"use client";

import { useState, useEffect } from "react";
import { navLinks, siteConfig } from "@/lib/data";
import { useActiveSection } from "@/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { slideInMenu, menuItemVariants } from "@/lib/animations";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeSection = useActiveSection(["home", "about", "services", "portfolio", "testimonials", "process", "contact"]);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (pathname === "/" && href.startsWith("/#")) {
      return activeSection === href.substring(2);
    }
    if (pathname === "/" && href === "/") {
      return activeSection === "home";
    }
    return pathname === href;
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-transparent",
          scrolled
            ? "bg-[var(--nav-bg)] backdrop-blur-xl border-[var(--glass-border)] shadow-sm py-2 xs:py-2.5 sm:py-3 md:py-4"
            : "bg-transparent py-2.5 xs:py-3.5 sm:py-5 md:py-6"
        )}
      >
        <div className="w-full px-4 sm:px-6 md:px-6 lg:px-10 flex items-center justify-between">
          {/* Logo */}
          <Link href="/#home" className="relative z-50" aria-label="Eventura Home">
            <Image
              src="/images/logo.png"
              alt={siteConfig.name}
              width={180}
              height={60}
              priority
              className="h-8 xs:h-9 sm:h-11 md:h-14 lg:h-16 w-auto transition-all"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-6 bg-[var(--glass-bg)] backdrop-blur-md px-6 py-2 rounded-full border border-[var(--glass-border)]">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "relative text-sm font-medium transition-colors hover:text-[#D4AF37]",
                    isActive(link.href)
                      ? "text-[#D4AF37]"
                      : scrolled ? "text-[var(--text-primary)]" : "text-white"
                  )}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#D4AF37] rounded-full"
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">

              <Link href="#contact" className="btn-primary py-2.5 px-6">
                <span>Get Quote</span>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 lg:hidden relative z-50">

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className={cn(
                "p-2 rounded-full flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]",
                mobileMenuOpen || !scrolled ? "text-white bg-white/10" : "text-[var(--text-primary)] bg-[var(--glass-bg)] border border-[var(--glass-border)]"
              )}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            variants={slideInMenu}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-40 bg-[#0B0B0F] flex flex-col justify-center items-center"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
               <div className="absolute top-1/4 left-1/4 w-48 h-48 xs:w-64 xs:h-64 bg-[#D4AF37]/10 rounded-full blur-[80px] xs:blur-[100px]" />
               <div className="absolute bottom-1/4 right-1/4 w-48 h-48 xs:w-64 xs:h-64 bg-[#D4AF37]/10 rounded-full blur-[80px] xs:blur-[100px]" />
            </div>
            
            <div className="flex flex-col items-center gap-6 xs:gap-8 z-10">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  custom={i}
                  variants={menuItemVariants}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "font-heading text-2xl xs:text-3xl md:text-4xl hover:text-[#D4AF37] transition-colors",
                      isActive(link.href) ? "text-[#D4AF37]" : "text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div variants={menuItemVariants} custom={navLinks.length}>
                <Link 
                  href="/planner" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary mt-8"
                >
                  <span>Get Quote</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
