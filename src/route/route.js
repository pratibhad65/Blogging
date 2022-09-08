const express = require('express');
const router = express.Router();
const authControl= require("../controllers/authorController")
const blogControl=require("../controllers/blogController")
const middlewareCV=require("../middleware/middleware")


router.post("/authors", authControl.createAuthor)

router.post("/blogs",middlewareCV.authentication,blogControl.createBlog)

router.get("/blog",middlewareCV.authentication, blogControl.getBlog)

router.put("/update/:blogId",middlewareCV.authentication,middlewareCV.authorization, blogControl.updateBlog)

router.delete("/deleteBlog/:blogId",middlewareCV.authentication,middlewareCV.authorization,blogControl.deleteBlog)

router.delete("/deleteBlogByQuery",middlewareCV.authentication,middlewareCV.authorization,blogControl.deleteBlogByQuery)

router.post("/login",authControl.loginAuthor)


module.exports = router;
