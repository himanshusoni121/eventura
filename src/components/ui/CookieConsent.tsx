"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("eventura-cookie-consent");
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("eventura-cookie-consent", "true");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="fixed bottom-0 left-0 w-full z-[100] p-4 md:p-6"
        >
          <div className="container-custom max-w-4xl mx-auto">
            <div className="glass-card bg-[#0B0B0F]/90 border border-[#D4AF37]/30 p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
              <div className="text-white text-sm">
                <p>
                  We use cookies to enhance your experience, analyze site traffic, and serve tailored content. By continuing to browse, you agree to our use of cookies.
                </p>
              </div>
              <div className="flex gap-4 flex-shrink-0 w-full md:w-auto">
                <button 
                  onClick={() => setIsVisible(false)}
                  className="text-gray-400 hover:text-white transition-colors text-sm px-4 py-2 flex-1 md:flex-none"
                >
                  Decline
                </button>
                <button 
                  onClick={accept}
                  className="btn-primary py-2 px-6 flex-1 md:flex-none justify-center text-sm"
                >
                  <span>Accept All</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
