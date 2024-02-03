const express = require('express');

const router = express.Router();
const { getUser, updateUser, getAllUser } = require("../controllers/users.js")

router.get('/getOne/:userId', getUser);
router.get('/all', getAllUser);

router.put("/",updateUser)
module.exports = router;
