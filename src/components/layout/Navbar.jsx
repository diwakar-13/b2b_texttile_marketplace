"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Menu,
  X,
  Store,
  Briefcase,
  PhoneCall,
  ArrowRight,
  ShoppingCart,
  LogOut,
} from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getUserProfile } from "@/action/getUserProfile";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [imgError, setImgError] = useState(false); // 🎯 Broken image state protection

  const { searchQuery, setSearchQuery, products } = useMarketplace();
  const { itemCount } = useCart();
  const searchRef = useRef(null);
  const router = useRouter();
  const supabase = createClient();

  // 🎯 FETCH USER & USER PROFILE WITH ROLE
  useEffect(() => {
    async function fetchUserData() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (currentUser) {
        setUser(currentUser);
        const profile = await getUserProfile();
        if (profile) {
          setUserProfile(profile);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
    }

    fetchUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          const profile = await getUserProfile();
          if (profile) setUserProfile(profile);
        } else {
          setUser(null);
          setUserProfile(null);
        }
      },
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      setIsMobileMenuOpen(false);
      router.push(
        `/marketplace?category=${encodeURIComponent(searchQuery.trim())}`,
      );
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
    setIsMobileMenuOpen(false);
    window.location.href = "/";
  };

  // 🎯 CASE-INSENSITIVE ROUTE CHECK ("SUPPLIER" / "supplier")
  const getDashboardRoute = () => {
    const role = userProfile?.role?.toUpperCase();
    if (role === "SUPPLIER") {
      return "/supplier/dashboard";
    }
    return "/buyer/dashboard";
  };

  // Initial letter fallback logic
  const initialFallback =
    userProfile?.fullName?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "U";

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
              href="/supplier"
              className="px-3 py-1.5 rounded-full hover:bg-neutral-100 text-neutral-800 transition-colors"
            >
              Suppliers
            </Link>
            <Link
              href="/contact"
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
              placeholder="Search fabrics..."
              className="w-full h-9 sm:h-10 pl-9 pr-8 rounded-full bg-[#F4F4F2] text-xs font-semibold text-neutral-900 placeholder:text-neutral-400 border border-black/5 focus:border-black focus:bg-white focus:outline-none transition-all"
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

          {/* SEARCH DROPDOWN */}
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
                    className="text-[10px] font-bold text-black hover:underline"
                  >
                    View All →
                  </button>
                </div>
                {products.length === 0 ? (
                  <div className="p-6 text-center space-y-1">
                    <p className="text-xs font-bold text-neutral-700">
                      No fabrics found
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5 pt-1">
                    {products.slice(0, 6).map((item) => (
                      <Link
                        key={item.id}
                        href={`/product/${item.id}`}
                        onClick={() => setIsSearchFocused(false)}
                        className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-neutral-50 transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-black/5"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-neutral-800 group-hover:text-black truncate">
                              {item.title}
                            </h4>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT DESKTOP: CART & USER ACTIONS */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <Link
            href="/cart"
            className="relative p-2 rounded-full hover:bg-neutral-100 transition-colors text-neutral-800"
          >
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 size-4 bg-red-500 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          {!user ? (
            <>
              <Link
                href="/register?role=supplier"
                className="text-sm font-semibold text-neutral-600 hover:text-black px-3 py-1.5 rounded-full hover:bg-neutral-100 transition-colors"
              >
                Become a Supplier
              </Link>
              <Link
                href="/login"
                className="text-sm font-bold px-5 py-2 rounded-full bg-[#111111] text-white shadow-xs hover:bg-neutral-800 transition-colors"
              >
                Login
              </Link>
            </>
          ) : (
            <Link
              href={getDashboardRoute()}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-all border border-black/5 cursor-pointer"
            >
              {/* 🎯 SAFE AVATAR WITH BROKEN IMAGE PROTECTION */}
              <div className="size-7 rounded-full bg-black text-white flex items-center justify-center font-extrabold text-xs uppercase overflow-hidden shrink-0 border border-black/10">
                {userProfile?.avatar && !imgError ? (
                  <img
                    src={userProfile.avatar}
                    alt="Avatar"
                    onError={() => setImgError(true)}
                    className="size-full object-cover"
                  />
                ) : (
                  <span>{initialFallback}</span>
                )}
              </div>
              <span className="text-xs font-bold text-neutral-900 max-w-[110px] truncate">
                {userProfile?.fullName?.split(" ")[0] || "Account"}
              </span>
            </Link>
          )}
        </div>

        {/* MOBILE ACTIONS */}
        <div className="flex items-center sm:hidden shrink-0 gap-1.5">
          <Link href="/cart" className="relative p-1.5 text-neutral-800">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 size-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-full bg-[#F4F4F2] text-neutral-800 cursor-pointer"
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-16 left-0 right-0 bg-white border border-black/10 rounded-2xl shadow-xl p-4 sm:hidden z-50 space-y-3"
            >
              <div className="flex flex-col space-y-1">
                <Link
                  href="/marketplace"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 font-bold text-xs text-neutral-800"
                >
                  <span className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-black" /> Marketplace
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                </Link>
                <Link
                  href="/supplier"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 font-bold text-xs text-neutral-800"
                >
                  <span className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-black" /> Suppliers
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                </Link>
                <Link
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 font-bold text-xs text-neutral-800"
                >
                  <span className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-black" /> Contact Us
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                </Link>

                {user && (
                  <Link
                    href={getDashboardRoute()}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-100 font-bold text-xs text-neutral-900 mt-2"
                  >
                    <span className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-black text-white flex items-center justify-center font-bold text-[10px] uppercase overflow-hidden shrink-0">
                        {userProfile?.avatar && !imgError ? (
                          <img
                            src={userProfile.avatar}
                            alt="Avatar"
                            onError={() => setImgError(true)}
                            className="size-full object-cover"
                          />
                        ) : (
                          <span>{initialFallback}</span>
                        )}
                      </div>
                      My Profile (
                      {userProfile?.fullName?.split(" ")[0] || "Account"})
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-black" />
                  </Link>
                )}
              </div>

              {!user ? (
                <div className="pt-2 border-t border-black/5 flex flex-col gap-2">
                  <Link
                    href="/register?role=supplier"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl border border-black/10 text-xs font-bold text-neutral-800 hover:bg-neutral-50 transition-colors"
                  >
                    Become a Supplier
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl bg-[#111111] text-xs font-bold text-white shadow-xs"
                  >
                    Login
                  </Link>
                </div>
              ) : (
                <div className="pt-2 border-t border-black/5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 border border-rose-100 text-xs font-bold text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Logout Account
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}
