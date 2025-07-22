import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/navbar";
import Home from "./Pages/Home";
import AllPosts from "./Pages/AllPostsPages";
import PostDetails from "./Pages/PostDetails";
import MyPosts from "./Pages/MyPosts";
import CreatePost from "./Pages/CreatePost";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<AllPosts />} />
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route path="/my-posts" element={<MyPosts />} />
        <Route path="/create-post" element={<CreatePost />} />
      </Routes>
    </Router>
  );
};

export default App;
