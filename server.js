import { MongoClient, ObjectId } from "mongodb";
import express from "express";
import expressEjsLayouts from "express-ejs-layouts";

const port = 3001;
const app = express();

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.urlencoded());

//app.use(expressEjsLayouts)

//här gör jag en public map som gör att jag har tillgång till css filer och bilder 
app.use(express.static('public'))

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
    res.render("home", { })
})

// Här hämtar jag alla medlemar från min collection i db och omvandlar dem till en array och ger dem till rätt templet.
app.get("/members", async(req, res) => {
    const members = await membersCollection.find({}).toArray();
    res.render("membersList", { members })
})



app.get("/member/:id", (req, res) => {
     res.render("memberDetail", { })
})


app.get("/members/create", (req, res) => {
    res.render("createMember", { })
})

