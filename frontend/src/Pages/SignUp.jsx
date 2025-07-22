import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'seeker',
    phoneNumber: '',
    location: '',
    bio: '',
    hobbies: '',
    profilePic: '',
    aadharCardUrl: '',
    preferences: {
      smoking: false,
      pets: false,
      nightOwl: false,
      cleanlinessLevel: 3,
    },
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name in formData.preferences) {
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [name]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      hobbies: formData.hobbies.split(',').map((h) => h.trim()),
    };
    console.log('Submitted data:', finalData);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200 px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-4xl">
        <div className="p-10">
          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Create Your Account</h2>
          <form onSubmit={handleSubmit} className="space-y-5 max-h-[80vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                placeholder="Full Name"
                required
                className="bg-gray-100 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                value={formData.name}
                onChange={handleChange}
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                className="bg-gray-100 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                value={formData.email}
                onChange={handleChange}
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                required
                className="bg-gray-100 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                value={formData.password}
                onChange={handleChange}
              />
              <input
                name="phoneNumber"
                placeholder="Phone Number"
                className="bg-gray-100 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              <input
                name="location"
                placeholder="Location"
                className="bg-gray-100 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                value={formData.location}
                onChange={handleChange}
              />
              <select
                name="role"
                className="bg-gray-100 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="seeker">Seeker</option>
                <option value="poster">Poster</option>
                <option value="admin">Admin</option>
              </select>
              <input
                name="profilePic"
                placeholder="Profile Pic URL"
                className="bg-gray-100 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                value={formData.profilePic}
                onChange={handleChange}
              />
              <input
                name="aadharCardUrl"
                placeholder="Aadhar Card URL"
                className="bg-gray-100 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                value={formData.aadharCardUrl}
                onChange={handleChange}
              />
            </div>

            <textarea
              name="bio"
              placeholder="Short Bio (max 500 chars)"
              maxLength="500"
              rows="3"
              className="bg-gray-100 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 w-full"
              value={formData.bio}
              onChange={handleChange}
            />

            <input
              name="hobbies"
              placeholder="Hobbies (comma separated)"
              className="bg-gray-100 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 w-full"
              value={formData.hobbies}
              onChange={handleChange}
            />

            <div>
              <label className="block font-medium text-gray-700 mb-2">Preferences</label>
              <div className="flex flex-wrap gap-4">
                {["smoking", "pets", "nightOwl"].map((pref) => (
                  <label key={pref} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      name={pref}
                      checked={formData.preferences[pref]}
                      onChange={handleChange}
                      className="accent-indigo-600"
                    />
                    {pref.charAt(0).toUpperCase() + pref.slice(1)}
                  </label>
                ))}
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  Cleanliness
                  <input
                    type="range"
                    name="cleanlinessLevel"
                    min="1"
                    max="5"
                    value={formData.preferences.cleanlinessLevel}
                    onChange={handleChange}
                    className="accent-indigo-600"
                  />
                  {formData.preferences.cleanlinessLevel}
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition duration-300"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
