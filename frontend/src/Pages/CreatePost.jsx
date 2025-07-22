import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    rent: '',
    tags: '',
    hobbies: '',
    imageUrl: '',
    genderPreference: 'any',
    roomType: 'private',
    availabilityFrom: '',
  });

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL; // Should be: http://localhost:5000/api

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to create a post.');
        return;
      }

      const postData = {
        ...formData,
        rent: Number(formData.rent),
        tags: formData.tags.split(',').map(tag => tag.trim()),
        hobbies: formData.hobbies.split(',').map(hobby => hobby.trim()),
        images: formData.imageUrl ? [formData.imageUrl] : [],
      };

      const { data } = await axios.post(`${API_URL}/api/posts`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      navigate(`/post/${data._id}`);
    } catch (err) {
      console.error('Post creation failed:', err?.response?.data || err);
      alert('Failed to create post. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md p-8 rounded-lg my-10">
      <h2 className="text-3xl font-semibold mb-6 text-center text-blue-600">📤 Create Room Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="w-full border rounded px-4 py-2" required />

        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full border rounded px-4 py-2" rows={4} required />

        <input type="text" name="location" placeholder="Location (e.g., Pune)" value={formData.location} onChange={handleChange} className="w-full border rounded px-4 py-2" required />

        <input type="number" name="rent" placeholder="Monthly Rent (₹)" value={formData.rent} onChange={handleChange} className="w-full border rounded px-4 py-2" required />

        <input type="text" name="tags" placeholder="Tags (comma-separated)" value={formData.tags} onChange={handleChange} className="w-full border rounded px-4 py-2" />

        <input type="text" name="hobbies" placeholder="Preferred Hobbies (comma-separated)" value={formData.hobbies} onChange={handleChange} className="w-full border rounded px-4 py-2" />

        <input type="url" name="imageUrl" placeholder="Room Image URL" value={formData.imageUrl} onChange={handleChange} className="w-full border rounded px-4 py-2" />

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium text-gray-700">Gender Preference</label>
            <select name="genderPreference" value={formData.genderPreference} onChange={handleChange} className="w-full border rounded px-4 py-2">
              <option value="any">Any</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block mb-1 font-medium text-gray-700">Room Type</label>
            <select name="roomType" value={formData.roomType} onChange={handleChange} className="w-full border rounded px-4 py-2">
              <option value="private">Private</option>
              <option value="shared">Shared</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Available From</label>
          <input type="date" name="availabilityFrom" value={formData.availabilityFrom} onChange={handleChange} className="w-full border rounded px-4 py-2" required />
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
