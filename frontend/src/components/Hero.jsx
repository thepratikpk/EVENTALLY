import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import heroImage from '../assets/Bg.jpg';
import Navbar from './Navbar';
import Events from './Events';
import PersonalizedEvents from './PersonalizedEvents';
import { useAuthStore } from '../store/useAuth';

const Hero = () => {
  const { authUser } = useAuthStore();

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative text-gray-800">
      {/* Fixed Background Image with Blackish Overlay */}
      <div 
        className="fixed inset-0 z-[-1]" 
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-black opacity-50" />
      </div>
      
      <Navbar />
      
      {/* Hero Section */}
      <section className="min-h-screen pt-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center min-h-screen py-12">
          <motion.div 
            className="w-full lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-white">
              Welcome to <span className="text-blue-300">EVENTALLY</span>
            </h1>
            <motion.p
              className="text-base sm:text-lg text-gray-200 mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              An adaptive event organizer!
            </motion.p>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mb-8 lg:mb-0"
            >
              <button
                onClick={() => scrollToSection(authUser ? 'personalized-events' : 'all-events')}
                className="inline-block px-6 sm:px-8 py-2 sm:py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-md"
              >
                Explore Events
              </button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="w-full lg:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="relative w-full max-w-2xl bg-black/50 p-4 sm:p-6 rounded-xl shadow-xl">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Connect with Events</h2>
              <p className="text-sm sm:text-base text-gray-200 mb-4 overflow-y-auto max-h-48 sm:max-h-64 md:max-h-80">
              EventAlly – Your Ultimate Event Companion!

Welcome to EventAlly, where we turn event browsing into an experience! 🚀

Tired of endlessly scrolling through event lists that don't match your interests? We've got you covered. Our platform showcases a generalized list of exciting events for all visitors, making sure no one misses out on the action. But here's the magic: once you log in, the system curates events just for you—tailored to your interests, so you don't waste time on things you don't care about.

🎯 Why is this brilliant?

No more FOMO—get updates on events that actually matter to you.

Saves time (because we know you're busy).

Discover new events that match your passion.

It's like having a personal event concierge—minus the fancy suit. So, whether you're an AI enthusiast, a cybersecurity geek, or just here for the free food at startup events, we've got something for you.

Join us and let's revolutionize how you find events! 🎉
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 sm:px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-xs sm:text-sm">Technology</span>
                <span className="px-2 sm:px-3 py-1 bg-green-500/20 text-green-200 rounded-full text-xs sm:text-sm">Art</span>
                <span className="px-2 sm:px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-xs sm:text-sm">Music</span>
                <span className="px-2 sm:px-3 py-1 bg-amber-500/20 text-amber-200 rounded-full text-xs sm:text-sm">Sports</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Personalized Events Section */}
      {authUser && (
        <section id="personalized-events" className="py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-white">Events Just For You</h2>
            <PersonalizedEvents />
          </div>
        </section>
      )}

      {/* All Events Section */}
      <section id="all-events" className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-white">Explore All Events</h2>
          <Events />
        </div>
      </section>
    </div>
  );
};

export default Hero;