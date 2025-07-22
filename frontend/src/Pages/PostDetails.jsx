import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`/api/posts/${id}`);
        setPost(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Error fetching post details.');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        {post.images && post.images.length > 0 ? (
          <img
            src={post.images[0]}
            alt="Room"
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
            No Image Available
          </div>
        )}

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-600 mb-4">{post.description}</p>

          <div className="flex items-center gap-4 mb-6">
            {post.user?.profilePic && (
              <img
                src={post.user.profilePic}
                alt="User"
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div>
              <p className="font-medium text-gray-800">Posted by:</p>
              <p className="text-blue-600 font-semibold">{post.user?.name}</p>
              {post.user?.email && (
                <p className="text-sm text-gray-500">{post.user.email}</p>
              )}
              {post.user?.bio && (
                <p className="text-sm text-gray-500 italic">{post.user.bio}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-4">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              Location: {post.location}
            </span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              Rent: ₹{post.rent}/month
            </span>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
              Room Type: {post.roomType}
            </span>
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
              Gender Preference: {post.genderPreference}
            </span>
          </div>

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {post.hobbies?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.hobbies.map((hobby, i) => (
                <span
                  key={i}
                  className="bg-pink-100 px-3 py-1 rounded-full text-xs text-pink-700"
                >
                  🧩 {hobby}
                </span>
              ))}
            </div>
          )}

          {post.availabilityFrom && (
            <p className="mt-4 text-sm text-gray-600">
              Available from:{' '}
              <span className="font-medium">
                {new Date(post.availabilityFrom).toDateString()}
              </span>
            </p>
          )}

          {/* Optional: Show matches and requests count if present */}
          <div className="mt-6 flex gap-4 flex-wrap">
            {post.matches?.length > 0 && (
              <span className="text-sm text-green-600 font-semibold">
                Matches: {post.matches.length}
              </span>
            )}
            {post.requests?.length > 0 && (
              <span className="text-sm text-blue-600 font-semibold">
                Requests: {post.requests.length}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
