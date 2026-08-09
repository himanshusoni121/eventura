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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
                      "themed-card gradient-border h-full p-8 flex flex-col",
                      "transition-all duration-300"
                    )}
                  >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#b8962f] flex items-center justify-center mb-6 shadow-lg shadow-[#D4AF37]/20 group-hover:shadow-[#D4AF37]/40 transition-shadow">
                    <Icon className="text-white" size={24} />
                  </div>
                  
                  <h3 className="font-heading text-xl font-bold text-[var(--text-primary)] mb-3">
                    {service.title}
                  </h3>
                  
                  <p className="text-[var(--text-secondary)] font-body text-sm leading-relaxed flex-grow">
                    {service.description}
                  </p>

                  <div className="mt-6 flex items-center text-[#D4AF37] text-sm font-semibold group-hover:gap-2 transition-all">
                    <span>Learn more</span>
                    <svg className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
