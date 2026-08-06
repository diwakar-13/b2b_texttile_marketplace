"use client";
import React, { useState, useEffect, useRef } from "react";
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
  AlertCircle,
  Image as ImageIcon,
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

const SORT_OPTIONS = [
  { id: "relevant", label: "Most relevant" },
  { id: "price_asc", label: "Price: Low to High" },
  { id: "price_desc", label: "Price: High to Low" },
  { id: "newest", label: "Newest Arrivals" },
];

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

  // Sort State & Dropdown Toggle
  const [selectedSort, setSelectedSort] = useState("relevant");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef(null);

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

  // Outside click listener for sort dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target)
      ) {
        setIsSortDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // 🎯 WORKING SORTING LOGIC
  const sortedProducts = React.useMemo(() => {
    if (!products) return [];
    const list = [...products];

    switch (selectedSort) {
      case "price_asc":
        return list.sort(
          (a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0),
        );
      case "price_desc":
        return list.sort(
          (a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0),
        );
      case "newest":
        return list.sort(
          (a, b) =>
            new Date(b.createdAt || Date.now()).getTime() -
            new Date(a.createdAt || Date.now()).getTime(),
        );
      case "relevant":
      default:
        return list;
    }
  }, [products, selectedSort]);

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

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.id === selectedSort)?.label ||
    "Most relevant";

  const FilterContent = () => (
    <div className="space-y-5 font-sans">
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
    <section className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 md:px-7 py-8 font-sans">
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

          {/* 🎯 SORT BY DROPDOWN */}
          <div className="relative" ref={sortDropdownRef}>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 font-semibold hidden sm:inline">
                Sort by:
              </span>
              <button
                type="button"
                onClick={() => setIsSortDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#18181B] font-bold text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 cursor-pointer shadow-2xs hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <span>{currentSortLabel}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${isSortDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {isSortDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#18181B] p-1.5 shadow-xl z-30 animate-in fade-in zoom-in-95 duration-100">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSelectedSort(opt.id);
                      setIsSortDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                      selectedSort === opt.id
                        ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {selectedSort === opt.id && (
                      <Check className="w-3.5 h-3.5 text-indigo-500" />
                    )}
                  </button>
                ))}
              </div>
            )}
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
          ) : sortedProducts.length === 0 ? (
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
              {sortedProducts.map((item) => {
                // 🎯 DIRECT DB IMAGE URL ONLY (NO UN SPLASH HARDCODED FALLBACK)
                const dbImage =
                  item.imageUrl ||
                  item.image ||
                  (item.images && item.images[0]?.imageUrl);

                // DYNAMIC STOCK STATUS
                const stockVal =
                  item.stock !== undefined ? Number(item.stock) : null;
                const isAvailable = item.isAvailable !== false;
                const isOutOfStock =
                  stockVal !== null ? stockVal <= 0 : !isAvailable;
                const isLowStock =
                  stockVal !== null &&
                  stockVal > 0 &&
                  stockVal <= (item.moq || 100);

                return (
                  <Link
                    key={item.id}
                    href={`/product/${item.id}`}
                    className="group relative rounded-md border border-black/5 dark:border-white/10 bg-white dark:bg-[#111114] p-3 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between cursor-pointer block"
                  >
                    <div>
                      {/* FABRIC IMAGE FROM DB */}
                      <div className="relative h-40 w-full rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                        {dbImage ? (
                          <img
                            src={dbImage}
                            alt={item.title || item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="text-center text-neutral-400 space-y-1">
                            <ImageIcon className="w-8 h-8 mx-auto" />
                            <span className="text-[10px] font-bold block">
                              No Image
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 space-y-1">
                        <h3 className="font-bold text-sm text-neutral-900 dark:text-white truncate group-hover:text-indigo-600 transition-colors">
                          {item.title || item.name}
                        </h3>
                        <div className="flex items-center justify-between text-[12px] text-neutral-500 font-medium">
                          <span>GSM: {item.gsm || "N/A"}</span>
                          <span>{item.width || '58/60"'}</span>
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

                        {/* DYNAMIC IN STOCK BADGE */}
                        {isOutOfStock ? (
                          <div className="flex items-center gap-1 text-[10px] text-rose-600 dark:text-rose-400 font-bold">
                            <AlertCircle className="w-3 h-3 text-rose-500" />{" "}
                            Out of Stock
                          </div>
                        ) : isLowStock ? (
                          <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                            <Check className="w-3 h-3 text-amber-500" /> Low
                            Stock ({stockVal}m)
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                            <Check className="w-3 h-3 text-emerald-500" /> In
                            Stock {stockVal ? `(${stockVal}m)` : ""}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(e, item)}
                        disabled={addingId === item.id || isOutOfStock}
                        className={`p-1.5 rounded-xl transition-colors cursor-pointer z-10 shrink-0 ${
                          isOutOfStock
                            ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
                            : addedIds.includes(item.id)
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
                );
              })}
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
