import React from 'react';
import { Link } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  MessageCircleIcon,
  MapPinIcon,
  SparklesIcon,
} from 'lucide-react';
import Navbar from '../Components/navbar';

const Home = () => {
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-white py-36 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            ShareSpace – Find Your Ideal Roommate
          </h1>
          <p className="text-lg md:text-xl font-light mb-10">
            Whether you're looking for a room or sharing yours, ShareSpace connects the right people at the right place.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to="/browse"
              className="w-48 text-center bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition duration-300"
            >
              Find a Room
            </Link>
            <Link
              to="/post"
              className="w-48 text-center border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-indigo-600 transition duration-300"
            >
              Post for Roommate
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-10 max-w-6xl mx-auto text-center">
          {[
            { icon: <HomeIcon className="w-12 h-12 mx-auto text-indigo-500" />, title: "Post or Browse", desc: "Create a post for your space or find listings nearby." },
            { icon: <UsersIcon className="w-12 h-12 mx-auto text-indigo-500" />, title: "Send Requests", desc: "Connect with potential roommates based on shared interests." },
            { icon: <SparklesIcon className="w-12 h-12 mx-auto text-indigo-500" />, title: "Get Matched", desc: "Posters accept seekers, enabling verified matching." },
            { icon: <MessageCircleIcon className="w-12 h-12 mx-auto text-indigo-500" />, title: "Start Chatting", desc: "Chat securely through our built-in real-time messenger." },
          ].map(({ icon, title, desc }, i) => (
            <div key={i}>
              {icon}
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="text-sm text-gray-600 mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-16">Why ShareSpace?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { icon: <MapPinIcon className="w-10 h-10 mx-auto text-indigo-500" />, title: "Location-Based Search", desc: "Discover listings near colleges, offices, or your ideal area." },
            { icon: <UsersIcon className="w-10 h-10 mx-auto text-indigo-500" />, title: "Smart Matching", desc: "Get matched based on hobbies, interests & lifestyle." },
            { icon: <MessageCircleIcon className="w-10 h-10 mx-auto text-indigo-500" />, title: "Real-Time Chat", desc: "Instantly connect with your matches in a safe space." },
          ].map(({ icon, title, desc }, i) => (
            <div key={i} className="p-6 bg-white rounded-xl shadow-lg text-center hover:shadow-2xl transition">
              {icon}
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="text-sm text-gray-600 mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-20 text-center bg-white border-t border-gray-200">
        <h3 className="text-2xl font-bold mb-4">Start Your Roommate Journey Today</h3>
        <p className="text-gray-600 mb-6">It takes less than 2 minutes to get started. Sign up now and explore perfect roommate options.</p>
        <Link
          to="/signup"
          className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition"
        >
          Join ShareSpace
        </Link>
      </footer>
    </div>
  );
};

export default Home;
