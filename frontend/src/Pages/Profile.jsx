import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios
      .get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        console.log('User Data:', res.data); // ✅ DEBUG
        setUser(res.data);
      })
      .catch((err) => {
        console.error('Error loading profile:', err);
        setMessage('Failed to load profile');
      });
  }, []);

  if (!user) {
    return <div className="mt-24 text-center text-gray-600">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-24 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-indigo-600">My Profile</h2>
      {message && <p className="mb-4 text-red-500">{message}</p>}

      <div className="flex flex-col md:flex-row gap-8">
        {user.profilePic && (
          <img
            src={user.profilePic}
            alt="Profile"
            className="w-40 h-40 object-cover rounded-full border shadow"
          />
        )}

        <div className="space-y-4 flex-1">
          <Info label="Full Name" value={user.name} />
          <Info label="Email" value={user.email} />
          <Info label="Gender" value={user.gender || 'Not specified'} />
          <Info label="Phone Number" value={user.phoneNumber || 'Not provided'} />
          <Info label="Location" value={user.location || 'Not specified'} />
          <Info label="Bio" value={user.bio || 'No bio provided'} />

          <Info label="Aadhar Card">
            {user.aadharCardUrl ? (
              <a
                href={user.aadharCardUrl}
                className="text-blue-600 underline break-all"
                target="_blank"
                rel="noreferrer"
              >
                {user.aadharCardUrl}
              </a>
            ) : (
              'Not uploaded'
            )}
          </Info>

          <Info label="Roles" value={Array.isArray(user.role) ? user.role.join(', ') : user.role} />
          <Info label="Hobbies" value={(user.hobbies || []).join(', ') || 'None'} />
          <Info label="Verified" value={user.isVerified ? 'Yes ✅' : 'No ❌'} />

          {user.preferences && (
            <div>
              <h3 className="text-lg font-medium text-gray-700">Preferences</h3>
              <ul className="list-disc list-inside text-gray-600 ml-2">
                <li>Smoking: {user.preferences.smoking ? 'Yes' : 'No'}</li>
                <li>Pets: {user.preferences.pets ? 'Yes' : 'No'}</li>
                <li>Night Owl: {user.preferences.nightOwl ? 'Yes' : 'No'}</li>
                <li>
                  Cleanliness Level:{' '}
                  {user.preferences.cleanlinessLevel || 'Not specified'}
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value, children }) => (
  <div>
    <label className="block text-gray-600 font-medium">{label}</label>
    <p className="bg-gray-100 p-2 rounded">{children || value}</p>
  </div>
);

export default Profile;
