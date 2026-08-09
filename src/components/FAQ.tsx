"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "@/hooks";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { faqs } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { threshold: 0.1 });

  return (
    <section id="faq" ref={ref} className="section-padding bg-[var(--bg-secondary)]">
      <div className="container-custom">
        <SectionHeading 
          title="Frequently Asked Questions" 
          subtitle="Got Questions?" 
          centered 
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-3xl mx-auto space-y-4"
        >
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            
            return (
              <motion.div key={i} variants={fadeInUp} className="relative">
                <div 
                  className={cn(
                    "themed-card overflow-hidden transition-all duration-300",
                    isOpen ? "border-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.15)]" : "hover:border-[#D4AF37]/50"
                  )}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  >
                    <h3 className={cn(
                      "font-heading font-semibold text-[1.1rem] transition-colors pr-8",
                      isOpen ? "text-[#D4AF37]" : "text-[var(--text-primary)]"
                    )}>
                      {faq.question}
                    </h3>
                    <div className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                      isOpen ? "bg-[#D4AF37]/10 text-[#D4AF37]" : "bg-[var(--glass-border)] text-[var(--text-secondary)]"
                    )}>
                      <ChevronDown 
                        size={18} 
                        className={cn(
                          "transition-transform duration-300",
                          isOpen ? "rotate-180" : "rotate-0"
                        )} 
                      />
                    </div>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="p-6 pt-0 text-[var(--text-secondary)] text-sm leading-relaxed border-t border-[var(--glass-border)] mt-2">
                          <p className="pt-4">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
