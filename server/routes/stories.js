const express = require('express');

const router = express.Router();
const {  addStory, getStories, deleteStory } = require("../controllers/stories")

router.get('/',getStories);
router.post('/',addStory);
router.delete("/:id",deleteStory)


module.exports = router;