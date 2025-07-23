import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../Components/PostCard';

// Hook to get query params from URL
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const AllPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const query = useQuery();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const params = {};
        for (const [key, value] of query.entries()) {
          params[key] = value;
        }

        const { data } = await axios.get('http://localhost:5000/api/posts', { params });

        let allPosts = Array.isArray(data) ? data : data?.posts || [];

        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?._id;

        // Filter out posts created by the logged-in user
        const filteredPosts = allPosts.filter((post) => post?.user?._id !== userId);

        setPosts(filteredPosts);
      } catch (err) {
        console.error('Error fetching posts:', err.message);
        setError('Failed to load posts.');
      }
    };

    fetchPosts();
  }, [query.toString()]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">🏠 Room Listings</h2>

      {error ? (
        <p className="text-red-600 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <p className="text-center col-span-full">No posts available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AllPostsPage;
