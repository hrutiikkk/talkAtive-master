
export const markMessagesAsSeen = async (receiverId, senderId) => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/chat/mark-as-seen`;
    try {
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ receiverId, senderId }),
      });
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  };