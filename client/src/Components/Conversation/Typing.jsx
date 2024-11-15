import React from "react";
import "../../Utils/typingAnimation.css"; // Import the CSS file for typing animation
import useConversation from "../../Zustand/useConversation";

const Typing = () => {
  const { selectedConversation } = useConversation();

  return (
    <div className="chat chat-start">
      <div className="chat-image avatar hidden lg:block">
        <div className="w-10 rounded-full">
          <img
            alt="Profile"
            src={selectedConversation?.profilePic}
          />
        </div>
      </div>
      <div className="chat-bubble text-white bg-slate-800">
        <div className="typing-animation">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
};

export default Typing;

