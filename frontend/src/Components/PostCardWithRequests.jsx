import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-toastify';

const RequestCard = ({ request, onAccept, onReject, onMatch }) => {
  const { seeker, status, _id } = request;

  const whatsappLink = seeker?.phoneNumber
    ? `https://wa.me/${seeker.phoneNumber.replace(/\D/g, '')}`
    : null;

  return (
    <div className="border p-3 rounded-lg mb-3 bg-white shadow-sm space-y-1">
      <p><strong>👤 Name:</strong> {seeker?.name || 'N/A'}</p>
      <p><strong>📧 Email:</strong> {seeker?.email || 'N/A'}</p>

      {status === 'accepted' && (
        <>
          <p className="flex items-center gap-2">
            <strong>📱 Mobile:</strong>
            {seeker?.phoneNumber || 'N/A'}
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 ml-1"
                title="Chat on WhatsApp"
              >
                <FaWhatsapp size={18} />
              </a>
            )}
          </p>
          {seeker?.bio && <p><strong>📝 Bio:</strong> {seeker.bio}</p>}
          {seeker?.profilePic && (
            <img
              src={seeker.profilePic}
              alt="Profile"
              className="w-16 h-16 object-cover rounded-full mt-2"
            />
          )}
        </>
      )}

      <p>
        <strong>📌 Status:</strong>{' '}
        <span className={`font-semibold ${
          status === 'accepted' ? 'text-green-600'
          : status === 'rejected' ? 'text-red-500'
          : 'text-yellow-500'
        }`}>
          {status}
        </span>
      </p>

      {status === 'pending' && (
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => onAccept(_id)}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            ✅ Accept
          </button>
          <button
            onClick={() => onReject(_id)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            ❌ Reject
          </button>
          <button
            onClick={() => onMatch(_id)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            🤝 Match
          </button>
        </div>
      )}
    </div>
  );
};

const PostCardWithRequests = ({ post }) => {
  const token = localStorage.getItem('token');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/requests/post/${post._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (post?._id) {
      fetchRequests();
    }
  }, [post?._id]);

  const handleAccept = async (requestId) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/requests/${requestId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || 'Request accepted');
      const updated = requests.map((r) =>
        r._id === requestId
          ? { ...r, status: 'accepted', seeker: { ...r.seeker, ...res.data.seeker } }
          : r
      );
      setRequests(updated);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/requests/${requestId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.info(res.data.message || 'Request rejected');
      const updated = requests.map((r) =>
        r._id === requestId ? { ...r, status: 'rejected' } : r
      );
      setRequests(updated);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject request');
    }
  };

  const handleMatch = async (requestId) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/requests/${requestId}/match`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || 'Matched successfully');
      const updated = requests.map((r) =>
        r._id === requestId ? { ...r, status: 'accepted' } : r
      );
      setRequests(updated);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Match failed');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
      <img
        src={post?.images?.[0] || '/default-room.jpg'}
        alt="Room"
        className="w-full h-60 object-cover"
      />

      <div className="p-4 space-y-3">
        <h3 className="text-2xl font-bold text-gray-800">{post?.title || 'No Title'}</h3>
        <p className="text-gray-600">{post?.description || 'No description provided.'}</p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          <span>📍 <strong>Location:</strong> {post?.location || 'N/A'}</span>
          <span>🏠 <strong>Room Type:</strong> {post?.roomType || 'N/A'}</span>
          <span>⚧️ <strong>Gender Preference:</strong> {post?.genderPreference || 'N/A'}</span>
          <span>💰 <strong>Rent:</strong> ₹{post?.rent || 'N/A'}</span>
        </div>

        {post?.tags?.length > 0 && (
          <div><strong>🏷 Tags:</strong> {post.tags.join(', ')}</div>
        )}
        {post?.hobbies?.length > 0 && (
          <div><strong>🎯 Hobbies:</strong> {post.hobbies.join(', ')}</div>
        )}

        <div className="bg-gray-100 p-4 rounded-lg mt-4">
          <h4 className="font-semibold text-lg mb-2">📨 Requests</h4>
          {loading ? (
            <p className="text-gray-500 italic">Loading requests...</p>
          ) : requests.length > 0 ? (
            requests.map((req) => (
              <RequestCard
                key={req._id}
                request={req}
                onAccept={handleAccept}
                onReject={handleReject}
                onMatch={handleMatch}
              />
            ))
          ) : (
            <p className="text-gray-500 italic">No requests yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCardWithRequests;
