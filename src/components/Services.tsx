"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { staggerContainer3D, reveal3D, cardHover } from "@/lib/animations";
import { services } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import SectionPattern from "./ui/SectionPattern";
import Tilt3DCard from "./ui/Tilt3DCard";
import { 
  Heart, Building2, Cake, GraduationCap, Palette, 
  Sparkles, Music, Camera, Video, UtensilsCrossed, 
  PartyPopper, Clapperboard, LucideIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Heart, Building2, Cake, GraduationCap, Palette, 
  Sparkles, Music, Camera, Video, UtensilsCrossed, 
  PartyPopper, Clapperboard
};

export default function Services() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section id="services" ref={ref} className="relative overflow-hidden section-padding bg-[var(--bg-secondary)]">
      <SectionPattern />
      <div className="container-custom relative z-10">
        <SectionHeading 
          title="Our Services" 
          subtitle="What We Offer" 
          centered 
        />

        <motion.div
          variants={staggerContainer3D}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          style={{ perspective: 900 }}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 xs:gap-3 sm:gap-6"
        >
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] || Sparkles;
            return (
              <motion.div
                key={i}
                variants={reveal3D}
                whileHover="hover"
                className="relative group h-full"
              >
                <Tilt3DCard maxTilt={6} className="h-full">
                  <motion.div
                    variants={cardHover}
                    className={cn(
                      "themed-card gradient-border h-full p-3 xs:p-4 sm:p-8 flex flex-col justify-between",
                      "transition-all duration-300"
                    )}
                  >
                  <div>
                    <div className="w-7 h-7 xs:w-9 xs:h-9 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#b8962f] flex items-center justify-center mb-2 xs:mb-3 sm:mb-6 shadow-lg shadow-[#D4AF37]/20 group-hover:shadow-[#D4AF37]/40 transition-shadow">
                      <Icon className="text-white w-3.5 h-3.5 xs:w-4.5 xs:h-4.5 sm:w-6 sm:h-6" />
                    </div>
                    
                    <h3 className="font-heading text-xs xs:text-sm sm:text-xl font-bold text-[var(--text-primary)] mb-1 xs:mb-1.5 sm:mb-3 leading-snug">
                      {service.title}
                    </h3>
                    
                    <p className="text-[var(--text-secondary)] font-body text-[10px] xs:text-xs sm:text-sm leading-tight sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-2.5 xs:mt-3 sm:mt-6 flex items-center text-[#D4AF37] text-[10px] xs:text-xs sm:text-sm font-semibold group-hover:gap-2 transition-all">
                    <span>Learn more</span>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                  </motion.div>
                </Tilt3DCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
