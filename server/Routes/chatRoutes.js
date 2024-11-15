const express = require("express");
const { sendMessage, getMessages, markMessagesAsSeen } = require("../Controllers/chatController");
const isAuthenticate = require("../MiddleWares/isAuthenticate");

const router = express.Router();

router.post("/send/:id", isAuthenticate, sendMessage);
router.get("/:id", isAuthenticate, getMessages);
router.post("/mark-as-seen", markMessagesAsSeen);

module.exports = router;
