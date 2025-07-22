import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-indigo-600">ShareSpace</Link>
        <div className="space-x-6 hidden md:flex">
          <Link to="/browse" className="text-gray-700 hover:text-indigo-600 font-medium transition">Browse Rooms</Link>
          <Link to="/post" className="text-gray-700 hover:text-indigo-600 font-medium transition">Post a Room</Link>
          <Link to="/chat" className="text-gray-700 hover:text-indigo-600 font-medium transition">Chat</Link>
          <Link to="/profile" className="text-gray-700 hover:text-indigo-600 font-medium transition">Profile</Link>
          <Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
