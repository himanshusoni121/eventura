"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  centered = false,
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className={cn("mb-6 sm:mb-12", centered && "text-center flex flex-col items-center", className)}
    >
      {subtitle && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] mb-2 sm:mb-3 shadow-[0_0_15px_rgba(212,175,55,0.12)]">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          <span>{subtitle}</span>
        </div>
      )}
      <h2 className="font-heading text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-2.5 sm:mb-4 tracking-tight">
        {title}
      </h2>
      <div className={cn("relative flex items-center justify-center my-1", centered ? "mx-auto" : "")}>
        <div className="gold-line" />
        <div className="absolute w-2 h-2 rotate-45 bg-[#F3E2B8] shadow-[0_0_8px_rgba(212,175,55,0.7)] border border-[#0D0E12]" />
      </div>
    </motion.div>
  );
}
