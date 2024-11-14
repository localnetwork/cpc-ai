const express = require("express");
const router = express.Router();

require("dotenv").config();

const {
  sendChat,
} = require(`../../controllers/${process.env.NODE_API_VERSION}/chatController`);

router.post("/chat", sendChat);

module.exports = router;
