import React from "react";

export default function SupplierDashboardSkeleton() {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1300px] mx-auto w-full space-y-6 sm:space-y-8 animate-pulse font-sans">
      {/* Banner Skeleton */}
      <div className="h-24 bg-white/80 rounded-3xl border border-neutral-200/70 p-6 flex flex-col justify-center space-y-2">
        <div className="h-6 w-1/3 bg-neutral-200 rounded-lg" />
        <div className="h-4 w-1/2 bg-neutral-100 rounded-md" />
      </div>

      {/* Metrics Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-3xl bg-white border border-neutral-200/70 space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-3 w-28 bg-neutral-200 rounded-md" />
              <div className="size-10 bg-neutral-100 rounded-2xl" />
            </div>
            <div className="flex justify-between items-baseline pt-2">
              <div className="h-8 w-20 bg-neutral-200 rounded-lg" />
              <div className="h-3 w-16 bg-neutral-100 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Grid Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-neutral-200/70 space-y-4">
          <div className="h-5 w-40 bg-neutral-200 rounded-md pb-4 border-b border-neutral-100" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-[#FBFBFC] rounded-2xl border border-neutral-200/50 p-4" />
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-neutral-200/70 space-y-4">
          <div className="h-5 w-48 bg-neutral-200 rounded-md pb-4 border-b border-neutral-100" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-[#FBFBFC] rounded-2xl border border-neutral-200/50 p-4" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}