"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, CheckCircle2, Plus, ArrowRight } from "lucide-react";
import axios from "axios";

// Skeleton for Recommended Cards
function RecommendedSkeleton() {
  return (
    <div className="space-y-4 pt-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="h-6 bg-neutral-200 rounded w-48" />
          <div className="h-3 bg-neutral-200 rounded w-32" />
        </div>
        <div className="h-4 bg-neutral-200 rounded w-24" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-black/5 bg-white p-3 space-y-3"
          >
            <div className="h-40 w-full rounded-xl bg-neutral-200" />
            <div className="space-y-2">
              <div className="h-4 bg-neutral-200 rounded w-3/4" />
              <div className="flex justify-between">
                <div className="h-3 bg-neutral-200 rounded w-1/3" />
                <div className="h-3 bg-neutral-200 rounded w-1/4" />
              </div>
              <div className="h-4 bg-neutral-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RecommendedProducts({ material, currentProductId }) {
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommended() {
      if (!material) return;
      setLoading(true);
      try {
        const res = await axios.get("/api/products", {
          params: { category: material, limit: 6 },
        });

        if (res.data.success && res.data.products) {
          // Current product ko exclude karke top 4 recommendations set karein
          const filtered = res.data.products.filter(
            (item) => item.id !== currentProductId,
          );
          setRecommended(filtered.slice(0, 4));
        }
      } catch (err) {
        console.error("Error loading recommendations:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommended();
  }, [material, currentProductId]);

  if (loading) return <RecommendedSkeleton />;

  if (recommended.length === 0) return null;

  return (
    <div className="space-y-6 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold  text-neutral-900">
            Recommended Fabrics
          </h3>
          <p className="text-sm mt-2 text-neutral-500 font-medium">
            Similar {material} textiles from top verified mills
          </p>
        </div>

        <Link
          href="/marketplace"
          className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1"
        >
          View Marketplace <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommended.map((item) => (
          <Link
            key={item.id}
            href={`/product/${item.id}`}
            className="group relative rounded-md border border-black/5 bg-white p-3 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between cursor-pointer block"
          >
            <div>
              <div className="relative h-40 w-full rounded-md overflow-hidden bg-neutral-100">
                <img
                  src={
                    item.image ||
                    "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?q=80&w=600"
                  }
                  alt={item.title || item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?q=80&w=600";
                  }}
                />
                {/* <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 backdrop-blur-xs text-neutral-600 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5" />
                </button> */}
              </div>

              <div className="pt-3 space-y-1">
                <h4 className="font-bold text-sm text-neutral-900 truncate group-hover:text-indigo-600 transition-colors">
                  {item.title || item.name}
                </h4>
                <div className="flex items-center justify-between text-[12px] text-neutral-500 font-medium">
                  <span>GSM: {item.gsm}</span>
                  <span>{item.width}</span>
                </div>

                <div className="flex items-center justify-between text-sm pt-1">
                  <span className="font-bold text-neutral-900">
                    ₹{item.price}{" "}
                    <span className="text-[12px] font-normal text-neutral-500">
                      /meter
                    </span>
                  </span>
                  <span className="text-[11px] font-semibold text-neutral-500">
                    MOQ {item.moq}m
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 mt-2 border-t border-black/5">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-[12px] font-bold text-neutral-800">
                  <span className="truncate">
                    {item.supplier || item.supplierName || "Verified Mill"}
                  </span>
                  <CheckCircle2 className="w-3 h-3 text-indigo-500 shrink-0" />
                </div>
              </div>

              <div className="p-1.5 rounded-xl bg-neutral-100 text-neutral-800 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Plus className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
