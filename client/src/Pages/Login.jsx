import React, { useState } from "react";
import toast from "react-hot-toast";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../Context/AuthContext";
import useLogin from "../Hooks/useLogin";
import logo from "../assets/logo.ico";

const Login = () => {
  const { setAuthUser } = useAuthContext();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await useLogin(formData);
      if (response.success) {
        localStorage.setItem("user", JSON.stringify(response.data));
        setAuthUser(JSON.stringify(response.data));
        setFormData({
          email: "",
          password: "",
        });
        navigate("/");
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(
        error.message || "Something went wrong. Please try again later."
      );
      console.log(error.message || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="w-[100vw] text-center absolute top-10 flex items-center justify-center gap-3">
        <img
          src={logo}
          alt="Hero Image"
          className="w-20 rounded-lg"
        />  
        <h1 className="text-3xl font-bold text-slate-100">talkAtive</h1>
      </div>
    <div className="min-h-[100vh] flex items-center justify-center bg-slate-950 m-auto flex-col gap-5">

      <div className="md:bg-slate-900 p-8 rounded-lg shadow-md w-full max-w-md bg-slate-950">
        <h2 className="text-zinc-300 text-2xl font-bold mb-6 text-center">
          {loading ? "Logging in..." : "Login"}
        </h2>
        <form onSubmit={handleSubmit} className="relative">
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="input w-full bg-slate-800 text-slate-100"
              required
            />
          </div>
          <div className="mb-4">
            <label className="input flex items-center gap-2 bg-slate-800 text-slate-100">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="grow"
              />
              <div
                className="p-2 rounded-full bg-slate-700 shadow-lg cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
                onMouseDown={(e) => e.preventDefault()}
              >
                {!showPassword ? <LuEyeOff /> : <LuEye />}
              </div>
            </label>
          </div>

          <div className="text-right mb-4">
            <Link
              to="/forgot-password"
              className="text-blue-500 font-semibold"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className={`w-full ${
              loading ? "bg-blue-800 my-5" : "bg-blue-700"
            } text-white py-2 rounded shadow-sm hover:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300 relative`}
            disabled={loading}
          >
            {loading ? (
              <div className="loading-spinner loading bg-slate-100"></div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-white">
            New to talkAtive?{" "}
            <Link to="/register" className="text-blue-500 font-semibold">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
