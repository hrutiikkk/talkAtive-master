import { useEffect } from "react";
import Conversation from "../Components/Conversation/Conversation";
import Sidebar from "../Components/Sidebar/Sidebar";
import { useAuthContext } from "../Context/AuthContext";

const Home = () => {
  const { setAuthUser } = useAuthContext();
  
  useEffect(() => {
    setAuthUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  return (
    <div className="flex items-center justify-center w-[100vw] h-[100vh] bg-slate-950">
      <div className="m-auto h-[95vh] w-[95vw] sm:h-[calc(100vh-30px)] sm:w-[calc(100vw-50px)] rounded-lg overflow-hidden bg-slate-900 grid shadow-2xl md:grid-cols-[400px_1fr]">
        <Sidebar />
        <Conversation />
      </div>
    </div>
  );
};

export default Home;
