import { useEffect, useState } from "react";
import useConversation from "../Zustand/useConversation";

const useGetMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const getMessage = async () => {
      setLoading(true);
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/chat/${
        selectedConversation?._id
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        setMessages(data.Messages);
    } else {
        setMessages([]);
      }
      setLoading(false);
    };

    if (selectedConversation?._id) {
      getMessage();
    }
  }, [selectedConversation?._id, setMessages]);

  return { messages, loading, setMessages };
};

export default useGetMessage;
