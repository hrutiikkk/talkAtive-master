const mongoose = require("mongoose");

const messageScheme = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
    },
    seen: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    imageURL: {
      type: String,
    },
    videoURL: {
      type: String,
    },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model("Message", messageScheme);

module.exports = MessageModel;
