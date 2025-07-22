import { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from '../Components/PostCard';

const AllPostsPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await axios.get('/api/posts');
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">🏠 Room Listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default AllPostsPage;
