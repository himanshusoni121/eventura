"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  portfolioItems as staticPortfolioItems,
  portfolioCategories as defaultCategoriesList,
  type PortfolioCategory,
  type PortfolioItem,
} from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import SectionPattern from "./ui/SectionPattern";
import Tilt3DCard from "./ui/Tilt3DCard";
import { X, ZoomIn, Sparkles, MapPin, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>("all");
  const [lightboxItem, setLightboxItem] = useState<PortfolioItem | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(staticPortfolioItems);
  const [categories, setCategories] = useState<{ label: string; value: string }[]>(
    defaultCategoriesList
  );
  const ref = useRef<HTMLElement>(null);

  // Fetch live content & categories from R2 manifests on mount
  useEffect(() => {
    Promise.all([
      fetch("/api/manifest/portfolio").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/manifest/categories").then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([portData, catData]) => {
        if (portData?.items && Array.isArray(portData.items) && portData.items.length > 0) {
          setPortfolioItems(portData.items);
        }
        if (catData?.items && Array.isArray(catData.items) && catData.items.length > 0) {
          setCategories([
            { label: "All", value: "all" },
            ...catData.items.map((c: { label: string; id: string }) => ({
              label: c.label,
              value: c.id,
            })),
          ]);
        }
      })
      .catch(() => {
        // Silently keep static fallback
      });
  }, []);

  // Prevent background scroll when lightbox is open
  useEffect(() => {
    if (lightboxItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [lightboxItem]);

  const filteredItems = portfolioItems.filter(
    (item) =>
      activeCategory === "all" ||
      item.category?.toLowerCase() === activeCategory.toLowerCase()
  );

  const getCategoryLabel = (catValue: string) => {
    const found = categories.find(
      (c) => c.value.toLowerCase() === catValue.toLowerCase()
    );
    return found ? found.label : catValue;
  };

  return (
    <section id="portfolio" ref={ref} className="relative overflow-hidden section-padding bg-[var(--bg)]">
      <SectionPattern ornaments={false} />
      
      {/* Background ambient luxury lighting aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse,_rgba(212,175,55,0.06)_0%,_transparent_70%)] pointer-events-none" />

      <div className="container-custom relative z-10">
        <SectionHeading 
          title="Our Portfolio" 
          subtitle="Featured Work" 
          centered 
        />

        {/* Dynamic Category Filters */}
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-3 mb-6 sm:mb-12">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={cn(
                "px-3.5 py-1.5 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 border relative group cursor-pointer",
                activeCategory === cat.value
                  ? "bg-gradient-to-r from-[#E8CD82] to-[#D4AF37] text-[#0D0E12] border-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.3)] font-semibold scale-105"
                  : "bg-white/4 text-[var(--text-secondary)] border-white/10 hover:border-[#D4AF37]/50 hover:text-white hover:bg-white/8"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 3D Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                key={item.id}
                className="cursor-pointer group"
                onClick={() => setLightboxItem(item)}
              >
                <Tilt3DCard
                  maxTilt={12}
                  lift={true}
                  glare={true}
                  goldSheen={true}
                  perspective={900}
                  className="rounded-2xl overflow-hidden bg-[#13151B] border border-white/10 shadow-2xl h-full"
                >
                  <div className="relative w-full aspect-[4/3] sm:min-h-[290px] overflow-hidden">
                    {/* Floating 3D Category Badge */}
                    <div className="absolute top-3.5 left-3.5 z-20 px-3 py-1 rounded-full bg-[#0D0E12]/85 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] font-semibold uppercase tracking-wider shadow-lg [transform:translateZ(25px)] flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                      <span>{getCategoryLabel(item.category)}</span>
                    </div>

                    {/* Main Image with 3D Depth Layer */}
                    <div className="relative w-full h-full [transform:translateZ(0px)]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110 brightness-[0.93] group-hover:brightness-100"
                      />
                    </div>
                    
                    {/* Subtle Gradient Shadow Base */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E12]/95 via-[#0D0E12]/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                    {/* Hover Overlay with 3D Elevated Content */}
                    <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end z-20 [transform:translateZ(35px)]">
                      <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                        {/* Zoom button */}
                        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#b8962f] flex items-center justify-center mb-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl shadow-[#D4AF37]/30 [transform:translateZ(50px)]">
                          <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5 text-[#0B0B0F]" />
                        </div>

                        <h3 className="text-white font-heading text-base sm:text-xl font-bold mb-1 leading-snug drop-shadow-md">
                          {item.title}
                        </h3>

                        {item.location && (
                          <div className="flex items-center gap-1.5 text-[#D4AF37] text-xs font-medium mb-1">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{item.location}</span>
                          </div>
                        )}

                        <p className="text-gray-300/90 text-xs sm:text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-body">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Tilt3DCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 text-[#8a8a9a]">
            <p className="text-base">No showcase events found for this category.</p>
          </div>
        )}

        {/* 3D Cinematic Lightbox Modal */}
        <AnimatePresence>
          {lightboxItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md"
              onClick={() => setLightboxItem(null)}
              style={{ perspective: 1200 }}
            >
              <button
                className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all z-20 cursor-pointer"
                onClick={() => setLightboxItem(null)}
                aria-label="Close image lightbox"
              >
                <X className="w-6 h-6" />
              </button>
              
              <motion.div
                initial={{ scale: 0.88, rotateX: 12, opacity: 0 }}
                animate={{ scale: 1, rotateX: 0, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 25 }}
                className="relative max-w-4xl w-full bg-[#13151B] border border-[#D4AF37]/30 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_35px_rgba(212,175,55,0.2)]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Large Image Preview */}
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[60vh] bg-black">
                  <Image
                    src={lightboxItem.image}
                    alt={lightboxItem.title}
                    fill
                    sizes="(max-width: 1024px) 95vw, 900px"
                    className="object-contain"
                    priority
                  />
                </div>

                {/* Info Drawer */}
                <div className="p-5 sm:p-7 bg-[#0D0E12] border-t border-white/10">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">
                      {getCategoryLabel(lightboxItem.category)}
                    </span>
                    {lightboxItem.date && (
                      <span className="flex items-center gap-1.5 text-xs text-[#8a8a9a]">
                        <Calendar className="w-3.5 h-3.5" />
                        {lightboxItem.date}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-heading font-bold text-white mb-2">
                    {lightboxItem.title}
                  </h3>

                  {lightboxItem.location && (
                    <p className="flex items-center gap-1.5 text-sm text-[#D4AF37] font-medium mb-3">
                      <MapPin className="w-4 h-4 shrink-0" />
                      {lightboxItem.location}
                    </p>
                  )}

                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-body">
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
