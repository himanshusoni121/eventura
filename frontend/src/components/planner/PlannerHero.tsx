"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

export default function PlannerHero() {
  return (
    <section className="relative pt-32 pb-12 overflow-hidden bg-[var(--bg)] border-b border-[#2a2a35]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-[var(--bg)] to-[var(--bg)] pointer-events-none" />
      
      <div className="container-custom relative z-10 text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs sm:text-sm font-semibold tracking-wider uppercase mb-4 sm:mb-6 border border-[#D4AF37]/20">
            Event Estimator
          </span>
          <h1 className="font-heading text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Plan Your <span className="text-gold-gradient">Event Budget</span>
          </h1>
          <p className="text-sm sm:text-lg text-gray-400 font-body max-w-2xl mx-auto leading-relaxed">
            Tell us about your event and estimated budget. We&apos;ll prepare a customized luxury proposal that matches your vision and expectations.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
