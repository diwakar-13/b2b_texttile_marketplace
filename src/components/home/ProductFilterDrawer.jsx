"use client";

import React from "react";
import { SlidersHorizontal, RotateCcw, X } from "lucide-react";

export default function ProductFilterDrawer({
  filters,
  setFilters,
  resetFilters,
  categories = [],
  isOpen,
  onClose,
}) {
  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-full sm:w-80 bg-white dark:bg-[#111114] border-l border-black/10 dark:border-white/10 p-6 shadow-2xl transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-2 font-bold text-lg text-neutral-900 dark:text-white">
          <SlidersHorizontal className="w-5 h-5 text-indigo-500" />
          <span>B2B Spec Filters</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6 pt-6 overflow-y-auto max-h-[calc(100vh-140px)] pr-1">
        {/* Category Selection */}
        <div>
          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="w-full bg-neutral-100 dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* GSM Range Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Max GSM
            </label>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {filters.maxGsm || "Any"} GSM
            </span>
          </div>
          <input
            type="range"
            min="40"
            max="400"
            step="10"
            value={filters.maxGsm || 400}
            onChange={(e) => setFilters({ ...filters, maxGsm: e.target.value })}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        {/* MOQ Filter */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Max MOQ (Units)
            </label>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {filters.maxMoq || "Any"} Units
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="2000"
            step="50"
            value={filters.maxMoq || 2000}
            onChange={(e) => setFilters({ ...filters, maxMoq: e.target.value })}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Footer Reset */}
      <div className="absolute bottom-6 left-6 right-6 pt-4 border-t border-black/5 dark:border-white/10">
        <button
          onClick={resetFilters}
          className="w-full py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
        </button>
      </div>
    </div>
  );
}