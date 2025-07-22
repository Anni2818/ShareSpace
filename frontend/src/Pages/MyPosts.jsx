// src/Pages/MyPosts.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from '../Components/PostCard';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const token = localStorage.getItem('token'); // Adjust as needed
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get('/api/posts/my', config);
        setPosts(data);
      } catch (error) {
        console.error('Error fetching my posts:', error);
      }
    };

    fetchMyPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">My Room Posts</h2>
      {posts.length === 0 ? (
        <p className="text-center text-gray-600">No posts available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
