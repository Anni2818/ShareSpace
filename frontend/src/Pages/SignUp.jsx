import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...formData,
      roles: [formData.role],
      hobbies: formData.hobbies.split(',').map((h) => h.trim()),
    };

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, payload);
      alert(res.data.message || 'Registered! Please verify your email.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200 px-4 py-10">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-10">
        <h2 className="text-4xl font-bold text-center text-indigo-700 mb-8">Create Your Account</h2>

        {error && <div className="text-red-600 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              ['name', 'Full Name'],
              ['email', 'Email', 'email'],
              ['password', 'Password', 'password'],
              ['phoneNumber', 'Phone Number'],
              ['location', 'Location'],
              ['profilePic', 'Profile Pic URL'],
              ['aadharCardUrl', 'Aadhar Card URL'],
            ].map(([name, placeholder, type = 'text']) => (
              <input
                key={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                className="p-3 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                required={['email', 'password', 'name'].includes(name)}
              />
            ))}

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="p-3 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            >
              <option value="seeker">Seeker</option>
              <option value="poster">Poster</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <textarea
            name="bio"
            maxLength="500"
            rows="3"
            placeholder="Short Bio (max 500 chars)"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          />

          <input
            name="hobbies"
            placeholder="Hobbies (comma separated)"
            value={formData.hobbies}
            onChange={handleChange}
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          />

          <div>
            <label className="block font-semibold mb-2 text-gray-700">Preferences</label>
            <div className="flex flex-wrap gap-4">
              {['smoking', 'pets', 'nightOwl'].map((pref) => (
                <label key={pref} className="flex items-center gap-2 text-sm">
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
              <label className="flex items-center gap-3 text-sm">
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
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
