// ============================================================
// Framer Motion Animation Variants — Eventura
// ============================================================
import type { Variants } from "framer-motion";

// Fade in from below
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Fade in from above
export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Fade in from left
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Fade in from right
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Simple fade in
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Scale up from smaller
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// 3D perspective reveal — element rotates up out of the page as it scrolls into view
export const reveal3D: Variants = {
  hidden: { opacity: 0, y: 90, rotateX: 65, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: { duration: 1.1, ease: "easeOut" },
  },
};

// 3D reveal from the left, gentle depth rotation
export const reveal3DLeft: Variants = {
  hidden: { opacity: 0, x: -80, rotateY: -55, scale: 0.9 },
  visible: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    scale: 1,
    transition: { duration: 1.1, ease: "easeOut" },
  },
};

// 3D reveal from the right, gentle depth rotation
export const reveal3DRight: Variants = {
  hidden: { opacity: 0, x: 80, rotateY: 55, scale: 0.9 },
  visible: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    scale: 1,
    transition: { duration: 1.1, ease: "easeOut" },
  },
};

// Stagger container tuned for 3D children (slightly longer delay so depth reads clearly)
export const staggerContainer3D: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.05,
    },
  },
};

// Stagger container for child animations
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Slow stagger for bigger grids
export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// Card hover – 3D lift
export const cardHover: Variants = {
  rest: {
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  hover: {
    scale: 1.03,
    y: -8,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// Text reveal character-by-character
export const textRevealContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

export const textRevealChild: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// Navbar animation
export const navbarVariants: Variants = {
  top: {
    backgroundColor: "rgba(11, 11, 15, 0)",
    backdropFilter: "blur(0px)",
  },
  scrolled: {
    backgroundColor: "rgba(11, 11, 15, 0.85)",
    backdropFilter: "blur(20px)",
  },
};

// Page section reveal
export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Floating animation for decorative elements
export const floatingAnimation: Variants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Glow pulse
export const glowPulse: Variants = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(212, 175, 55, 0.2)",
      "0 0 40px rgba(212, 175, 55, 0.4)",
      "0 0 20px rgba(212, 175, 55, 0.2)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Slide in for mobile menu
export const slideInMenu: Variants = {
  closed: {
    x: "100%",
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  open: {
    x: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const menuItemVariants: Variants = {
  closed: { opacity: 0, x: 30 },
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};
