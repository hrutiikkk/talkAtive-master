import React, { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuthContext } from "./Context/AuthContext";

// Lazy load the components
const ForgotPassword = lazy(() => import("./Pages/ForgotPassword"));
const Home = lazy(() => import("./Pages/Home"));
const Login = lazy(() => import("./Pages/Login"));
const NewPassword = lazy(() => import("./Pages/NewPassword"));
const Register = lazy(() => import("./Pages/Register"));

const App = () => {
  const { authUser } = useAuthContext();

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="w-full h-screen flex items-center justify-center">
        <div className="loading loading-spinner"></div>
      </div>}>
        <Routes>
          <Route
            path="/"
            element={authUser ? <Home /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/register"
            element={authUser ? <Navigate to={"/"} /> : <Register />}
          />
          <Route
            path="/login"
            element={authUser ? <Navigate to={"/"} /> : <Login />}
          />
          <Route
            path="/forgot-password"
            element={authUser ? <Navigate to={"/"} /> : <ForgotPassword />}
          />
          <Route
            path="/reset-password"
            element={authUser ? <Navigate to={"/"} /> : <NewPassword />}
          />
          <Route path="*" element={<Navigate to={"/"} />} />
        </Routes>
      </Suspense>
      <Toaster position="top-center" reverseOrder={false} />
    </BrowserRouter>
  );
};

export default App;
