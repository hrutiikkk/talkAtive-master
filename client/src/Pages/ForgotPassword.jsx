import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.ico";
import useSendCode from "../Hooks/useSendCode";
import useVerifyCode from "../Hooks/useVerifyCode";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    code: "",
  });
  const [loading, setLoading] = useState(false);
  const [sendCode, setSendCode] = useState({
    loading: false,
    codeSent: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setSendCode({ codeSent: false, loading: true });
    try {
      const response = await useSendCode(formData.email);
      if (response?.success) {
        toast.success(response?.message);
        setSendCode({ loading: false, codeSent: true });
      } else {
        toast.error(response?.message);
        setSendCode({ loading: false, codeSent: false });
      }
    } catch (error) {
      toast.error(
        error.message || "Something went wrong. Please try again later."
      );
      console.log(error.message || error);
    };

  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {
      const response = await useVerifyCode(formData.email, formData.code);
      if (response?.success) {
        toast.success(response?.message);
        navigate("/reset-password", { state: { email: formData.email } });
      } else {
        toast.error(response?.message);
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
        <img src={logo} alt="Hero Image" className="w-20 rounded-lg" />
        <h1 className="text-3xl font-bold text-slate-100">talkAtive</h1>
      </div>
      <div className="min-h-[100vh] w-full flex items-center justify-center bg-slate-950 m-auto flex-col gap-5">
        <div className="md:bg-slate-900 p-8 rounded-lg shadow-md w-full max-w-md bg-slate-950">
          <h2 className="text-zinc-300 text-2xl font-bold mb-6 text-center">
            {loading ? "Loading..." : "Forgot Password"}
          </h2>
          <form
            onSubmit={handleSendCode}
            className="w-full relative flex gap-2"
          >
            <div className="w-full">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="input w-full bg-slate-800 text-slate-100"
                required
                disabled={sendCode.codeSent}
              />
            </div>
            <button
              type="submit"
              className={`w-[150px] px-3 ${
                sendCode.codeSent ? "bg-slate-900 hover:bg-slate-900 cursor-not-allowed" : "bg-blue-700"
              } text-white py-2 rounded shadow-sm hover:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300 relative`}
              disabled={sendCode.loading || sendCode.codeSent}
            >
              {sendCode.loading ? (
                <div className="loading-spinner loading bg-slate-100"></div>
              ) : (
                "Send Code"
              )}
            </button>
          </form>
          <form action="" onSubmit={handleVerifyCode}>
            <div className="my-4">
              <label className="input flex items-center gap-2 bg-slate-800 text-slate-100">
                <input
                  type="text"
                  name="code"
                  placeholder="Code"
                  value={formData.code.toLocaleUpperCase()}
                  onChange={handleChange}
                  className="grow"
                  required
                  disabled={!sendCode.codeSent}
                />
              </label>
            </div>

            <button
              type="submit"
              className={`w-full ${
                loading ? "bg-blue-800 my-5" : "bg-blue-700"
              } ${!sendCode.codeSent ? "cursor-not-allowed" : ""} text-white py-2 rounded shadow-sm hover:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300 relative`}
              disabled={loading || !sendCode.codeSent}
            >
              {loading ? (
                <div className="loading-spinner loading bg-slate-100"></div>
              ) : (
                "Verify Code"
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-white">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-500 font-semibold">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
