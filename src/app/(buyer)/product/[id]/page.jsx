"use client";
import React, { useState, useEffect, use } from "react";
import Navbar from "@/components/layout/Navbar";
import {
  CheckCircle2,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  MapPin,
  Lock,
  Box,
  Check,
  Loader2,
  ImageIcon,
  Scale,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import RecommendedProducts from "@/components/product/RecommandedProduct";
import { useCart } from "@/context/CartContext";
import AiFloatingAssistant from "@/components/ai/AiFloatingAssistant";

// 💀 SKELETON COMPONENT FOR PRODUCT DETAIL PAGE
function ProductDetailSkeleton() {
  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 space-y-12 animate-pulse">
      <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 flex gap-4">
          <div className="flex-1 h-[420px] rounded-2xl bg-neutral-200" />
        </div>
        <div className="lg:col-span-6 space-y-5">
          <div className="space-y-2">
            <div className="h-8 bg-neutral-200 rounded-lg w-3/4" />
            <div className="h-3 bg-neutral-200 rounded w-1/4" />
          </div>
          <div className="h-10 bg-neutral-200 rounded-xl w-1/2 pt-2" />
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="h-12 bg-neutral-200 rounded-xl" />
            <div className="h-12 bg-neutral-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(800);
  const [selectedImage, setSelectedImage] = useState("");
  const [activeTab, setActiveTab] = useState("Description");

  // CART STATES & CONTEXT
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProductById() {
      setLoading(true);
      try {
        const response = await axios.get(`/api/products/${productId}`);
        const data = response.data;
        if (data.success && data.product) {
          setProduct(data.product);
          setQuantity(data.product.moq || 800);
          const primaryImg =
            data.product.image ||
            data.product.imageUrl ||
            (data.product.images && data.product.images[0]?.imageUrl);
          setSelectedImage(primaryImg || "");
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
    if (productId) fetchProductById();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);
    const success = await addToCart({
      id: product.id,
      title: product.title || product.name,
      price: product.price,
      image: selectedImage || product.image || product.imageUrl,
      quantity: quantity,
    });
    setIsAdding(false);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handlePlaceOrder = async () => {
    if (!product) return;
    await addToCart({
      id: product.id,
      title: product.title || product.name,
      price: product.price,
      image: selectedImage || product.image || product.imageUrl,
      quantity: quantity,
    });
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <Navbar />
        <ProductDetailSkeleton />
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
            <div className="flex-1 h-[420px] rounded-xl overflow-hidden bg-neutral-100 border border-black/5 relative flex items-center justify-center">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.title || product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              ) : (
                <div className="text-center text-neutral-400 space-y-1">
                  <ImageIcon className="w-10 h-10 mx-auto" />
                  <span className="text-xs font-bold block">
                    No Image Available
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* PRODUCT SPECS RIGHT */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                {product.title || product.name}
              </h1>
              <p className="text-sm text-neutral-500 font-semibold mt-1">
                GSM: {product.gsm || "N/A"}
              </p>
            </div>

            {/* SUPPLIER INFO ROW WITH GREEN COMPARE BUTTON RIGHT HERE */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-600 font-medium">
                <span className="font-bold text-neutral-800">
                  {product.supplierName || product.supplier || "Verified Mill"}
                </span>
                <span>•</span>
                <div className="flex items-center gap-1 text-neutral-500">
                  <MapPin className="w-3.5 h-3.5 text-black" /> India
                </div>
                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold text-[12px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />{" "}
                  Verified Supplier
                </div>
              </div>

              {/* 🎯 GREEN ROUNDED-MD COMPARE BUTTON */}
              <Link
                href={`/compare?baseProduct=${product.id}`}
                className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare</span>
              </Link>
            </div>

            <div className="flex items-baseline gap-4 pt-2 border-t border-black/5">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-neutral-900">
                  ₹{product.price}
                </span>
                <span className="text-sm text-neutral-500 font-bold">
                  /meter
                </span>
              </div>
              <span className="text-sm font-bold text-neutral-500">
                MOQ {product.moq || 800} meters
              </span>
            </div>

            {/* QUANTITY COUNTER */}
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
                  <span className="text-lg font-bold text-neutral-900">
                    ₹{totalPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS ROW */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`py-3 rounded-xl font-extrabold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                  added
                    ? "bg-emerald-600 text-white"
                    : "border-2 border-black text-black hover:bg-neutral-100"
                }`}
              >
                {isAdding ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : added ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart
                  </>
                ) : (
                  "Add to Cart"
                )}
              </button>
              <button
                onClick={handlePlaceOrder}
                className="py-3 rounded-xl bg-black font-extrabold text-xs text-white hover:bg-neutral-800 shadow-md transition-colors cursor-pointer"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>

        {/* HIGHLIGHTS BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-white rounded-2xl border border-black/5 shadow-2xs text-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-100 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-neutral-700" />
            </div>
            <div>
              <div className="font-bold md:text-lg text-neutral-900">
                Premium Quality
              </div>
              <div className="text-[10px] md:text-[13px] text-neutral-500 font-semibold">
                Carefully selected fabrics
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-100 rounded-xl">
              <Box className="w-5 h-5 text-neutral-700" />
            </div>
            <div>
              <div className="font-bold md:text-lg text-neutral-900">
                In Stock
              </div>
              <div className="text-[10px] md:text-[13px] text-neutral-500 font-semibold">
                Ready to ship
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-100 rounded-xl">
              <Truck className="w-5 h-5 text-neutral-700" />
            </div>
            <div>
              <div className="font-bold md:text-lg text-neutral-900">
                Fast Delivery
              </div>
              <div className="text-[10px] md:text-[13px] text-neutral-500 font-semibold">
                2-5 business days
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-100 rounded-xl">
              <Lock className="w-5 h-5 text-neutral-700" />
            </div>
            <div>
              <div className="font-bold md:text-lg text-neutral-900">
                Secure Payment
              </div>
              <div className="text-[10px] md:text-[13px] text-neutral-500 font-semibold">
                100% secure checkout
              </div>
            </div>
          </div>
        </div>

        {/* TABS & DESCRIPTION */}
        <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-2xs space-y-6">
          <div className="flex items-center gap-8 border-b border-black/5 pb-3">
            {["Description", "Specifications", "Shipping"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`md:text-lg text-xs font-bold cursor-pointer transition-colors relative pb-3 -mb-3 ${
                  activeTab === tab
                    ? "text-neutral-900 border-b-2 border-black"
                    : "text-neutral-400 hover:text-neutral-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="text-sm text-neutral-600 leading-relaxed">
            {activeTab === "Description" && (
              <div className="space-y-4">
                <p>
                  {product.description ||
                    `Our ${product.title || product.name} is crafted with precision to deliver exceptional softness, durability, and breathability.`}
                </p>
                <ul className="list-disc pl-4 space-y-1 text-neutral-700">
                  <li>
                    <span className="font-bold">Composition: </span>
                    {product.composition || "100% Certified Organic"}
                  </li>
                  <li className="font-medium">
                    High tensile strength and tear resistance
                  </li>
                  <li className="font-medium">Pre-shrunk and color fast</li>
                </ul>
              </div>
            )}
            {activeTab === "Specifications" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-neutral-50 border border-black/5 space-y-1">
                  <span className="text-[10px] md:text-[13px] text-neutral-500 font-bold uppercase">
                    Fabric Material
                  </span>
                  <div className="font-bold text-neutral-800">
                    {product.material || "Cotton"}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 border border-black/5 space-y-1">
                  <span className="text-[10px] md:text-[13px] text-neutral-500 font-bold uppercase">
                    GSM Weight
                  </span>
                  <div className="font-bold text-neutral-800">
                    {product.gsm} GSM
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 border border-black/5 space-y-1">
                  <span className="text-[10px] md:text-[13px] text-neutral-500 font-bold uppercase">
                    Fabric Width
                  </span>
                  <div className="font-bold text-neutral-800">
                    {product.width || '58-60"'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 border border-black/5 space-y-1">
                  <span className="text-[10px] md:text-[13px] text-neutral-500 font-bold uppercase">
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
                <h4 className="font-bold md:text-lg text-neutral-900">
                  Global Mill Dispatch Terms
                </h4>
                <p>
                  Orders are dispatched within 2-3 business days directly from
                  mill inventory.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* FLOATING AI ASSISTANT */}
        <AiFloatingAssistant currentProduct={product} />

        {/* RECOMMENDED PRODUCTS */}
        <RecommendedProducts
          material={product.material}
          currentProductId={product.id}
        />
      </main>
    </div>
  );
}
