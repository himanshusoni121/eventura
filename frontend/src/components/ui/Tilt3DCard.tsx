"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Tilt3DCardProps {
  children: React.ReactNode;
  className?: string;
  /** max tilt in degrees, default 10 for refined luxury feel */
  maxTilt?: number;
  /** subtle light sweep that follows the cursor */
  glare?: boolean;
  /** champagne gold specular sheen that adds luxury brilliance */
  goldSheen?: boolean;
  /** slight forward lift (translateZ) on hover for extra depth */
  lift?: boolean;
  /** scale factor on hover */
  scale?: number;
  /** 3D perspective depth */
  perspective?: number;
}

/**
 * Premium 3D Perspective Card
 * Generates true multi-layer 3D depth, specular reflection, and
 * light-catching rim shine tailored for luxury photography and event showcases.
 */
export default function Tilt3DCard({
  children,
  className = "",
  maxTilt = 12,
  glare = true,
  goldSheen = true,
  lift = true,
  scale = 1.02,
  perspective = 1000,
}: Tilt3DCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Smooth, weighted spring physics mimicking physical luxury materials
  const springConfig = { stiffness: 220, damping: 22, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [0, 1], [maxTilt, -maxTilt]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-maxTilt, maxTilt]), springConfig);
  const translateZ = useSpring(hovered && lift ? 25 : 0, springConfig);
  const cardScale = useSpring(hovered ? scale : 1, springConfig);

  const glareX = useTransform(x, (v) => `${v * 100}%`);
  const glareY = useTransform(y, (v) => `${v * 100}%`);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0.5);
    y.set(0.5);
  };

  // Dynamic light sweep that radiates outwards from pointer
  const glareBackground = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle 320px at ${gx} ${gy}, rgba(255, 255, 255, 0.18), transparent 70%)`
  );

  // Specular champagne gold highlight that creates metallic reflection
  const goldSheenBackground = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle 240px at ${gx} ${gy}, rgba(212, 175, 55, 0.22), transparent 60%)`
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        translateZ,
        scale: cardScale,
        transformPerspective: perspective,
        transformStyle: "preserve-3d",
      }}
      className={`relative will-change-transform ${className}`}
    >
      {/* 3D Child Elements */}
      <div className="w-full h-full [transform-style:preserve-3d]">
        {children}
      </div>

      {/* Luminous Specular Glare Layer */}
      {glare && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden z-30"
          style={{
            background: glareBackground as unknown as string,
          }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        />
      )}

      {/* Royal Gold Micro-Sheen */}
      {goldSheen && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden z-20 mix-blend-screen"
          style={{
            background: goldSheenBackground as unknown as string,
          }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        />
      )}

      {/* Interactive 3D Gold Border Edge Glow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[1px] rounded-[inherit] border border-[#D4AF37]/0 transition-colors duration-300 z-40"
        style={{
          boxShadow: hovered
            ? "0 12px 40px -10px rgba(0, 0, 0, 0.7), 0 0 25px -5px rgba(212, 175, 55, 0.25)"
            : "none",
        }}
        animate={{
          borderColor: hovered ? "rgba(212, 175, 55, 0.45)" : "rgba(212, 175, 55, 0)",
        }}
      />
    </motion.div>
  );
}
