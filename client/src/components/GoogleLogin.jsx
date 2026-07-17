import React from "react";
import { useGoogleAuth } from "../config/GoogleAuth";
import { FaGoogle } from "react-icons/fa";
import api from "../config/API";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const GoogleLogin = () => {

  const {user, setUser, setLogin, login} = useAuth();

  const [formData, setFormData] = useState({
    role:"",
  });

  const { isLoading, error, isInitialized, signInWithGoogle } = useGoogleAuth();

  const [loading, setLoading] = React.useState(false);

  const handleProfileUpdate = async() =>{
    try {
      
      const res = await api.patch("/auth/update-role", formData);

      setUser(res?.data?.data);

    } catch (error) {
      console.log(error);
    }
  }

  const handleGoogleSuccess = async (userData) => {
    console.log("Google Login Data", userData);
    setLoading(true);
    try {
      const res = await api.post("/auth/googleLogin", userData);

      console.log(res?.data?.user);

      toast.success(res?.data?.message);

      // optional: store user or token
      sessionStorage.setItem("EduUser", JSON.stringify(res?.data?.user));
      setUser(res?.data?.user);
      setLogin(true);

    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

   const shouldCompleteProfile =
  login && user && (!user?.role || user?.role === "");

  console.log(shouldCompleteProfile);

  const GoogleLogin = () => {
    signInWithGoogle(handleGoogleSuccess, handleGoogleFailure);
  };

  const handleGoogleFailure = (error) => {
    console.error("Google login failed:", error);
    toast.error("Google login failed. Please try again.");
  };

  return (
    <>
    {
      <div className="flex justify-center items-center gap-5 text-sm">
      Can Register/Login via
      <button
        onClick={GoogleLogin}
        className="flex items-center bg-white text-gray-900 font-semibold px-4 py-2 rounded-md hover:bg-gray-100 transition-colors text-sm border border-gray-300 shadow-sm cursor-pointer"
      >
        <FaGoogle className="mr-2 text-red-500" />
        Continue with Google
      </button>
    </div> 
    }
    {
      shouldCompleteProfile && (<div className="mx-auto mt-10 w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-lg">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white">
          Choose Your Role
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          Select how you want to use the platform.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <button
          onClick={() =>
            setFormData({ ...formData, role: "Teacher" })
          }
          className={`rounded-xl border p-5 transition-all duration-300 ${
            formData.role === "Teacher"
              ? "border-white bg-white text-black"
              : "border-zinc-700 bg-black text-white hover:border-white"
          }`}
        >
          <div className="text-lg font-semibold">Teacher</div>
          <p
            className={`mt-2 text-sm ${
              formData.role === "Teacher"
                ? "text-zinc-700"
                : "text-zinc-400"
            }`}
          >
            Manage meetings with students and parents.
          </p>
        </button>

        <button
          onClick={() =>
            setFormData({ ...formData, role: "Student" })
          }
          className={`rounded-xl border p-5 transition-all duration-300 ${
            formData.role === "Student"
              ? "border-white bg-white text-black"
              : "border-zinc-700 bg-black text-white hover:border-white"
          }`}
        >
          <div className="text-lg font-semibold">Student</div>
          <p
            className={`mt-2 text-sm ${
              formData.role === "Student"
                ? "text-zinc-700"
                : "text-zinc-400"
            }`}
          >
            Schedule meetings with your teachers.
          </p>
        </button>
      </div>
      <div className="mt-6">
  <button
    disabled={!formData.role}
    onClick={handleProfileUpdate}
    className={`w-full rounded-xl py-3 font-semibold transition ${
      formData.role
        ? "bg-white text-black hover:bg-zinc-200"
        : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
    }`}
  >
    Continue
  </button>
</div>
    </div>)
    }
    </>
  );
};

export default GoogleLogin;
