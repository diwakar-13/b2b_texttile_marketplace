"use client";

import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { InteractiveHoverButton } from "../ui/interactive-hover-button";

export default function SearchHero() {
  return (
    <section className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 md:px-7 pt-4 md:pt-6 pb-8 md:pb-12 font-sans">
      <div className="relative w-full min-h-[480px] lg:min-h-[520px] rounded-[32px] overflow-hidden flex flex-col justify-center items-center p-6 sm:p-10 md:p-14 shadow-sm border border-black/5 text-center">
        {/* BACKGROUND IMAGE WITH DARK OVERLAY */}
        <div className="absolute inset-0 w-full h-full z-0">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="/hero.jpg"
            alt="Textile Factory Background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
        </div>

        {/* MAIN HERO CONTENT WITH FRAMER MOTION ANIMATIONS */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                staggerChildren: 0.2,
                duration: 0.6,
                ease: "easeOut",
              },
            },
          }}
          className="relative z-10 max-w-4xl space-y-6 mx-auto flex flex-col items-center"
        >
          {/* BADGE ANIMATION */}
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: { opacity: 1, scale: 1 },
            }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-extrabold uppercase tracking-wider shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>AI-Powered B2B Sourcing Platform</span>
          </motion.div>

          {/* HEADLINE ANIMATION */}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15] drop-shadow-md"
          >
            Source Verified Bulk Fabrics <br />
            <span className="bg-gradient-to-r from-amber-200 via-indigo-200 to-white bg-clip-text text-transparent">
              Directly From Top Textile Mills
            </span>
          </motion.h1>

          {/* SUBTITLE ANIMATION */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-sm sm:text-base md:text-lg font-medium text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-xs"
          >
            Instant GSM matching, live mill directory, and seamless bulk fabric
            procurement for global buyers and suppliers.
          </motion.p>

          {/* MAGIC UI BUTTON WITH HOVER & ENTRANCE ANIMATION */}
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.9, y: 15 },
              visible: { opacity: 1, scale: 1, y: 0 },
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="pt-4 flex items-center justify-center"
          >
            <Link href="/marketplace">
              <InteractiveHoverButton className="bg-white text-black text-xs sm:text-sm font-black py-3 px-8 rounded-full border border-white/40 shadow-2xl transition-all">
                Browse Marketplace Catalog
              </InteractiveHoverButton>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
