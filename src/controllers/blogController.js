const blogModel = require('../models/blogModel')

const createBlog = async function(req, res) {
    try {
    let author = req.body
    if(!author) {
        res.send("Author is not Present");
    }
    if(author.isPublished) author.publishedAt=new Date()
    if(author.isDeleted) author.deletedAt=new Date()
    let savedData = await blogModel.create(author);
    res.status(201).send({status:true , msg: savedData})
}catch(err){
    res.status(400).send({msg: err.message})
}
}
module.exports.createBlog = createBlog