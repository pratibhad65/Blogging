const blogModel = require('../models/blogModel')
const authorModel = require('../models/authorModel');

const createBlog = async function (req, res) {
    try {
        let data = req.body
        let ndata = data.authorId
        let validation = await authorModel.findById(ndata)
        if (!validation) {
            res.send({ status: false, msg: " author is not present" })
        }
        if (data.isPublished) data.publishedAt = new Date()
        if (data.isDeleted) data.deletedAt = new Date()

        let savedData = await blogModel.create(author);
        res.status(201).send({ status: true, msg: savedData })
    } catch (err) {
        res.status(400).send({ msg: err.message })
    }
}
module.exports.createBlog = createBlog