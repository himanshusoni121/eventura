"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { portfolioItems, portfolioCategories, PortfolioCategory, PortfolioItem } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import SectionPattern from "./ui/SectionPattern";
import Tilt3DCard from "./ui/Tilt3DCard";
import { X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>("all");
  const [lightboxItem, setLightboxItem] = useState<PortfolioItem | null>(null);
  const ref = useRef<HTMLElement>(null);

  const filteredItems = portfolioItems.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

  return (
    <section id="portfolio" ref={ref} className="relative overflow-hidden section-padding bg-[var(--bg)]">
      <SectionPattern ornaments={false} />
      <div className="container-custom relative z-10">
        <SectionHeading 
          title="Our Portfolio" 
          subtitle="Featured Work" 
          centered 
        />

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-4 mb-5 sm:mb-12">
          {portfolioCategories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={cn(
                "px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-full text-[11px] xs:text-xs sm:text-sm font-medium transition-all duration-300 border",
                activeCategory === cat.value
                  ? "bg-[#D4AF37] text-[#0B0B0F] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                  : "bg-transparent text-[var(--text-secondary)] border-[var(--glass-border)] hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery - 2 columns on mobile, 2 on tablet, 3 on desktop */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 xs:gap-3 sm:gap-6"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={item.id}
                className="relative rounded-lg xs:rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer"
                onClick={() => setLightboxItem(item)}
              >
                <Tilt3DCard maxTilt={5} lift={false} className="rounded-lg xs:rounded-xl sm:rounded-2xl h-full">
                  <div className="relative w-full aspect-[4/3] sm:aspect-auto sm:min-h-[280px] h-full min-h-[120px] xs:min-h-[140px]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 xs:p-3 sm:p-6">
                    <motion.div
                      initial={{ y: 15, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                    >
                      <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-[#D4AF37] flex items-center justify-center mb-1 sm:mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        <ZoomIn className="w-3 h-3 sm:w-5 sm:h-5 text-[#0B0B0F]" />
                      </div>
                      <span className="text-[#D4AF37] text-[8px] xs:text-[9px] sm:text-xs font-semibold uppercase tracking-wider mb-0.5 sm:mb-1 block">
                        {portfolioCategories.find(c => c.value === item.category)?.label}
                      </span>
                      <h3 className="text-white font-heading text-xs xs:text-sm sm:text-xl md:text-2xl font-bold mb-0.5 sm:mb-2 line-clamp-1 sm:line-clamp-none">
                        {item.title}
                      </h3>
                      <p className="text-gray-300 text-[9px] xs:text-[10px] sm:text-sm line-clamp-2 hidden xs:block">
                        {item.description}
                      </p>
                    </motion.div>
                  </div>
                </Tilt3DCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm"
              onClick={() => setLightboxItem(null)}
            >
              <button
                className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white p-2.5 rounded-full bg-black/40 border border-white/20"
                onClick={() => setLightboxItem(null)}
                aria-label="Close image lightbox"
              >
                <X className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
              
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-4xl xs:max-w-5xl aspect-video rounded-lg xs:rounded-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={lightboxItem.image}
                  alt={lightboxItem.title}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
                
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">
                    {portfolioCategories.find(c => c.value === lightboxItem.category)?.label}
                  </span>
                  <h3 className="text-white font-heading text-lg sm:text-2xl md:text-3xl font-bold mt-1">
                    {lightboxItem.title}
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-base mt-1 sm:mt-2 max-w-2xl">
                    {lightboxItem.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
