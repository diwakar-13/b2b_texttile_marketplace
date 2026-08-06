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
  Plus,
  Package,
  AlertCircle,
  Check,
  ImageIcon,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";
import { useCart } from "@/context/CartContext";

function SupplierDetailSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 space-y-8 animate-pulse font-sans">
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 space-y-6">
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
  const [addingId, setAddingId] = useState(null);
  const [addedIds, setAddedIds] = useState([]);

  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchSupplierDetails() {
      setLoading(true);
      try {
        const res = await axios.get(`/api/suppliers/${supplierId}`);
        if (res.data.success) {
          setSupplier(res.data.supplier);
          setProducts(res.data.products || []);
        } else {
          setError(res.data.message || "Failed to load supplier.");
        }
      } catch (err) {
        console.error("Error loading supplier profile:", err);
        setError("Failed to fetch supplier details.");
      } finally {
        setLoading(false);
      }
    }

    if (supplierId) fetchSupplierDetails();
  }, [supplierId]);

  // SMART CONTACT SUPPLIER HANDLER (MOBILE: CALL, DESKTOP: EMAIL)
  const handleContactSupplier = () => {
    if (!supplier) return;

    const phoneNumber = supplier.contactNumber || supplier.phone;
    const emailAddress = supplier.email;

    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    if (isMobile && phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    } else if (emailAddress) {
      const subject = encodeURIComponent(
        `B2B Inquiry for ${supplier.businessName}`,
      );
      const body = encodeURIComponent(
        `Hello ${supplier.businessName},\n\nI am interested in procuring fabric from your mill via Textil Marketplace.\n\nPlease get back to me with your latest catalog and wholesale pricing.`,
      );
      window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
    } else if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      alert("Supplier contact details are not currently available.");
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFBFD]">
        <Navbar />
        <SupplierDetailSkeleton />
      </div>
    );
  }

  if (error || !supplier) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <Navbar />
        <div className="text-center py-20 space-y-4">
          <p className="text-base font-bold text-neutral-600">
            {error || "Supplier profile not found"}
          </p>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-neutral-950 text-sm font-bold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBFD] text-neutral-950 font-sans">
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* SUPPLIER PROFILE HEADER CARD */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0 flex items-center justify-center p-1">
                <img
                  src={
                    supplier.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      supplier.businessName || "Mill",
                    )}`
                  }
                  alt={supplier.businessName}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950">
                    {supplier.businessName}
                  </h1>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100 shrink-0" />
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600 font-bold">
                  <div className="flex items-center gap-1.5 text-amber-600 font-black">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{supplier.rating || "4.8"}</span>
                    <span className="text-neutral-500 font-bold">
                      ({supplier.reviewsCount || 12} reviews)
                    </span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-neutral-800" />
                    <span>{supplier.businessType || "Textile Mill"}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-neutral-800" />
                    <span>{supplier.businessAddress || "India"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BLACK PREMIUM CONTACT BUTTON */}
            <button
              onClick={handleContactSupplier}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-extrabold text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 sm:hidden" />
              <Mail className="w-4 h-4 hidden sm:block" />
              <span>Contact Supplier</span>
            </button>
          </div>

          {/* SUPPLIER QUICK METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-100 text-sm">
            <div className="p-4 rounded-2xl bg-[#FBFBFC] border border-neutral-200/80 space-y-1">
              <span className="text-xs text-neutral-400 font-black uppercase tracking-wider block">
                Fabrics Offered
              </span>
              <div className="font-bold text-neutral-900 text-sm">
                {supplier.fabricsOffered ||
                  "Organic Cotton, Denim, Linen, Silk"}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FBFBFC] border border-neutral-200/80 space-y-1">
              <span className="text-xs text-neutral-400 font-black uppercase tracking-wider block">
                Operating Hours
              </span>
              <div className="font-bold text-neutral-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-600" />
                {supplier.operatingHours || "09:00 AM - 07:00 PM (Mon-Sat)"}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FBFBFC] border border-neutral-200/80 space-y-1">
              <span className="text-xs text-neutral-400 font-black uppercase tracking-wider block">
                Minimum Order Quantity
              </span>
              <div className="font-bold text-neutral-900 text-sm flex items-center gap-2">
                <Package className="w-4 h-4 text-neutral-600" />
                {supplier.minimumOrderQuantity || supplier.moq || 100} meters
              </div>
            </div>
          </div>
        </div>

        {/* SUPPLIER CATALOG */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight flex items-center gap-3">
              <span>Product Catalog</span>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-neutral-100 text-neutral-900 border border-neutral-200">
                {products.length}
              </span>
            </h2>
          </div>

          {products.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-neutral-200 space-y-2">
              <Package className="w-10 h-10 text-neutral-300 mx-auto" />
              <p className="text-sm font-bold text-neutral-500">
                No active fabric rolls listed by this supplier.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map((item) => {
                const stockVal =
                  item.stock !== undefined ? Number(item.stock) : null;
                const isAvailable = item.isAvailable !== false;
                const isOutOfStock =
                  stockVal !== null ? stockVal <= 0 : !isAvailable;
                const isLowStock =
                  stockVal !== null &&
                  stockVal > 0 &&
                  stockVal <= (item.moq || 100);

                const itemImg =
                  item.imageUrl ||
                  item.image ||
                  (item.images && item.images[0]?.imageUrl);

                return (
                  <Link
                    key={item.id}
                    href={`/product/${item.id}`}
                    className="group relative rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between cursor-pointer block"
                  >
                    <div>
                      {/* PRODUCT IMAGE */}
                      <div className="relative h-44 w-full rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200/60 flex items-center justify-center">
                        {itemImg ? (
                          <img
                            src={itemImg}
                            alt={item.title || item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="text-center text-neutral-400 space-y-1">
                            <ImageIcon className="w-8 h-8 mx-auto" />
                            <span className="text-xs font-bold block">
                              No Image
                            </span>
                          </div>
                        )}
                      </div>

                      {/* TITLE & DETAILS */}
                      <div className="pt-3.5 space-y-1.5">
                        <h3 className="font-extrabold text-base text-neutral-950 truncate group-hover:text-neutral-600 transition-colors">
                          {item.title || item.name}
                        </h3>

                        <div className="flex items-center justify-between text-xs text-neutral-600 font-bold">
                          <span>GSM: {item.gsm || "N/A"}</span>
                          <span>{item.width || '58/60"'}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm pt-1">
                          <span className="font-black text-neutral-950 text-base">
                            ₹{item.price}{" "}
                            <span className="text-xs font-bold text-neutral-500">
                              /meter
                            </span>
                          </span>
                          <span className="text-xs font-extrabold text-neutral-600">
                            MOQ {item.moq || 100}m
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* FOOTER & DYNAMIC STOCK BADGE */}
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-neutral-100">
                      <div>
                        {isOutOfStock ? (
                          <div className="flex items-center gap-1.5 text-xs text-rose-600 font-black">
                            <AlertCircle className="w-4 h-4 text-rose-500" />{" "}
                            Out of Stock
                          </div>
                        ) : isLowStock ? (
                          <div className="flex items-center gap-1.5 text-xs text-amber-600 font-black">
                            <Check className="w-4 h-4 text-amber-500" /> Low
                            Stock ({stockVal}m)
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-black">
                            <Check className="w-4 h-4 text-emerald-500" /> In
                            Stock {stockVal ? `(${stockVal}m)` : ""}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(e, item)}
                        disabled={addingId === item.id || isOutOfStock}
                        className={`p-2.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                          isOutOfStock
                            ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                            : addedIds.includes(item.id)
                              ? "bg-emerald-600 text-white"
                              : "bg-neutral-100 hover:bg-neutral-950 hover:text-white text-neutral-900"
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
        </div>
      </main>
    </div>
  );
}
