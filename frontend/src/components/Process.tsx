"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/hooks";
import { staggerContainer3D, reveal3D } from "@/lib/animations";
import { processSteps } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import SectionPattern from "./ui/SectionPattern";
import { 
  MessageCircle, ClipboardList, PenTool, Users, Rocket, Trophy, LucideIcon 
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  MessageCircle, ClipboardList, PenTool, Users, Rocket, Trophy
};

export default function Process() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { threshold: 0.1 });

  return (
    <section id="process" ref={ref} className="relative overflow-hidden section-padding bg-[#0B0B0F] text-white">
      <SectionPattern />
      <div className="container-custom relative z-10">
        <SectionHeading 
          title="Our Process" 
          subtitle="How We Work" 
          centered 
          className="text-white"
        />

        <div className="mt-8 sm:mt-16 md:mt-20">
          {/* Desktop Horizontal Timeline */}
          <div className="hidden lg:block relative">
            {/* Connecting Line */}
            <div className="absolute top-6 left-[8%] right-[8%] h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-30" />
            
            <motion.div
              variants={staggerContainer3D}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              style={{ perspective: 900 }}
              className="grid grid-cols-6 gap-4"
            >
              {processSteps.map((step, i) => {
                const Icon = iconMap[step.icon] || ClipboardList;
                return (
                  <motion.div key={i} variants={reveal3D} whileHover={{ y: -6, rotateX: -6 }} className="relative flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#b8962f] flex items-center justify-center font-heading font-bold text-lg text-[#0B0B0F] mb-6 relative z-10 shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                      {step.step}
                    </div>
                    
                    <div className="bg-[#1a1a24] border border-[#2a2a35] rounded-xl p-4 w-full h-full relative group transition-all duration-300 hover:border-[#D4AF37]/50 hover:-translate-y-2">
                      <Icon className="text-[#D4AF37] mx-auto mb-3" size={24} />
                      <h3 className="font-heading font-bold text-lg mb-2">{step.title}</h3>
                      <p className="text-gray-400 text-xs leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Mobile/Tablet Vertical Timeline */}
          <div className="lg:hidden relative pl-4 sm:pl-6 space-y-6 sm:space-y-12">
            {/* Connecting Line */}
            <div className="absolute top-0 bottom-0 left-[18px] sm:left-[23px] w-[2px] bg-gradient-to-b from-[#D4AF37] to-transparent opacity-30" />
            
            <motion.div
              variants={staggerContainer3D}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              style={{ perspective: 900 }}
            >
              {processSteps.map((step, i) => {
                const Icon = iconMap[step.icon] || ClipboardList;
                return (
                  <motion.div key={i} variants={reveal3D} className="relative mb-6 sm:mb-12 last:mb-0 pl-8 sm:pl-10">
                    <div className="absolute -left-4 sm:-left-6 top-0 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#b8962f] flex items-center justify-center font-heading font-bold text-sm sm:text-lg text-[#0B0B0F] z-10 shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                      {step.step}
                    </div>
                    
                    <div className="bg-[#1a1a24] border border-[#2a2a35] rounded-xl p-4 sm:p-6 relative">
                      <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                        <Icon className="text-[#D4AF37] w-5 h-5 sm:w-6 sm:h-6" />
                        <h3 className="font-heading font-bold text-base sm:text-xl">{step.title}</h3>
                      </div>
                      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
