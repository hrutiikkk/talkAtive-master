import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../Context/AuthContext";
import useLogout from "../../Hooks/useLogout";
import useConversation from "../../Zustand/useConversation";

const LogoutDialog = ({ onClose }) => {
  const { authUser, setAuthUser } = useAuthContext();
  const { setSelectedConversation } = useConversation();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await useLogout(authUser?._id);
      if (response.success) {
        onClose();
        localStorage.removeItem("user");
        setAuthUser(null);
        setSelectedConversation(null);
        navigate("/login");
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong !!");
    }
  };

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0
  bg-slate-950 bg-opacity-60 flex justify-center items-center z-20"
      onClick={() => onClose()}
    >
      <div
        className=" max-w-md bg-slate-800 rounded-xl p-5 mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="lg:text-lg text-md font-semibold text-zinc-300 text-center">
          Are you sure you want to log out ?
        </h1>

        <div className="flex justify-center gap-2 mt-8 w-full">
          <button
            className="px-3 py-2 rounded shadow-sm outline-none bg-slate-900 text-white w-full"
            onClick={() => onClose()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-3 py-2 rounded shadow-sm outline-none bg-red-600 text-white w-full`}
            onClick={() => handleLogout()}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutDialog;
