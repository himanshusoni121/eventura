"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "@/hooks";
import { fadeInLeft, fadeInRight } from "@/lib/animations";
import SectionHeading from "./ui/SectionHeading";

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { threshold: 0.2 });

  return (
    <section id="about" ref={ref} className="section-padding bg-[var(--bg)] overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
          
          {/* Left Side: Images */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInLeft}
            className="relative h-[240px] xs:h-[280px] sm:h-[360px] md:h-[450px] lg:h-[600px] w-full"
          >
            {/* Main Image */}
            <div className="absolute top-0 left-0 w-[75%] xs:w-[80%] h-[75%] xs:h-[80%] rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-2xl z-10">
              <Image
                src="/images/about-wedding.png"
                alt="Eventura Team"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="eager"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Overlapping Image */}
            <div className="absolute bottom-0 right-0 w-[50%] xs:w-[60%] h-[40%] xs:h-[50%] rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-2xl z-20 border-2 sm:border-4 border-[#D4AF37]">
              <Image
                src="/images/portfolio-event.jpg"
                alt="Luxury Wedding"
                fill
                sizes="(max-width: 1024px) 70vw, 35vw"
                className="object-cover"
              />
            </div>

            {/* Decorative Element */}
            <div className="absolute -top-2 -left-2 sm:-top-6 sm:-left-6 w-12 h-12 sm:w-32 sm:h-32 border-t-2 border-l-2 border-[#D4AF37] z-0" />
            <div className="absolute -bottom-2 right-6 sm:-bottom-6 sm:right-20 w-12 h-12 sm:w-32 sm:h-32 border-b-2 border-r-2 border-[#D4AF37] z-0" />
          </motion.div>

          {/* Right Side: Text */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInRight}
          >
            <SectionHeading 
              title="Our Story" 
              subtitle="About Eventura" 
            />

            <div className="space-y-3 sm:space-y-6 text-xs sm:text-base md:text-lg text-[var(--text-secondary)] font-body">
              <p className="font-semibold text-[var(--text-primary)] text-sm sm:text-lg md:text-xl leading-snug">
                Born in the heart of the Blue City, Eventura is Jodhpur&apos;s premier luxury event management company &amp; destination wedding planner.
              </p>
              
              <p className="leading-relaxed">
                We believe that every event is a unique story waiting to be told. Our passion lies in crafting extraordinary experiences that transcend the ordinary. From royal destination weddings to corporate galas, we blend traditional Rajasthani heritage with modern luxury.
              </p>
              
              <p className="leading-relaxed">
                With a dedicated team of creative visionaries, meticulous planners, and expert executors, we are expanding our footprint across Rajasthan and India, bringing our signature touch of elegance to every celebration.
              </p>

              <div className="pt-2 sm:pt-6 space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-[var(--text-primary)] text-sm sm:text-lg md:text-xl">Headquartered in Jodhpur</h4>
                    <p className="text-xs sm:text-sm">The cultural capital of Rajasthan</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"/><path d="M12 2v20"/><path d="m4.93 4.93 14.14 14.14"/><path d="m19.07 4.93-14.14 14.14"/></svg>
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-[var(--text-primary)] text-sm sm:text-lg md:text-xl">Serving All of Rajasthan</h4>
                    <p className="text-xs sm:text-sm">Bringing luxury to every corner</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
