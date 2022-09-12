const express = require('express');
const router = express.Router();
const authControl= require("../controllers/authorController")
const blogControl=require("../controllers/blogController")
const middlewareCV=require("../middleware/middleware")


router.post("/authors", authControl.createAuthor)

router.post("/blogs",middlewareCV.authentication,blogControl.createBlog)

router.get("/blogs",middlewareCV.authentication, blogControl.getBlog)

router.put("/blogs/:blogId",middlewareCV.authentication,middlewareCV.authorization, blogControl.updateBlog)

router.delete("/blogs/:blogId",middlewareCV.authentication,middlewareCV.authorization,blogControl.deleteBlog)

router.delete("/blogs",middlewareCV.authentication,middlewareCV.authorization,blogControl.deleteBlogByQuery)

router.post("/login",authControl.loginAuthor)


module.exports = router;
