const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const database = require(__dirname + "/modules/database.js"); //modules using database

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/blogDB');  //This is for local connection MongoDB

const ChapterSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true} 
});

const Chapter = mongoose.model("Chapter", ChapterSchema);


// MAIN PAGE
app.get("/", (req, res)=>{
    database.getChapters(Chapter, res, "main");
});


//CHAPTER PAGE
app.get("/posts/:title", (req, res)=>{
    const ChapterID = req.query.chapterID;

    database.getChapter(Chapter, res, "chapter", ChapterID);
});

app.post("/posts/settings/:editOrDelete", (req, res)=>{

    const ChapterID = req.body.index;
    const editOrDelete = req.params.editOrDelete;

    switch (editOrDelete) {
        case "Edit":
            database.getChapter(Chapter, res, "edit", ChapterID);
            break;
        case "Delete":
            database.deleteChapter(Chapter, res, "/", ChapterID);
            break;
        default:
            console.log("Path is incorrect. Current rout: " + req.params.editOrDelete);
            break;
    }
});

app.post("/editing", (req, res)=>{
    
    const ID = req.body.currentId;
    const NewTitle = req.body.titleInput;
    const NewContent = req.body.contentInput;

    database.updateChapter(Chapter, res, "/", ID, NewTitle, NewContent);
});


// COMPOSE PAGE
app.route("/compose")

.get((req, res)=>{
    database.composeValidation(Chapter, res, "compose", "compose-not");
})

.post((req, res)=>{
    const Title = req.body.titleInput;
    const Content = req.body.contentInput;

    database.addNewChapter(Chapter, Title, Content);

    res.redirect("/");
});



//CONTACT PAGE
app.get("/contact", (req, res)=>{
    res.render("contact");
});


// STARTING THE SERVER
const PORT = 3000;
app.listen(PORT, ()=>{
    console.log("Server is runing on port: " + PORT + "...");
});