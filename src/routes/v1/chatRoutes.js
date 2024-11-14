const express = require("express");
const router = express.Router();

require("dotenv").config();

const { sendChat } = require(`../../controllers/v1/chatController`);

router.post("/chat", sendChat);

module.exports = router;