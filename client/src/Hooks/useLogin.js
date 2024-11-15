
const useLogin = async (formData) => {
  const url = `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
    credentials: "include",
  });

  const data = await response.json();

  return data;
};

export default useLogin;
