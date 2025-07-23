import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosWithAuth } from '../utils/auth';
import {
  FaMapMarkerAlt, FaRupeeSign, FaUserFriends, FaHome, FaPhoneAlt
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const [requestStatus, setRequestStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [posterPhone, setPosterPhone] = useState(null);

  const {
    _id,
    images = [],
    title = 'Untitled Room',
    location = 'Unknown Location',
    rent,
    genderPreference = 'Any',
    roomType = 'N/A',
    description = 'No description provided.',
    tags = [],
  } = post || {};

  useEffect(() => {
    const fetchRequestStatus = async () => {
      try {
        const { data } = await axiosWithAuth().get(`/api/requests/status/${_id}`);
        setRequestStatus(data.status);

        if (data.status === 'accepted') {
          const res = await axiosWithAuth().get(`/api/posts/${_id}`);
          const phone = res.data?.user?.phoneNumber;
          if (phone) {
            setPosterPhone(phone);
          }
        }
      } catch (err) {
        console.error('Error checking request status:', err?.response?.data?.message || err.message);
      }
    };

    fetchRequestStatus();
  }, [_id]);

  const handleRequest = async () => {
    try {
      setLoading(true);
      const { data } = await axiosWithAuth().post(`/api/requests/${_id}`);
      setRequestStatus(data.status || 'pending');
      toast.success('Request sent successfully!');
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg === 'Request already sent for this post') {
        setRequestStatus('pending');
        toast.info('Request already sent!');
      } else {
        toast.error(msg || 'Error sending request');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
      <img
        src={images[0] || '/default-room.jpg'}
        alt={title}
        className="w-full h-48 object-cover cursor-pointer"
        onClick={() => navigate(`/post/${_id}`)}
      />

      <div className="p-4 space-y-2">
        <h3 className="text-xl font-semibold truncate cursor-pointer" onClick={() => navigate(`/post/${_id}`)}>
          {title}
        </h3>

        <div className="text-gray-600 text-sm flex items-center gap-2">
          <FaMapMarkerAlt className="text-gray-500" />
          {location}
        </div>

        <div className="flex justify-between text-sm mt-2">
          <span className="flex items-center gap-1 text-green-600">
            <FaRupeeSign /> {rent ? `${rent}/month` : 'N/A'}
          </span>
          <span className="flex items-center gap-1 text-blue-600">
            <FaUserFriends /> {genderPreference}
          </span>
          <span className="flex items-center gap-1 text-purple-600">
            <FaHome /> {roomType}
          </span>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2">{description}</p>

        <div className="flex flex-wrap gap-2 mt-2">
          {tags.length > 0 ? (
            tags.map((tag, index) => (
              <span key={index} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                #{tag}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400">No tags</span>
          )}
        </div>

        {/* Poster contact if accepted */}
        {posterPhone && (
          <div className="mt-3 text-sm text-green-600 flex items-center gap-2">
            <FaPhoneAlt />
            <a
              href={`https://wa.me/${posterPhone.replace('+', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-green-800"
            >
              {posterPhone}
            </a>
          </div>
        )}

        <div className="mt-4 flex gap-3 flex-wrap">
          <button
            onClick={handleRequest}
            disabled={loading || requestStatus}
            className={`px-4 py-1 rounded-md text-sm font-medium ${
              requestStatus
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {requestStatus ? `Request ${requestStatus}` : 'Request to Join'}
          </button>

          <button
            onClick={() => navigate(`/posts/${_id}`)}
            className="px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm"
          >
            Match Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
