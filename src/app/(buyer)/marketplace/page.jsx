"use client";

import React, { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useMarketplace } from "@/context/MarketplaceContext";
import BrowseMarketplace from "@/components/home/BrowseMarketPlace";

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const { setSelectedMaterial } = useMarketplace();

  useEffect(() => {
    if (categoryParam) {
      const formattedCategory =
        categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
      setSelectedMaterial(formattedCategory);
    }
  }, [categoryParam, setSelectedMaterial]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="py-6">
        <BrowseMarketplace />
      </main>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-xs font-bold">
          Loading Marketplace...
        </div>
      }
    >
      <MarketplaceContent />
    </Suspense>
  );
}
