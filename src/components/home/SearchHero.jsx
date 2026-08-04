"use client";

import React from "react";
import { Search, ArrowRight, ArrowUpRight } from "lucide-react";

export default function SearchHero() {
  const trendingTags = ["Cotton", "Organic Cotton", "Silk", "Linen", "Denim"];

  return (
    <section className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 md:px-7 pt-4 md:pt-6 pb-8 md:pb-12">
      {/* MAIN HERO CONTAINER (PURE CONTAINER ME HERO.JPG BACKGROUND MEIN HAI) */}
      <div className="relative w-full min-h-[460px] lg:min-h-[520px] rounded-[32px] overflow-hidden flex items-center p-6 sm:p-10 md:p-12 shadow-sm border border-black/5">
        {/* BACKGROUND IMAGE (FULL COVER) */}
        <div className="absolute inset-0 w-full h-full z-0">
         
          <img
            src="/hero.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* OVERLAY FLOATING SEARCH CARD (IMAGE KE OOPER FLOAT KAR RAHA HAI) */}
        <div className="relative z-10 w-full max-w-[480px] md:max-w-[600px] bg-white/90 dark:bg-[#111114]/90 backdrop-blur-md p-6 sm:p-8 rounded-[28px] shadow-[0_15px_35px_rgba(0,0,0,0.06)] border border-white/60 dark:border-white/10 space-y-6">
          {/* Main Search Input */}
          <div className="relative flex items-center bg-[#F7F7F5] dark:bg-[#18181B] rounded-full p-2 border border-black/5 dark:border-white/10">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 ml-3 shrink-0" />
            <input
              type="text"
              placeholder="Search fabrics, GSM, MOQ, supplier..."
              className="w-full bg-transparent px-3 text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none"
            />
            <button className="size-10 sm:size-11 rounded-full bg-[#6366F1] hover:bg-indigo-600 text-white flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-md">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Trending Searches */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase">
              Trending searches
            </p>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-4 py-2 rounded-full bg-[#F4F4F2] dark:bg-[#27272A] hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border border-black/5 dark:border-white/10 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {tag} <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
