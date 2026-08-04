"use client";

import React, { useState, useEffect, use } from "react";
import Navbar from "@/components/layout/Navbar";
import {
  CheckCircle2,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  Star,
  MapPin,
  Lock,
  Box,
  Heart,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(800);
  const [selectedImage, setSelectedImage] = useState("");
  const [activeTab, setActiveTab] = useState("Description");

  // 1. FETCH MAIN PRODUCT DETAILS
  useEffect(() => {
    async function fetchProductById() {
      setLoading(true);
      try {
        const response = await axios.get(`/api/products/${productId}`);
        const data = response.data;

        if (data.success && data.product) {
          setProduct(data.product);
          setQuantity(data.product.moq || 800);

          const primaryImg = data.product.image || data.product.imageUrl;
          setSelectedImage(
            primaryImg ||
              "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?q=80&w=600",
          );

          // 2. FETCH RECOMMENDED PRODUCTS BASED ON MATERIAL / CATEGORY
          fetchRecommended(data.product.material, data.product.id);
        } else {
          setError(data.message || "Product not found");
        }
      } catch (err) {
        console.error("Axios Error:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    }

    async function fetchRecommended(material, currentId) {
      try {
        const res = await axios.get("/api/products", {
          params: { category: material, limit: 5 },
        });

        if (res.data.success && res.data.products) {
          // Current Product ko excludes karke filter karein
          const filtered = res.data.products.filter(
            (item) => item.id !== currentId,
          );
          setRecommendedProducts(filtered.slice(0, 4));
        }
      } catch (err) {
        console.error("Recommended fetch error:", err);
      }
    }

    if (productId) fetchProductById();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50/50">
        <Navbar />
        <div className="max-w-[1240px] mx-auto px-4 py-20 text-center text-xs font-bold text-neutral-400 animate-pulse">
          Loading Fabric Details & Recommendations from DB...
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="text-center py-20 space-y-3">
          <p className="text-sm font-bold text-neutral-500">
            {error || "Product not found"}
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

  const dbImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  const colors = ["#D1C7BD", "#B8A99A", "#E5DEC9", "#A89B8C", "#4A3E3D"];

  const totalPrice = (product.price * quantity).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 font-sans">
      <Navbar />

      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 space-y-12">
        {/* TOP PRODUCT SECTION */}
        <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* GALLERY LEFT */}
          <div className="lg:col-span-6 flex gap-4">
            {dbImages.length > 1 && (
              <div className="flex flex-col gap-3 shrink-0">
                {dbImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                      selectedImage === img
                        ? "border-black shadow-xs scale-95"
                        : "border-transparent hover:border-neutral-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?q=80&w=600";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 h-[420px] rounded-2xl overflow-hidden bg-neutral-100 border border-black/5">
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?q=80&w=600";
                }}
              />
            </div>
          </div>

          {/* PRODUCT SPECS RIGHT */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                {product.title}
              </h1>
              <p className="text-xs text-neutral-400 font-semibold mt-1">
                GSM: {product.gsm}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600 font-medium pt-1">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span>4.8</span>
                <span className="text-neutral-400 font-normal">
                  (150 reviews)
                </span>
              </div>
              <span>•</span>
              <span className="font-bold text-neutral-800">
                {product.supplierName || product.supplier || "Verified Mill"}
              </span>
              <span>•</span>
              <div className="flex items-center gap-1 text-neutral-500">
                <MapPin className="w-3 h-3" /> India
              </div>
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold text-[10px]">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Verified
                Supplier
              </div>
            </div>

            <div className="flex items-baseline gap-4 pt-2 border-t border-black/5">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-neutral-900">
                  ${product.price}
                </span>
                <span className="text-xs text-neutral-400 font-bold">
                  /meter
                </span>
              </div>
              <span className="text-xs font-bold text-neutral-500">
                MOQ {product.moq || 800} meters
              </span>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-neutral-600 block">
                Available Shades
              </span>
              <div className="flex items-center gap-2">
                {colors.map((c, i) => (
                  <div
                    key={i}
                    style={{ backgroundColor: c }}
                    className={`w-7 h-7 rounded-lg border-2 cursor-pointer transition-transform ${
                      i === 0
                        ? "border-black scale-105 shadow-xs"
                        : "border-transparent hover:scale-105"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-neutral-600 block">
                Quantity (meters)
              </span>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center border border-black/15 rounded-xl bg-neutral-50/50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(100, q - 50))}
                    className="p-2.5 text-neutral-600 hover:text-black cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-extrabold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 50)}
                    className="p-2.5 text-neutral-600 hover:text-black cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-xs font-bold text-neutral-500">
                  Total:{" "}
                  <span className="text-lg font-black text-neutral-900">
                    ${totalPrice}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <button className="py-3 rounded-xl border-2 border-black font-extrabold text-xs text-black hover:bg-neutral-100 transition-colors cursor-pointer">
                Add to Cart
              </button>
              <button className="py-3 rounded-xl bg-[#4F46E5] font-extrabold text-xs text-white hover:bg-indigo-700 shadow-md transition-colors cursor-pointer">
                Request Quote
              </button>
            </div>
          </div>
        </div>

        {/* HIGHLIGHTS BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-white rounded-2xl border border-black/5 shadow-2xs text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-100 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-neutral-700" />
            </div>
            <div>
              <div className="font-extrabold text-neutral-900">
                Premium Quality
              </div>
              <div className="text-[10px] text-neutral-400 font-semibold">
                Carefully selected fabrics
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-100 rounded-xl">
              <Box className="w-5 h-5 text-neutral-700" />
            </div>
            <div>
              <div className="font-extrabold text-neutral-900">In Stock</div>
              <div className="text-[10px] text-neutral-400 font-semibold">
                Ready to ship
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-100 rounded-xl">
              <Truck className="w-5 h-5 text-neutral-700" />
            </div>
            <div>
              <div className="font-extrabold text-neutral-900">
                Fast Delivery
              </div>
              <div className="text-[10px] text-neutral-400 font-semibold">
                2-5 business days
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-100 rounded-xl">
              <Lock className="w-5 h-5 text-neutral-700" />
            </div>
            <div>
              <div className="font-extrabold text-neutral-900">
                Secure Payment
              </div>
              <div className="text-[10px] text-neutral-400 font-semibold">
                100% secure checkout
              </div>
            </div>
          </div>
        </div>

        {/* TABS & DESCRIPTION */}
        <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-2xs space-y-6">
          <div className="flex items-center gap-8 border-b border-black/5 pb-3">
            {["Description", "Specifications", "Shipping", "Reviews (150)"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs font-extrabold cursor-pointer transition-colors relative pb-3 -mb-3 ${
                    activeTab === tab
                      ? "text-neutral-900 border-b-2 border-black"
                      : "text-neutral-400 hover:text-neutral-700"
                  }`}
                >
                  {tab}
                </button>
              ),
            )}
          </div>

          <div className="text-xs text-neutral-600 leading-relaxed">
            {activeTab === "Description" && (
              <div className="space-y-4">
                <p>
                  {product.description ||
                    `Our ${product.title} is crafted with precision to deliver exceptional softness, durability, and breathability.`}
                </p>
                <ul className="list-disc pl-4 space-y-1 font-semibold text-neutral-700">
                  <li>
                    Composition:{" "}
                    {product.composition || "100% Certified Organic"}
                  </li>
                  <li>Smooth and soft surface texture</li>
                  <li>High tensile strength and tear resistance</li>
                  <li>Pre-shrunk and color fast</li>
                </ul>
              </div>
            )}

            {activeTab === "Specifications" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-neutral-50 border border-black/5 space-y-1">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase">
                    Fabric Material
                  </span>
                  <div className="font-bold text-neutral-800">
                    {product.material || "Cotton"}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 border border-black/5 space-y-1">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase">
                    GSM Weight
                  </span>
                  <div className="font-bold text-neutral-800">
                    {product.gsm} GSM
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 border border-black/5 space-y-1">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase">
                    Fabric Width
                  </span>
                  <div className="font-bold text-neutral-800">
                    {product.width || '58-60"'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 border border-black/5 space-y-1">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase">
                    Min Order Quantity
                  </span>
                  <div className="font-bold text-neutral-800">
                    {product.moq} meters
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Shipping" && (
              <div className="space-y-2">
                <h4 className="font-bold text-neutral-900">
                  Global Mill Dispatch Terms
                </h4>
                <p>
                  Orders are dispatched within 2-3 business days directly from
                  mill inventory.
                </p>
              </div>
            )}

            {activeTab === "Reviews (150)" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-500" /> 4.8
                  </div>
                  <span className="text-neutral-400">
                    • Verified B2B Buyer Reviews
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 🌟 RECOMMENDED PRODUCTS SECTION */}
        {recommendedProducts.length > 0 && (
          <div className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-neutral-900">
                  Recommended Fabrics
                </h3>
                <p className="text-xs text-neutral-400 font-medium">
                  Similar {product.material} textiles from top mills
                </p>
              </div>

              <Link
                href="/marketplace"
                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                View Marketplace <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.id}`}
                  className="group relative rounded-2xl border border-black/5 bg-white p-3 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between cursor-pointer block"
                >
                  <div>
                    <div className="relative h-40 w-full rounded-xl overflow-hidden bg-neutral-100">
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
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 backdrop-blur-xs text-neutral-600 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="pt-3 space-y-1">
                      <h4 className="font-extrabold text-sm text-neutral-900 truncate group-hover:text-indigo-600 transition-colors">
                        {item.title || item.name}
                      </h4>
                      <div className="flex items-center justify-between text-[10px] text-neutral-400 font-medium">
                        <span>GSM: {item.gsm}</span>
                        <span>{item.width}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm pt-1">
                        <span className="font-black text-neutral-900">
                          ₹{item.price}{" "}
                          <span className="text-[10px] font-normal text-neutral-400">
                            /meter
                          </span>
                        </span>
                        <span className="text-[9px] font-semibold text-neutral-500">
                          MOQ {item.moq}m
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-black/5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-800">
                        <span className="truncate">
                          {item.supplier ||
                            item.supplierName ||
                            "Verified Mill"}
                        </span>
                        <CheckCircle2 className="w-3 h-3 text-indigo-500 shrink-0" />
                      </div>
                    </div>

                    <div className="p-1.5 rounded-xl bg-neutral-100 text-neutral-800 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
