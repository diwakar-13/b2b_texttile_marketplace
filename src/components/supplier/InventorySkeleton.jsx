import React from "react";

export default function InventorySkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-neutral-200/70 p-6 space-y-4 animate-pulse">
      <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
        <div className="h-10 w-72 bg-neutral-100 rounded-xl" />
        <div className="h-4 w-32 bg-neutral-100 rounded-lg" />
      </div>

      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-neutral-50 border border-neutral-100 rounded-2xl p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-neutral-200 rounded-xl" />
              <div className="space-y-1">
                <div className="h-3 w-40 bg-neutral-200 rounded" />
                <div className="h-2 w-24 bg-neutral-100 rounded" />
              </div>
            </div>
            <div className="h-6 w-20 bg-neutral-200 rounded-full" />
            <div className="h-4 w-16 bg-neutral-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}