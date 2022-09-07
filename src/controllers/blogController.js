const blogModel = require('../models/blogModel')
const authorModel = require('../models/authorModel');

//*******************************************createBlog***************************************************************** */

const createBlog = async function (req, res) {
    try {
        let data = req.body
        let author = data.authorId
        let validation = await authorModel.findById(author)
        if (!validation) {
            res.status(400).send({ status: false, msg: " author is not present" })
        }
        if (data.isPublished) data.publishedAt = new Date()
        if (data.isDeleted) data.deletedAt = new Date()

        let savedData = await blogModel.create(data);
        res.status(201).send({ status: true, msg: savedData })
    } catch (err) {
        res.status(500).send({ msg: err.message })
    }
}

//*************************************************getBlog************************************************************* */

const getBlog=async function(req,res){
    try{
        let data = req.query
        let Blogs=await blogModel.find({isDeleted:false, isPublished: true , ...data})
        if(!Blogs){
            res.status(404).send({status: false,  msg: "Not found"})
        }
        res.status(200).send({status: true, msg:Blogs})
    
    }catch (err) {
        res.status(500).send({ msg: err.message })
    }
}

//*************************************************UpdateBlog****************************************************

//const updateBlog = async function(req, res){
    // try {
    //     let blogId = req.params.blogId
    //     let data = await blogModel.findOneAndUpdate({ _id: userId }, );
    //     res.send({msg: data})
    // }catch(err){
    //     res.status(500).send({msg: err.message})
    // }

const updateBlog = async function(req, res){   
    try {  
        let blogId = req.params.blogId;
        let user = await blogModel.findById(blogId);
        //Return an error if no user with the given id exists in the db
        if (!user) {
          return res.status(404).send("No such user exists");
        }
        let data = req.body;
        let updatedUser = await blogModel.findByIdAndUpdate(blogId,
            { $push:{tags:data.tags,subCategory:data.subCategory},title:data.title,body:data.body,isPublished: true, publishedAt: new Date()} ,{ new: true })
        res.status(200).send({ status: true, data: updatedUser });
        }catch(err){
            res.status(500).send({status: false, msg: err.message})
        }
        
}

const deleteBlog = async function(req, res) {
    try{ 
    let blogId = req.params.blogId
    let savedData = await blogModel.findById(blogId)
    if (!savedData) {
        return res.status(404).send("No such blogId is present");
      }
    let deleted = await blogModel.findByIdAndUpdate(savedData, {$set: {isDeleted: true ,deletedAt:new Date()}},{new: true})
    res.status(200).send()
    }catch(err){
        res.status(500).send({status: false,  msg: err.message})
    }

}

const deleteBlogByQuery = async function (req, res) {
    try {
        let query = req.query
        if (!query) return res.status(404).send("Give a query")

        let find = await blogModel.find(query)

        if (!find) return res.status(404).send("blog not found")

        if (find.isDeleted == true)
            res.status(200).send({ status: true, msg: "Blog is already Deleted" })

        let update = await blogModel.updateMany(query, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })
        res.status(200).send({ msg: "Data deleted succesfully" })

    } catch (err) {
        res.status(500).send({ msg: err.message })
    }

}

module.exports.createBlog = createBlog
module.exports.getBlog = getBlog
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
module.exports.deleteBlogByQuery = deleteBlogByQuery