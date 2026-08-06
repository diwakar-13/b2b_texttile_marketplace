"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { useCart } from "@/context/CartContext";
import {
  ShieldCheck,
  Truck,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

// 💀 SKELETON COMPONENT FOR CHECKOUT PAGE
function CheckoutSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 space-y-6 animate-pulse">
      <div className="h-4 w-24 bg-neutral-200 rounded-md" />
      <div className="h-8 w-48 bg-neutral-200 rounded-lg" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT FORM SKELETON */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-black/5 space-y-5">
          <div className="h-6 w-56 bg-neutral-200 rounded-md pb-3 border-b border-black/5" />
          <div className="space-y-2">
            <div className="h-4 w-36 bg-neutral-200 rounded" />
            <div className="h-28 w-full bg-neutral-200 rounded-2xl" />
          </div>
          <div className="h-16 w-full bg-neutral-200 rounded-2xl" />
        </div>

        {/* RIGHT SUMMARY SKELETON */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-black/5 space-y-4">
          <div className="h-6 w-32 bg-neutral-200 rounded-md pb-3 border-b border-black/5" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-neutral-200 rounded-lg shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-3 w-28 bg-neutral-200 rounded" />
                    <div className="h-2 w-20 bg-neutral-200 rounded" />
                  </div>
                </div>
                <div className="h-3 w-12 bg-neutral-200 rounded" />
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-2">
            <div className="flex justify-between">
              <div className="h-3 w-20 bg-neutral-200 rounded" />
              <div className="h-3 w-16 bg-neutral-200 rounded" />
            </div>
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-neutral-200 rounded" />
              <div className="h-4 w-20 bg-neutral-200 rounded" />
            </div>
          </div>
          <div className="h-12 w-full bg-neutral-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { cart, refreshCart, user, loading: cartLoading } = useCart();
  const router = useRouter();

  const [shippingAddress, setShippingAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const totalAmount = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
    0,
  );

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      const msg = "Please enter a valid shipping address.";
      setError(msg);
      toast.error("Invalid Address", { description: msg });
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await axios.post("/api/checkout", {
        shippingAddress,
      });

      if (res.data.success) {
        toast.success("Order Placed Successfully!", {
          description: `Order #${res.data.orderNumber} sent to supplying mill.`,
        });
        await refreshCart();
        router.push("/buyer/dashboard?orderPlaced=true");
      } else {
        const msg = res.data.message || "Failed to place order.";
        setError(msg);
        toast.error("Checkout Failed", { description: msg });
      }
    } catch (err) {
      console.error("Checkout submission failed:", err);
      const msg = err.response?.data?.message || "Something went wrong.";
      setError(msg);
      toast.error("Order Failed", { description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 font-sans">
      <Navbar />

      {/* 💀 SKELETON WHILE INITIAL CART & AUTH DATA LOADS */}
      {cartLoading ? (
        <CheckoutSkeleton />
      ) : !user ? (
        <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-black/5 text-center space-y-4">
          <p className="text-sm font-bold text-neutral-600">
            Please login to proceed with Checkout.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-2.5 rounded-xl bg-[#111111] text-white font-bold text-xs"
          >
            Go to Login
          </Link>
        </div>
      ) : cart.length === 0 ? (
        <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-black/5 text-center space-y-4">
          <p className="text-sm font-bold text-neutral-600">
            Your cart is empty. Please add fabrics before checkout.
          </p>
          <Link
            href="/marketplace"
            className="inline-block px-6 py-2.5 rounded-xl bg-[#111111] text-white font-bold text-xs"
          >
            Explore Marketplace
          </Link>
        </div>
      ) : (
        <main className="max-w-[1200px] mx-auto px-4 py-8 space-y-6">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>

          <h1 className="text-2xl font-extrabold text-neutral-900">
            Order Checkout
          </h1>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
              {error}
            </div>
          )}

          <form
            onSubmit={handlePlaceOrder}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* LEFT: SHIPPING ADDRESS FORM */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-black/5 space-y-5">
              <h2 className="font-bold text-base text-neutral-900 flex items-center gap-2 border-b pb-3">
                <Truck className="w-5 h-5 text-indigo-600" /> Shipping &
                Delivery Information
              </h2>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-700 block">
                  Full Shipping Address *
                </label>
                <textarea
                  rows="4"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Enter complete mill/factory delivery address with Pincode..."
                  className="w-full p-3.5 bg-neutral-50 border border-black/10 rounded-2xl text-xs font-semibold focus:outline-none focus:border-black transition-all"
                />
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-indigo-600 shrink-0" />
                <p className="text-xs text-indigo-950 font-medium">
                  B2B Payment Terms: Order will be generated as{" "}
                  <span className="font-bold">Pending</span>. Invoice and
                  dispatch timeline will be synchronized directly with the
                  supplying mill.
                </p>
              </div>
            </div>

            {/* RIGHT: ORDER SUMMARY */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-black/5 space-y-4">
              <h2 className="font-bold text-base border-b pb-3">
                Order Summary
              </h2>

              <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={
                          item.image ||
                          "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?q=80&w=600"
                        }
                        alt={item.title}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-neutral-900 truncate">
                          {item.title}
                        </p>
                        <p className="text-neutral-500 font-medium">
                          {item.quantity} meters @ ₹{item.price}/m
                        </p>
                      </div>
                    </div>
                    <span className="font-bold shrink-0">
                      ₹{(Number(item.price) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-neutral-500">
                  <span>Total Quantity</span>
                  <span>
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} meters
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-neutral-900">
                  <span>Grand Total</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing
                    Order...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Confirm & Place Order
                  </>
                )}
              </button>
            </div>
          </form>
        </main>
      )}
    </div>
  );
}
