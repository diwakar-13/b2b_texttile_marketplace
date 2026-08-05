"use client";

import React, { useState, useEffect, use } from "react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import {
  Star,
  MapPin,
  Building2,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  Heart,
  Plus,
  Package,
  CheckCheck,
  CircleCheck,
} from "lucide-react";
import axios from "axios";

function SupplierDetailSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 space-y-8 animate-pulse">
      <div className="bg-white p-6 rounded-3xl border border-black/5 space-y-6">
        <div className="flex gap-4 items-center">
          <div className="w-20 h-20 rounded-full bg-neutral-200" />
          <div className="space-y-2 flex-1">
            <div className="h-6 bg-neutral-200 rounded w-1/3" />
            <div className="h-4 bg-neutral-200 rounded w-1/4" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-64 bg-neutral-200 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default function SupplierDetailPage({ params }) {
  const resolvedParams = use(params);
  const supplierId = resolvedParams.id;

  const [supplier, setSupplier] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSupplierDetails() {
      setLoading(true);
      try {
        const res = await axios.get(`/api/suppliers/${supplierId}`);
        if (res.data.success) {
          setSupplier(res.data.supplier);
          setProducts(res.data.products);
        } else {
          setError(res.data.message);
        }
      } catch (err) {
        console.error("Error loading supplier profile:", err);
        setError("Failed to fetch supplier details");
      } finally {
        setLoading(false);
      }
    }

    if (supplierId) fetchSupplierDetails();
  }, [supplierId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <Navbar />
        <SupplierDetailSkeleton />
      </div>
    );
  }

  if (error || !supplier) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="text-center py-20 space-y-3">
          <p className="text-sm font-bold text-neutral-500">
            {error || "Supplier not found"}
          </p>
          <Link
            href="/marketplace"
            className="text-indigo-600 text-xs font-bold hover:underline"
          >
            ← Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 font-sans">
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* SUPPLIER PROFILE HEADER CARD */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/5 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-neutral-100 border border-black/5 shrink-0 flex items-center justify-center ">
                <img
                  src={
                    supplier.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      supplier.businessName,
                    )}`
                  }
                  alt={supplier.businessName}
                  className="w-full h-full object-contain rounded-full"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-normal text-neutral-900">
                    {supplier.businessName}
                  </h1>
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 fill-indigo-100 shrink-0" />
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500 font-medium mt-2">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{supplier.rating}</span>
                    <span className="text-neutral-400 font-normal">
                      ({supplier.reviewsCount} reviews)
                    </span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-black font-semibold" />
                    <span>{supplier.businessType || "Textile Mill"}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-black font-semibold" />
                    <span>{supplier.businessAddress || "India"}</span>
                  </div>
                </div>
              </div>
            </div>

            <button className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold  hover:bg-indigo-700 transition-colors shadow-md cursor-pointer">
              Contact Supplier
            </button>
          </div>

          {/* SUPPLIER QUICK METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-black/5 text-xs">
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-black/5 space-y-1">
              <span className="text-[10px] md:text-[13px] text-neutral-500 font-bold uppercase">
                Fabrics Offered
              </span>
              <div className="font-bold  text-neutral-800 mt-1">
                {supplier.fabricsOffered || "Cotton, Linen, Silk, Denim"}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-black/5 space-y-1">
              <span className="text-[10px] md:text-[13px] text-neutral-500 font-bold uppercase">
                Operating Hours
              </span>
              <div className="font-bold text-neutral-800 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                {supplier.operatingHours || "09:00 AM - 07:00 PM"}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-black/5 space-y-1">
              <span className="text-[10px] md:text-[13px] text-neutral-500 font-bold uppercase">
                Minimum Order Quantity
              </span>
              <div className="font-bold text-neutral-800 flex items-center mt-1 gap-1">
                <Package className="w-3.5 h-3.5 text-neutral-500" />
                {supplier.moq || 100} meters
              </div>
            </div>
          </div>
        </div>

        {/* SUPPLIER CATALOG */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-neutral-900">
              Product Catalog ({products.length})
            </h2>
          </div>

          {products.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-black/5">
              <p className="text-xs font-bold text-neutral-400">
                No active products listed by this supplier.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.id}`}
                  className="group relative rounded-md border border-black/5 bg-white p-3 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between cursor-pointer block"
                >
                  <div>
                    <div className="relative h-40 w-full rounded-md overflow-hidden bg-neutral-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?q=80&w=600";
                        }}
                      />
                      {/* <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 backdrop-blur-xs text-neutral-600 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5" />
                      </button> */}
                    </div>

                    <div className="pt-3 space-y-1">
                      <h3 className="font-bold  text-neutral-900 truncate group-hover:text-indigo-600 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between text-[13px] text-neutral-500 font-medium">
                        <span>GSM: {item.gsm}</span>
                        <span>{item.width}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm pt-1">
                        <span className="font-bold text-neutral-900">
                          ₹{item.price}{" "}
                          <span className="text-[13px] font-normal text-neutral-500">
                            /meter
                          </span>
                        </span>
                        <span className="text-[12px] font-semibold text-neutral-500">
                          MOQ {item.moq}m
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-black/5">
                    <div className=" flex item-center justify-center text-[11px] font-bold text-green-500">
                      <CircleCheck className="h-3.5 w-3-5 " />
                      In Stock
                    </div>
                    <div className="p-1.5 rounded-xl bg-neutral-100 text-neutral-800 hover:bg-indigo-600 hover:text-white transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
