const useVerifyCode = async (email, code) => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-code`;
  
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
      credentials: "include",
    });
  
    const data = await response.json();
  
    return data;
  };
  
  export default useVerifyCode;
  