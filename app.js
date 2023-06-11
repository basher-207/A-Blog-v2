const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

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

    async function getChapters(){
        const Chapters = await Chapter.find({}); //getting all chapters from "Chapters" collection

        res.render("main", {arr: Chapters});
    };

    getChapters();
});


//CHAPTER PAGE
app.get("/posts/:chapterId/:title", (req, res)=>{
    const ChapterID = req.params.chapterId;

    async function getChapter(id){
        const CurrentChapter = await Chapter.findById(id);

        res.render("chapter", {chapter: CurrentChapter});
    };

    getChapter(ChapterID);
});

app.post("/posts/settings/:editOrDelete", (req, res)=>{

    const ChapterId = req.body.index;
    const editOrDelete = req.params.editOrDelete;

    switch (editOrDelete) {
        case "Edit":
            async function getChapter(id){
                const CurrentChapter = await Chapter.findById(id);
                res.render("edit", {chapter: CurrentChapter});
            }

            getChapter(ChapterId);
            break;

        case "Delete":
            async function deleteChapter(id){
                await Chapter.findByIdAndDelete(id);
                res.redirect("/");
            }

            deleteChapter(ChapterId);
            break;
    
        default:
            console.log("Path is incorrect. Current rout: " + req.params.editOrDelete);
            break;
    }
});

app.post("/editing", (req, res)=>{

    const Id = req.body.currentId
    const NewTitle = req.body.titleInput;
    const NewContent = req.body.contentInput;

    async function updateChapter(id, newTitle, newContent){
        await Chapter.findByIdAndUpdate(id, {title: newTitle, content: newContent});
        res.redirect("/");
    };

    updateChapter(Id, NewTitle, NewContent);
});


// COMPOSE PAGE
app.get("/compose", (req, res)=>{
    async function composeValidation(){

        const ChaptersArr = await Chapter.find({});
        const NumberOfChapters = ChaptersArr.length;

        if(NumberOfChapters >= 5){
            res.render("compose-not");
        }else{
            res.render("compose");
        }
    }

    composeValidation();
});

app.post("/compose", (req, res)=>{

    const Title = req.body.titleInput;
    const Content = req.body.contentInput;

    const NewChapter = new Chapter({title: Title, content: Content});
    NewChapter.save();

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