"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

function SupplierSkeleton() {
  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 md:px-7 py-6 space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-44" />
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-28" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-black/5 bg-white space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-neutral-200 shrink-0" />
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="h-3.5 bg-neutral-200 rounded w-full" />
                <div className="h-2.5 bg-neutral-200 rounded w-1/2" />
              </div>
            </div>
            <div className="h-3 bg-neutral-200 rounded w-2/3" />
            <div className="h-3 bg-neutral-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function VerifiedSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSuppliers() {
      setLoading(true);
      try {
        const res = await axios.get("/api/suppliers");
        if (res.data.success) {
          setSuppliers(res.data.suppliers);
        }
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSuppliers();
  }, []);

  if (loading) return <SupplierSkeleton />;

  if (suppliers.length === 0) return null;

  return (
    <section className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 md:px-7 py-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white tracking-tight">
          Verified Suppliers
        </h2>
        <Link
          href="/marketplace"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          View all suppliers →
        </Link>
      </div>

      {/* SUPPLIER CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {suppliers.map((sup) => (
          <Link
            key={sup.id}
            href={`/supplier/${sup.id}`}
            className="group relative p-5 rounded-2xl border border-black/5 bg-white shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between cursor-pointer block"
          >
            <div className="space-y-4">
              {/* TOP: LOGO & DETAILS */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-100 border border-black/5 shrink-0 flex items-center justify-center p-1">
                  <img
                    src={sup.avatar}
                    alt={sup.businessName}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                        sup.businessName,
                      )}`;
                    }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-sm text-neutral-900 truncate group-hover:text-indigo-600 transition-colors">
                    {sup.businessName}
                  </h3>
                  <p className="text-xs text-neutral-400 font-medium truncate">
                    {sup.country}
                  </p>
                </div>
              </div>

              {/* RATING */}
              <div className="flex items-center gap-1.5 text-xs font-black text-neutral-900 pt-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{sup.rating}</span>
                <span className="text-neutral-400 font-medium">
                  ({sup.reviewsCount})
                </span>
              </div>
            </div>

            {/* BOTTOM: PRODUCTS COUNT */}
            <div className="pt-3 border-t border-black/5 text-xs font-bold text-neutral-500">
              <span className="text-neutral-900 font-extrabold">
                {sup.productsCount
                  ? sup.productsCount.toLocaleString()
                  : "2,450"}
                +
              </span>{" "}
              Products
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
