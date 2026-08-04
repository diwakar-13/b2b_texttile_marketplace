"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Menu,
  X,
  Building2,
  PhoneCall,
  Store,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { searchQuery, setSearchQuery, products } = useMarketplace();
  const searchRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Enter Key press in Search -> Redirects to Marketplace Filtered Route
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      router.push(
        `/marketplace?category=${encodeURIComponent(searchQuery.trim())}`,
      );
    }
  };

  return (
    <header className="sticky top-2 sm:top-4 z-50 w-full max-w-[1500px] mx-auto px-2 sm:px-6 md:px-7">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="h-14 sm:h-16 px-3 sm:px-6 rounded-full bg-white/95 backdrop-blur-md border border-black/10 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex items-center justify-between gap-2 relative"
      >
        {/* LEFT: BRAND LOGO */}
        <div className="flex items-center gap-3 sm:gap-8 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-base sm:text-lg tracking-tight"
          >
            <span className="size-7 sm:size-8 rounded-xl bg-[#111111] text-white flex items-center justify-center font-extrabold text-xs sm:text-sm shadow-xs">
              T
            </span>
            <span className="text-[#111111] font-extrabold hidden sm:inline">
              Textil.
            </span>
          </Link>

          <div className="hidden lg:flex text-sm items-center gap-1 font-semibold text-neutral-600">
            <Link
              href="/marketplace"
              className="px-3 py-1.5 rounded-full hover:bg-neutral-100 text-neutral-800 transition-colors"
            >
              Marketplace
            </Link>
            <Link
              href="#contact"
              className="px-3 py-1.5 rounded-full hover:bg-neutral-100 text-neutral-800 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* CENTER: SEARCH FORM */}
        <div
          ref={searchRef}
          className="flex-1 max-w-full sm:max-w-md mx-1 sm:mx-4 relative"
        >
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center w-full"
          >
            <Search className="absolute left-3.5 w-4 h-4 text-neutral-400 z-10 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
              }}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search fabrics, GSM, press Enter..."
              className="w-full h-9 sm:h-10 pl-9 pr-8 rounded-full bg-[#F4F4F2] text-xs font-semibold text-neutral-900 placeholder:text-neutral-400 border border-black/5 focus:border-indigo-500/40 focus:bg-white focus:outline-none transition-all"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-xs font-bold text-neutral-400 hover:text-black p-1"
              >
                ✕
              </button>
            )}
          </form>

          {/* FLOATING DROPDOWN FOR SPECIFIC PRODUCT TAP */}
          <AnimatePresence>
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-x-3 top-16 sm:absolute sm:top-12 sm:inset-x-auto sm:left-0 sm:right-0 bg-white border border-black/10 rounded-md shadow-2xl p-3 z-50 space-y-2 max-h-[380px] overflow-y-auto min-w-[280px]"
              >
                <div className="flex items-center justify-between px-2 pb-1.5 border-b border-black/5">
                  <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">
                    Quick Matches ({products.length})
                  </span>
                  <button
                    onClick={handleSearchSubmit}
                    className="text-[10px] font-bold text-indigo-600 hover:underline"
                  >
                    View All in Marketplace →
                  </button>
                </div>

                {products.length === 0 ? (
                  <div className="p-6 text-center space-y-1">
                    <p className="text-xs font-bold text-neutral-700">
                      No fabrics found
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      Press Enter to search entire catalog
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5 pt-1">
                    {products.slice(0, 6).map((item) => (
                      <Link
                        key={item.id}
                        href={`/product/${item.id}`}
                        onClick={() => setIsSearchFocused(false)}
                        className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-black/5 transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-black/5"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-neutral-900 group-hover:text-indigo-600 truncate">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-medium">
                              <span className="bg-neutral-100 px-1.5 py-0.2 rounded font-bold text-neutral-600">
                                {item.gsm} GSM
                              </span>
                              <span>•</span>
                              <span className="truncate">{item.supplier}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-neutral-900 block">
                            ₹{item.price}
                          </span>
                          <span className="text-[9px] text-neutral-400">
                            /meter
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <Link
            href="/register?role=supplier"
            className="text-sm font-semibold text-neutral-600 hover:text-indigo-600 transition-colors px-2"
          >
            Become a Supplier
          </Link>

          <Link
            href="/login"
            className="text-sm font-bold px-5 py-2 rounded-full bg-[#111111] text-white shadow-xs hover:bg-neutral-800 transition-colors"
          >
            Login
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex items-center sm:hidden shrink-0">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-full bg-[#F4F4F2] text-neutral-800"
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </motion.nav>
    </header>
  );
}
