"use client";

import React from "react";
import Link from "next/link";
import {
  FaXTwitter,
  FaMedium,
  FaLinkedinIn,
  FaFacebookF,
  FaTiktok,
} from "react-icons/fa6";
import { FiArrowRight } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full max-w-[1500px] mx-auto px-3 sm:px-6 md:px-7 py-4 font-sans">
      <div className="bg-white rounded-2xl border border-black/5 p-4 sm:p-6 shadow-2xs space-y-4">
        {/* TOP SECTION: LOGO + QUICK LINKS + NEWSLETTER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-black/5">
          {/* BRAND LOGO */}
          <Link
            href="/"
            className="text-lg font-black text-neutral-900 tracking-tight shrink-0"
          >
            Textil.
          </Link>

          {/* MINIMAL LINKS */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-neutral-600">
            <Link
              href="/marketplace"
              className="hover:text-neutral-900 transition-colors"
            >
              Marketplace
            </Link>
            <Link
              href="/supplier"
              className="hover:text-neutral-900 transition-colors"
            >
              Suppliers
            </Link>
            <Link
              href="/register?role=supplier"
              className="hover:text-neutral-900 transition-colors"
            >
              Become Supplier
            </Link>
            <Link href="#" className="hover:text-neutral-900 transition-colors">
              About Us
            </Link>
          </div>

          {/* COMPACT NEWSLETTER INPUT */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center gap-1.5 w-full md:w-auto"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full md:w-48 bg-neutral-50 border border-black/5 rounded-xl px-3 py-1.5 text-xs font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-black"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-[#4F46E5] text-white hover:bg-indigo-700 transition-colors shrink-0 cursor-pointer"
            >
              <FiArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* BOTTOM SECTION: SOCIALS + COPYRIGHT + LEGAL */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-semibold text-neutral-400">
          {/* SOCIAL ICONS */}
          <div className="flex items-center gap-2">
            <a
              href="/https://www.linkedin.com/in/diwakarpandey13/"
              className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-indigo-600 transition-colors"
            >
              <FaLinkedinIn className="w-2.5 h-2.5" />
            </a>
            <a
              href="/https://www.facebook.com/profile.php?id=100030056957980&rdid=VuVrnLqAwCW8w1I3&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1GAtirjFb7%2F#"
              className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-indigo-600 transition-colors"
            >
              <FaFacebookF className="w-2.5 h-2.5" />
            </a>
            <a
              href="/https://www.instagram.com/diwakar__007?igsh=NzltYTAxaHNkc2xu"
              className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-indigo-600 transition-colors"
            >
              <FaInstagram className="w-2.5 h-2.5" />
            </a>
          </div>

          {/* COPYRIGHT */}
          <p>© 2026 Textil. All rights reserved.</p>

          {/* LEGAL LINKS */}
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-neutral-900 transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-neutral-900 transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-neutral-900 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
