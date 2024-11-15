const ConversationModel = require("../Models/conversationModel");
const MessageModel = require("../Models/messageModel");

const getConversationForSideBar = async (userId) => {
  const startedConversations = await ConversationModel.find({
    participants: { $in: [userId] },
  })
    .populate("participants")
    .populate("messages")
    .sort({ updatedAt: -1 });

  const conversations = await Promise.all(
    startedConversations.map(async (convo) => {
      const isFirstParticipant = convo.participants[0]._id.toString() == userId;
      const user = isFirstParticipant
        ? convo.participants[1]
        : convo.participants[0];

      // Calculate unread message count
      const unreadMessageCount = await MessageModel.countDocuments({
        receiverId: userId,
        senderId: user?._id,
        seen: { $ne: userId },
      });

      return {
        _id: convo._id,
        user: {
          _id: user?._id,
          firstName: user?.firstName,
          lastName: user?.lastName,
          profilePic: user?.profilePic,
        },
        lastMessage: {
          message: convo.messages[convo.messages.length - 1],
        },
        lastMessageTime: convo.updatedAt,
        unreadMessageCount,
      };
    })
  );

  return conversations;
};

module.exports = {
  getConversationForSideBar
}