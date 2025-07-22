import React from 'react';
import { Link } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  MessageCircleIcon,
  MapPinIcon,
  ArrowRightIcon,
  PlusIcon,
} from 'lucide-react';

const howItWorks = [
  {
    icon: <HomeIcon size={40} className="text-indigo-600" />,
    title: 'Browse Listings',
    desc: 'Discover nearby available rooms and compatible roommates with advanced filters.',
  },
  {
    icon: <UsersIcon size={40} className="text-indigo-600" />,
    title: 'Connect with Posters',
    desc: 'View hobbies, lifestyle tags, and preferences to find your best roommate match.',
  },
  {
    icon: <MessageCircleIcon size={40} className="text-indigo-600" />,
    title: 'Chat Securely',
    desc: 'Once accepted, start chatting directly within ShareSpace to coordinate safely.',
  },
  {
    icon: <MapPinIcon size={40} className="text-indigo-600" />,
    title: 'Move In Smartly',
    desc: 'Explore listings with images, availability calendar, and safety tools before committing.',
  },
];

const Home = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-500 text-white pt-16 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Find Your Perfect Roommate, Effortlessly
          </h1>
          <p className="text-lg md:text-xl font-light mb-6">
            ShareSpace helps you discover compatible roommates and safe, verified room listings in minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              to="/posts"
              className="flex items-center gap-2 w-44 justify-center bg-white text-indigo-700 font-semibold px-4 py-2.5 rounded-md shadow hover:bg-gray-100 transition"
            >
              <ArrowRightIcon size={18} /> Browse Rooms
            </Link>
            <Link
              to="/create-post"
              className="flex items-center gap-2 w-52 justify-center border-2 border-white text-white font-semibold px-4 py-2.5 rounded-md hover:bg-white hover:text-indigo-700 transition"
            >
              <PlusIcon size={18} /> Post Your Room
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {howItWorks.map(({ icon, title, desc }, i) => (
            <div
              key={i}
              className="p-6 bg-white border border-gray-100 rounded-lg shadow hover:shadow-md transition duration-300 text-center"
            >
              <div className="mb-3">{icon}</div>
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why ShareSpace Section */}
      <section className="py-20 bg-indigo-50 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Why Choose ShareSpace?</h2>
          <p className="text-gray-700 text-lg mb-8">
            Unlike random Facebook groups or outdated forums, ShareSpace is built with privacy, compatibility, and verified interactions at its core.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 border">
              <h4 className="font-semibold text-indigo-600 mb-2">Verified Listings</h4>
              <p className="text-sm text-gray-600">Each post goes through basic screening and optional document verification.</p>
            </div>
            <div className="bg-white rounded-lg p-6 border">
              <h4 className="font-semibold text-indigo-600 mb-2">Compatibility Tags</h4>
              <p className="text-sm text-gray-600">Match based on lifestyle, hobbies, and interests — not just rent.</p>
            </div>
            <div className="bg-white rounded-lg p-6 border">
              <h4 className="font-semibold text-indigo-600 mb-2">Safe Chat</h4>
              <p className="text-sm text-gray-600">Start a conversation only when both parties agree to connect. No spam.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
