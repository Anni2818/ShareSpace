import { FaMapMarkerAlt, FaRupeeSign, FaUserFriends, FaHome } from 'react-icons/fa';

const PostCard = ({ post }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
      <img
        src={post.images[0] || '/default-room.jpg'}
        alt="room"
        className="w-full h-48 object-cover"
      />
      <div className="p-4 space-y-2">
        <h3 className="text-xl font-semibold">{post.title}</h3>

        <div className="text-gray-600 text-sm flex items-center gap-2">
          <FaMapMarkerAlt /> {post.location}
        </div>

        <div className="flex justify-between text-sm mt-2">
          <span className="flex items-center gap-1 text-green-600">
            <FaRupeeSign /> {post.rent}/month
          </span>
          <span className="flex items-center gap-1 text-blue-600">
            <FaUserFriends /> {post.genderPreference}
          </span>
          <span className="flex items-center gap-1 text-purple-600">
            <FaHome /> {post.roomType}
          </span>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2">{post.description}</p>

        <div className="flex flex-wrap gap-2 mt-2">
          {post.tags.map((tag, i) => (
            <span key={i} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
