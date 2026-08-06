import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getBuyerDashboardData } from "@/action/getBuyerDashboardData";
import {
  Building2,
  Mail,
  Phone,
  Clock,
  PackageCheck,
  CheckCircle2,
  Truck,
  MapPin,
  Package,
} from "lucide-react";

export default async function BuyerDashboardPage() {
  const {
    user = null,
    profile = null,
    buyer = null,
    buyerOrders = [],
  } = (await getBuyerDashboardData()) || {};

  // Real Database Filtered Orders
  const currentOrders = buyerOrders.filter(
    (o) =>
      o.status === "pending" ||
      o.status === "processing" ||
      o.status === "shipped",
  );
  const previousOrders = buyerOrders.filter((o) => o.status === "delivered");

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar userProfile={profile} userEmail={user?.email} role="BUYER" />
      <SidebarInset className="min-h-screen bg-[#F8F9FA] text-neutral-900 font-sans">
        {/* HEADER */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-black/5 px-6 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4 bg-black/10" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-extrabold text-xs text-neutral-900">
                    Buyer Portal / Dashboard
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* BODY CONTENT */}
        <div className="p-4 sm:p-6 md:p-8 max-w-[1300px] mx-auto w-full space-y-6 sm:space-y-8">
          {/* WELCOME */}
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-neutral-900">
              Welcome back, {profile?.fullName || "Buyer"} 👋
            </h1>
            <p className="text-xs md:text-sm font-semibold text-neutral-600 mt-0.5">
              Track your textile orders and view your buyer profile details.
            </p>
          </div>

          {/* 1️⃣ VIEW PROFILE SECTION */}
          <section
            id="profile-section"
            className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-black/5 space-y-4 shadow-2xs"
          >
            <h2 className="text-sm md:text-lg font-bold text-neutral-900 flex items-center gap-2 border-b pb-3">
              <Building2 className="w-4 h-4 text-Black" /> My Profile
              Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-black/5 space-y-1">
                <span className="text-[12px] font-bold text-neutral-500 uppercase block">
                  Name / Account
                </span>
                <p className="font-bold text-neutral-900 text-sm truncate">
                  {profile?.fullName || "Not Specified"}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-black/5 space-y-1">
                <span className="text-[12px] font-bold text-neutral-600 uppercase flex items-center gap-1">
                  <Mail className="w-3 h-3 text-neutral-600" /> Email
                </span>
                <p className="font-bold text-neutral-800 truncate">
                  {user?.email}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-black/5 space-y-1">
                <span className="text-[12px] font-bold text-neutral-600 uppercase flex items-center gap-1">
                  <Phone className="w-3 h-3 text-neutral-600" /> Phone
                </span>
                <p className="font-bold text-neutral-800">
                  {profile?.phone || "Not Added"}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-black/5 space-y-1">
                <span className="text-[12px] font-bold text-neutral-600 uppercase block">
                  Business Type
                </span>
                <p className="font-extrabold text-black">
                  {buyer?.businessType || "Garment Buyer"}
                </p>
              </div>
            </div>
          </section>

          {/* 2️⃣ ORDERS SECTION (CURRENT + PREVIOUS) */}
          <section
            id="orders-section"
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start"
          >
            {/* CURRENT ACTIVE ORDERS & TRACKING */}
            <div className="lg:col-span-7 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-black/5 space-y-5 shadow-2xs">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-sm md:text-lg font-extrabold text-neutral-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-black" /> Current Orders (
                  {currentOrders.length})
                </h2>
                <span className="text-[10px] font-extrabold text-black flex items-center gap-2 bg-gray-200 px-2.5 py-1 rounded-full uppercase">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"/> Live Status Tracking
                </span>
              </div>

              {currentOrders.length === 0 ? (
                <div className="p-8 text-center bg-neutral-50 border border-dashed border-black/10 rounded-2xl space-y-1">
                  <p className="text-xs font-bold text-neutral-600">
                    No active ongoing orders right now.
                  </p>
                  <p className="text-[11px] text-neutral-400 font-medium">
                    Orders placed from marketplace will appear here with
                    real-time tracking.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-2xl bg-neutral-50 border border-black/5 space-y-4"
                    >
                      {/* ORDER INFO HEADER */}
                      <div className="flex items-center justify-between text-xs border-b border-black/5 pb-2.5">
                        <div>
                          <span className="font-extrabold text-neutral-900 text-sm block">
                            #{ord.orderNumber}
                          </span>
                          <span className="text-[11px] text-neutral-500 font-medium">
                            Placed:{" "}
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="font-extrabold text-sm text-neutral-900">
                          ₹{Number(ord.totalAmount).toLocaleString()}
                        </span>
                      </div>

                      {/* ORDER ITEMS LIST WITH BIGGER IMAGES */}
                      <div className="space-y-3">
                        {ord.items?.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-4 text-xs"
                          >
                            <div className="flex items-center gap-3.5">
                              {/* 🖼️ BIGGER IMAGE SIZE (w-20 h-20 sm:w-24 sm:h-24) */}
                              <img
                                src={
                                  item.productImage ||
                                  "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?q=80&w=600"
                                }
                                alt={item.productName}
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border border-black/10 shrink-0 shadow-2xs"
                              />
                              <div className="space-y-1">
                                <p className="font-extrabold text-neutral-900 text-sm sm:text-base leading-snug">
                                  {item.productName}
                                </p>
                                <p className="text-xs text-neutral-500 font-bold">
                                  {item.quantity} meters @ ₹{item.price}/m
                                </p>
                              </div>
                            </div>
                            <span className="font-extrabold text-neutral-900 text-sm sm:text-base shrink-0">
                              ₹
                              {(
                                Number(item.price) * item.quantity
                              ).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* STEP TRACKING BAR */}
                      <div className="pt-2 space-y-1.5 border-t border-black/5">
                        <span className="text-[12px] font-bold text-neutral-600 uppercase block">
                          Live Status Tracking
                        </span>
                        <div className="grid grid-cols-3 gap-2 text-center text-[12px] font-extrabold">
                          <div
                            className={`p-2 rounded-xl flex items-center justify-center gap-1 ${
                              ord.status === "pending" ||
                              ord.status === "processing" ||
                              ord.status === "shipped"
                                ? "bg-black text-white"
                                : "bg-neutral-200 text-neutral-500"
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3" /> Placed
                          </div>
                          <div
                            className={`p-2 rounded-xl flex items-center justify-center gap-1 ${
                              ord.status === "processing" ||
                              ord.status === "shipped"
                                ? "bg-black text-white"
                                : "bg-neutral-200 text-neutral-500"
                            }`}
                          >
                            <Truck className="w-3 h-3" /> Processing
                          </div>
                          <div
                            className={`p-2 rounded-xl flex items-center justify-center gap-1 ${
                              ord.status === "shipped"
                                ? "bg-black text-white"
                                : "bg-neutral-200 text-neutral-500"
                            }`}
                          >
                            <PackageCheck className="w-3 h-3" /> Dispatched
                          </div>
                        </div>
                      </div>
                      <div className="text-[12px] font-semibold text-neutral-600 flex items-center gap-1 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span className="truncate">
                          Shipping Address: {ord.shippingAddress}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PREVIOUS FULFILLED ORDERS HISTORY */}
            <div className="lg:col-span-5 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-black/5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-sm md:text-lg font-extrabold text-neutral-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-600" /> Previous
                  Order History
                </h2>
                <span className="text-xs md:text-sm font-bold text-neutral-500">
                  {previousOrders.length} Fulfilled
                </span>
              </div>
              {previousOrders.length === 0 ? (
                <div className="p-8 text-center bg-neutral-50 border border-dashed border-black/10 rounded-2xl">
                  <p className="text-xs font-bold text-neutral-500">
                    No past fulfilled orders recorded yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {previousOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3.5 rounded-2xl bg-neutral-50 border border-black/5 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-extrabold text-neutral-900 block">
                          #{ord.orderNumber}
                        </span>
                        <span className="text-[11px] font-medium text-neutral-500">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-neutral-900 block">
                          ₹{Number(ord.totalAmount).toLocaleString()}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase mt-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Delivered
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
