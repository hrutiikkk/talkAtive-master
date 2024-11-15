import { useState } from "react";
import { RiLogoutCircleLine, RiUserSearchFill } from "react-icons/ri";
import { useAuthContext } from "../../Context/AuthContext";
import useConversation from "../../Zustand/useConversation";
import LogoutDialog from "../Dailog/LogoutDialog";
import SearchDialog from "../Dailog/SearchDialog";
import UpdateDialog from "../Dailog/UpdateDialog";
import SidebarConversation from "./SidebarConversation";
const Sidebar = () => {
  const [openLogout, setOpenLogout] = useState(false);
  const [openSearch, setOpenSerach] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();

  return (
    <div
      className={`w-full h-full md:h-[calc(100vh-30px)] md:grid md:grid-cols-[80px_1fr] ${
        selectedConversation !== null ? "hidden md:grid" : "grid"
      } transition-all`}
    >
      <div className="border-r border-slate-800 md:h-auto">
        <div className="flex md:flex-col justify-between md:items-stretch w-full h-full p-2 py-3 gap-2">
          <div className="flex md:flex-col gap-2">
            {/* Search */}
            <div
              className="w-16 h-16 rounded-full hover:bg-slate-800 flex items-center justify-center cursor-pointer"
              title="Search"
              onClick={() => setOpenSerach(true)}
            >
              <RiUserSearchFill size={30} />
            </div>
          </div>

          <div className="flex md:flex-col gap-3">
            {/* Profile */}
            <div
              className="avatar m-1 w-14 cursor-pointer"
              title="Profile"
              onClick={() => setOpenUpdate(true)}
            >
              <div className="ring-primary ring-offset-base-100 rounded-full ring ring-offset-2">
                <img src={authUser?.profilePic} />
              </div>
            </div>

            {/* Logout */}
            <div
              className="w-16 h-16 rounded-full hover:bg-slate-800 flex items-center justify-center cursor-pointer"
              title="Logout"
              onClick={() => setOpenLogout(true)}
            >
              <RiLogoutCircleLine size={30} className="text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Loaded Conversations */}
      <SidebarConversation setOpenSerach={setOpenSerach}/>

      {openLogout && <LogoutDialog onClose={() => setOpenLogout(false)} />}

      {openSearch && <SearchDialog onClose={() => setOpenSerach(false)} />}

      {openUpdate && <UpdateDialog onClose={() => setOpenUpdate(false)} />}

      
    </div>
  );
};

export default Sidebar;
