"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "@/hooks";
import { fadeInLeft, fadeInRight } from "@/lib/animations";
import SectionHeading from "./ui/SectionHeading";
import Tilt3DCard from "./ui/Tilt3DCard";
import { Award, Crown, MapPin, Sparkles } from "lucide-react";

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { threshold: 0.2 });

  return (
    <section id="about" ref={ref} className="section-padding bg-[var(--bg)] overflow-hidden relative">
      {/* Subtle background luxury ambient glow */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[radial-gradient(circle,_rgba(212,175,55,0.08)_0%,_transparent_70%)] pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
          
          {/* Left Side: 3D Interactive Images */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInLeft}
            className="relative h-[280px] xs:h-[320px] sm:h-[420px] md:h-[480px] lg:h-[580px] w-full"
            style={{ perspective: 1200 }}
          >
            {/* Main 3D Image */}
            <div className="absolute top-0 left-0 w-[78%] h-[78%] z-10">
              <Tilt3DCard
                maxTilt={10}
                lift={true}
                glare={true}
                goldSheen={true}
                className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              >
                <div className="relative w-full h-full min-h-[220px]">
                  <Image
                    src="/images/about-wedding.png"
                    alt="Eventura Royal Wedding Production"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    loading="eager"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                </div>
              </Tilt3DCard>
            </div>

            {/* Overlapping 3D Image with Royal Gold Border */}
            <div className="absolute bottom-2 right-2 sm:bottom-0 sm:right-0 w-[54%] xs:w-[58%] h-[46%] xs:h-[50%] z-20">
              <Tilt3DCard
                maxTilt={14}
                lift={true}
                glare={true}
                goldSheen={true}
                className="w-full h-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(212,175,55,0.25)] border-2 sm:border-3 border-[#D4AF37]"
              >
                <div className="relative w-full h-full">
                  <Image
                    src="/images/portfolio-event.jpg"
                    alt="Luxury Wedding Décor by Eventura"
                    fill
                    sizes="(max-width: 1024px) 70vw, 35vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>
              </Tilt3DCard>
            </div>

            {/* Floating 3D Experience Badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-3 right-4 sm:top-6 sm:right-8 z-30 bg-[#13151B]/90 backdrop-blur-md border border-[#D4AF37]/50 rounded-2xl px-3.5 py-2 sm:px-4 sm:py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(212,175,55,0.3)] flex items-center gap-2.5"
            >
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#E8CD82] to-[#D4AF37] flex items-center justify-center text-[#0D0E12] shadow-md shrink-0">
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-[#0D0E12]" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-[#D4AF37] uppercase tracking-wider font-semibold">Rajasthan&apos;s Finest</p>
                <p className="text-white font-heading font-bold text-xs sm:text-sm">Royal Event Specialists</p>
              </div>
            </motion.div>

            {/* Decorative Corner Filigrees */}
            <div className="absolute -top-2 -left-2 sm:-top-5 sm:-left-5 w-12 h-12 sm:w-28 sm:h-28 border-t-2 border-l-2 border-[#D4AF37]/60 pointer-events-none z-0" />
            <div className="absolute -bottom-2 right-6 sm:-bottom-5 sm:right-16 w-12 h-12 sm:w-28 sm:h-28 border-b-2 border-r-2 border-[#D4AF37]/60 pointer-events-none z-0" />
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
                <div className="flex items-center gap-3 sm:gap-4 p-3 rounded-2xl bg-white/4 border border-white/8 hover:border-[#D4AF37]/30 transition-all">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-[var(--text-primary)] text-sm sm:text-lg">Headquartered in Jodhpur</h4>
                    <p className="text-xs sm:text-sm text-[#8a8a9a]">The royal cultural capital of Rajasthan</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 p-3 rounded-2xl bg-white/4 border border-white/8 hover:border-[#D4AF37]/30 transition-all">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-[var(--text-primary)] text-sm sm:text-lg">Serving All of Rajasthan &amp; India</h4>
                    <p className="text-xs sm:text-sm text-[#8a8a9a]">Palaces, heritage forts, resorts, and corporate hubs</p>
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
