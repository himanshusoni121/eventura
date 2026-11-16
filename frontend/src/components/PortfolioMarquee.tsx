"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { marqueeItemsList as staticMarqueeItems } from "@/lib/data";
import { X, ZoomIn, Sparkles } from "lucide-react";
import Tilt3DCard from "./ui/Tilt3DCard";

export default function PortfolioMarquee() {
  type MarqueeItem = typeof staticMarqueeItems[0];
  const [selectedItem, setSelectedItem] = useState<MarqueeItem | null>(null);
  const [marqueeItemsList, setMarqueeItemsList] = useState<MarqueeItem[]>(staticMarqueeItems);

  // Fetch live content from R2 manifest on mount.
  useEffect(() => {
    fetch("/api/manifest/marquee")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { items?: MarqueeItem[] } | null) => {
        if (data?.items && Array.isArray(data.items) && data.items.length > 0) {
          setMarqueeItemsList(data.items);
        }
      })
      .catch(() => {
        // Silently keep static fallback
      });
  }, []);

  // Duplicate items to ensure smooth 100% seamless marquee loop
  const marqueeItems = [...marqueeItemsList, ...marqueeItemsList];

  return (
    <section className="py-8 xs:py-10 md:py-16 bg-[#0D0E12] relative overflow-hidden border-y border-[var(--glass-border)] z-20">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.06)_0%,_transparent_75%)] pointer-events-none" />

      <div className="container-custom mb-5 xs:mb-7 sm:mb-9 text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>Curated Work Showcase</span>
        </div>
        <h2 className="font-heading text-lg sm:text-3xl md:text-4xl font-bold text-white tracking-wide">
          Moments Crafted by <span className="text-gold-gradient">Eventura</span>
        </h2>
      </div>

      {/* Continuously Moving Slider Container */}
      <div className="relative w-full overflow-hidden py-2 select-none">
        {/* Gradient edge fades for luxury studio aesthetic */}
        <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-20 md:w-36 bg-gradient-to-r from-[#0D0E12] via-[#0D0E12]/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-20 md:w-36 bg-gradient-to-l from-[#0D0E12] via-[#0D0E12]/90 to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee group w-max">
          {marqueeItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              onClick={() => setSelectedItem(item)}
              className="relative mx-2 sm:mx-3 md:mx-4 flex-shrink-0 cursor-pointer group/item"
              style={{ perspective: 900 }}
            >
              <Tilt3DCard
                maxTilt={8}
                lift={true}
                glare={true}
                goldSheen={true}
                className="w-[190px] xs:w-[230px] sm:w-[290px] md:w-[330px] h-[130px] xs:h-[155px] sm:h-[195px] md:h-[215px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-300"
              >
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 230px, (max-width: 768px) 290px, 330px"
                    className="object-cover transition-transform duration-700 group-hover/item:scale-110"
                    priority={index < 4}
                  />
                  
                  {/* Floating category badge */}
                  <div className="absolute top-2.5 left-2.5 z-20 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37]/30 text-[#D4AF37] text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider [transform:translateZ(20px)]">
                    {item.category}
                  </div>

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4 z-20 [transform:translateZ(30px)]">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#E8CD82] to-[#D4AF37] flex items-center justify-center mb-1 sm:mb-2 shadow-md">
                      <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0D0E12]" />
                    </div>
                    <h4 className="text-white font-heading font-bold text-xs sm:text-sm truncate">
                      {item.title}
                    </h4>
                  </div>
                </div>
              </Tilt3DCard>
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-md"
            onClick={() => setSelectedItem(null)}
            style={{ perspective: 1200 }}
          >
            <button
              className="absolute top-4 sm:top-6 right-4 sm:right-6 text-white/80 hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all z-20 cursor-pointer"
              onClick={() => setSelectedItem(null)}
              aria-label="Close preview"
            >
              <X className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>

            <motion.div
              initial={{ scale: 0.88, rotateX: 10, opacity: 0 }}
              animate={{ scale: 1, rotateX: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="relative w-full max-w-4xl aspect-[16/10] rounded-2xl overflow-hidden border border-[#D4AF37]/35 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.2)] bg-[#13151B]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedItem.image}
                alt={selectedItem.title}
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 bg-gradient-to-t from-black/95 via-black/60 to-transparent">
                <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest inline-block mb-2">
                  {selectedItem.category}
                </span>
                <h3 className="text-white font-heading text-lg sm:text-2xl md:text-3xl font-bold">
                  {selectedItem.title}
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm md:text-base mt-2 max-w-2xl font-body">
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
