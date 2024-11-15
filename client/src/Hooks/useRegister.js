import { uploadFile } from "../Utils/uploadFile";

const useRegister = async (formData, avatar) => {
  const UploadProfilePic = await uploadFile(avatar);
  const updatedFormData = {
    ...formData,
    profilePic: UploadProfilePic?.secure_url,
  };

  const url = `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedFormData),
    credentials: "include",
  });

  const data = await response.json();

  return data;
};

export default useRegister;
