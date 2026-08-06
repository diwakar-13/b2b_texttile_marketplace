"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
  MapPin,
  Phone,
  User,
  Loader2,
  PackageCheck,
  ChevronDown,
  Layers,
} from "lucide-react";
import { updateOrderStatus } from "@/action/supplier/updateOrderStatus";
import { toast } from "sonner";

const STATUSES = [
  {
    value: "pending",
    label: "Pending",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    value: "accepted",
    label: "Accepted",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    value: "preparing",
    label: "Preparing",
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    value: "shipped",
    label: "Ready for Dispatch",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    value: "delivered",
    label: "Completed",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
];

export default function SupplierOrdersList({ initialOrders = [] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.success) {
        setOrders((prev) =>
          prev.map((ord) =>
            ord.id === orderId ? { ...ord, status: newStatus } : ord,
          ),
        );
        toast.success(`Order status updated to "${newStatus.toUpperCase()}"`);
      } else {
        toast.error(res.error || "Failed to update status");
      }
    } catch (err) {
      toast.error("Status update error");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    if (filter === "all") return true;
    if (filter === "pending")
      return ord.status === "pending" || ord.status === "processing";
    if (filter === "active")
      return ord.status === "accepted" || ord.status === "preparing";
    if (filter === "completed")
      return ord.status === "delivered" || ord.status === "shipped";
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: "all", label: `All Orders (${orders.length})` },
          { id: "pending", label: "Pending Approval" },
          { id: "active", label: "In Production / Preparing" },
          { id: "completed", label: "Dispatched / Completed" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              filter === tab.id
                ? "bg-neutral-950 text-white shadow-xs"
                : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/70"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ORDERS CARDS */}
      {filteredOrders.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-neutral-200/70 space-y-3">
          <div className="w-12 h-12 bg-neutral-100 text-neutral-400 rounded-2xl flex items-center justify-center mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-neutral-800">
            No orders found in this category.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => {
            const currentStatusObj =
              STATUSES.find((s) => s.value === ord.status) || STATUSES[0];

            return (
              <div
                key={ord.id}
                className="bg-white p-6 rounded-3xl border border-neutral-200/70 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-5"
              >
                {/* CARD HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-black text-neutral-950">
                        #{ord.orderNumber}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-black border uppercase ${currentStatusObj.color}`}
                      >
                        {ord.status}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-neutral-500 block">
                      Placed on: {new Date(ord.createdAt).toLocaleDateString()}{" "}
                      at{" "}
                      {new Date(ord.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* UPDATE STATUS DROPDOWN */}
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="text-xs font-bold text-neutral-400">
                      Status:
                    </span>
                    <div className="relative">
                      <select
                        value={ord.status}
                        disabled={updatingId === ord.id}
                        onChange={(e) =>
                          handleStatusChange(ord.id, e.target.value)
                        }
                        className="h-9 bg-[#FBFBFC] border border-neutral-200 text-xs font-extrabold text-neutral-900 rounded-xl pl-3 pr-8 appearance-none focus:outline-none focus:border-neutral-900 cursor-pointer disabled:opacity-50"
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="preparing">Preparing</option>
                        <option value="shipped">Ready for Dispatch</option>
                        <option value="delivered">Completed</option>
                      </select>
                      {updatingId === ord.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin absolute right-2.5 top-3 text-neutral-600" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-3 text-neutral-400 pointer-events-none" />
                      )}
                    </div>
                  </div>
                </div>

                {/* BUYER & SHIPPING INFO */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#FBFBFC] p-4 rounded-2xl border border-neutral-200/50">
                  <div className="space-y-1">
                    <span className="text-xs font-black text-neutral-600 uppercase flex items-center gap-1.5">
                      <User className="w-4 h-4 text-neutral-500" /> Buyer
                      Details
                    </span>
                    <p className="font-bold text-sm text-neutral-900">
                      {ord.buyerName}
                    </p>
                    <p className="text-neutral-600 font-semibold flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-neutral-900" />{" "}
                      {ord.buyerPhone}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-black text-neutral-600 uppercase flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-neutral-500" /> Shipping
                      Destination
                    </span>
                    <p className="font-semibold text-xs text-neutral-800 leading-snug">
                      {ord.shippingAddress}
                    </p>
                  </div>
                </div>

                {/* ITEMS ORDERED WITH PRODUCT IMAGE */}
                <div className="space-y-2">
                  <span className="text-xs font-black text-neutral-600 uppercase block">
                    Ordered Fabrics
                  </span>
                  <div className="divide-y divide-neutral-100">
                    {ord.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="py-3 flex items-center justify-between gap-4 text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* PRODUCT IMAGE SWATCH */}
                          <div className="size-12 rounded-xl bg-neutral-100 border border-neutral-200/80 overflow-hidden shrink-0 flex items-center justify-center">
                            {item.image || item.imageUrl ? (
                              <img
                                src={item.image || item.imageUrl}
                                alt={item.name}
                                className="size-full object-cover"
                              />
                            ) : (
                              <Layers className="w-5 h-5 text-neutral-400" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="font-extrabold text-sm text-neutral-950 truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-neutral-500 font-bold">
                              {item.quantity} meters @ ₹{item.price}/m{" "}
                              {item.gsm ? `• ${item.gsm} GSM` : ""}
                            </p>
                          </div>
                        </div>

                        <span className="font-black text-neutral-950 text-base shrink-0">
                          ₹
                          {(
                            Number(item.price) * item.quantity
                          ).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TOTAL SUMMARY */}
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-500">
                    Order Revenue Total
                  </span>
                  <span className="text-base font-black text-neutral-950">
                    ₹{Number(ord.totalAmount).toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
