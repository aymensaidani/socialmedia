const express = require('express');

const router = express.Router();
const { getRelation, addRelation, deleteRelation } = require("../controllers/relation.js")

router.get('/',getRelation);
router.post('/',addRelation);
router.delete("/",deleteRelation)


module.exports = router;