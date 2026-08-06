"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { login } from "@/action/auth/login";
import { signInWithGoogle } from "@/action/auth/google";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const res = await login(formData);

    if (!res.success) {
      setErrorMsg(res.message);
      setLoading(false);
    } else {
      router.push(res.redirectTo || "/buyer/dashboard");
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
        {/* LEFT FLOATING LOGIN CARD */}
        <div className="w-full max-w-md bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl space-y-6">
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
              Welcome back
            </h1>
            <p className="text-xs font-semibold text-neutral-500">
              Login to continue to your account
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {/* LOGIN FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-700">
                Email address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@company.com"
                className="w-full h-11 bg-neutral-50/80 border border-black/10 rounded-xl px-3.5 text-xs font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
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
                  className="w-full h-11 bg-neutral-50/80 border border-black/10 rounded-xl pl-3.5 pr-10 text-xs font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
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

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-600 font-semibold">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-black/20 accent-indigo-600 cursor-pointer"
                />
                Remember me
              </label>
              <Link
                href="#"
                className="font-bold text-indigo-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#4F46E5] text-white font-bold text-xs rounded-xl shadow-md hover:bg-indigo-700 transition-colors cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-black/10 w-full" />
            <span className="bg-white/95 px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider absolute">
              or
            </span>
          </div>

          {/* GOOGLE OAUTH */}
          <button
            type="button"
            onClick={async () => {
              const url = await signInWithGoogle();
              if (url) window.location.href = url;
            }}
            className="w-full h-11 bg-white border border-black/10 rounded-xl text-xs font-bold text-neutral-800 flex items-center justify-center gap-2.5 hover:bg-neutral-50 transition-colors shadow-2xs cursor-pointer"
          >
            <FcGoogle className="w-4 h-4" /> Continue with Google
          </button>

          <p className="text-center text-xs font-semibold text-neutral-500 pt-2">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-indigo-600 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>

        {/* RIGHT SIDE WELCOME MESSAGE (DESKTOP ONLY) */}
        {/* RIGHT SIDE WELCOME & TRUST HERO (DESKTOP ONLY) */}
        <div className="hidden md:flex flex-col justify-center max-w-xl text-white space-y-6 pl-6">
          {/* BADGE */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-inner w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold tracking-wide text-white">
              Next-Gen B2B Sourcing Platform
            </span>
          </div>

          {/* MAIN HEADING */}
          <div className="space-y-3">
            <h2 className="text-4xl sm:text-5xl font-black leading-[1.15] tracking-tight text-white drop-shadow-md">
              Discover Premium Fabrics & Direct Mill Suppliers.
            </h2>
            <p className="text-sm sm:text-base text-neutral-200 font-medium leading-relaxed drop-shadow-sm">
              Streamline your garment manufacturing procurement. Connect
              directly with verified textile mills, request custom swatches, and
              manage bulk orders effortlessly.
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
