"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/hooks";
import { staggerContainer3D, reveal3D } from "@/lib/animations";
import { whyChooseUs } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import SectionPattern from "./ui/SectionPattern";
import { 
  Eye, Clock, Lightbulb, IndianRupee, Layers, Headphones, LucideIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Eye, Clock, Lightbulb, IndianRupee, Layers, Headphones
};

export default function WhyChooseUs() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { threshold: 0.1 });

  return (
    <section id="why-us" ref={ref} className="relative overflow-hidden section-padding bg-[var(--bg)]">
      <SectionPattern ornaments={false} />
      <div className="container-custom relative z-10">
        <SectionHeading 
          title="Why Choose Us" 
          subtitle="The Eventura Difference" 
          centered 
        />

        <motion.div
          variants={staggerContainer3D}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{ perspective: 900 }}
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 xs:gap-3 sm:gap-8"
        >
          {whyChooseUs.map((feature, i) => {
            const Icon = iconMap[feature.icon] || Lightbulb;
            return (
              <motion.div
                key={i}
                variants={reveal3D}
                whileHover={{ y: -8, rotateX: -4, transition: { duration: 0.3 } }}
                className={cn(
                  "glass-card gradient-border p-3 xs:p-4 sm:p-8 flex flex-col justify-between",
                  "hover:shadow-[0_15px_30px_rgba(212,175,55,0.1)] transition-all duration-300"
                )}
              >
                <div>
                  <div className="w-7 h-7 xs:w-9 xs:h-9 sm:w-14 sm:h-14 rounded-lg xs:rounded-xl bg-[#D4AF37]/10 flex items-center justify-center mb-2 xs:mb-3 sm:mb-6">
                    <Icon className="text-[#D4AF37] w-3.5 h-3.5 xs:w-4.5 xs:h-4.5 sm:w-7 sm:h-7" strokeWidth={1.5} />
                  </div>
                  
                  <h3 className="font-heading text-xs xs:text-sm sm:text-xl font-bold text-[var(--text-primary)] mb-1 xs:mb-1.5 sm:mb-3 leading-snug">
                    {feature.title}
                  </h3>
                  
                  <p className="text-[var(--text-secondary)] font-body text-[10px] xs:text-xs sm:text-sm leading-tight sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
