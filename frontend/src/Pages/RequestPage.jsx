import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RequestsPage = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/posts/my', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const posts = Array.isArray(res.data) ? res.data : [];
        setMyPosts(posts);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setMyPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/requests/${requestId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Optimistically update UI
      setMyPosts((prev) =>
        prev.map((post) => ({
          ...post,
          requests: post.requests.map((req) =>
            req._id === requestId ? { ...req, status: 'accepted' } : req
          ),
        }))
      );
    } catch (err) {
      console.error('Error accepting request:', err);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/requests/${requestId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Optimistically update UI
      setMyPosts((prev) =>
        prev.map((post) => ({
          ...post,
          requests: post.requests.map((req) =>
            req._id === requestId ? { ...req, status: 'rejected' } : req
          ),
        }))
      );
    } catch (err) {
      console.error('Error rejecting request:', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 mt-20">
      <h2 className="text-2xl font-bold text-center mb-4">Requests for Your Posts</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : myPosts.length === 0 ? (
        <p className="text-center text-gray-600">You haven’t created any posts yet.</p>
      ) : (
        myPosts.map((post) => (
          <div key={post._id} className="mb-6 border p-4 rounded shadow">
            <h3 className="text-xl font-semibold">{post.title}</h3>
            <p className="text-gray-600">Location: {post.location}</p>
            <p className="text-gray-600">Rent: ₹{post.rent}</p>

            {post.requests?.length === 0 ? (
              <p className="text-sm text-gray-500 mt-2">No requests yet.</p>
            ) : (
              <div className="mt-4">
                <h4 className="text-lg font-medium mb-2">Requests:</h4>
                <ul className="space-y-3">
                  {post.requests.map((req) => (
                    <li
                      key={req._id}
                      className="border p-3 rounded flex flex-col md:flex-row md:justify-between md:items-center"
                    >
                      <div>
                        <p><strong>Name:</strong> {req.seeker?.name || 'Unknown'}</p>
                        <p><strong>Email:</strong> {req.seeker?.email || 'Unknown'}</p>
                        <p>
                          <strong>Status:</strong>{' '}
                          <span className={`font-medium ${
                            req.status === 'accepted'
                              ? 'text-green-600'
                              : req.status === 'rejected'
                              ? 'text-red-500'
                              : 'text-yellow-600'
                          }`}>
                            {req.status}
                          </span>
                        </p>
                      </div>
                      {req.status === 'pending' && (
                        <div className="mt-3 md:mt-0 flex gap-2">
                          <button
                            onClick={() => handleAccept(req._id)}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(req._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default RequestsPage;
