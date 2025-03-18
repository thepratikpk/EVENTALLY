import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import Bg from '../assets/Bg.jpg';
import Navbar from './Navbar';
import Footer from './Footer';
import Events from './Events';

const Home = () => {
  const eventsRef = useRef(null);
  const currentUser = useSelector((state) => state.auth.currentUser);

  const scrollToEvents = () => {
    eventsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative w-screen min-h-screen flex flex-col text-center text-white">
      <Navbar />
      <img
        src={Bg}
        alt="Background"
        className="absolute top-0 left-0 w-full h-screen object-cover object-center -z-20"
      />
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.3)] -z-20"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-screen p-10">
        <h1 className="text-4xl font-bold drop-shadow-lg">WELCOME TO EVENTALLY!</h1>
        <h2 className="text-3xl mt-2">Adaptive Event Organiser</h2>
        <br />
        <button
          onClick={scrollToEvents}
          className="px-6 py-2 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700 transition"
        >
          View Events
        </button>
      </div>

      <div ref={eventsRef} className="w-full bg-gray-900 py-10">
        <Events />
      </div>

      <Footer />
    </div>
  );
};

export default Home;