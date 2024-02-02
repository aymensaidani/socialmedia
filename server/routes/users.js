const express = require('express');

const router = express.Router();
const { getUser, updateUser } = require("../controllers/users.js")

router.get('/getOne/:userId', getUser);
router.put("/",updateUser)
module.exports = router;
