"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { marqueeItemsList } from "@/lib/data";
import { X, ZoomIn, Sparkles } from "lucide-react";

export default function PortfolioMarquee() {
  const [selectedItem, setSelectedItem] = useState<(typeof marqueeItemsList)[0] | null>(null);

  // Duplicate items to ensure smooth 100% seamless marquee loop
  const marqueeItems = [...marqueeItemsList, ...marqueeItemsList];

  return (
    <section className="py-6 xs:py-8 md:py-16 bg-[#0B0B0F] relative overflow-hidden border-y border-[var(--glass-border)]/40 z-20">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.06)_0%,_transparent_75%)] pointer-events-none" />

      <div className="container-custom mb-4 xs:mb-6 sm:mb-8 text-center relative z-10">
        <div className="inline-flex items-center gap-1 xs:gap-1.5 px-2.5 py-0.75 xs:px-3 xs:py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[9px] xs:text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-1.5 xs:mb-2 sm:mb-3">
          <Sparkles className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5" />
          <span>Curated Work Showcase</span>
        </div>
        <h2 className="font-heading text-base xs:text-lg sm:text-3xl md:text-4xl font-bold text-white tracking-wide">
          Moments Crafted by <span className="text-gold-gradient">Eventura</span>
        </h2>
      </div>

      {/* Continuously Moving Slider Container */}
      <div className="relative w-full overflow-hidden py-0.5 xs:py-1 sm:py-2 select-none">
        {/* Gradient edge fades for luxury aesthetic */}
        <div className="absolute top-0 bottom-0 left-0 w-6 xs:w-8 sm:w-16 md:w-32 bg-gradient-to-r from-[#0B0B0F] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-6 xs:w-8 sm:w-16 md:w-32 bg-gradient-to-l from-[#0B0B0F] to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee group w-max">
          {marqueeItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              onClick={() => setSelectedItem(item)}
              className="relative mx-1.5 sm:mx-3 md:mx-4 flex-shrink-0 cursor-pointer group/item"
            >
              {/* Image card for mobile & desktop */}
              <div className="relative w-[180px] xs:w-[220px] sm:w-[280px] md:w-[320px] h-[125px] xs:h-[150px] sm:h-[190px] md:h-[210px] rounded-xl sm:rounded-2xl overflow-hidden border border-[var(--glass-border)] shadow-xl transition-all duration-500 transform group-hover/item:scale-105 group-hover/item:border-[#D4AF37]/60 group-hover/item:shadow-[0_10px_30px_rgba(212,175,55,0.25)]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 220px, (max-width: 768px) 280px, 320px"
                  className="object-cover transition-transform duration-700 group-hover/item:scale-110"
                  priority={index < 4}
                />
                
                {/* Subtle Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#D4AF37] flex items-center justify-center mb-1 sm:mb-2 shadow-md">
                    <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0B0B0F]" />
                  </div>
                  <span className="text-[#D4AF37] text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                    {item.category}
                  </span>
                  <h4 className="text-white font-heading font-bold text-xs sm:text-sm truncate">
                    {item.title}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox for Showcase Items */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 xs:p-4 bg-black/95 backdrop-blur-md"
            onClick={() => setSelectedItem(null)}
          >
            <button
              className="absolute top-4 xs:top-6 right-4 xs:right-6 text-white/70 hover:text-white p-1.5 xs:p-2 transition-colors"
              onClick={() => setSelectedItem(null)}
              aria-label="Close preview"
            >
              <X size={24} className="xs:w-8 xs:h-8" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl aspect-[16/10] rounded-xl xs:rounded-2xl overflow-hidden border border-[#D4AF37]/30"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedItem.image}
                alt={selectedItem.title}
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 xs:p-6 md:p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <span className="text-[#D4AF37] text-[10px] xs:text-xs font-semibold uppercase tracking-widest">
                  {selectedItem.category}
                </span>
                <h3 className="text-white font-heading text-lg xs:text-2xl md:text-3xl font-bold mt-1">
                  {selectedItem.title}
                </h3>
                <p className="text-gray-300 text-[11px] xs:text-sm md:text-base mt-2 max-w-2xl">
                  {selectedItem.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
