const ConversationModel = require("../Models/conversationModel");
const MessageModel = require("../Models/messageModel");
const { io, getSocketId } = require("../Socket/Scoket");
const { getConversationForSideBar } = require("../Utils/getUserForSideBar");

const sendMessage = async (req, res, next) => {
  try {
    const { message, imageURL, videoURL } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.userId;

    let Conversation = await ConversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!Conversation) {
      Conversation = await ConversationModel.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await MessageModel.create({
      senderId,
      receiverId,
      message,
      imageURL,
      videoURL,
    });

    if (newMessage) {
      Conversation.messages.push(newMessage._id);
    }

    await Conversation.save();

    const receiverSocketId = getSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    // Emitting conversationUpdated event
    const updatedConversation = await ConversationModel.findById(
      Conversation?._id
    )
      .populate("participants")
      .populate("messages");

    updatedConversation?.participants?.forEach(async (participant) => {
      const unreadMessageCount = await MessageModel.countDocuments({
        receiverId: participant._id,
        seen: { $ne: participant._id },
      });

      const conversations = await getConversationForSideBar(participant._id);
      const socketId = getSocketId(participant._id.toString());
      if (socketId) {
        io.to(socketId).emit("new_Convo_Started", { conversations });
        io.to(socketId).emit("conversationUpdated", {
          updatedConversation,
          unreadMessageCount,
        });
      }
    });

    return res.status(201).json({
      success: true,
      message: "Message sent",
      Messages: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user.userId;

    const Conversation = await ConversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!Conversation) {
      return res.status(200).json({
        success: true,
        message: "Conversation not found",
        Messages: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Conversation found",
      Messages: Conversation?.messages,
    });
  } catch (error) {
    next(error);
  }
};

const markMessagesAsSeen = async (req, res) => {
  const { receiverId, senderId } = req.body;

  try {
    await MessageModel.updateMany(
      { senderId: receiverId, receiverId: senderId, seen: { $ne: senderId } },
      { $push: { seen: senderId } }
    );

    // Emitting conversationUpdated event
    const Conversation = await ConversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    const updatedConversation = await ConversationModel.findById(
      Conversation?._id
    )
      .populate("participants")
      .populate("messages");

    updatedConversation.participants.forEach(async (participant) => {
      const unreadMessageCount = await MessageModel.countDocuments({
        receiverId: participant._id,
        seen: { $ne: participant._id },
      });

      const socketId = getSocketId(participant._id.toString());
      if (socketId) {
        io.to(socketId).emit(
          "seenMessageUpdated",
          updatedConversation?.messages
        );
        io.to(socketId).emit("conversationUpdated", {
          updatedConversation,
          unreadMessageCount,
        });
      }
    });

    res.status(200).send("Messages marked as seen");
  } catch (error) {
    res.status(500).send("Error marking messages as seen");
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markMessagesAsSeen,
};
