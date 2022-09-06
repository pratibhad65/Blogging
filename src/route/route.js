const express = require('express');
const router = express.Router();
const authControl= require("../controllers/authorController")
const blogControl=require("../controllers/blogController")


router.post("/authors", authControl.createAuthor)

router.post("/blogs", blogControl.createBlog)

router.get("/blog", blogControl.getBlog)



module.exports = router;
