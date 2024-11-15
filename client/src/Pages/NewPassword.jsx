import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.ico";
import useResetPassword from "../Hooks/useResetPassword";

const NewPassword = () => {
  const location = useLocation();
  const { email } = location.state || {};
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [])

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
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await useResetPassword(formData.newPassword, email);
      if (response.success) {
        navigate("/login");
        toast.success(response?.message);
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error(
        error.message || "Something went wrong. Please try again later."
      );
      console.log(error.message || error);
    } finally {
      setFormData({
        newPassword: "",
        confirmPassword: "",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-[100vw] text-center absolute top-10 flex items-center justify-center gap-3">
        <img src={logo} alt="Hero Image" className="w-20 rounded-lg" />
        <h1 className="text-3xl font-bold text-slate-100">talkAtive</h1>
      </div>
      <div className="min-h-[100vh] flex items-center justify-center bg-slate-950 m-auto flex-col gap-5">
        <div className="md:bg-slate-900 p-8 rounded-lg shadow-md w-full max-w-md bg-slate-950">
          <h2 className="text-zinc-300 text-2xl font-bold mb-6 text-center">
            {loading ? "Reseting..." : "Reset Password"}
          </h2>
          <form onSubmit={handleSubmit} className="relative">
            <div className="mb-4">
              <label className="input flex items-center gap-2 bg-slate-800 text-slate-100">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="New Password"
                  value={formData.newPassword}
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
            <div className="mb-4">
              <label className="input flex items-center gap-2 bg-slate-800 text-slate-100">
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
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

            <button
              type="submit"
              className={`w-full ${
                loading ? "bg-blue-800 my-5 cursor-not-allowed" : "bg-blue-700"
              } text-white py-2 rounded shadow-sm hover:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300 relative`}
              disabled={loading}
            >
              {loading ? (
                <div className="loading-spinner loading bg-slate-100"></div>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default NewPassword;
