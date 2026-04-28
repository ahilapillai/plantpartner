"use client";

import { useEffect, useState } from "react";
import { IconQuote, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

const testimonials = [
  {
    quote: "Thanks to LeafLens, love the tips. Helped me save my betel plant — it's thriving now!",
    author: "Sudha",
    location: "Chennai",
  },
  {
    quote: "My monstera has never looked better. The health score made it so easy to understand what was wrong.",
    author: "Priya R.",
    location: "Bengaluru",
  },
  {
    quote: "Finally an app that actually tells me what's wrong with my plants. The product suggestions are spot on!",
    author: "Karthik M.",
    location: "Mumbai",
  },
  {
    quote: "I thought my jasmine was dying. Turns out it just needed better drainage. The care tips were so practical!",
    author: "Ananya S.",
    location: "Hyderabad",
  },
  {
    quote: "Took a photo of my cactus on a whim — got a full health report in seconds. Genuinely impressed.",
    author: "Rohan V.",
    location: "Pune",
  },
];

export default function Testimonial() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const goTo = (index: number, dir: "left" | "right") => {
    if (animating) return;
    setAnimating(true);
    setDirection(dir);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 350);
  };

  const prev = () => goTo((current - 1 + testimonials.length) % testimonials.length, "left");
  const next = () => goTo((current + 1) % testimonials.length, "right");

  // Auto-rotate every 4s
  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [current]);

  const t = testimonials[current];

  const slideStyle: React.CSSProperties = {
    opacity: animating ? 0 : 1,
    transform: animating
      ? `translateX(${direction === "right" ? "32px" : "-32px"})`
      : "translateX(0px)",
    transition: "opacity 0.35s ease, transform 0.35s ease",
  };

  return (
    <div className="max-w-[860px] mx-auto px-4">
      {/* Heading */}
      <h2 className="font-playfair text-[40px] md:text-[50px] font-normal text-white mb-10 text-center leading-tight">
        Hear from others
      </h2>

      {/* Card */}
      <div
        className="relative bg-[#4c7a44]/50 backdrop-blur-sm rounded-[24px] px-8 md:px-14 py-10 md:py-12 border border-white/5 flex flex-col gap-6 min-h-[220px]"
        style={slideStyle}
      >
        <IconQuote size={32} stroke={1.5} color="#d0ff93" className="opacity-70 flex-shrink-0" />

        <p className="font-dm font-medium italic text-[19px] md:text-[24px] text-white/90 leading-relaxed">
          &ldquo;{t.quote}&rdquo;
        </p>

        <div className="pt-2 border-t border-white/10">
          <p className="font-dm font-semibold text-[#d0ff93] text-[15px]">{t.author}</p>
          <p className="font-dm font-light text-white/45 text-[13px]">{t.location}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mt-8">
        {/* Prev */}
        <button
          onClick={prev}
          aria-label="Previous testimonial"
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-all"
        >
          <IconChevronLeft size={18} />
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? "right" : "left")}
              aria-label={`Go to testimonial ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? "24px" : "8px",
                height: "8px",
                backgroundColor: i === current ? "#d0ff93" : "rgba(255,255,255,0.25)",
              }}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={next}
          aria-label="Next testimonial"
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-all"
        >
          <IconChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
