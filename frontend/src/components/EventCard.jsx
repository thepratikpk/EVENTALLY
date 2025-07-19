import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import seminarImg from "../assets/seminar.png";

gsap.registerPlugin(ScrollTrigger);

const EventCard = ({ id, title, club_name, thumbnail }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 90%",
        },
      }
    );
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={() => navigate(`/event/${id}`)}
      className="cursor-pointer max-w-sm w-full mx-auto"
    >
      <div className="relative h-[260px] w-full overflow-hidden rounded-2xl shadow-md group transition duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-white/5">
        {/* Image */}
        <img
          src={thumbnail || seminarImg}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-0" />

        {/* Bottom text */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 z-10 text-white">
          <h3 className="text-lg font-bold leading-tight">{title}</h3>
          <p className="text-sm text-gray-300">
            Hosted by <span className="font-semibold text-white">{club_name}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
