"use client";
import { motion } from "motion/react";
import { Heart, ShieldCheck, MapPin, Scale } from "lucide-react";

export default function ProductCard({ product }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative flex flex-col bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Image Area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-background/90 backdrop-blur-md rounded-md text-[10px] font-bold uppercase tracking-wider border border-border/50 text-foreground">
            {product.category}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button className="size-8 rounded-full bg-background/90 backdrop-blur-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background transition-colors border border-border/50 shadow-sm">
            <Heart className="h-4 w-4" />
          </button>
          <button className="size-8 rounded-full bg-background/90 backdrop-blur-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background transition-colors border border-border/50 shadow-sm">
            <Scale className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-semibold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
          <span>{product.supplier}</span>
          {product.verified && (
            <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
          )}
          <span className="text-border">•</span>
          <MapPin className="h-3 w-3" />
          <span>{product.location}</span>
        </div>

        <div className="mt-auto pt-4 border-t border-border/50 grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wide">
              Min. Order
            </p>
            <p className="font-medium">{product.moq}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wide">
              Price / Yd
            </p>
            <p className="font-bold text-lg leading-none">
              ${product.price.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {product.colors} Colors
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-xs font-medium">
              <span className="text-yellow-500">★</span>
              <span>{product.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Action */}
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-background via-background to-transparent z-10 flex justify-center">
        <button className="w-full h-10 bg-primary text-primary-foreground rounded-lg text-sm font-medium shadow-lg hover:bg-primary/90 transition-colors">
          View Specifications
        </button>
      </div>
    </motion.div>
  );
}
