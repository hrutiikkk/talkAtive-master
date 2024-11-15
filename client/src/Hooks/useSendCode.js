const useSendCode = async (email) => {
  const url = `${import.meta.env.VITE_BACKEND_URL}/api/auth/send-code`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
    credentials: "include",
  });

  const data = await response.json();

  return data;
};

export default useSendCode;
