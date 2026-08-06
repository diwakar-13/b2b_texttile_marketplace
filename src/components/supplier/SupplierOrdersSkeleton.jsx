import React from "react";

export default function SupplierOrdersSkeleton() {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1300px] mx-auto w-full space-y-6 sm:space-y-8 animate-pulse font-sans">
      <div className="h-20 bg-white rounded-3xl border border-neutral-200/70 p-6 flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-6 w-56 bg-neutral-200 rounded-lg" />
          <div className="h-3 w-80 bg-neutral-100 rounded-md" />
        </div>
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-neutral-200/70 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
              <div className="h-5 w-36 bg-neutral-200 rounded-md" />
              <div className="h-8 w-28 bg-neutral-100 rounded-xl" />
            </div>
            <div className="h-16 bg-[#FBFBFC] rounded-2xl border border-neutral-200/50 p-4" />
            <div className="h-12 bg-neutral-50 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}