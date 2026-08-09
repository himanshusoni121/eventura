"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { cn } from "@/lib/utils";

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
      className={cn("mb-12", centered && "text-center flex flex-col items-center", className)}
    >
      {subtitle && (
        <span className="text-[#D4AF37] font-semibold tracking-wider uppercase text-sm mb-2 block">
          {subtitle}
        </span>
      )}
      <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
        {title}
      </h2>
      <div className={cn("gold-line", centered && "mx-auto")} />
    </motion.div>
  );
}
