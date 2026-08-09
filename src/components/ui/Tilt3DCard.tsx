"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Tilt3DCardProps {
  children: React.ReactNode;
  className?: string;
  /** max tilt in degrees, kept low for a professional, non-gimmicky feel */
  maxTilt?: number;
  /** subtle light sweep that follows the cursor */
  glare?: boolean;
  /** slight forward lift (translateZ) on hover for extra depth */
  lift?: boolean;
}

/**
 * Wraps content in a real 3D tilt that responds to cursor position,
 * plus an optional soft glare sweep. Kept subtle (small tilt angles,
 * spring damping) so it reads as premium rather than a toy effect.
 */
export default function Tilt3DCard({
  children,
  className = "",
  maxTilt = 12,
  glare = true,
  lift = true,
}: Tilt3DCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { stiffness: 150, damping: 18, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [0, 1], [maxTilt, -maxTilt]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-maxTilt, maxTilt]), springConfig);
  const translateZ = useSpring(hovered && lift ? 40 : 0, springConfig);
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
        transformPerspective: 700,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className}`}
    >
      {children}

      {glare && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.14), transparent 55%)`
            ) as unknown as string,
          }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
}
