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

/* Tar endpointen som jag använder i webbläsaren och kopplar till en templet som ska skickas till webbläsaren */

app.get("/", async (req, res) => {
    res.render("home", { })
})

app.get("/members", (req, res) => {
    res.render("membersList", { })
})

app.get("/member/:id", (req, res) => {
     res.render("membersDetail", { })
})


app.get("/members/create", (req, res) => {
    res.render("createMember", { })
})