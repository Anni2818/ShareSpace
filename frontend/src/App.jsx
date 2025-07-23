// App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/navbar";
import Home from "./Pages/Home";
import AllPosts from "./Pages/AllPostsPages";
import PostDetails from "./Pages/PostDetails";
import MyPosts from "./Pages/MyPosts";
import CreatePost from "./Pages/CreatePost";
import Login from "./Pages/Login";
import Signup from "./Pages/SignUp";
import RequestsPage from "./Pages/RequestPage";
import AboutUs from "./Pages/AboutUs";
import Profile from "./Pages/Profile";
import MyRequests from "./Pages/MyRequests"; // ✅ Add thi
import VerifyEmail from "./Pages/VerifyResult"; // ✅ Add this import

const App = () => {
  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem("token") ? true : false;
  });

  return (
    <Router>
      <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <div className="pt-20 px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/posts" element={<AllPosts />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/my-requests" element={<MyRequests />} /> {/* ✅ New route */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
