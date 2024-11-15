const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/auto/upload`;

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "Chat-Applicaton");

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  return await res.json();
};
