const express = require('express');

const router = express.Router();
const { getPosts, addPosts, deletePost } = require("../controllers/posts.js")

router.get('/',getPosts);
router.post('/',addPosts);
router.delete('/:id',deletePost);



module.exports = router;