import { useEffect, useRef, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import NoConvo from "../../assets/NoConvo.png";
import { useSocketContext } from "../../Context/SocketContext";
import useDebounce from "../../Hooks/useDebouncing";
import useGetMessage from "../../Hooks/useGetMessage";
import useListenMessage from "../../Hooks/useListenMessage";
import { processMessagesWithTimeline } from "../../Utils/addTimeLabel";
import useConversation from "../../Zustand/useConversation";
import OpenMediaDialog from "../Dailog/OpenMediaDialog";
import Message from "./Message";
import MessageInput from "./MessageInput";
import Typing from "./Typing";

const Conversation = () => {
  const { selectedConversation, setSelectedConversation, typingUsers, openMedia, setOpenMedia } =
    useConversation();
  const { messages, loading } = useGetMessage();
  const { onlineUsers, socket } = useSocketContext();
  const [mediaLoading, setMediaLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState({
    message: "",
    imageURL: "",
    videoURL: "",
  });
  const messagesEndRef = useRef(null);
  const isOnline = onlineUsers.includes(selectedConversation?._id);
  const isTyping = typingUsers[selectedConversation?._id];

  // Debounce the typing state
  const debouncedIsTyping = useDebounce(isTyping, 100);

  useListenMessage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!loading && (messages.length > 0 || debouncedIsTyping !== undefined)) {
      scrollToBottom();
    }
  }, [loading, messages, debouncedIsTyping, inputMessage.imageURL, inputMessage.videoURL]);

  const formattedMessages = processMessagesWithTimeline(messages);

  return (
    <div
      className={`w-full h-[calc(100vh-180px)] md:h-[calc(100vh-30px)] ${
        !selectedConversation ? "hidden md:block" : ""
      } transition-all duration-75`}
    >
      {selectedConversation ? (
        <div className="w-full h-full">
          <div className="h-20 flex items-center gap-3 p-2 px-6 border-b border-slate-800 sticky top-0">
            <div
              className="p-1 bg-slate-800 rounded-full flex justify-center items-center cursor-pointer"
              onClick={() => setSelectedConversation(null)}
            >
              <IoIosArrowBack size={28} />
            </div>

            <div className="flex gap-4">
              <div className={`avatar ${isOnline ? "online" : ""}`}>
                <div className="w-16 rounded-full">
                  <img src={selectedConversation?.profilePic} alt="Profile" />
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <p className="text-lg font-semibold line-clamp-1">
                  {selectedConversation?.firstName +
                    " " +
                    selectedConversation?.lastName}
                </p>
                <p className="text-slate-400">
                  {debouncedIsTyping
                    ? "typing..."
                    : isOnline
                    ? "online"
                    : "offline"}
                </p>
              </div>
            </div>
          </div>

          {mediaLoading ||
          inputMessage.imageURL != "" ||
          inputMessage.videoURL != "" ? (
            <div className="h-[calc(100vh-175px)] overflow-auto p-0 relative">
            <div className="absolute h-full w-full p-5 flex items-center justify-center bg-slate-950 bg-opacity-50">
              <div className="absolute top-0 text-xl right-0 m-2 p-2 cursor-pointer bg-red-500 font-bold text-white rounded-full" onClick={() => setInputMessage({
                ...inputMessage,
                imageURL: "",
                videoURL: "",
              })}>
                <IoClose />
              </div>
              {inputMessage.imageURL == "" ? (
                inputMessage.videoURL == "" ? (
                  <p className="loading loading-spinner"></p>
                ) : (
                  <video
                    src={inputMessage.videoURL}
                    controls
                    className="w-full h-full"
                  ></video>
                )
              ) : (
                <img
                  src={inputMessage.imageURL}
                  alt="image"
                  className="w-full h-full
              object-contain"
                />
              )}
            </div>
            </div>
          ) : (
            <div className="h-[calc(100vh-175px)] overflow-auto p-0 px-2 relative">
              {loading && (
                <div className="h-full w-full flex items-center justify-center">
                  <p className="loading loading-spinner"></p>
                </div>
              )}
              {!loading && formattedMessages.length > 0 && (
                <>
                  {formattedMessages.map((message) => (
                    <Message message={message} key={message._id} />
                  ))}
                  {debouncedIsTyping && <Typing />}
                  <div ref={messagesEndRef} />
                </>
              )}

              {!loading && formattedMessages.length === 0 && (
                <div className="h-full w-full flex items-start justify-center">
                  <p className="text-slate-400 font-semibold text-center p-2 border border-slate-500 rounded-lg bg-slate-800">
                    Start a conversation with{" "}
                    <span className="text-blue-600">
                      {selectedConversation?.firstName}
                    </span>{" "}
                    by sending a message.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="h-16 border-t border-slate-800">
            <MessageInput
              toUserId={selectedConversation?._id}
              setMediaLoading={setMediaLoading}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
            />
          </div>
        </div>
      ) : (
        <div
          className={`w-full h-[80%] md:flex items-center justify-center hidden`}
        >
          <div className="text-center">
            <img src={NoConvo} alt="NoConvo" className="w-[300px] h-auto " />
            <p className="text-3xl font-semibold">Select a conversation</p>
            <p className="text-slate-400">to start messaging</p>
          </div>
        </div>
      )}
      {openMedia?.state && <OpenMediaDialog onClose={() => setOpenMedia(false, "", "")} Media={openMedia} />}
    </div>
  );
};

export default Conversation;
