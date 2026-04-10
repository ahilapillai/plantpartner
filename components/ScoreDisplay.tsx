"use client";

import { useEffect, useState } from "react";

interface Props {
  score: number; // 0–100
}

/** Returns accent colour based on health score */
function scoreColor(score: number): string {
  if (score >= 70) return "#d0ff93"; // lime  — healthy
  if (score >= 40) return "#ffeb93"; // yellow — moderate
  return "#ff9393";                  // red    — critical
}

/** Returns a human label */
function scoreLabel(score: number): string {
  if (score >= 70) return "Healthy";
  if (score >= 40) return "Moderate";
  return "Critical";
}

export default function ScoreDisplay({ score }: Props) {
  const [animated, setAnimated] = useState(0);
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const color = scoreColor(score);

  // Animate the ring on mount
  useEffect(() => {
    const timeout = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(timeout);
  }, [score]);

  const offset = circumference - (animated / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <div className="relative w-[148px] h-[148px]">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 120 120"
          aria-label={`Health score: ${score} out of 100`}
        >
          {/* Track */}
          <circle
            cx="60" cy="60" r={r}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="9"
          />
          {/* Progress arc */}
          <circle
            cx="60" cy="60" r={r}
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(.4,0,.2,1)" }}
          />
        </svg>

        {/* Centre value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-dm font-bold text-[38px] leading-none"
            style={{ color }}
          >
            {score}
          </span>
          <span className="font-dm font-light text-[13px] text-white/50 mt-0.5">
            / 100
          </span>
        </div>
      </div>

      {/* Label pill */}
      <span
        className="font-dm font-medium text-[13px] px-4 py-1 rounded-full"
        style={{ backgroundColor: `${color}25`, color }}
      >
        {scoreLabel(score)}
      </span>

      <p className="font-dm font-light text-white/60 text-[13px] tracking-wide uppercase">
        Health Score
      </p>
    </div>
  );
}
