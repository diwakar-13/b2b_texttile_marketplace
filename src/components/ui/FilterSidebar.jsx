"use client";

import { Check } from "lucide-react";

export default function FilterSidebar() {
  const categories = ["Cotton", "Silk", "Denim", "Linen", "Polyester", "Wool", "Viscose"];
  const suppliers = ["Verified Only", "Top Rated", "Fast Shipping"];

  return (
    <div className="flex flex-col gap-8 pr-4">
      {/* Category Filter */}
      <div>
        <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Fabric Category</h4>
        <div className="space-y-3">
          {categories.map((cat, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer group">
              <div className="size-4 rounded-md border border-border flex items-center justify-center group-hover:border-primary transition-colors">
                {i === 0 && <Check className="h-3 w-3 text-primary" />}
              </div>
              <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px w-full bg-border/60"></div>

      {/* Price Filter */}
      <div>
        <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Price Range</h4>
        <div className="flex items-center gap-2">
          <input type="text" placeholder="Min" className="w-full h-9 rounded-md border border-border bg-transparent px-3 text-sm focus:outline-none focus:border-primary transition-colors" />
          <span className="text-muted-foreground">-</span>
          <input type="text" placeholder="Max" className="w-full h-9 rounded-md border border-border bg-transparent px-3 text-sm focus:outline-none focus:border-primary transition-colors" />
        </div>
      </div>

      <div className="h-px w-full bg-border/60"></div>

      {/* Supplier Filter */}
      <div>
        <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Supplier Type</h4>
        <div className="space-y-3">
          {suppliers.map((sup, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer group">
              <div className="size-4 rounded-md border border-border flex items-center justify-center group-hover:border-primary transition-colors">
                 {i === 0 && <Check className="h-3 w-3 text-primary" />}
              </div>
              <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">{sup}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}