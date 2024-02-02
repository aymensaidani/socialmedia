const express = require('express');

const router = express.Router();
const { getComments, addComments } = require("../controllers/comment.js")

router.get('/',getComments);
router.post('/',addComments);


module.exports = router;