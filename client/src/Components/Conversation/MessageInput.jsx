import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaRegImages } from "react-icons/fa";
import { IoIosVideocam } from "react-icons/io";
import { LuSend } from "react-icons/lu";
import { RiAttachment2 } from "react-icons/ri";
import { useSocketContext } from "../../Context/SocketContext";
import useSendMessage from "../../Hooks/useSendMessage";
import { uploadFile } from "../../Utils/uploadFile";

const MessageInput = ({ toUserId, setMediaLoading, inputMessage, setInputMessage }) => {
  const { socket } = useSocketContext();
  const { sendMessage, loading } = useSendMessage();
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleImage = async (e) => {
    const file = e.target.files[0];
    setIsDropdownOpen(false);
    setMediaLoading(true);
    const UploadImage = await uploadFile(file);
    setInputMessage((prevState) => ({
      ...prevState,
      imageURL: UploadImage?.secure_url || "",
    }));
    setMediaLoading(false);
  };

  const handleVideo = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > 100) {
        toast.error("File size exceeds 100 MB. Please select a smaller file.");
        setIsDropdownOpen(false);
      } else {
        try {
          setIsDropdownOpen(false);
          setMediaLoading(true);
          const UploadVideo = await uploadFile(file);
          setInputMessage((prevState) => ({
            ...prevState,
            videoURL: UploadVideo?.secure_url || "",
          }));
          setMediaLoading(false);
        } catch (error) {
          toast.error(error?.message);
          setIsDropdownOpen(false);
          setMediaLoading(false);
        }
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputMessage?.message || inputMessage?.imageURL || inputMessage?.videoURL) {
      sendMessage(inputMessage);
      setInputMessage({
        message: "",
        imageURL: "",
        videoURL: "",
      });
      clearTimeout(typingTimeoutRef.current);
      setIsTyping(false);
      socket.emit("stopTyping", { toUserId }); // Ensure typing status stops
    }
  };

  const handleInputChange = (e) => {
    setInputMessage({
      ...inputMessage,
      message: e.target.value,
    });

    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { toUserId });
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("stopTyping", { toUserId });
    }, 2000);
  };

  return (
    <div className="h-full w-full flex items-center p-2 gap-3">
      <div className="dropdown dropdown-hover dropdown-top dropdown-start">
        <div
          tabIndex={0}
          role="button"
          className="btn m-1 bg-slate-900 hover:bg-slate-800 rounded-full"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <RiAttachment2 size={25} />
        </div>
        {isDropdownOpen && (
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box z-[1] w-auto p-2 shadow bg-slate-800"
          >
            <form>
              <li>
                <label htmlFor="image">
                  <div
                    className="px-4 py-2 text-white flex items-center gap-3"
                    htmlFor="image"
                  >
                    <FaRegImages size={20} />
                    Image
                  </div>
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={(e) => handleImage(e)}
                  className="hidden"
                />
              </li>
              <li>
                <label htmlFor="video">
                  <div className="px-4 py-2 text-white flex items-center gap-3">
                    <IoIosVideocam size={20} />
                    Video
                  </div>
                </label>
                <input
                  type="file"
                  id="video"
                  accept="video/*"
                  onChange={(e) => handleVideo(e)}
                  className="hidden"
                />
              </li>
            </form>
          </ul>
        )}
      </div>
      <form className="w-full flex items-center gap-3" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type here"
          value={inputMessage.message}
          onChange={handleInputChange}
          className="input input-ghost w-full bg-slate-950 outline-none"
        />
        <button
          type="submit"
          className="btn hover:bg-blue-800 bg-blue-700 text-white"
          disabled={loading || !(inputMessage?.message || inputMessage?.imageURL || inputMessage?.videoURL)}
        >
          {loading ? (
            <div className="loading loading-spinner"></div>
          ) : (
            <LuSend size={25} />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
