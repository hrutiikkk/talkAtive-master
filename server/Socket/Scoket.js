const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const MessageModel = require("../Models/messageModel");
const ConversationModel = require("../Models/conversationModel");

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO server with CORS configuration
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"], // Allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  },
});

// Map to store user IDs and their corresponding socket IDs
const userSocketMap = {};

// Handle new socket connections
io.on("connection", (socket) => {
  console.log("User Connected: " + socket.id);

  const userId = socket.handshake.query.userId;
  
  // If userId is valid, store the socket ID
  if (userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  // Notify all users of the currently online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle "typing" event to notify the recipient that the sender is typing
  socket.on("typing", ({ toUserId }) => {
    const participantSocketId = getSocketId(toUserId);
    if (participantSocketId) {
      io.to(participantSocketId).emit("typing", { fromUserId: userId });
    }
  });

  // Handle "stopTyping" event to notify the recipient that the sender has stopped typing
  socket.on("stopTyping", ({ toUserId }) => {
    const participantSocketId = getSocketId(toUserId);
    if (participantSocketId) {
      io.to(participantSocketId).emit("stopTyping", { fromUserId: userId });
    }
  });

  // Handle "Seen_Unseen_MSG" event to mark messages as seen
  socket.on("Seen_Unseen_MSG", async ({ receiverId, senderId }) => {
    try {
      await MessageModel.updateMany(
        { senderId: receiverId, receiverId: senderId, seen: { $ne: senderId } },
        { $push: { seen: senderId } }
      );
      updateConversation(senderId, receiverId);
    } catch (error) {
      console.error(error);
    }
  });

  // Handle "Delete_Message" event to delete a message and update the conversation
  socket.on("Delete_Message", async (messageModel) => {
    const { senderId, receiverId, _id } = messageModel;
    await MessageModel.findByIdAndDelete(_id);
    updateConversation(senderId, receiverId); 
  });

  // Handle socket disconnection
  socket.on("disconnect", () => {
    console.log("User Disconnected: " + socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Utility function to get the socket ID of a user by their user ID
const getSocketId = (userId) => {
  return userSocketMap[userId];
};

// Utility function to update the conversation and notify participants
const updateConversation = async (senderId, receiverId) => {
  const updatedConversation = await ConversationModel.findOne({
    participants: { $all: [senderId, receiverId] },
  })
    .populate("participants")
    .populate("messages");

  updatedConversation?.participants?.forEach(async (participant) => {
    const unreadMessageCount = await MessageModel.countDocuments({
      receiverId: participant._id,
      seen: { $ne: participant._id },
    });

    const socketId = getSocketId(participant._id.toString());
    if (socketId) {
      io.to(socketId).emit("seenMessageUpdated", updatedConversation?.messages);
      io.to(socketId).emit("conversationUpdated", {
        updatedConversation,
        unreadMessageCount,
      });
    }
  });
};

module.exports = {
  server,
  getSocketId,
  userSocketMap,
  app,
  io,
};
