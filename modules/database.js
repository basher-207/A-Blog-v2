
module.exports = {getChapters, getChapter, deleteChapter, updateChapter, composeValidation, addNewChapter};

async function getChapters(collectionName, res, rout){
    const Chapters = await collectionName.find({}); //getting all chapters from "Chapters" collection

    res.render(rout, {arr: Chapters});
};


async function getChapter(collectionName, res, rout, id){
    const CurrentChapter = await collectionName.findById(id);

    res.render(rout, {chapter: CurrentChapter});
};


async function deleteChapter(collectionName, res, rout, id){
    await collectionName.findByIdAndDelete(id);

    res.redirect(rout);
}


async function updateChapter(collectionName, res, rout, id, editedTitle, editedContent){
    await collectionName.findByIdAndUpdate(id, {title: editedTitle, content: editedContent});

    res.redirect(rout);
};


async function composeValidation(collectionName, res, successRout, failureRout){

    const ChaptersArr = await collectionName.find({});
    const NumberOfChapters = ChaptersArr.length;

    if(NumberOfChapters >= 5){
        res.render(failureRout);
    }else{
        res.render(successRout);
    }
};


function addNewChapter(collectionName, Title, Content){
    const NewChapter = new collectionName({title: Title, content: Content});
    NewChapter.save();
};