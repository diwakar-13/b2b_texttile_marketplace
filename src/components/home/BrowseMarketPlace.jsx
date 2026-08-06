"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  ChevronDown,
  CheckCircle2,
  ArrowDown,
  Loader2,
  RotateCcw,
  Check,
  Ruler,
  Layers,
  Filter,
  X,
} from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useCart } from "@/context/CartContext";

const MATERIALS = [
  "All",
  "Cotton",
  "Linen",
  "Silk",
  "Denim",
  "Wool",
  "Sustainable",
];
const WIDTHS = ["All", "44-45 inches", "54-56 inches", "58-60 inches"];

function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#111114] p-3 shadow-2xs space-y-3 animate-pulse">
      <div className="h-40 w-full rounded-md bg-neutral-200 dark:bg-neutral-800" />
      <div className="space-y-2">
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
        <div className="flex justify-between">
          <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4" />
          <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export default function BrowseMarketplace() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [addedIds, setAddedIds] = useState([]);

  const { addToCart } = useCart();

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

  const {
    products,
    totalCount,
    isLoading,
    hasMore,
    isLoadingMore,
    loadMoreProducts,
    priceMax,
    setPriceMax,
    moqMax,
    setMoqMax,
    selectedMaterial,
    setSelectedMaterial,
    selectedWidth,
    setSelectedWidth,
    maxGsm,
    setMaxGsm,
    resetFilters,
  } = useMarketplace();

  const handleAddToCart = async (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingId(item.id);

    const success = await addToCart(item);

    setAddingId(null);
    if (success) {
      setAddedIds((prev) => [...prev, item.id]);
      setTimeout(() => {
        setAddedIds((prev) => prev.filter((id) => id !== item.id));
      }, 2000);
    }
  };

  const FilterContent = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
        <h3 className="font-bold text-neutral-900 dark:text-white">Filters</h3>
        <button
          onClick={resetFilters}
          className="text-[13px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" /> Clear all
        </button>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-500" /> Fabric Material
        </label>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {MATERIALS.map((mat) => (
            <button
              key={mat}
              onClick={() => setSelectedMaterial(mat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                selectedMaterial === mat
                  ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-xs"
                  : "bg-neutral-50 dark:bg-neutral-800/60 border-black/5 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:border-neutral-300"
              }`}
            >
              {mat}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2 pt-3 border-t border-black/5 dark:border-white/5">
        <div className="flex justify-between items-center text-sm font-bold text-neutral-700 dark:text-neutral-300">
          <span>Max Weight ({maxGsm} GSM)</span>
        </div>
        <input
          type="range"
          min="40"
          max="500"
          step="10"
          value={maxGsm}
          onChange={(e) => setMaxGsm(Number(e.target.value))}
          className="w-full accent-black dark:accent-white cursor-pointer"
        />
      </div>
      <div className="space-y-2 pt-3 border-t border-black/5 dark:border-white/5">
        <div className="flex justify-between items-center text-sm font-bold text-neutral-700 dark:text-neutral-300">
          <span>Max Price (₹{priceMax})</span>
        </div>
        <input
          type="range"
          min="100"
          max="2000"
          step="50"
          value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          className="w-full accent-black dark:accent-white cursor-pointer"
        />
      </div>
      <div className="space-y-2 pt-3 border-t border-black/5 dark:border-white/5">
        <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
          <Ruler className="w-3.5 h-3.5 text-indigo-500" /> Fabric Width
        </label>
        <select
          value={selectedWidth}
          onChange={(e) => setSelectedWidth(e.target.value)}
          className="w-full bg-neutral-50 dark:bg-neutral-800 border border-black/5 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer"
        >
          {WIDTHS.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2 pt-3 border-t border-black/5 dark:border-white/5">
        <div className="flex justify-between items-center text-sm font-bold text-neutral-700 dark:text-neutral-300">
          <span>Max MOQ ({moqMax}m)</span>
        </div>
        <input
          type="range"
          min="50"
          max="10000"
          step="50"
          value={moqMax}
          onChange={(e) => setMoqMax(Number(e.target.value))}
          className="w-full accent-black dark:accent-white cursor-pointer"
        />
      </div>
    </div>
  );

  return (
    <section className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 md:px-7 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
          Browse Marketplace
        </h2>
        <div className="flex items-center justify-between md:justify-end gap-3 text-sm">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-xs shadow-2xs cursor-pointer active:scale-95 transition-transform"
          >
            <Filter className="w-3.5 h-3.5" /> Filters
          </button>
          <span className="text-neutral-500 font-medium text-xs sm:text-sm">
            {totalCount} products loaded
          </span>
          <div className="flex items-center gap-2">
            <span className="text-neutral-500 font-semibold hidden sm:inline">
              Sort by:
            </span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#18181B] font-bold text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 cursor-pointer">
              Most relevant{" "}
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        <div className="hidden lg:block lg:col-span-3 self-start bg-white dark:bg-[#111114] p-5 rounded-2xl border border-black/5 dark:border-white/10 shadow-2xs z-10">
          <FilterContent />
        </div>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-xs bg-white dark:bg-[#111114] h-full p-5 overflow-y-auto space-y-4 shadow-2xl animate-in slide-in-from-right duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
                <span className="font-bold text-sm text-neutral-900 dark:text-white">
                  Marketplace Filters
                </span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterContent />
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-bold text-xs rounded-xl shadow-md cursor-pointer mt-4"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
        <div className="lg:col-span-9 space-y-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#111114] rounded-2xl border border-black/5 dark:border-white/10 space-y-3">
              <p className="text-sm font-bold text-neutral-500">
                No fabrics match your selected filters.
              </p>
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {products.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.id}`}
                  className="group relative rounded-md border border-black/5 dark:border-white/10 bg-white dark:bg-[#111114] p-3 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between cursor-pointer block"
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
                    </div>
                    <div className="pt-3 space-y-1">
                      <h3 className="font-bold text-sm text-neutral-900 dark:text-white truncate group-hover:text-indigo-600 transition-colors">
                        {item.title || item.name}
                      </h3>
                      <div className="flex items-center justify-between text-[12px] text-neutral-500 font-medium">
                        <span>GSM: {item.gsm}</span>
                        <span>{item.width}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm pt-1">
                        <span className="font-bold text-neutral-900 dark:text-white">
                          ₹{item.price}{" "}
                          <span className="text-[12px] font-normal text-neutral-500">
                            /meter
                          </span>
                        </span>
                        <span className="text-[10px] font-semibold text-neutral-500">
                          MOQ {item.moq}m
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-black/5 dark:border-white/5">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1 text-[13px] font-bold text-neutral-800 dark:text-neutral-200">
                        <span className="truncate">
                          {item.supplier ||
                            item.supplierName ||
                            "Verified Mill"}
                        </span>
                        <CheckCircle2 className="w-3 h-3 text-indigo-500 shrink-0" />
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                        <Check className="w-3 h-3 text-emerald-500" /> In Stock
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(e, item)}
                      disabled={addingId === item.id}
                      className={`p-1.5 rounded-xl transition-colors cursor-pointer z-10 shrink-0 ${
                        addedIds.includes(item.id)
                          ? "bg-emerald-600 text-white"
                          : "bg-neutral-100 dark:bg-neutral-800 hover:bg-indigo-600 hover:text-white text-neutral-800 dark:text-neutral-200"
                      }`}
                    >
                      {addingId === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : addedIds.includes(item.id) ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={loadMoreProducts}
                disabled={isLoadingMore}
                className="px-6 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#18181B] text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-2xs disabled:opacity-50 cursor-pointer"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />{" "}
                    Loading more fabrics...
                  </>
                ) : (
                  <>
                    Load more products <ArrowDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
