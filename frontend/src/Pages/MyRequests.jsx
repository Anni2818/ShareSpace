import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const res = await axios.get('/api/requests/my');
        const data = Array.isArray(res.data) ? res.data : res.data?.requests || [];
        setRequests(data);
      } catch (err) {
        console.error("Failed to fetch requests:", err);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRequests();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Sent Requests</h2>
      {requests.length === 0 ? (
        <p>No requests sent yet.</p>
      ) : (
        requests.map((req) => (
          <div key={req._id} className="mb-4 p-4 border rounded-lg shadow-sm bg-white">
            <h3 className="text-lg font-semibold text-blue-600">
              {req?.post?.title || 'No Title'}
            </h3>
            <p><strong>Location:</strong> {req?.post?.location || 'N/A'}</p>
            <p><strong>Rent:</strong> ₹{req?.post?.rent || 'N/A'}</p>
            <p><strong>Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-white text-sm ${req.status === 'pending' ? 'bg-yellow-500' : req.status === 'accepted' ? 'bg-green-600' : 'bg-red-500'}`}>
                {req.status}
              </span>
            </p>
            <p><strong>Posted By:</strong> {req?.post?.user?.name || 'N/A'}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default MyRequests;
