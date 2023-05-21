import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import { MongoClient, ObjectId } from "mongodb";

const port = 3001;
const app = express();

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.urlencoded());

//app.use(expressEjsLayouts)

//här gör jag en public map som gör att jag har tillgång till css filer och bilder
app.use(express.static("public"));

// här lyssnar jag på anslutningar (startar express serven)
app.listen(port, () => console.log(`Listening on ${port}`));

// här ansluter jag till min mongoDb server
const client = new MongoClient("mongodb://127.0.0.1:27017");
await client.connect();

//här sparar jag databasen i en variabel som jag vill annvända.
const db = client.db("animeClub");
const membersCollection = db.collection("members");

/* Tar endpointen som jag använder i webbläsaren och kopplar till en templet som ska skickas till webbläsaren */

app.get("/", async (req, res) => {
  res.render("home", {});
});

// Här hämtar jag alla medlemar från min collection i db och omvandlar dem till en array och ger dem till rätt templet.
app.get("/members", async (req, res) => {
    const sortType = req.query.sort || "default";
    let sortOption = {};
  
    if (sortType === "asc") {
      sortOption = { name: 1 }; 
    } else if (sortType === "desc") {
      sortOption = { name: -1 }; 
    }
  
    const members = await membersCollection
      .find({})
      .sort(sortOption)
      .toArray();
  
    res.render("membersList", { members });
  });
  

app.get("/member/:id", async (req, res) => {
  const member = await membersCollection.findOne({
    _id: new ObjectId(req.params.id),
  });

  if (member === null) {
    res.redirect("/members");
  }

  const date = member.date ? new Date(member.date) : null;
  const formattedDate = date
    ? `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
    : null;

  res.render("memberDetail", {
    id: member._id,
    name: member.name,
    email: member.email,
    phone: member.phone,
    date: formattedDate,
    favoriteAnime: member.favoriteAnime,
  });
});

app.get("/members/create", (req, res) => {
  res.render("createMember", {});
});

app.post("/members/create", async (req, res) => {
  await membersCollection.insertOne(req.body);
  res.redirect("/members");
});

app.delete("/member/:id", async (req, res) => {
  await membersCollection.deleteOne({ _id: new ObjectId(req.params.id) });
  res.status(200).send();
});

/* 
app.post("/update-member/:id", async (req,res) => {
    await membersCollection.updateOne({ _id: new ObjectId(req.params.id)}, {... req.body})
    res.redirect('/members')
})

  */

app.post("/update-member/:id", async (req, res) => {
  try {
    const memberId = req.params.id;
    const updatedMemberData = req.body;

    await membersCollection.updateOne(
      { _id: new ObjectId(memberId) },
      { $set: updatedMemberData }
    );

    res.redirect("/members");
  } catch (error) {
    console.error(error);
    res.redirect("/members");
  }
});


