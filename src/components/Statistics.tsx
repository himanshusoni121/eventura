"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/hooks";
import { useCounter } from "@/hooks";
import { stats } from "@/lib/data";

function StatItem({ stat, index, inView }: { stat: any, index: number, inView: boolean }) {
  const count = useCounter(stat.value, 2500, inView);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex flex-col items-center flex-1 min-w-[150px] p-4 relative"
    >
      <div className="flex items-center text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mb-2">
        <span>{count}</span>
        <span className="text-[#D4AF37] ml-1">{stat.suffix}</span>
      </div>
      <span className="text-gray-400 text-sm md:text-base tracking-widest uppercase font-semibold text-center">
        {stat.label}
      </span>
      
      {/* Decorative dot - hidden on last item or mobile */}
      {index < stats.length - 1 && (
        <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#D4AF37]/50" />
      )}
    </motion.div>
  );
}

export default function Statistics() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { threshold: 0.5 });

  return (
    <section 
      id="statistics" 
      ref={ref} 
      className="py-24 relative bg-[#0B0B0F] overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-transparent to-transparent opacity-50" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
      
      <div className="container-custom relative z-10">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-8">
          {stats.map((stat, i) => (
            <StatItem key={i} stat={stat} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
