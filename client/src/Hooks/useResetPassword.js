const useResetPassword = async (password, email) => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`;
  
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
  
    const data = await response.json();
  
    return data;
  };
  
  export default useResetPassword;
  