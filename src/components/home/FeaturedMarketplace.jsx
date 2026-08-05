"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { OfferCarousel } from "../ui/Textile-corousal";

// Skeleton Loader for Carousel Loading State
function FeaturedCarouselSkeleton() {
  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 md:px-7 py-6 space-y-5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-7 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-56" />
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-28" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#111114] p-3 space-y-3"
          >
            <div className="h-44 w-full rounded-xl bg-neutral-200 dark:bg-neutral-800" />
            <div className="space-y-2">
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
              <div className="flex justify-between">
                <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
                <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4" />
              </div>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OfferCarouselDemo() {
  const [featuredTextile, setFeaturedTextile] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllCategoryFeaturedProducts() {
      setLoading(true);
      try {
        // Multi-category DB fetch (Cotton, Denim, Silk, Linen etc.)
        const res = await axios.get("/api/products", {
          params: { limit: 12 }, // Higher limit to include all categories from DB
        });

        if (res.data.success && res.data.products) {
          // Normalize DB items into Carousel compatible format
          const formatted = res.data.products.map((item) => {
            // Material badge assignment
            let badgeTag = "Featured";
            if (item.material?.toLowerCase().includes("denim"))
              badgeTag = "Denim Premium";
            else if (item.material?.toLowerCase().includes("cotton"))
              badgeTag = "Bestseller";
            else if (item.material?.toLowerCase().includes("silk"))
              badgeTag = "Pure Silk";
            else if (item.material?.toLowerCase().includes("linen"))
              badgeTag = "Organic Linen";

            return {
              id: item.id,
              imageSrc:
                item.image ||
                item.imageUrl ||
                "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?q=80&w=600",
              title: item.title || item.name,
              gsm: item.gsm,
              price: `$${item.price}`,
              moq: item.moq,
              supplier: item.supplier || item.supplierName || "Verified Mill",
              rating: 4.8,
              reviewsCount: 120,
              badge: badgeTag,
            };
          });

          setFeaturedTextile(formatted);
        }
      } catch (error) {
        console.error(
          "Error fetching multi-category featured products:",
          error,
        );
      } finally {
        setLoading(false);
      }
    }

    fetchAllCategoryFeaturedProducts();
  }, []);

  if (loading) {
    return <FeaturedCarouselSkeleton />;
  }

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 md:px-7 py-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white tracking-tight">
          Featured in Marketplace
        </h2>
        <a
          href="/marketplace"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          View all products →
        </a>
      </div>

      <OfferCarousel offers={featuredTextile} />
    </div>
  );
}
