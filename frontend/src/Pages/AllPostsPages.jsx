import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../Components/PostCard';

// Utility to parse query params from URL
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const AllPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const query = useQuery();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Build query object from URL params
        const params = {};
        for (const [key, value] of query.entries()) {
          params[key] = value;
        }

        const { data } = await axios.get('/api/posts', { params });
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      }
    };

    fetchPosts();
  }, [query.toString()]); // re-run when query params change

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">🏠 Room Listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <p className="text-center col-span-full">No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default AllPostsPage;
