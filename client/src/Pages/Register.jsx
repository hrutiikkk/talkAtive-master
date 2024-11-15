import { useFileHandler } from "6pp";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { MdCameraAlt } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../Context/AuthContext";
import useRegister from "../Hooks/useRegister";
import { default_avatar } from "../Utils/constants";

const Register = () => {
  const { setAuthUser } = useAuthContext();
  const navigate = useNavigate();
  const avatar = useFileHandler("single");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    profilePic: "",
  });
  const [loading, setLoading] = useState(false);

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
      const response = await useRegister(formData, avatar.file);
      if (response.success) {
        localStorage.setItem("user", JSON.stringify(response.data));
        setAuthUser(JSON.stringify(response.data));
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          profilePic: "",
        });
        avatar.clear();
        navigate("/");
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Something went wrong. Please try again later."
      );
      console.log(error.message || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100vh] flex items-center justify-center bg-slate-950 m-auto">
      <div className="md:bg-slate-900 p-8 rounded-lg shadow-md w-full max-w-md bg-slate-950">
        <h2 className="text-zinc-300 text-2xl font-bold mb-6 text-center">
          {loading ? "Registering..." : "Register"}
        </h2>
        <form onSubmit={handleSubmit} className="relative">
          <div className="my-6 w-[150px] h-[150px] bg-zinc-700 rounded-full mx-auto relative">
            <img
              src={avatar.preview == null ? default_avatar : avatar.preview}
              alt="profile_avatar"
              className="w-full h-full rounded-full object-cover"
            />

            <div className="w-10 h-10 rounded-full bg-zinc-700 absolute bottom-0 right-0">
              <div className="relative">
                <MdCameraAlt className="text-2xl w-full m-auto mt-2.5 text-zinc-200" />
                <input
                  type="file"
                  accept="image/*"
                  required
                  className="w-full h-[40px] opacity-0 cursor-pointer absolute z-10 top-[-10px] border-red-400 border-2"
                  onChange={avatar.changeHandler}
                />
              </div>
            </div>
          </div>

          {avatar.error && (
            <h2 className="text-red-600 mt-2 ml-2">{avatar.error}</h2>
          )}

          <div className="mb-4 w-full">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="input w-full bg-slate-800 text-slate-100"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="input w-full bg-slate-800 text-slate-100"
              required
            />
          </div>
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
                onClick={() => setShowPassword(!showPassword)}
                onMouseDown={(e) => e.preventDefault()}
              >
                {!showPassword ? <LuEyeOff /> : <LuEye />}
              </div>
            </label>
          </div>
          <button
            type="submit"
            className={`w-full ${
              loading ? "bg-blue-800 my-5" : "bg-blue-700 hover:bg-blue-800"
            } text-white py-2 rounded shadow-sm  focus:outline-none focus:ring focus:ring-blue-300 relative`}
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <div className="loading-spinner loading bg-slate-100"></div>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-white">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
