"use client";

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import {
  Star,
  Search,
  RotateCcw,
  Building2,
  Globe2,
  Layers,
  CheckCircle2,
  Filter,
  X,
} from "lucide-react";
import axios from "axios";

const BUSINESS_TYPES = ["All", "Manufacturer", "Exporter", "Weaver", "Mill"];
const FABRICS = ["All", "Cotton", "Silk", "Denim", "Linen", "Wool"];
const COUNTRIES = ["All", "India", "Turkey", "Bangladesh", "China"];

function SupplierCardSkeleton() {
  return (
    <div className="p-5 rounded-md border border-black/5 bg-white space-y-4 animate-pulse shadow-2xs">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-neutral-200 shrink-0" />
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="h-3.5 bg-neutral-200 rounded w-full" />
          <div className="h-2.5 bg-neutral-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // PREVENT BACKGROUND BODY SCROLL WHEN MOBILE DRAWER IS OPEN
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileFilterOpen]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedFabric, setSelectedFabric] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [maxMoq, setMaxMoq] = useState(5000);

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/suppliers", {
        params: {
          search: searchQuery || undefined,
          type: selectedType !== "All" ? selectedType : undefined,
          fabric: selectedFabric !== "All" ? selectedFabric : undefined,
          country: selectedCountry !== "All" ? selectedCountry : undefined,
          maxMoq: maxMoq || undefined,
        },
      });

      if (res.data.success) {
        setSuppliers(res.data.suppliers);
      }
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedType, selectedFabric, selectedCountry, maxMoq]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedType("All");
    setSelectedFabric("All");
    setSelectedCountry("All");
    setMaxMoq(5000);
  };

  const SupplierFilterContent = () => (
    <div className="space-y-5 ">
      <div className="flex items-center justify-between pb-3 border-b border-black/5">
        <h3 className="font-bold text-sm md:text-lg text-neutral-900">
          Supplier Filters
        </h3>
        <button
          onClick={resetFilters}
          className="text-[12px] font-semibold text-black flex items-center gap-1 hover:underline cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" /> Clear all
        </button>
      </div>

      <div className="space-y-2 pt-2">
        <label className="text-sm font-bold text-neutral-700 flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-black" /> Business Type
        </label>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {BUSINESS_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                selectedType === type
                  ? "bg-black text-white border-black shadow-xs"
                  : "bg-neutral-50 border-black/5 text-neutral-600 hover:border-neutral-300"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 pt-3 border-t border-black/5">
        <label className="text-sm font-bold text-neutral-700 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-black" /> Fabrics Offered
        </label>
        <select
          value={selectedFabric}
          onChange={(e) => setSelectedFabric(e.target.value)}
          className="w-full bg-neutral-50 border border-black/5 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none cursor-pointer"
        >
          {FABRICS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2 pt-3 border-t border-black/5">
        <label className="text-sm font-bold text-neutral-700 flex items-center gap-1.5">
          <Globe2 className="w-3.5 h-3.5 text-black" /> Country / Region
        </label>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="w-full bg-neutral-50 border border-black/5 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none cursor-pointer"
        >
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2 pt-3 border-t border-black/5">
        <div className="flex justify-between items-center text-sm font-bold text-neutral-700">
          <span>Max MOQ ({maxMoq}m)</span>
        </div>
        <input
          type="range"
          min="100"
          max="10000"
          step="100"
          value={maxMoq}
          onChange={(e) => setMaxMoq(Number(e.target.value))}
          className="w-full accent-black cursor-pointer"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 font-sans">
      <Navbar />

      <main className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 md:px-7 py-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
              Verified Textile Suppliers
            </h1>
            <p className="text-sm text-neutral-500 font-semibold mt-1">
              Connect directly with verified textile mills, manufacturers &
              exporters
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-black text-white font-bold text-xs cursor-pointer shadow-2xs active:scale-95 transition-transform shrink-0"
            >
              <Filter className="w-3.5 h-3.5" /> Filters
            </button>

            <div className="relative flex-1 md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search supplier, mill, region..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-black/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black shadow-2xs"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
          <div className="hidden lg:block lg:col-span-3 self-start bg-white p-5 rounded-xl border border-black/5 shadow-2xs z-10">
            <SupplierFilterContent />
          </div>

          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-black/60 backdrop-blur-xs">
              <div className="w-full max-w-xs bg-white h-full p-5 overflow-y-auto space-y-4 shadow-2xl animate-in slide-in-from-right duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-black/5">
                  <span className="font-bold text-sm text-neutral-900">
                    Supplier Filters
                  </span>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 rounded-full hover:bg-neutral-100 text-neutral-500 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <SupplierFilterContent />

                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3 bg-black text-white font-bold text-xs rounded-xl shadow-md cursor-pointer mt-4"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          <div className="lg:col-span-9 space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <SupplierCardSkeleton key={i} />
                ))}
              </div>
            ) : suppliers.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-black/5 space-y-3">
                <p className="text-sm font-bold text-neutral-500">
                  No verified suppliers match your filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-black hover:underline cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {suppliers.map((sup) => (
                  <Link
                    key={sup.id}
                    href={`/supplier/${sup.id}`}
                    className="group relative p-5 rounded-md border border-black/5 bg-white shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between cursor-pointer block"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-100 border border-black/5 shrink-0 flex items-center justify-center">
                          <img
                            src={sup.avatar}
                            alt={sup.businessName}
                            className="w-full h-full object-contain rounded-full"
                            onError={(e) => {
                              e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                                sup.businessName,
                              )}`;
                            }}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <h3 className="font-bold text-sm md:text-lg text-neutral-900 group-hover:text-indigo-600 transition-colors">
                              {sup.businessName}
                            </h3>
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          </div>
                          <p className="text-sm text-neutral-500 font-medium truncate">
                            {sup.country}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-sm font-black text-neutral-900 py-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{sup.rating}</span>
                        <span className="text-neutral-400 font-medium">
                          ({sup.reviewsCount})
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-black/5 text-sm font-bold text-neutral-500 flex justify-between items-center">
                      <div>
                        <span className="text-neutral-900 font-bold">
                          {sup.productsCount
                            ? sup.productsCount.toLocaleString()
                            : "2,450"}
                          +
                        </span>{" "}
                        Products
                      </div>
                      <span className="text-[10px] md:text-[13px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        MOQ {sup.moq}m
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
