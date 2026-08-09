"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "@/hooks";
import { testimonials } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { threshold: 0.1 });

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <section id="testimonials" ref={ref} className="section-padding bg-[var(--bg)] overflow-hidden">
      <div className="container-custom">
        <SectionHeading 
          title="What Our Clients Say" 
          subtitle="Testimonials" 
          centered 
        />

        <div className="max-w-4xl mx-auto mt-12 relative">
          <div className="relative h-[400px] sm:h-[350px] md:h-[300px]">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <div className="glass-card gradient-border p-8 md:p-12 h-full flex flex-col items-center text-center">
                  <div className="text-6xl font-heading text-gold-gradient leading-none mb-4 absolute top-6 left-8 opacity-20">
                    &ldquo;
                  </div>
                  
                  <div className="flex gap-1 mb-6 text-[#D4AF37]">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <Star key={i} size={18} fill="currentColor" />
                    ))}
                  </div>
                  
                  <p className="text-lg md:text-xl font-body italic text-[var(--text-primary)] mb-8 flex-grow flex items-center">
                    "{currentTestimonial.quote}"
                  </p>
                  
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 rounded-full overflow-hidden relative">
                      <Image 
                        src={currentTestimonial.image} 
                        alt={currentTestimonial.name} 
                        fill 
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <h4 className="font-heading font-bold text-[var(--text-primary)]">{currentTestimonial.name}</h4>
                      <p className="text-sm text-[var(--text-muted)]">{currentTestimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button 
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all z-10"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex gap-2 z-10">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > currentIndex ? 1 : -1);
                    setCurrentIndex(i);
                  }}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300",
                    i === currentIndex ? "bg-[#D4AF37] w-8" : "bg-[var(--glass-border)]"
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button 
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all z-10"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
