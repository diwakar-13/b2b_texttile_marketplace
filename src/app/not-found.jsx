"use client";

import React from "react";
import Link from "next/link";
import {
  Scissors,
  ArrowLeft,
  Store,
  Compass,
  Search,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFBFD] dark:bg-[#09090B] text-neutral-900 dark:text-white font-sans flex flex-col justify-between p-4 sm:p-6 md:p-10 relative overflow-hidden select-none">
      
      {/* 🔮 BACKGROUND DECORATIVE GLOWS */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP BRAND BAR */}
      <header className="max-w-[1400px] w-full mx-auto flex items-center justify-between relative z-10">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-lg font-black tracking-tight group"
        >
          <div className="size-9 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-black text-sm shadow-md group-hover:scale-105 transition-transform">
            T
          </div>
          <span className="text-xl font-black">Textil.</span>
        </Link>

        <Link
          href="/marketplace"
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#18181B]/80 text-xs font-extrabold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shadow-2xs backdrop-blur-md"
        >
          <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Explore Marketplace</span>
        </Link>
      </header>

      {/* MAIN HERO CONTENT */}
      <main className="max-w-3xl w-full mx-auto text-center space-y-8 my-auto relative z-10 py-12">
        
        {/* 404 FABRIC CUT ANIMATION BADGE */}
        <div className="relative inline-flex items-center justify-center">
          <span className="text-8xl sm:text-[140px] md:text-[180px] font-black tracking-tighter text-neutral-200 dark:text-neutral-800/60 leading-none select-none">
            404
          </span>
          
          {/* CUT THREAD EMBLEM OVERLAY */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="px-5 py-2.5 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 border border-neutral-800 dark:border-neutral-200 shadow-2xl flex items-center gap-3 animate-bounce">
              <Scissors className="w-5 h-5 text-indigo-400 dark:text-indigo-600 -rotate-45" />
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider">
                Fabric Weave Cut
              </span>
            </div>
          </div>
        </div>

        {/* HEADLINE & DESCRIPTION */}
        <div className="space-y-3 max-w-lg mx-auto">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-neutral-950 dark:text-white">
            This Roll is Out of the Loom!
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-neutral-500 dark:text-neutral-400 leading-relaxed">
            The page or textile specification you are looking for has been moved, archived, or never existed in our mill database.
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/marketplace"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-extrabold text-xs shadow-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Store className="w-4 h-4" />
            <span>Browse Marketplace</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#18181B] font-extrabold text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back Previous Page</span>
          </button>
        </div>

        {/* QUICK LINK PILLS */}
        <div className="pt-8 border-t border-black/5 dark:border-white/5 flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-neutral-500">
          <span className="text-neutral-400">Quick Navigation:</span>
          <Link
            href="/supplier/dashboard"
            className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 hover:text-neutral-950 dark:hover:text-white transition-colors"
          >
            Supplier Workspace
          </Link>
          <Link
            href="/cart"
            className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 hover:text-neutral-950 dark:hover:text-white transition-colors"
          >
            My Cart
          </Link>
          <Link
            href="/orders"
            className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 hover:text-neutral-950 dark:hover:text-white transition-colors"
          >
            Track Orders
          </Link>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="max-w-[1400px] w-full mx-auto text-center relative z-10">
        <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500">
          &copy; {new Date().getFullYear()} Textil B2B Marketplace Platform • All rights reserved.
        </p>
      </footer>

    </div>
  );
}