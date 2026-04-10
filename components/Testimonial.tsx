"use client";

import { useEffect, useRef, useState } from "react";
import { IconQuote } from "@tabler/icons-react";

const testimonials = [
  {
    quote:
      "Thanks to LeafLens, love the tips. Helped me save my betel plant — it's thriving now!",
    author: "Sudha",
    location: "Chennai",
  },
  {
    quote:
      "My monstera has never looked better. The health score made it so easy to understand what was wrong.",
    author: "Priya R.",
    location: "Bengaluru",
  },
  {
    quote:
      "Finally an app that actually tells me what's wrong with my plants. The product suggestions are spot on!",
    author: "Karthik M.",
    location: "Mumbai",
  },
];

/** Single card that fades + slides up once it enters the viewport */
function TestimonialCard({
  quote,
  author,
  location,
  delay,
}: {
  quote: string;
  author: string;
  location: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // only fire once
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(28px)",
        transition: "opacity 0.65s ease, transform 0.65s ease",
      }}
      className="bg-[#4c7a44]/50 backdrop-blur-sm rounded-[20px] p-7 md:p-8 flex flex-col gap-4 border border-white/5"
    >
      {/* Quote icon */}
      <IconQuote size={28} stroke={1.5} color="#d0ff93" className="opacity-70 flex-shrink-0" />

      {/* Quote text */}
      <p className="font-dm font-light italic text-[17px] md:text-[18px] text-white/90 leading-relaxed flex-1">
        {quote}
      </p>

      {/* Author */}
      <div className="pt-2 border-t border-white/10">
        <p className="font-dm font-medium text-[#d0ff93] text-[14px]">{author}</p>
        <p className="font-dm font-light text-white/45 text-[13px]">{location}</p>
      </div>
    </div>
  );
}

export default function Testimonial() {
  return (
    <div className="max-w-[1026px] mx-auto px-4">
      {/* Section heading */}
      <h2 className="font-playfair text-[40px] md:text-[50px] font-normal text-white mb-10 text-center leading-tight">
        Hear from others
      </h2>

      {/* 3-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {testimonials.map((t, i) => (
          <TestimonialCard
            key={i}
            quote={t.quote}
            author={t.author}
            location={t.location}
            delay={i * 160}
          />
        ))}
      </div>
    </div>
  );
}
