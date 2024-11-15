import { useEffect } from "react";
import { useAuthContext } from "../Context/AuthContext";
import { useSocketContext } from "../Context/SocketContext";
import useConversation from "../Zustand/useConversation";
import { markMessagesAsSeen } from "./useSeenMessage";

const useListenMessage = () => {
  const { messages, setMessages } = useConversation();
  const { socket } = useSocketContext();
  const { selectedConversation } = useConversation();
  const { authUser } = useAuthContext();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setMessages([...messages, newMessage]);
      socket?.emit("Seen_Unseen_MSG", {
        receiverId: selectedConversation?._id,
        senderId: authUser?._id,
      });
    });

    socket?.on("seenMessageUpdated", (newMessages) => {
      setMessages(newMessages);
    });

    return () => {
      socket?.off("newMessage");
      socket?.off("seenMessageUpdated");
    };
  }, [socket, selectedConversation, setMessages, messages]);

  useEffect(() => {
    markMessagesAsSeen(selectedConversation?._id, authUser?._id);
  },[selectedConversation]);
};

export default useListenMessage;
