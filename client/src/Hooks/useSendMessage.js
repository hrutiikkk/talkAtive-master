import { useState } from "react";
import useConversation from "../Zustand/useConversation";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const sendMessage = async (messageOBJ) => {
    setLoading(true);
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/chat/send/${
      selectedConversation?._id
    }`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageOBJ),
      credentials: "include",
    });

    const data = await response.json();
    if (data.success) {
        setMessages([...messages, data.Messages]);
    } else {
        console.log(data.message);
    }
    setLoading(false);
  };

  return { sendMessage, loading };
};

export default useSendMessage;
