import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'Discover Events',
      description: 'Find all campus events in one place instead of searching through multiple WhatsApp groups.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: 'Personalized Feed',
      description: 'See events based on your interests - technical, cultural, sports, literary, and more.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Never Miss Out',
      description: 'Stay updated with upcoming events from all clubs and organizations on campus.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'For Clubs Too',
      description: 'Club admins can easily create and manage events, reaching students who actually care.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-medium text-[#202124] mb-6">
            About EventAlly
          </h1>
          <p className="text-xl text-[#5f6368] max-w-2xl mx-auto">
            One platform to discover all campus events — no more endless WhatsApp groups.
          </p>
        </motion.div>
      </section>

      {/* The Problem Section */}
      <section className="py-16 bg-[#f8f9fa]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 text-sm font-medium text-[#1a73e8] mb-4">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              The Problem
            </div>
            <h2 className="text-2xl sm:text-3xl font-medium text-[#202124] mb-6">
              Why we built this
            </h2>

            <div className="bg-white rounded-xl border border-[#e8eaed] p-6 sm:p-8">
              <p className="text-[#5f6368] leading-relaxed mb-4">
                In college, there are <strong className="text-[#202124]">so many clubs</strong> — technical clubs, cultural clubs, sports teams, literary societies, and more. Each one has its own WhatsApp group.
              </p>
              <p className="text-[#5f6368] leading-relaxed mb-4">
                As a student, it's <strong className="text-[#202124]">incredibly difficult</strong> to keep track of all the events happening on campus. You're either in too many groups getting spammed with notifications, or you miss events that you would have loved to attend.
              </p>
              <p className="text-[#5f6368] leading-relaxed">
                <strong className="text-[#202124]">EventAlly solves this.</strong> Students can come to one website, select their interests, and see all relevant upcoming events — technical, non-technical, whatever interests them. No more FOMO, no more WhatsApp chaos.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-medium text-[#202124] mb-4">
              How it works
            </h2>
            <p className="text-[#5f6368]">
              Simple, clean, and effective
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white border border-[#e8eaed] rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-10 h-10 bg-[#e8f0fe] text-[#1a73e8] rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-base font-medium text-[#202124] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#5f6368]">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#f8f9fa]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-medium text-[#202124] mb-4">
            Ready to discover events?
          </h2>
          <p className="text-[#5f6368] mb-8">
            Join your campus community and never miss an event again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-[#1a73e8] text-white rounded-full font-medium hover:bg-[#1557b0] transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Events
            </motion.button>
            <motion.button
              onClick={() => navigate('/register')}
              className="px-8 py-3 border border-[#dadce0] text-[#5f6368] rounded-full font-medium hover:bg-[#f1f3f4] transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Create Account
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[#e8eaed]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-[#5f6368]">
              © {new Date().getFullYear()} EventAlly. Built with ❤️ for students.
            </div>
            <div className="flex items-center gap-6">
              <button onClick={() => navigate('/')} className="text-sm text-[#5f6368] hover:text-[#202124]">
                Home
              </button>
              <a href="#" className="text-sm text-[#5f6368] hover:text-[#202124]">
                Privacy
              </a>
              <a href="#" className="text-sm text-[#5f6368] hover:text-[#202124]">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
