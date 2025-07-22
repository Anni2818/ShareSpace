import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    imageUrl: "", // using direct URL for now
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/posts", {
        ...formData,
        images: [formData.imageUrl], // assuming backend accepts `images: []`
      });

      const newPost = res.data;
      navigate(`/post/${newPost._id}`);
    } catch (err) {
      console.error("Post creation failed:", err);
      alert("Failed to create post.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Monthly Rent"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />
        <input
          type="url"
          name="imageUrl"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
