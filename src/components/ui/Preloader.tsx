"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "eventura-loaded";
type Phase = "loading" | "done" | "hidden";

export default function Preloader() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>("loading");
  const [progress, setProgress] = useState(0);

  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Step 1: mark mounted, and resolve real phase — client only.
  useEffect(() => {
    setMounted(true);
    const alreadyLoaded = sessionStorage.getItem(STORAGE_KEY);
    if (alreadyLoaded) {
      setPhase("hidden");
    }
  }, []);

  // Step 2: scroll lock.
  useEffect(() => {
    if (!mounted || phase === "hidden") return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mounted, phase]);

  // Step 3: run the animation ONLY when mounted and phase is "loading".
  useEffect(() => {
    if (!mounted || phase !== "loading") return;

    sessionStorage.setItem(STORAGE_KEY, "true");

    const start = performance.now();
    const duration = 2800;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPhase("done");
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [mounted, phase]);

  // Step 4: after "done", wait, then hide. Separate effect — decoupled from the rAF loop.
  useEffect(() => {
    if (phase !== "done") return;
    timeoutRef.current = setTimeout(() => setPhase("hidden"), 1200);
    return () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    };
  }, [phase]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {phase !== "hidden" && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "#0B0B0F",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 600,
              height: 600,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)",
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, ease: "linear", repeat: Infinity }}
            style={{
              position: "absolute",
              width: 380,
              height: 380,
              borderRadius: "50%",
              border: "1px solid rgba(212,175,55,0.2)",
              pointerEvents: "none",
            }}
          />

          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 18, ease: "linear", repeat: Infinity }}
            style={{
              position: "absolute",
              width: 300,
              height: 300,
              borderRadius: "50%",
              border: "1px dashed rgba(212,175,55,0.12)",
              pointerEvents: "none",
            }}
          />

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, ease: "linear", repeat: Infinity }}
            style={{
              position: "absolute",
              width: 380,
              height: 380,
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -4,
                left: "50%",
                transform: "translateX(-50%)",
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#D4AF37",
                boxShadow: "0 0 12px 4px rgba(212,175,55,0.6)",
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "relative", zIndex: 10 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0.4] }}
              transition={{ duration: 2, delay: 0.8, ease: "easeOut" }}
              style={{
                position: "absolute",
                inset: -20,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)",
                filter: "blur(20px)",
                pointerEvents: "none",
              }}
            />

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              src="/images/logo.png"
              alt="Eventura"
              animate={
                phase === "done"
                  ? { scale: 1.05, opacity: 0.8 }
                  : { scale: 1, opacity: 1 }
              }
              transition={{ duration: 0.5 }}
              style={{
                width: 260,
                height: 260,
                objectFit: "contain",
                display: "block",
                position: "relative",
                zIndex: 10,
              }}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{
                duration: 1.5,
                delay: 1.4,
                repeat: Infinity,
                repeatDelay: 2.5,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(105deg, transparent 30%, rgba(255,220,100,0.25) 50%, transparent 70%)",
                pointerEvents: "none",
                zIndex: 11,
              }}
            />
          </motion.div>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
            style={{
              marginTop: 20,
              height: 2,
              width: 200,
              background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
              transformOrigin: "center",
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            style={{
              marginTop: 12,
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#6a6a7a",
            }}
          >
            Weddings · Cultural Events · Celebrations
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7, duration: 0.4 }}
            style={{
              marginTop: 36,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                position: "relative",
                width: 200,
                height: 2,
                backgroundColor: "rgba(255,255,255,0.08)",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <motion.div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #D4AF37, #f0d060)",
                  borderRadius: 4,
                }}
              />
            </div>
            <span
              style={{
                fontSize: 11,
                color: "#6a6a7a",
                fontVariantNumeric: "tabular-nums",
                minWidth: 30,
              }}
            >
              {progress}%
            </span>
          </motion.div>

          {phase === "done" && (
            <>
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: "-100%" }}
                transition={{ duration: 0.9, ease: [0.83, 0, 0.17, 1], delay: 0.1 }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "50%",
                  backgroundColor: "#0B0B0F",
                  zIndex: 50,
                }}
              />
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: "100%" }}
                transition={{ duration: 0.9, ease: [0.83, 0, 0.17, 1], delay: 0.1 }}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "50%",
                  backgroundColor: "#0B0B0F",
                  zIndex: 50,
                }}
              />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}