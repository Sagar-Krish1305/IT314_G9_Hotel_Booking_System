const express = require("express");

const router = express.Router();

const {newmessage} = require("../controllers/messagehandle");
const {login} = require("../controllers/loginhandle");

router.post("/createmessage",newmessage);
router.post("/createlogin",login);

module.exports = router;