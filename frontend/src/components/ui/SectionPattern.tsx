"use client";

import { motion } from "framer-motion";

interface SectionPatternProps {
  /** "dark" for near-black sections, "light" for cream/white sections */
  tone?: "dark" | "light";
  /** show the rotating corner mandala ornaments */
  ornaments?: boolean;
  /** show the soft ambient glow blobs */
  glow?: boolean;
  className?: string;
}

/**
 * Reusable premium decorative layer: fine gold lattice texture +
 * slow-rotating Rajasthani-inspired corner mandalas + ambient glow.
 * Drop this as the first child of any `relative` section wrapper.
 */
export default function SectionPattern({
  tone = "dark",
  ornaments = true,
  glow = true,
  className = "",
}: SectionPatternProps) {
  const line = tone === "dark" ? "rgba(212,175,55,0.35)" : "rgba(11,11,15,0.25)";
  const lineFaint = tone === "dark" ? "rgba(212,175,55,0.14)" : "rgba(11,11,15,0.08)";

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Fine diamond lattice texture */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.5]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="eventura-lattice" width="56" height="56" patternUnits="userSpaceOnUse">
            <path
              d="M28 0 L56 28 L28 56 L0 28 Z"
              fill="none"
              stroke={lineFaint}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#eventura-lattice)" />
      </svg>

      {/* Ambient glow blobs */}
      {glow && (
        <>
          <div
            className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full blur-[110px]"
            style={{ background: "rgba(212,175,55,0.10)" }}
          />
          <div
            className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full blur-[110px]"
            style={{ background: "rgba(212,175,55,0.08)" }}
          />
        </>
      )}

      {/* Rotating corner mandala — top left */}
      {ornaments && (
        <motion.svg
          className="absolute -top-10 -left-10 w-40 h-40 md:w-56 md:h-56"
          viewBox="0 0 200 200"
          fill="none"
          animate={{ rotate: 360 }}
          transition={{ duration: 90, ease: "linear", repeat: Infinity }}
        >
          <circle cx="100" cy="100" r="70" stroke={lineFaint} strokeWidth="1" />
          <circle cx="100" cy="100" r="50" stroke={lineFaint} strokeWidth="1" />
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={i}
              x1="100"
              y1="30"
              x2="100"
              y2="50"
              stroke={line}
              strokeWidth="1"
              transform={`rotate(${i * 30} 100 100)`}
            />
          ))}
          <circle cx="100" cy="100" r="4" fill={line} />
        </motion.svg>
      )}

      {/* Rotating corner mandala — bottom right */}
      {ornaments && (
        <motion.svg
          className="absolute -bottom-12 -right-12 w-48 h-48 md:w-64 md:h-64"
          viewBox="0 0 200 200"
          fill="none"
          animate={{ rotate: -360 }}
          transition={{ duration: 110, ease: "linear", repeat: Infinity }}
        >
          <circle cx="100" cy="100" r="80" stroke={lineFaint} strokeWidth="1" />
          <circle cx="100" cy="100" r="60" stroke={lineFaint} strokeWidth="1" />
          {Array.from({ length: 16 }).map((_, i) => (
            <line
              key={i}
              x1="100"
              y1="20"
              x2="100"
              y2="40"
              stroke={line}
              strokeWidth="1"
              transform={`rotate(${i * 22.5} 100 100)`}
            />
          ))}
          <circle cx="100" cy="100" r="4" fill={line} />
        </motion.svg>
      )}
    </div>
  );
}
