import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyResult = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const status = params.get("status");
  const message = decodeURIComponent(params.get("message") || "");

  const getStatusStyles = () => {
    switch (status) {
      case "success":
        return {
          text: "text-green-600",
          bg: "bg-green-100",
          border: "border-green-300",
        };
      case "error":
        return {
          text: "text-red-600",
          bg: "bg-red-100",
          border: "border-red-300",
        };
      default:
        return {
          text: "text-yellow-600",
          bg: "bg-yellow-100",
          border: "border-yellow-300",
        };
    }
  };

  const { text, bg, border } = getStatusStyles();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div
        className={`w-full max-w-md ${bg} ${border} border rounded-xl shadow-md p-6 text-center transition-all duration-300`}
      >
        <h1 className={`text-2xl font-bold mb-2 ${text}`}>Email Verification</h1>
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          onClick={() => navigate("/login")}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
        >
          Go to Login
        </button>
      </div>
    </main>
  );
};

export default VerifyResult;
