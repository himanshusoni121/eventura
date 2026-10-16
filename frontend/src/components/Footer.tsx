import Link from "next/link";
import Image from "next/image";
import { siteConfig, navLinks, services } from "@/lib/data";
import { ArrowRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B0B0F] text-white pt-10 pb-6 md:pt-20 md:pb-8 border-t border-[#1a1a24] relative z-20">
      <div className="container-custom relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-8 sm:mb-16 relative z-10">
          {/* Column 1: Brand */}
          <div className="space-y-4 sm:space-y-6 flex flex-col items-start">
            <Link href="#home">
              <Image
                src="/images/logo.png"
                alt={siteConfig.name}
                width={200}
                height={65}
                className="h-10 sm:h-14 w-auto"
              />
            </Link>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              {siteConfig.tagline}
            </p>
            <div className="flex gap-3 sm:gap-4">
              {/* Instagram SVG */}
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Follow Eventura on Instagram" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1a1a24] flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all border border-[#2a2a35] hover:border-[#D4AF37]">
                <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              {/* Facebook SVG */}
              <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Follow Eventura on Facebook" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1a1a24] flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all border border-[#2a2a35] hover:border-[#D4AF37]">
                <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              {/* Youtube SVG */}
              <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="Subscribe to Eventura YouTube Channel" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1a1a24] flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all border border-[#2a2a35] hover:border-[#D4AF37]">
                <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
              </a>
              {/* Linkedin SVG */}
              <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Connect with Eventura on LinkedIn" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1a1a24] flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all border border-[#2a2a35] hover:border-[#D4AF37]">
                <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-start">
            <h4 className="font-heading font-bold text-base sm:text-lg mb-3 sm:mb-6 flex items-center gap-2">
              <span className="w-4 h-[2px] bg-[#D4AF37]"></span>
              Quick Links
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-[#D4AF37] transition-colors text-xs sm:text-sm flex items-center gap-2 group">
                    <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#D4AF37]" />
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="flex flex-col items-start">
            <h4 className="font-heading font-bold text-base sm:text-lg mb-3 sm:mb-6 flex items-center gap-2">
              <span className="w-4 h-[2px] bg-[#D4AF37]"></span>
              Our Services
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {services.slice(0, 6).map((service) => (
                <li key={service.title}>
                  <Link href="#services" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-xs sm:text-sm flex items-center gap-2 group">
                    <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#D4AF37]" />
                    <span className="group-hover:translate-x-1 transition-transform">{service.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>


        </div>

        {/* Bottom */}
        <div className="pt-4 sm:pt-8 border-t border-[#2a2a35] flex flex-col md:flex-row justify-between items-center gap-3 text-[11px] sm:text-xs text-gray-500 relative z-10">
          <p>© {currentYear} {siteConfig.name}. All rights reserved.</p>
          <p>
            Designed with <span className="text-red-500 mx-1">❤️</span> in Jodhpur
          </p>
        </div>
      </div>
    </footer>
  );
}
