import React from 'react';
import Lanyard from '../components/Lanyard';

const About = () => {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Static background */}
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        
      {/* Lanyard component */}
      <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
    </div>
  );
};

export default About;
