"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useCart } from "@/context/CartContext";
import {
  ShoppingCart,
  LogIn,
  Trash2,
  ArrowRight,
  Plus,
  Minus,
} from "lucide-react";
import { toast } from "sonner";

function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
      <div className="lg:col-span-2 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="p-4 bg-white rounded-2xl border border-black/5 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-neutral-200 shrink-0" />
              <div className="space-y-2">
                <div className="h-4 w-40 bg-neutral-200 rounded" />
                <div className="h-3 w-20 bg-neutral-200 rounded" />
                <div className="h-3 w-24 bg-neutral-200 rounded" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-24 h-9 bg-neutral-200 rounded-xl" />
              <div className="w-8 h-8 bg-neutral-200 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
      <div className="p-6 bg-white rounded-3xl border border-black/5 h-fit space-y-4">
        <div className="h-5 w-24 bg-neutral-200 rounded" />
        <div className="flex justify-between">
          <div className="h-4 w-16 bg-neutral-200 rounded" />
          <div className="h-4 w-20 bg-neutral-200 rounded" />
        </div>
        <div className="h-10 w-full bg-neutral-200 rounded-xl" />
      </div>
    </div>
  );
}

export default function CartPage() {
  const { cart, itemCount, removeFromCart, updateQuantity, user, loading } =
    useCart();

  const totalAmount = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
    0,
  );

  const handleRemove = (id, title) => {
    removeFromCart(id);
    toast.error("Item removed", {
      description: `${title} was removed from your cart.`,
    });
  };

  const handleCheckoutClick = () => {
    toast.success("Proceeding to Checkout", {
      description: "Redirecting to complete your order details.",
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 font-sans">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-4 py-8">
        <h1 className="text-2xl font-extrabold flex items-center gap-2 mb-6">
          <ShoppingCart className="w-6 h-6 text-indigo-600" />
          Shopping Cart ({loading ? "..." : itemCount})
        </h1>

        {!user && !loading && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
            <p className="text-xs font-semibold text-amber-800">
              You are currently viewing cart as a guest. Please login to proceed
              to checkout.
            </p>
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-amber-900 text-white text-xs font-bold flex items-center gap-1 hover:bg-amber-800 transition-colors shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" /> Login Now
            </Link>
          </div>
        )}

        {loading ? (
          <CartSkeleton />
        ) : cart.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-black/5 space-y-4">
            <p className="text-sm font-bold text-neutral-500">
              Your cart is empty.
            </p>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111111] text-white text-xs font-bold"
            >
              Explore Fabrics <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-white rounded-2xl border border-black/5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <Link href={`/product/${item.productId}`}>
                      <img
                        src={
                          item.image ||
                          "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?q=80&w=600"
                        }
                        alt={item.title}
                        className="w-16 h-16 rounded-xl object-cover hover:opacity-90 transition-opacity shrink-0"
                      />
                    </Link>
                    <div>
                      <Link
                        href={`/product/${item.productId}`}
                        className="font-bold text-sm text-neutral-900 hover:text-indigo-600 transition-colors block"
                      >
                        {item.title}
                      </Link>
                      <p className="text-xs text-neutral-500 font-semibold mt-0.5">
                        ₹{item.price} / meter
                      </p>
                      <p className="text-xs font-bold text-indigo-600 mt-1">
                        Total: ₹
                        {(Number(item.price) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-black/15 rounded-xl bg-neutral-50 p-1">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.price,
                            Math.max(1, item.quantity - 10),
                          )
                        }
                        className="p-1.5 text-neutral-600 hover:text-black cursor-pointer active:scale-90 transition-transform"
                        title="Decrease by 10m"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center px-1">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              item.productId,
                              item.price,
                              parseInt(e.target.value, 10) || 1,
                            )
                          }
                          className="w-16 text-center text-xs font-extrabold bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-[11px] font-bold text-neutral-500 mr-1">
                          m
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.price,
                            item.quantity + 10,
                          )
                        }
                        className="p-1.5 text-neutral-600 hover:text-black cursor-pointer active:scale-90 transition-transform"
                        title="Increase by 10m"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(item.id, item.title)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-white rounded-3xl border border-black/5 h-fit space-y-4">
              <h2 className="font-bold text-base border-b pb-3">Summary</h2>
              <div className="flex justify-between text-xs font-semibold">
                <span>Subtotal</span>
                <span className="text-sm font-bold">
                  ₹{totalAmount.toLocaleString()}
                </span>
              </div>

              {user ? (
                <Link
                  href="/checkout"
                  onClick={handleCheckoutClick}
                  className="block w-full text-center py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors cursor-pointer shadow-md"
                >
                  Proceed to Checkout
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="block w-full text-center py-3 rounded-xl bg-[#111111] text-white font-bold text-xs hover:bg-neutral-800 transition-colors"
                >
                  Login to Checkout
                </Link>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
