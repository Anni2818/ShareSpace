import React from 'react';
import { FaMapMarkerAlt, FaRupeeSign, FaUserFriends, FaHome } from 'react-icons/fa';

const PostCard = ({ post }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
      <img
        src={post?.images?.[0] || '/default-room.jpg'}
        alt="Room"
        className="w-full h-48 object-cover"
      />

      <div className="p-4 space-y-2">
        <h3 className="text-xl font-semibold truncate">{post?.title || 'Untitled Room'}</h3>

        <div className="text-gray-600 text-sm flex items-center gap-2">
          <FaMapMarkerAlt /> {post?.location || 'Unknown Location'}
        </div>

        <div className="flex justify-between text-sm mt-2">
          <span className="flex items-center gap-1 text-green-600">
            <FaRupeeSign /> {post?.rent ? `${post.rent}/month` : 'N/A'}
          </span>
          <span className="flex items-center gap-1 text-blue-600">
            <FaUserFriends /> {post?.genderPreference || 'Any'}
          </span>
          <span className="flex items-center gap-1 text-purple-600">
            <FaHome /> {post?.roomType || 'N/A'}
          </span>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2">
          {post?.description || 'No description provided.'}
        </p>

        <div className="flex flex-wrap gap-2 mt-2">
          {post?.tags?.length > 0 ? (
            post.tags.map((tag, i) => (
              <span
                key={i}
                className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400">No tags</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
