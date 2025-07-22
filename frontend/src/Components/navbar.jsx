import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ loggedIn, setLoggedIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(prev => !prev);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData?.name) {
      setUserName(userData.name);
    } else {
      setUserName('');
    }
  }, [loggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoggedIn(false);
    setUserName('');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-semibold text-indigo-600 hover:text-indigo-700 transition">
          ShareSpace
        </Link>

        <button
          className="md:hidden text-2xl text-gray-700 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isOpen ? '×' : '☰'}
        </button>

        <div className={`flex-col md:flex-row md:flex items-center space-y-4 md:space-y-0 md:space-x-6 text-gray-700 font-medium ${isOpen ? 'flex mt-4' : 'hidden md:flex'}`}>
          <Link to="/" className="hover:text-indigo-500 transition block md:inline">Home</Link>
          <Link to="/about" className="hover:text-indigo-500 transition block md:inline">About Us</Link>

          {loggedIn ? (
            <>
              <span className="text-indigo-600 font-semibold">Hi, {userName}</span>
              <Link to="/profile" className="hover:text-indigo-500 transition">Profile</Link>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-500 transition">Login</Link>
              <Link to="/signup" className="hover:text-indigo-500 transition">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
