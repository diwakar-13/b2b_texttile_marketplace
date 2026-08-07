"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { register } from "@/action/auth/register";
import { signInWithGoogle } from "@/action/auth/google";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      setLoading(false);
      return;
    }

    const res = await register(formData);

    if (!res.success) {
      setErrorMsg(res.message);
      setLoading(false);
    } else {
      router.push("/complete-profile");
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-between p-4 sm:p-8 md:p-12 font-sans overflow-hidden">
      {/* 1. FULL SCREEN BACKGROUND IMAGE */}
      <Image
        src="/hero.jpg"
        alt="B2B Textile Background"
        fill
        priority
        quality={95}
        className="object-cover object-center z-0"
      />

      {/* 2. GRADIENT OVERLAY (LEFT LIGHT, RIGHT DARK/READABLE) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/70 z-10" />

      {/* 3. MAIN CONTENT WRAPPER */}
      <div className="relative z-20 w-full max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* LEFT FLOATING REGISTER CARD */}
        <div className="w-full max-w-md bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl space-y-5">
          {/* BRAND LOGO */}
          <Link
            href="/"
            className="text-2xl font-black text-neutral-900 tracking-tight block"
          >
            Textil.
          </Link>

          {/* HEADER */}
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
              Create your account
            </h1>
            <p className="text-xs font-semibold text-neutral-500">
              Join thousands of textile businesses
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {/* REGISTER FORM */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-700">
                Full name
              </label>
              <input
                type="text"
                name="fullName"
                required
                placeholder="Your full name"
                className="w-full h-10 bg-neutral-50/80 border border-black/10 rounded-xl px-3.5 text-xs font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-700">
                Email address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@company.com"
                className="w-full h-10 bg-neutral-50/80 border border-black/10 rounded-xl px-3.5 text-xs font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full h-10 bg-neutral-50/80 border border-black/10 rounded-xl pl-3.5 pr-10 text-xs font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-4 h-4" />
                  ) : (
                    <FiEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-700">
                Confirm password
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="••••••••"
                className="w-full h-10 bg-neutral-50/80 border border-black/10 rounded-xl px-3.5 text-xs font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                required
                className="w-4 h-4 rounded border-black/20 accent-indigo-600 cursor-pointer mt-0.5"
              />
              <span className="text-[11px] font-semibold text-neutral-500 leading-tight">
                I agree to the{" "}
                <Link
                  href="#"
                  className="font-bold text-indigo-600 hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="#"
                  className="font-bold text-indigo-600 hover:underline"
                >
                  Privacy Policy
                </Link>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#4F46E5] text-white font-bold text-xs rounded-xl shadow-md hover:bg-indigo-700 transition-colors cursor-pointer disabled:opacity-50 mt-1"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-black/10 w-full" />
            <span className="bg-white/95 px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider absolute">
              or
            </span>
          </div>

          {/* GOOGLE OAUTH */}
          {/* <button
            type="button"
            onClick={async () => {
              const url = await signInWithGoogle();
              if (url) window.location.href = url;
            }}
            className="w-full h-10 bg-white border border-black/10 rounded-xl text-xs font-bold text-neutral-800 flex items-center justify-center gap-2.5 hover:bg-neutral-50 transition-colors shadow-2xs cursor-pointer"
          >
            <FcGoogle className="w-4 h-4" /> Continue with Google
          </button> */}

          <p className="text-center text-xs font-semibold text-neutral-500 pt-1">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-indigo-600 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>

        {/* RIGHT SIDE WELCOME & TRUST HERO (DESKTOP ONLY) */}
        <div className="hidden md:flex flex-col justify-center max-w-xl text-white space-y-6 pl-6">
          {/* BADGE */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-inner w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold tracking-wide text-white">
              Join the B2B Textile Revolution
            </span>
          </div>

          {/* MAIN HEADING */}
          <div className="space-y-3">
            <h2 className="text-4xl sm:text-5xl font-black leading-[1.15] tracking-tight text-white drop-shadow-md">
              Scale Your Fabric Business Worldwide.
            </h2>
            <p className="text-sm sm:text-base text-neutral-200 font-medium leading-relaxed drop-shadow-sm">
              Connect with thousands of verified garment manufacturers and
              textile suppliers. Source premium fabrics or list your mill
              inventory with full transparency.
            </p>
          </div>

          {/* STATS & METRICS GRID */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/15">
            <div>
              <h3 className="text-2xl font-black text-white">500+</h3>
              <p className="text-[11px] font-semibold text-neutral-300">
                Verified Mills
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">100k+</h3>
              <p className="text-[11px] font-semibold text-neutral-300">
                Fabrics Catalog
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">100%</h3>
              <p className="text-[11px] font-semibold text-neutral-300">
                Trade Assured
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
