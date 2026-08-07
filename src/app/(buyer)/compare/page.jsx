"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import axios from "axios";
import {
  ArrowLeftRight,
  ArrowLeft,
  Sparkles,
  Loader2,
  ShoppingBag,
  Scale,
  ChevronDown,
} from "lucide-react";

// 🎯 ULTRA-CLEAN PARSER: Strips ####, **, *, and renders beautiful UI cards
function FormattedComparisonOutput({ text }) {
  if (!text) return null;

  // Strip all markdown symbols completely (####, ###, **, *, etc.)
  const cleanRawText = text
    .replace(/#{1,6}\s?/g, "") // Remove ###
    .replace(/\*\*/g, "") // Remove **
    .replace(/\*/g, "•"); // Replace * with clean bullet

  const lines = cleanRawText.split("\n");

  return (
    <div className="space-y-3">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        // Check if line looks like a Header (starts with number like "1." or ends with ":")
        const isHeading =
          /^\d+\./.test(trimmed) ||
          (trimmed.endsWith(":") && trimmed.length < 60);

        if (isHeading) {
          return (
            <div
              key={idx}
              className="pt-2 pb-1 border-b border-neutral-200/80 font-black text-neutral-950 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              {trimmed.replace(/:$/, "")}
            </div>
          );
        }

        // Bullet line
        if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
          return (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-[#FBFBFC] border border-neutral-200/60 flex items-start gap-2.5 text-xs text-neutral-800 font-semibold"
            >
              <span className="text-amber-500 font-bold shrink-0 mt-0.5">
                •
              </span>
              <span>{trimmed.replace(/^[•-]\s*/, "")}</span>
            </div>
          );
        }

        // Regular paragraph text
        return (
          <p
            key={idx}
            className="text-xs sm:text-sm text-neutral-700 font-medium leading-relaxed"
          >
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

// 💀 FULL PAGE SHIMMER SKELETON
function ComparePageSkeleton() {
  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 space-y-8 animate-pulse">
      <div className="flex justify-between items-center border-b pb-6">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-neutral-200 rounded-md" />
          <div className="h-8 w-64 bg-neutral-200 rounded-xl" />
          <div className="h-4 w-80 bg-neutral-200 rounded-md" />
        </div>
        <div className="h-12 w-44 bg-neutral-200 rounded-2xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="p-6 bg-white rounded-3xl border space-y-5">
            <div className="flex justify-between">
              <div className="h-5 w-32 bg-neutral-200 rounded-full" />
              <div className="h-4 w-24 bg-neutral-200 rounded-md" />
            </div>
            <div className="h-11 w-full bg-neutral-200 rounded-2xl" />
            <div className="h-52 w-full bg-neutral-200 rounded-2xl" />
            <div className="grid grid-cols-2 gap-2">
              <div className="h-12 bg-neutral-200 rounded-xl" />
              <div className="h-12 bg-neutral-200 rounded-xl" />
              <div className="h-12 bg-neutral-200 rounded-xl" />
              <div className="h-12 bg-neutral-200 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompareContent() {
  const searchParams = useSearchParams();
  const baseProductId = searchParams.get("baseProduct");

  const [allProducts, setAllProducts] = useState([]);
  const [productA, setProductA] = useState(null);
  const [productB, setProductB] = useState(null);
  const [loadingBase, setLoadingBase] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [aiVerdict, setAiVerdict] = useState("");

  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await axios.get("/api/products");
        const prods = res.data?.products || [];
        setAllProducts(prods);

        if (baseProductId) {
          const base = prods.find(
            (p) => String(p.id) === String(baseProductId),
          );
          if (base) setProductA(base);
          else if (prods.length > 0) setProductA(prods[0]);
        } else if (prods.length > 0) {
          setProductA(prods[0]);
        }

        if (prods.length > 1) {
          const defaultB =
            prods.find((p) => String(p.id) !== String(baseProductId)) ||
            prods[1];
          setProductB(defaultB);
        }
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoadingBase(false);
      }
    }
    loadCatalog();
  }, [baseProductId]);

  const handleRunAiComparison = async () => {
    if (!productA || !productB) return;
    setComparing(true);
    setAiVerdict("");

    try {
      const res = await fetch("/api/ai/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productA, productB }),
      });

      const json = await res.json();
      if (json.success) {
        setAiVerdict(json.comparisonText);
      } else {
        setAiVerdict("Failed to generate comparison.");
      }
    } catch (err) {
      console.error(err);
      setAiVerdict("Unable to connect to AI engine.");
    } finally {
      setComparing(false);
    }
  };

  if (loadingBase) {
    return (
      <div className="min-h-screen bg-[#FAFBFD]">
        <Navbar />
        <ComparePageSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBFD] text-neutral-900 font-sans pb-20">
      <Navbar />

      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* BREADCRUMB & HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/60 pb-6">
          <div className="space-y-1">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-neutral-500 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight flex items-center gap-3">
              <Scale className="w-7 h-7 text-neutral-900" /> Fabric Spec
              Benchmarking
            </h1>
            <p className="text-xs md:text-sm font-semibold text-neutral-500">
              Side-by-side technical specification analysis & AI garment
              suitability verdict.
            </p>
          </div>

          <button
            onClick={handleRunAiComparison}
            disabled={comparing || !productA || !productB}
            className="self-start sm:self-auto px-6 py-3.5 rounded-2xl bg-neutral-950 text-white font-extrabold text-xs hover:bg-neutral-800 shadow-md transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
          >
            {comparing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                Analyzing Fabric Metrics...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" />
                Run AI Deep Compare
              </>
            )}
          </button>
        </div>

        {/* COMPARISON CARDS DUAL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* FABRIC A */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-2xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-neutral-950 text-white text-[10px] font-black uppercase tracking-wider">
                  Fabric A (Base Roll)
                </span>
                <span className="text-xs font-bold text-neutral-400">
                  Locked Selection
                </span>
              </div>

              <div className="relative">
                <select
                  value={productA?.id || ""}
                  onChange={(e) => {
                    const found = allProducts.find(
                      (p) => String(p.id) === e.target.value,
                    );
                    setProductA(found);
                  }}
                  className="w-full bg-[#FBFBFC] border border-neutral-200/80 rounded-2xl p-3.5 pr-10 font-bold text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 appearance-none cursor-pointer"
                >
                  {allProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name || p.title} ({p.gsm} GSM • ₹{p.price}/m)
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {productA && (
                <div className="space-y-4 pt-1">
                  <div className="h-52 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/80 relative">
                    <img
                      src={
                        productA.imageUrl ||
                        productA.image ||
                        "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=600"
                      }
                      alt={productA.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-black text-neutral-900 shadow-sm">
                      ₹{productA.price} / Meter
                    </div>
                  </div>

                  <div>
                    <h3 className="font-black text-base sm:text-lg text-neutral-950">
                      {productA.name || productA.title}
                    </h3>
                    <p className="text-xs font-semibold text-neutral-500 mt-0.5">
                      Material: {productA.material || "Cotton"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="p-3 rounded-2xl bg-[#FBFBFC] border border-neutral-200/60">
                      <span className="text-[10px] font-extrabold text-neutral-400 block uppercase tracking-wider">
                        GSM Weight
                      </span>
                      <span className="font-extrabold text-neutral-900 text-sm">
                        {productA.gsm} GSM
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#FBFBFC] border border-neutral-200/60">
                      <span className="text-[10px] font-extrabold text-neutral-400 block uppercase tracking-wider">
                        MOQ Requirement
                      </span>
                      <span className="font-extrabold text-neutral-900 text-sm">
                        {productA.moq || 500} m
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href={`/product/${productA?.id}`}
              className="w-full py-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 font-bold text-xs text-neutral-800 transition-colors flex items-center justify-center gap-1.5 mt-4"
            >
              View Full Product Roll <ShoppingBag className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* FABRIC B */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-2xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                  Fabric B (Target Spec)
                </span>
                <span className="text-xs font-bold text-amber-600">
                  Choose to Compare
                </span>
              </div>

              <div className="relative">
                <select
                  value={productB?.id || ""}
                  onChange={(e) => {
                    const found = allProducts.find(
                      (p) => String(p.id) === e.target.value,
                    );
                    setProductB(found);
                  }}
                  className="w-full bg-[#FBFBFC] border border-neutral-200/80 rounded-2xl p-3.5 pr-10 font-bold text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 appearance-none cursor-pointer"
                >
                  {allProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name || p.title} ({p.gsm} GSM • ₹{p.price}/m)
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {productB && (
                <div className="space-y-4 pt-1">
                  <div className="h-52 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/80 relative">
                    <img
                      src={
                        productB.imageUrl ||
                        productB.image ||
                        "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=600"
                      }
                      alt={productB.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-black text-neutral-900 shadow-sm">
                      ₹{productB.price} / Meter
                    </div>
                  </div>

                  <div>
                    <h3 className="font-black text-base sm:text-lg text-neutral-950">
                      {productB.name || productB.title}
                    </h3>
                    <p className="text-xs font-semibold text-neutral-500 mt-0.5">
                      Material: {productB.material || "Cotton"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="p-3 rounded-2xl bg-[#FBFBFC] border border-neutral-200/60">
                      <span className="text-[10px] font-extrabold text-neutral-400 block uppercase tracking-wider">
                        GSM Weight
                      </span>
                      <span className="font-extrabold text-neutral-900 text-sm">
                        {productB.gsm} GSM
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#FBFBFC] border border-neutral-200/60">
                      <span className="text-[10px] font-extrabold text-neutral-400 block uppercase tracking-wider">
                        MOQ Requirement
                      </span>
                      <span className="font-extrabold text-neutral-900 text-sm">
                        {productB.moq || 500} m
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href={`/product/${productB?.id}`}
              className="w-full py-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 font-bold text-xs text-neutral-800 transition-colors flex items-center justify-center gap-1.5 mt-4"
            >
              View Full Product Roll <ShoppingBag className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* AI VERDICT OUTPUT CARD */}
        {comparing ? (
          <div className="bg-white p-8 rounded-3xl border space-y-3 animate-pulse">
            <div className="h-6 w-64 bg-neutral-200 rounded-lg" />
            <div className="h-14 w-full bg-neutral-100 rounded-2xl" />
            <div className="h-14 w-full bg-neutral-100 rounded-2xl" />
          </div>
        ) : (
          aiVerdict && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 space-y-5 shadow-2xs">
              <div className="flex items-center gap-2.5 border-b pb-4">
                <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-neutral-950">
                    AI Technical Comparison & Verdict
                  </h2>
                  <p className="text-xs font-semibold text-neutral-500">
                    Automated technical breakdown & suitability analysis
                  </p>
                </div>
              </div>

              {/* 🎯 PARSED CLEAN VERDICT CARDS */}
              <FormattedComparisonOutput text={aiVerdict} />
            </div>
          )
        )}
      </main>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<ComparePageSkeleton />}>
      <CompareContent />
    </Suspense>
  );
}
