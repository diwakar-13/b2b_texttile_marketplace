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
  CheckCircle2,
  Truck,
  MapPin,
  Package,
  PackageCheck,
  RotateCw,
  Box,
} from "lucide-react";

export default async function BuyerDashboardPage() {
  const {
    user = null,
    profile = null,
    buyer = null,
    buyerOrders = [],
  } = (await getBuyerDashboardData()) || {};

  // Database Filtered Orders (Case-Insensitive Clean Tracking)
  const currentOrders = buyerOrders.filter((o) => {
    const st = (o.status || "").toLowerCase();
    return st !== "delivered" && st !== "cancelled" && st !== "completed";
  });

  const previousOrders = buyerOrders.filter((o) => {
    const st = (o.status || "").toLowerCase();
    return st === "delivered" || st === "completed";
  });

  // Stepper Status Mapper
  const getStepProgress = (statusRaw) => {
    const st = (statusRaw || "").toLowerCase();
    switch (st) {
      case "pending":
      case "placed":
        return 1;
      case "accepted":
      case "processing":
      case "preparing":
        return 2;
      case "shipped":
      case "dispatched":
      case "ready for dispatch":
        return 3;
      case "delivered":
      case "completed":
        return 4;
      default:
        return 1;
    }
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar userProfile={profile} userEmail={user?.email} role="BUYER" />
      <SidebarInset className="min-h-screen bg-[#FAFBFD] text-neutral-900 font-sans">
        {/* HEADER */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200/80 px-6 bg-white/90 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4 bg-neutral-200" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <span className="font-extrabold text-xs text-neutral-400 uppercase tracking-wider">
                    Buyer Portal
                  </span>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <span className="text-neutral-300 mx-1">/</span>
                  <BreadcrumbPage className="font-black text-xs text-neutral-900 uppercase tracking-wider">
                    Dashboard & Orders
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
            <h1 className="text-xl sm:text-3xl font-bold text-neutral-950">
              Welcome back, {profile?.fullName || "Buyer"} 👋
            </h1>
            <p className="text-xs md:text-sm font-semibold text-neutral-500 mt-1">
              Live status tracking for ongoing fabric orders and profile
              details.
            </p>
          </div>

          {/* 1️⃣ PROFILE SECTION */}
          <section
            id="profile-section"
            className="bg-white p-5 sm:p-6 rounded-3xl border border-neutral-200/80 space-y-4 shadow-xs"
          >
            <h2 className="text-sm md:text-base font-black text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-3">
              <Building2 className="w-4 h-4 text-black" />
              Buyer Profile Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-1">
                <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider block">
                  Name / Account
                </span>
                <p className="font-bold text-neutral-900 text-sm truncate">
                  {profile?.fullName || "Not Specified"}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-1">
                <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                  <Mail className="w-3 h-3 text-neutral-500" /> Email
                </span>
                <p className="font-bold text-neutral-800 truncate">
                  {user?.email}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-1">
                <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                  <Phone className="w-3 h-3 text-neutral-500" /> Contact Phone
                </span>
                <p className="font-bold text-neutral-800">
                  {profile?.phone || "Not Added"}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-1">
                <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider block">
                  Business Operations
                </span>
                <p className="font-extrabold text-black">
                  {buyer?.businessType || "Garment Buyer"}
                </p>
              </div>
            </div>
          </section>

          {/* 2️⃣ ACTIVE & PAST ORDERS */}
          <section
            id="orders-section"
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start"
          >
            {/* CURRENT ACTIVE ORDERS & LIVE TRACKING */}
            <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-3xl border border-neutral-200/80 space-y-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h2 className="text-sm md:text-base font-black text-neutral-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-black" />
                  Active Live Orders ({currentOrders.length})
                </h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Live Sync
                </span>
              </div>

              {currentOrders.length === 0 ? (
                <div className="p-10 text-center bg-neutral-50/50 border border-dashed border-neutral-200 rounded-2xl space-y-1.5">
                  <Package className="w-8 h-8 text-neutral-300 mx-auto" />
                  <p className="text-xs font-bold text-neutral-700">
                    No active ongoing fabric orders right now.
                  </p>
                  <p className="text-[11px] text-neutral-400 font-medium">
                    Orders placed from marketplace will appear here with step
                    tracking.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {currentOrders.map((ord) => {
                    const currentStep = getStepProgress(ord.status);
                    const rawStatusName = (
                      ord.status || "Pending"
                    ).toUpperCase();

                    return (
                      <div
                        key={ord.id}
                        className="p-5 rounded-3xl bg-[#FBFBFC] border border-neutral-200/80 space-y-5 shadow-xs"
                      >
                        {/* ORDER HEADER */}
                        <div className="flex items-center justify-between text-xs border-b border-neutral-200/60 pb-3">
                          <div>
                            <span className="font-extrabold text-neutral-950 text-base block">
                              #{ord.orderNumber}
                            </span>
                            <span className="text-[11px] text-neutral-400 font-bold">
                              Placed:{" "}
                              {new Date(ord.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="font-black text-base text-neutral-950 block">
                              ₹{Number(ord.totalAmount).toLocaleString()}
                            </span>
                            <span className="inline-block px-2.5 py-0.5 rounded-md bg-black text-white text-[10px] font-black tracking-wider uppercase mt-1">
                              Status: {rawStatusName}
                            </span>
                          </div>
                        </div>

                        {/* ORDER ITEMS LIST */}
                        <div className="space-y-3">
                          {ord.items?.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between gap-4 text-xs"
                            >
                              <div className="flex items-center gap-3.5">
                                <img
                                  src={
                                    item.productImage ||
                                    "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?q=80&w=600"
                                  }
                                  alt={item.productName}
                                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-neutral-200 shrink-0 shadow-xs"
                                />
                                <div className="space-y-1">
                                  <p className="font-extrabold text-neutral-900 text-sm leading-snug">
                                    {item.productName}
                                  </p>
                                  <p className="text-xs text-neutral-500 font-bold">
                                    {item.quantity} meters @ ₹{item.price}/m
                                  </p>
                                </div>
                              </div>
                              <span className="font-black text-neutral-950 text-sm sm:text-base shrink-0">
                                ₹
                                {(
                                  Number(item.price) * item.quantity
                                ).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* 🎯 ULTRA CLEAR HIGH-VISIBILITY STEPPER */}
                        <div className="pt-3 border-t border-neutral-200/60 space-y-3">
                          <span className="text-[11px] font-black text-neutral-500 uppercase tracking-wider block">
                            Live Fulfillment Tracker
                          </span>

                          <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-extrabold">
                            {/* STEP 1: PLACED */}
                            <div
                              className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                                currentStep >= 1
                                  ? currentStep === 1
                                    ? "bg-black text-white ring-4 ring-neutral-200 shadow-md scale-[1.02]"
                                    : "bg-emerald-600 text-white"
                                  : "bg-neutral-100 text-neutral-400"
                              }`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>1. Order Placed</span>
                            </div>

                            {/* STEP 2: PROCESSING / PREPARING */}
                            <div
                              className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                                currentStep >= 2
                                  ? currentStep === 2
                                    ? "bg-black text-white ring-4 ring-neutral-200 shadow-md scale-[1.02]"
                                    : "bg-emerald-600 text-white"
                                  : "bg-neutral-100 text-neutral-400"
                              }`}
                            >
                              <RotateCw
                                className={`w-4 h-4 ${
                                  currentStep === 2 ? "animate-spin" : ""
                                }`}
                              />
                              <span>2. Preparing / Weaving</span>
                            </div>

                            {/* STEP 3: DISPATCHED */}
                            <div
                              className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                                currentStep >= 3
                                  ? currentStep === 3
                                    ? "bg-black text-white ring-4 ring-neutral-200 shadow-md scale-[1.02]"
                                    : "bg-emerald-600 text-white"
                                  : "bg-neutral-100 text-neutral-400"
                              }`}
                            >
                              <Truck className="w-4 h-4" />
                              <span>3. Dispatched Roll</span>
                            </div>
                          </div>
                        </div>

                        {/* SHIPPING ADDRESS */}
                        <div className="text-xs font-bold text-neutral-600 flex items-center gap-1.5 pt-1">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          <span className="truncate">
                            Dispatch Address:{" "}
                            {ord.shippingAddress || "Factory Location"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* PREVIOUS COMPLETED ORDERS */}
            <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-neutral-200/80 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h2 className="text-sm md:text-base font-black text-neutral-900 flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-emerald-600" />
                  Completed Orders
                </h2>
                <span className="text-xs font-bold text-neutral-400">
                  {previousOrders.length} Fulfilled
                </span>
              </div>

              {previousOrders.length === 0 ? (
                <div className="p-10 text-center bg-neutral-50/50 border border-dashed border-neutral-200 rounded-2xl">
                  <p className="text-xs font-bold text-neutral-500">
                    No past fulfilled orders recorded yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {previousOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-extrabold text-neutral-950 block">
                          #{ord.orderNumber}
                        </span>
                        <span className="text-[11px] font-bold text-neutral-400">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-neutral-950 block">
                          ₹{Number(ord.totalAmount).toLocaleString()}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md uppercase mt-0.5">
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
