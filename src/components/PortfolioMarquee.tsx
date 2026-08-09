"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { marqueeItemsList } from "@/lib/data";
import { X, ZoomIn, Sparkles } from "lucide-react";

export default function PortfolioMarquee() {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // Duplicate items to ensure smooth 100% seamless marquee loop
  const marqueeItems = [...marqueeItemsList, ...marqueeItemsList];

  return (
    <section className="py-12 md:py-16 bg-[#0B0B0F] relative overflow-hidden border-y border-[var(--glass-border)]/40 z-20">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.06)_0%,_transparent_75%)] pointer-events-none" />

      <div className="container-custom mb-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-3">
          <Sparkles size={14} />
          <span>Curated Work Showcase</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-wide">
          Moments Crafted by <span className="text-gold-gradient">Eventura</span>
        </h2>
      </div>

      {/* Continuously Moving Slider Container */}
      <div className="relative w-full overflow-hidden py-2 select-none">
        {/* Gradient edge fades for luxury aesthetic */}
        <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#0B0B0F] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#0B0B0F] to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee group w-max">
          {marqueeItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              onClick={() => setSelectedItem(item)}
              className="relative mx-3 md:mx-4 flex-shrink-0 cursor-pointer group/item"
            >
              {/* Reduced size image card (~20-30% smaller than main portfolio grid) */}
              <div className="relative w-[240px] sm:w-[280px] md:w-[320px] h-[170px] sm:h-[190px] md:h-[210px] rounded-2xl overflow-hidden border border-[var(--glass-border)] shadow-xl transition-all duration-500 transform group-hover/item:scale-105 group-hover/item:border-[#D4AF37]/60 group-hover/item:shadow-[0_10px_30px_rgba(212,175,55,0.25)]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 240px, (max-width: 768px) 280px, 320px"
                  className="object-cover transition-transform duration-700 group-hover/item:scale-110"
                  priority={index < 4}
                />
                
                {/* Subtle Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center mb-2 shadow-md">
                    <ZoomIn size={16} className="text-[#0B0B0F]" />
                  </div>
                  <span className="text-[#D4AF37] text-[10px] font-semibold uppercase tracking-wider">
                    {item.category}
                  </span>
                  <h4 className="text-white font-heading font-bold text-sm truncate">
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            onClick={() => setSelectedItem(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2 transition-colors"
              onClick={() => setSelectedItem(null)}
              aria-label="Close preview"
            >
              <X size={32} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl aspect-[16/10] rounded-2xl overflow-hidden border border-[#D4AF37]/30"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedItem.image}
                alt={selectedItem.title}
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <span className="text-[#D4AF37] text-xs font-semibold uppercase tracking-widest">
                  {selectedItem.category}
                </span>
                <h3 className="text-white font-heading text-2xl md:text-3xl font-bold mt-1">
                  {selectedItem.title}
                </h3>
                <p className="text-gray-300 text-sm md:text-base mt-2 max-w-2xl">
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
