import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ loggedIn }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md px-6 py-4 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="text-2xl font-semibold text-indigo-600 hover:text-indigo-700 transition duration-200">
          ShareSpace
        </Link>

        {/* Menu icon (mobile only) */}
        <button className="md:hidden text-2xl text-gray-700 focus:outline-none" onClick={toggleMenu}>
          {isOpen ? '×' : '☰'}
        </button>

        {/* Navigation links */}
        <div className={`md:flex space-x-6 text-gray-700 font-medium ${isOpen ? 'block mt-4 md:mt-0' : 'hidden'} md:block`}>
          <Link to="/" className="hover:text-indigo-500 transition block md:inline">Home</Link>
          <Link to="/about" className="hover:text-indigo-500 transition block md:inline">About Us</Link>

          {loggedIn ? (
            <Link to="/profile" className="hover:text-indigo-500 transition block md:inline">Profile</Link>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-500 transition block md:inline">Login</Link>
              <Link to="/signup" className="hover:text-indigo-500 transition block md:inline">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
