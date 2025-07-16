// src/components/EventCard.jsx
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TiltedCard from "./TiltedCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const EventCard = ({ id, title, club_name, thumbnail }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const overlayRef = useRef(null);

  // Scroll animation
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

  // Floating overlay title on hover
  const overlayContent = (
    <div
      ref={overlayRef}
      className="px-4 py-1 bg-black/60 text-white text-sm font-semibold rounded-md"
    >
      {title}
    </div>
  );

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    const tl = gsap.timeline({ paused: true });
    tl.to(el, {
      y: -5,
      duration: 0.3,
      ease: "power1.out",
    });

    const handleMouseEnter = () => tl.play();
    const handleMouseLeave = () => tl.reverse();

    el.parentElement?.addEventListener("mouseenter", handleMouseEnter);
    el.parentElement?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.parentElement?.removeEventListener("mouseenter", handleMouseEnter);
      el.parentElement?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={() => navigate(`/event/${id}`)}
      className="cursor-pointer w-full max-w-sm mx-auto transition-transform hover:scale-[1.03]"
    >
      <TiltedCard
        imageSrc={thumbnail || "https://via.placeholder.com/400x300.png?text=No+Image"}
        altText={title}
        containerHeight="320px"
        containerWidth="100%"
        imageHeight="300px"
        imageWidth="100%"
        scaleOnHover={1.05}
        rotateAmplitude={12}
        showMobileWarning={false}
        showTooltip={false}
        displayOverlayContent={true}
        overlayContent={overlayContent}
      />

      <div className="mt-3 px-2 text-center">
        <p className="text-gray-600 text-sm">
          Hosted by <span className="font-semibold">{club_name}</span>
        </p>
      </div>
    </div>
  );
};

export default EventCard;
