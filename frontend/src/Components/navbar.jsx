import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ loggedIn }) => {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-semibold text-indigo-600 hover:text-indigo-700 transition duration-200">
        ShareSpace
      </Link>

      <div className="space-x-6 text-gray-700 font-medium">
        <Link to="/" className="hover:text-indigo-500 transition">Home</Link>
        <Link to="/about" className="hover:text-indigo-500 transition">About Us</Link>

        {loggedIn ? (
          <Link to="/profile" className="hover:text-indigo-500 transition">Profile</Link>
        ) : (
          <>
            <Link to="/login" className="hover:text-indigo-500 transition">Login</Link>
            <Link to="/signup" className="hover:text-indigo-500 transition">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
