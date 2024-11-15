import { useFileHandler } from "6pp";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdCameraAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../Context/AuthContext";
import { uploadFile } from "../../Utils/uploadFile";

const UpdateDialog = ({ onClose }) => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuthContext();
  const avatar = useFileHandler("single");
  const [formData, setFormData] = useState({
    firstName: authUser?.firstName,
    lastName: authUser?.lastName,
    email: authUser?.email,
    profilePic: authUser?.profilePic,
  });

  const [disableBtn, setDisableBtn] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      formData.firstName !== authUser?.firstName ||
      formData.lastName !== authUser?.lastName ||
      avatar.preview
    ) {
      setDisableBtn(false);
    } else {
      setDisableBtn(true);
    }
  }, [formData, avatar.preview, authUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let updatedFormData = formData;
      if (avatar?.file) {
        const UploadProfilePic = await uploadFile(avatar?.file);
        updatedFormData = {
          ...formData,
          profilePic: UploadProfilePic?.secure_url,
        };
      }
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/user/updateDetails`;
      const response = await axios.post(
        url,
        {
          email: updatedFormData.email,
          firstName: updatedFormData.firstName,
          lastName: updatedFormData.lastName,
          profilePic: updatedFormData.profilePic,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        localStorage.setItem("user", JSON.stringify(response?.data?.user));
        setAuthUser(response?.data?.user);
        toast.success("Profile updated successfully");
        setLoading(false);
        onClose();
      } else {
        toast.error(response?.data?.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 bg-slate-950 bg-opacity-60 flex justify-center items-center z-20"
    >
      <div
        className="w-[340px] bg-slate-800 rounded-xl p-5 mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="lg:text-lg text-md font-semibold text-zinc-300 text-center">
          Update Details
        </h1>

        <form onSubmit={handleUpdate} className="relative">
          <div className="my-6 w-[150px] h-[150px] bg-zinc-700 rounded-full mx-auto relative">
            <img
              src={
                avatar.preview == null ? formData.profilePic : avatar.preview
              }
              alt="profile_avatar"
              className="w-full h-full rounded-full object-cover"
            />

            <div className="w-10 h-10 rounded-full bg-zinc-700 absolute bottom-0 right-0">
              <div className="relative">
                <MdCameraAlt className="text-2xl w-full m-auto mt-2.5 text-zinc-200" />
                <input
                  type="file"
                  accept="image/*"
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
              className="input w-full bg-slate-900 text-slate-100"
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
              className="input w-full bg-slate-900 text-slate-100"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              disabled
              className="input w-full bg-slate-800 text-slate-100"
              required
            />
          </div>

          <div className="flex justify-center gap-2 mt-8 w-full">
            <button
              className="px-3 py-2 rounded shadow-sm outline-none bg-slate-900 text-white w-full"
              onClick={() => onClose()}
              type="button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-3 py-2 rounded shadow-sm outline-none text-white w-full ${
                disableBtn ? "bg-slate-900" : "bg-blue-800"
              }`}
              disabled={disableBtn || loading}
            >
              {loading ? (
                <div className="loading-spinner loading bg-slate-100"></div>
              ) : (
                "Update"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateDialog;
