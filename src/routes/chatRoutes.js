const express = require("express");
const router = express.Router();

const { sendChat } = require("../controllers/chatController");

router.post("/chat", sendChat);

module.exports = router;
