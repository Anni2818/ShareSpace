import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    rent: "",
    tags: "",
    hobbies: "",
    imageUrl: "",
    genderPreference: "any",
    roomType: "private",
    availabilityFrom: "",
  });

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const { title, location, rent, availabilityFrom } = formData;
    if (!title.trim() || !location.trim() || !rent || !availabilityFrom) {
      alert("Please fill in all required fields.");
      return false;
    }
    if (isNaN(rent) || rent <= 0) {
      alert("Rent must be a positive number.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to create a post.");
        return;
      }

      const postData = {
        ...formData,
        rent: Number(formData.rent),
        tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        hobbies: formData.hobbies.split(",").map((hobby) => hobby.trim()).filter(Boolean),
        images: formData.imageUrl ? [formData.imageUrl.trim()] : [],
      };

      const { data } = await axios.post(`${API_URL}/api/posts`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // ✅ Redirect to newly created post's details page
      navigate(`/posts/${data._id}`);
    } catch (err) {
      console.error("Post creation failed:", err?.response?.data || err);
      alert("Failed to create post. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg p-8 rounded-xl mt-10">
      <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">
        🏡 Create a Room Post
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title *"
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
          required
        />

        {/* Description */}
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />

        {/* Location & Rent */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location *"
            className="border border-gray-300 rounded-lg px-4 py-2"
            required
          />
          <input
            name="rent"
            type="number"
            value={formData.rent}
            onChange={handleChange}
            placeholder="Monthly Rent (₹) *"
            className="border border-gray-300 rounded-lg px-4 py-2"
            required
          />
        </div>

        {/* Tags & Hobbies */}
        <input
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Tags (comma-separated)"
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
        <input
          name="hobbies"
          value={formData.hobbies}
          onChange={handleChange}
          placeholder="Preferred Hobbies (comma-separated)"
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />

        {/* Image URL */}
        <input
          name="imageUrl"
          type="url"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="Room Image URL"
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />

        {/* Gender & Room Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Gender Preference</label>
            <select
              name="genderPreference"
              value={formData.genderPreference}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="any">Any</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Room Type</label>
            <select
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="private">Private</option>
              <option value="shared">Shared</option>
            </select>
          </div>
        </div>

        {/* Availability */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Available From *</label>
          <input
            name="availabilityFrom"
            type="date"
            value={formData.availabilityFrom}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
        >
          ➕ Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
