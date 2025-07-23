import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostCardWithRequests from '../Components/PostCardWithRequests';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [requestsMap, setRequestsMap] = useState({});
  const token = localStorage.getItem('token');

  const fetchMyPosts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userPosts = res.data;
      setPosts(userPosts);

      const requestsData = {};
      await Promise.all(
        userPosts.map(async (post) => {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/requests/post/${post._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          requestsData[post._id] = res.data;
        })
      );

      setRequestsMap(requestsData);
    } catch (err) {
      console.error('Failed to fetch posts or requests:', err.message);
    }
  };

  useEffect(() => {
    if (token) fetchMyPosts();
  }, [token]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">📋 My Room Listings</h2>

      {posts.length === 0 ? (
        <p className="text-gray-600 text-center">No posts created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <PostCardWithRequests
              key={post._id}
              post={post}
              requests={requestsMap[post._id] || []}
              onStatusChange={fetchMyPosts}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
