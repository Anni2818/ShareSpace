import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: [],
    phoneNumber: '',
    profilePic: '',
    bio: '',
    aadharCardUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';

    if (!formData.role.length) {
      errors.role = 'Select at least one role';
    } else {
      const validRoles = ['seeker', 'poster'];
      const isValid = formData.role.every((r) => validRoles.includes(r));
      if (!isValid) errors.role = 'Only seeker, poster, or both are allowed';
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'role') {
      const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
      setFormData((prev) => ({ ...prev, role: selected }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const errors = validateForm();
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData);
      setSuccess(data.message || 'Registered successfully! Please verify your email.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200 px-4 py-10">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-3xl p-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-6">
          Sign Up for ShareSpace
        </h2>

        {error && <div className="text-red-600 text-center font-medium mb-4">{error}</div>}
        {success && <div className="text-green-600 text-center font-medium mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              ['name', 'Full Name'],
              ['email', 'Email', 'email'],
              ['password', 'Password', 'password'],
            ].map(([name, label, type = 'text']) => (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <input
                  id={name}
                  name={name}
                  type={type}
                  value={formData[name]}
                  onChange={handleChange}
                  className={`w-full p-3 border ${
                    validationErrors[name] ? 'border-red-500' : 'border-gray-300'
                  } rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  required
                />
                {validationErrors[name] && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors[name]}</p>
                )}
              </div>
            ))}

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Select Role(s)
              </label>
              <select
                id="role"
                name="role"
                multiple
                value={formData.role}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  validationErrors.role ? 'border-red-500' : 'border-gray-300'
                } rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              >
                <option value="seeker">Seeker</option>
                <option value="poster">Poster</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl (Cmd) to select both</p>
              {validationErrors.role && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.role}</p>
              )}
            </div>

            {[
              ['phoneNumber', 'Phone Number'],
              ['profilePic', 'Profile Picture URL'],
              ['aadharCardUrl', 'Aadhar Card URL'],
            ].map(([name, label]) => (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                  {label} (Optional)
                </label>
                <input
                  id={name}
                  name={name}
                  type="text"
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Short Bio (Optional)
            </label>
            <textarea
              id="bio"
              name="bio"
              rows="3"
              maxLength={500}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium text-lg shadow-md transition duration-200"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
