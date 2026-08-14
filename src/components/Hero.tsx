"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useMousePosition } from "@/hooks";
import { textRevealContainer, textRevealChild, fadeIn, floatingAnimation } from "@/lib/animations";
import { siteConfig } from "@/lib/data";

export default function Hero() {
  const mousePosition = useMousePosition();
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-linked 3D depth: background pulls back and content tilts away
  // as the user scrolls past the hero — a real perspective effect, not a toy.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const contentRotateX = useTransform(scrollYProgress, [0, 1], [0, 22]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const particles = [
    { id: 0, size: 6, top: "15%", left: "20%", delay: 0 },
    { id: 1, size: 8, top: "35%", left: "75%", delay: 0.5 },
    { id: 2, size: 5, top: "60%", left: "10%", delay: 1 },
    { id: 3, size: 7, top: "80%", left: "85%", delay: 1.5 },
    { id: 4, size: 9, top: "25%", left: "50%", delay: 0.3 },
    { id: 5, size: 6, top: "70%", left: "40%", delay: 0.8 },
    { id: 6, size: 8, top: "45%", left: "90%", delay: 1.2 },
    { id: 7, size: 5, top: "90%", left: "30%", delay: 1.8 },
  ];

  const headlineWords = siteConfig.tagline.split(" ");

  return (
    <section id="home" ref={sectionRef} className="relative min-h-[85vh] sm:min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden pt-24 sm:pt-28 md:pt-24 pb-12 sm:pb-16 md:pb-0 px-4 sm:px-6 md:px-12" style={{ perspective: 1000 }}>
      {/* Background Image */}
      <motion.div className="absolute inset-0 z-0 bg-[#0B0B0F]" style={{ scale: bgScale, y: bgY }}>
        <Image
          src="/images/home.png"
          alt="Luxury Event"
          fill
          sizes="100vw"
          priority
          className="object-cover opacity-80"
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0F]/90 via-[#0B0B0F]/60 to-[#0B0B0F]" />
      </motion.div>

      {/* Mouse Follow Glow */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none z-10 transition-transform duration-300 ease-out hidden md:block"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(0,0,0,0) 70%)',
          left: -300,
          top: -300,
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
        }}
      />

      {/* Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-[#D4AF37]/40 shadow-[0_0_10px_rgba(212,175,55,0.5)]"
            style={{
              width: p.size,
              height: p.size,
              top: p.top,
              left: p.left,
            }}
            variants={floatingAnimation}
            animate="animate"
            custom={p.delay}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="container-custom relative z-20 text-center px-3 sm:px-4"
        style={{ y: contentY, rotateX: contentRotateX, opacity: contentOpacity, transformStyle: "preserve-3d" }}
      >
        <motion.div
          variants={textRevealContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto flex flex-wrap justify-center gap-x-2 sm:gap-x-4 gap-y-1 sm:gap-y-2 mb-4 sm:mb-6"
        >
          {headlineWords.map((word, i) => (
            <motion.span
              key={i}
              variants={textRevealChild}
              className="font-heading text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight"
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

        <motion.p
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-xs sm:text-base md:text-xl text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-10 font-body px-2 leading-relaxed"
        >
          {siteConfig.description}
        </motion.p>

        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 w-full max-w-xs sm:max-w-none mx-auto"
        >
          <Link href="#contact" className="btn-primary w-full sm:w-auto justify-center text-xs sm:text-sm">
            <span>Get Free Consultation</span>
          </Link>
          <Link href="#portfolio" className="btn-outline w-full sm:w-auto justify-center text-white border-white/30 hover:border-[#D4AF37] hover:text-[#D4AF37] text-xs sm:text-sm">
            <span>Explore Our Work</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <Link href="#about" aria-label="Scroll down">
          <div className="flex flex-col items-center gap-1 sm:gap-2 text-white/50 hover:text-[#D4AF37] transition-colors">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest">Scroll</span>
            <ChevronDown className="w-4 h-4 sm:w-6 sm:h-6 scroll-indicator" />
          </div>
        </Link>
      </motion.div>
    </section>
  );
}
