const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController");
const blogController = require("../controllers/blogController");
const auth = require('../middleware/auth');





//CREATE AUTHOR
router.post("/authors", authorController.createAuthor);

//LOGIN
router.post('/login', authorController.loginAuthor)

//CREATE BLOG
router.post("/blog", blogController.createBlogs);

//GET BLOG
router.get("/getblog", auth.authentication, blogController.getblogs);

//UPDATE BLOG
router.put('/blogs/:blogId', auth.authentication, auth.authorization, blogController.updateBlog);

//DELETE BLOG
router.delete('/blogs/:blogId', auth.authentication, auth.authorization, blogController.deleteBlog);

//DELETE BY QUERY
router.delete('/blogs', auth.authentication, auth.authorization, blogController.deletebyquery);


module.exports = router;