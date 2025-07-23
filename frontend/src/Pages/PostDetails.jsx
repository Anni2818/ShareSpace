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
        setError('Failed to fetch post');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;
  if (!post) return <div className="text-center mt-8">No post found.</div>;

  const {
    title,
    location,
    rent,
    tags,
    hobbies,
    description,
    genderPreference,
    roomType,
    availabilityFrom,
    isAvailable,
    user,
    images,
  } = post;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-gray-600 mb-2">Location: {location}</p>
      <p className="text-gray-600 mb-2">Rent: ₹{rent}</p>
      <p className="text-gray-600 mb-2">Room Type: {roomType?.charAt(0).toUpperCase() + roomType?.slice(1)}</p>
      <p className="text-gray-600 mb-2">Gender Preference: {genderPreference}</p>
      <p className="text-gray-600 mb-2">
        Availability From: {new Date(availabilityFrom).toLocaleDateString()}
      </p>
      <p className="text-gray-600 mb-2">Available: {isAvailable ? 'Yes' : 'No'}</p>

      {user && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Posted By:</h3>
          <p className="text-gray-700">{user.name || 'User'}</p>
          <p className="text-gray-600">{user.email}</p>
        </div>
      )}

      {description && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Description:</h3>
          <p>{description}</p>
        </div>
      )}

      {tags?.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {hobbies?.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Preferred Roommate Hobbies:</h3>
          <div className="flex flex-wrap gap-2">
            {hobbies.map((hobby, index) => (
              <span key={index} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                {hobby}
              </span>
            ))}
          </div>
        </div>
      )}

      {images?.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Images:</h3>
          <div className="grid grid-cols-2 gap-4">
            {images.map((imgUrl, index) => (
              <img key={index} src={imgUrl} alt={`Room ${index}`} className="w-full h-auto rounded" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
