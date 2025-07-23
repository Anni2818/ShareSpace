import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const teamMembers = [
  {
    name: 'Anirrudha ',
    image: '/images/anirrudha.jpg',
    github: 'https://github.com/anirrudha',
    linkedin: 'https://linkedin.com/in/anirrudha',
  },
  {
    name: 'Soumitra',
    image: '/images/soumitra.jpg',
    github: 'https://github.com/soumitra',
    linkedin: 'https://linkedin.com/in/soumitra',
  },
  {
    name: 'Tejas',
    image: '/images/tejas.jpg',
    github: 'https://github.com/tejas',
    linkedin: 'https://linkedin.com/in/tejas',
  },
  {
    name: 'Shravani',
    image: '/images/shravani.jpg',
    github: 'https://github.com/shravani',
    linkedin: 'https://linkedin.com/in/shravani',
  },
  {
    name: 'Payal',
    image: '/images/payal.jpg',
    github: 'https://github.com/payal',
    linkedin: 'https://linkedin.com/in/payal',
  },
];

const About = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Intro Section */}
      <section className="bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-500 text-white pt-16 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Behind ShareSpace
          </h1>
          <p className="text-lg md:text-xl font-light mb-6">
            The idea for ShareSpace came from our own struggles with finding trustworthy roommates and safe rental options. We wanted to build a platform that focuses on compatibility, transparency, and verified interactions. Our mission is to make co-living safe, social, and stress-free.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">Meet the Team</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
            {teamMembers.map(({ name, image, github, linkedin }, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg border shadow hover:shadow-md transition text-center"
              >
                <img
                  src={image}
                  alt={name}
                  className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{name}</h3>
                <div className="flex justify-center gap-4 mt-3">
                  <a href={github} target="_blank" rel="noopener noreferrer">
                    <FaGithub className="text-gray-600 hover:text-indigo-600" size={20} />
                  </a>
                  <a href={linkedin} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin className="text-gray-600 hover:text-indigo-600" size={20} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
