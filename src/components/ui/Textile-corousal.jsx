"use client";

import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  CheckCircle2,
  Plus,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { forwardRef, useRef } from "react";

const OfferCard = forwardRef(({ offer, onClick }, ref) => (
  <motion.div
    ref={ref}
    onClick={() => onClick && onClick(offer)}
    className="relative flex-shrink-0 w-[280px] sm:w-[300px] bg-white dark:bg-[#111114] border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all snap-start cursor-pointer group"
    whileHover={{ y: -3 }}
    transition={{ duration: 0.15, ease: "easeOut" }} // Fast snappy animation
  >
    {/* Image & Top Controls */}
    <div className="relative w-full h-[180px] overflow-hidden bg-gray-100">
      <img
        src={offer.imageSrc}
        alt={offer.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {offer.badge && (
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-[10px] font-bold tracking-wide shadow-xs flex items-center gap-1">
          📍 {offer.badge}
        </span>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="absolute top-3 right-3 size-8 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md flex items-center justify-center text-gray-700 dark:text-gray-200 hover:text-red-500 transition-colors shadow-xs"
      >
        <Heart className="w-4 h-4" />
      </button>
    </div>

    {/* Content Area */}
    <div className="p-4 space-y-3">
      <div>
        <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {offer.title}
        </h3>
        <p className="text-[11px] font-medium text-gray-400 mt-0.5">
          GSM: {offer.gsm}
        </p>
      </div>

      <div className="flex items-baseline justify-between pt-1">
        <div>
          <span className="text-base font-bold text-gray-900 dark:text-white">
            {offer.price}
          </span>
          <span className="text-[10px] font-normal text-gray-400 ml-1">
            / meter
          </span>
        </div>

        <span className="text-[10px] font-medium text-gray-400">
          MOQ {offer.moq} meters
        </span>
      </div>

      <div className="pt-2 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
              {offer.supplier}
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 fill-blue-600 text-white" />
          </div>

          <div className="flex items-center gap-1 text-[11px] text-gray-500">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-bold text-gray-700 dark:text-gray-300">
              {offer.rating}
            </span>
            <span className="text-gray-400">({offer.reviewsCount})</span>
          </div>
        </div>

        <button
          type="button"
          className="size-8 rounded-full bg-gray-50 dark:bg-neutral-800 hover:bg-indigo-600 hover:text-white border border-gray-200 dark:border-neutral-700 flex items-center justify-center text-gray-800 dark:text-gray-200 transition-all active:scale-90"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  </motion.div>
));

OfferCard.displayName = "OfferCard";

const OfferCarousel = forwardRef(
  ({ offers, onItemClick, className, ...props }, ref) => {
    const scrollContainerRef = useRef(null);

    const scroll = (direction) => {
      if (scrollContainerRef.current) {
        const { current } = scrollContainerRef;
        const scrollAmount = current.clientWidth * 0.75;
        current.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
      }
    };

    return (
      <div
        ref={ref}
        className={cn("relative w-full group/carousel", className)}
        {...props}
      >
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-30 size-9 rounded-full bg-white dark:bg-[#18181B] border border-black/10 dark:border-white/10 shadow-md flex items-center justify-center text-gray-700 dark:text-gray-200 transition-all hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto py-2 px-1 [scrollbar-width:none] snap-x snap-mandatory scroll-smooth"
        >
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} onClick={onItemClick} />
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-30 size-9 rounded-full bg-white dark:bg-[#18181B] border border-black/10 dark:border-white/10 shadow-md flex items-center justify-center text-gray-700 dark:text-gray-200 transition-all hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  },
);

OfferCarousel.displayName = "OfferCarousel";

export { OfferCarousel, OfferCard };
