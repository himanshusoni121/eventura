"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "@/hooks";
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
  const isInView = useInView(ref, { threshold: 0.1 });

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
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
          {portfolioCategories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border",
                activeCategory === cat.value
                  ? "bg-[#D4AF37] text-[#0B0B0F] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                  : "bg-transparent text-[var(--text-secondary)] border-[var(--glass-border)] hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery */}
        <motion.div 
          layout
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
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
                className="relative rounded-2xl overflow-hidden group cursor-pointer break-inside-avoid"
                onClick={() => setLightboxItem(item)}
              >
                <Tilt3DCard maxTilt={5} lift={false} className="rounded-2xl">
                  <div className="relative w-full aspect-[4/5] sm:aspect-auto sm:min-h-[300px]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover w-full h-auto max-w-full transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        <ZoomIn size={18} className="text-[#0B0B0F]" />
                      </div>
                      <span className="text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-1 block">
                        {portfolioCategories.find(c => c.value === item.category)?.label}
                      </span>
                      <h3 className="text-white font-heading text-xl md:text-2xl font-bold mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-300 text-sm line-clamp-2">
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
                className="absolute top-6 right-6 text-white/70 hover:text-white p-2"
                onClick={() => setLightboxItem(null)}
              >
                <X size={32} />
              </button>
              
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={lightboxItem.image}
                  alt={lightboxItem.title}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="text-[#D4AF37] text-sm font-semibold uppercase tracking-wider">
                    {portfolioCategories.find(c => c.value === lightboxItem.category)?.label}
                  </span>
                  <h3 className="text-white font-heading text-2xl md:text-3xl font-bold mt-1">
                    {lightboxItem.title}
                  </h3>
                  <p className="text-gray-300 mt-2 max-w-2xl">
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
