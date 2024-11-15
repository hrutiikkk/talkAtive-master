import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdOutlineSearch } from "react-icons/md";
import { useAuthContext } from "../../Context/AuthContext";
import { useSocketContext } from "../../Context/SocketContext";
import useConversation from "../../Zustand/useConversation";

const SearchDialog = ({ onClose }) => {
  const { authUser } = useAuthContext();
  const [searchUsers, setSearchUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { onlineUsers } = useSocketContext();
  const [search, setSearch] = useState("");

  const searchUsersHandler = async () => {
    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/user/search-users`;
      const response = await axios.post(
        url,
        { search: search },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setSearchUsers(response.data.users);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    searchUsersHandler();
  }, [search]);

  const handleChangeConversation = (user) => {
    setSelectedConversation(user);
    onClose();
  }

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0
  bg-slate-950 bg-opacity-90 z-20"
      onClick={() => onClose()}
    >
      <div
        className="w-full max-w-xl rounded-xl mx-auto mt-14 p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-900 rounded overflow-hidden flex items-center p-1.5 pr-3">
          <input
            type="text"
            placeholder="Search by name or email....."
            className="w-full h-full px-3 pr-1.5 rounded-md bg-slate-900 outline-none text-zinc-100 text-lg font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="p-1.5  rounded-full text-blue-500 shadow-md cursor-pointer hover:bg-slate-700 ">
            <MdOutlineSearch size={30} />
          </div>
        </div>

        <div className="mt-3 rounded bg-slate-900 w-full max-h-[70vh] p-3 py-2 overflow-auto">
          {searchUsers.length === 0 && !loading && (
            <p className="text-lg font-semibold text-zinc-300 text-center p-3">
              No User Found ( :
            </p>
          )}

          {loading ? (
            <div className="flex items-center justify-center">
              <div className="loading loading-spinner"></div>
            </div>
          ) : (
            searchUsers.map((user) => {
                const isSelectedUser = selectedConversation?._id === user?._id;
                const isOnline = onlineUsers.includes(user?._id);
                return (
                  <div
                    className={`w-full rounded-md p-3 border my-2 ${
                      isSelectedUser
                        ? "border-blue-600 bg-slate-800"
                        : "border-slate-800 hover:bg-slate-800"
                    } `}
                    key={user?._id}
                    onClick={() => handleChangeConversation(user)}
                  >
                    <div className="flex items-center gap-4 cursor-pointer w-full overflow-hidden">
                      <div className={`avatar ${isOnline ? "online" : ""}`}>
                        <div className="w-12 md:w-16 rounded-full">
                          <img src={user?.profilePic} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-0.5 w-full">
                        <p className="text-lg font-semibold line-clamp-1">
                          {user?.firstName + " " + user?.lastName}
                        </p>
                        <p className="text-slate-400">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                );
            }
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchDialog;
