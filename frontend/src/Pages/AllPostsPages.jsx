import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../Components/PostCard';

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

        const { data } = await axios.get('/api/posts', { params });

        // ✅ Flexible handling of both response formats
        if (Array.isArray(data)) {
          setPosts(data);
        } else if (data?.posts && Array.isArray(data.posts)) {
          setPosts(data.posts);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (error) {
        console.error('Error fetching posts:', error.message);
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
