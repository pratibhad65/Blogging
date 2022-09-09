const blogModel = require('../models/blogModel')
const authorModel = require('../models/authorModel');
const validator = require("../validator/validator");

//*******************************************createBlog***************************************************************** */
const createBlog = async function (req, res) {
    try {
        let data = req.body
        let { authorId, title, body, category, isPublished } = data;

        if (!validator.isValidBody(data)) {
            //checking that body is empty or not
            return res.status(400).send({ status: false, msg: "Body cannot be empty" });
        }

        //edgeCase1 - 
        if (!authorId)
            return res.status(400).send({ statut: false, msg: "AuthorId is required" });

        // edgeCase2- 
        if (!validator.isValidId(authorId))
            return res.status(400).send({ status: false, message: "Invalid AuthoId" });

        //edgeCase3 - 
        let authorPresence = await authorModel.findById(authorId);
        if (!authorPresence)
            return res.status(404).send({ status: false, msg: "Author is not present" });

        //edgeCase4 - is title present or not
        if (!title)
            return res.status(400).send({ statut: false, msg: "Title is required" });

        //edgeCase5 - is body data present or not
        if (!body)
            return res.status(400).send({ statut: false, msg: "Body content is a mandatory part" });
        //content should be more than 100 characters
        if (body.length < 5)
            return res.status(400).send({
                statut: false,
                msg: "body content is too short...add some more content",
            });

        //edgeCase6 - is body data present or not
        if (!category || category.length == 0)
            return res.status(400).send({ statut: false, msg: "Category is must" });
        if (data.isPublished) data.publishedAt = new Date()
        if (data.isDeleted) data.deletedAt = new Date()

        let savedData = await blogModel.create(data);
        res.status(201).send({ status: true, msg: savedData })

    } catch (err) {
        res.status(500).send({ msg: err.message })
    }
}
//*************************************************getBlog************************************************************* */

const getBlog = async function (req, res) {
    try {
        let data = req.query
        let { authorId } = data;

<<<<<<< HEAD
    //edgeCase - 1 if authorId is given then is it valid or not
    if (authorId) {
      if (!validator.isValidId(authorId))
        return res.status(400).send({ status: false, msg: "Not a valid authorId" });
    }
        let Blogs=await blogModel.find({ $and: [data, {  title: "abc" }], });

        //edgeCase-2
        if(!Blogs){
            res.status(404).send({status: false,  msg: "Blog Not found"})
=======
        //edgeCase - 1 if authorId is given then is it valid or not
        if (authorId) {
            if (!validator.isValidId(authorId))
                return res.status(400).send({ status: false, msg: "Not a valid authorId" });
>>>>>>> 3b84f86c1b3cd98a8e867f89fed8762e4274f082
        }
        let Blogs = await blogModel.find({ isDeleted: false, isPublished: true, ...data })

        //edgeCase - 2
        if (Blogs.length == 0)
            return res.status(404).send({ status: false, msg: "No data found for given user" });
        res.status(200).send({ status: true, msg: Blogs })
    }
    catch (err) {
        res.status(500).send({ msg: err.message })
    }
}

//*************************************************UpdateBlog****************************************************


const updateBlog = async function (req, res) {
    try {
        let data = req.body;
        let blogId = req.params["blogId"];

        let { title, body, tags, subcategory } = data;//Return an error if no user with the given id exists in the db

        //edge case 1 ---- invalid blogId
        if (!validator.isValidId(blogId))
            return res.status(400).send({ status: false, message: "Not a valid blogId" });

        // edge case 2 ------ No found 

        let checkBlog = await blogModel.findOne({ _id: blogId });
        if (!checkBlog)
            return res.status(400).send({ status: false, msg: "No blog found with given Id to update" });

        // edge case 3 -----No provided data
        let emptyBody = validator.isValidBody(data);
        if (!emptyBody)
            return res.status(400).send({ status: false, msg: "You have not provided any data" });

        ///edgeCase 4 ...body content should be greater than 50
        if (body) {
            if (body.length < 5)
                return res.status(400).send({ statut: false, msg: "body content is too short...add some more content", });
        }

        //edgeCase 5 -- if title is present than it should not be empty
        if (title != null) {
            if (title.length == 0)
                return res.status(400).send({ statut: false, msg: "Title is is used but it is empty" });
        }

        if (title || body || tags || subcategory) {
            let updatedUser = await blogModel.findByIdAndUpdate(blogId,
                { $push: { tags: data.tags, subCategory: data.subCategory }, title: data.title, body: data.body, isPublished: true, publishedAt: new Date() }, { new: true })
            res.status(200).send({ status: true, data: updatedUser });
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

//*********************************************************DeleteBlogByParam****************************************************************/

const deleteBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId;
        // edge case 1 ----check blogId valid

        if (!validator.isValidId(blogId))
            return res.status(400).send({ status: false, msg: "Invalid blogId" });

        // is blog present ith given blogId
        let savedData = await blogModel.findById(blogId)
        if (!savedData) {
            return res.status(404).send("No such blogId is present");
        }
        //if it is already deleted

        if (savedData.isDeleted)
            return res.status(404).send({ status: false, msg: "Blog not found may you have already delted :)", });

        let updatedata = await blogModel.findByIdAndUpdate(savedData, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true });
        res.status(200).send();
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}
//*******************************************************DeleteBlogByQuery********************************************************************/

const deleteBlogByQuery = async function (req, res) {
    try {
        let query = req.query
        if (query.authorId) {
            if (!validator.isValidId(query.authorId))
                return res.status(400).send({ status: false, msg: "Invalid authorId" });
        }
        let update = await blogModel.updateMany(query, { $set: { isDeleted: true, deletedAt: Date.now() }, }, { new: true });

        //is modified count zero....then send resp- no blogs to delete
        if (update.modifiedCount == 0) {
            return res.status(404).send({ status: false, msg: "No blogs to delete with given queries" });
        }
        //if modified count is greater than zero then return modified count with message
        else {
            return res.status(200).send({ status: true, msg: `${update.modifiedCount} Blogs deleted with given queries`, });
        }

    } catch (err) {
        res.status(500).send({ msg: err.message })
    }
}

module.exports.createBlog = createBlog
module.exports.getBlog = getBlog
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
module.exports.deleteBlogByQuery = deleteBlogByQuery