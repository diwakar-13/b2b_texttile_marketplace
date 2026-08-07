import React, { Suspense } from "react";
import Link from "next/link";
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
import { Skeleton } from "@/components/ui/skeleton";
import { getBuyerDashboardData } from "@/action/getBuyerDashboardData";
import {
  Package,
  ChevronRight,
  ShoppingBag,
  CheckCircle2,
  Truck,
  RotateCw,
  MapPin,
} from "lucide-react";

// Skeleton Loading
function OrdersSkeleton() {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar userProfile={null} userEmail="" role="BUYER" />
      <SidebarInset className="min-h-screen bg-[#F8F9FA]">
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-black/5 px-6 bg-white sticky top-0 z-20">
          <Skeleton className="h-6 w-6 rounded-md" />
          <Separator orientation="vertical" className="h-4 bg-black/10" />
          <Skeleton className="h-4 w-36 rounded-md" />
        </header>

        <main className="p-4 sm:p-6 md:p-8 max-w-[1200px] mx-auto w-full space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 rounded-xl" />
            <Skeleton className="h-4 w-96 rounded-lg" />
          </div>

          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white p-5 sm:p-6 rounded-3xl border border-black/5 space-y-4 shadow-2xs"
              >
                <div className="flex justify-between items-center pb-3 border-b border-black/5">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-36 rounded-lg" />
                    <Skeleton className="h-3.5 w-28 rounded-md" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-20 rounded-lg" />
                    <Skeleton className="h-8 w-28 rounded-xl" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shrink-0" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48 rounded-md" />
                        <Skeleton className="h-3.5 w-36 rounded-md" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-20 rounded-md" />
                  </div>
                </div>

                <div className="pt-2 border-t border-black/5 flex items-center justify-between">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-4 w-48 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

// Status Progress Mapper
function getStepProgress(statusRaw) {
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
}

async function OrdersContent() {
  const {
    user = null,
    profile = null,
    buyerOrders = [],
  } = (await getBuyerDashboardData()) || {};

  return (
    <SidebarProvider defaultOpen={true}>
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
                  <BreadcrumbPage className="font-extrabold text-xs tracking-wider text-neutral-900 uppercase">
                    My Orders & Tracking
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* BODY */}
        <main className="p-4 sm:p-6 md:p-8 max-w-[1200px] mx-auto w-full space-y-6">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-neutral-900 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-black" /> My Orders & History
            </h1>
            <p className="text-xs md:text-sm font-semibold text-neutral-500 mt-1">
              View full breakdown, track live shipment status, and inspect
              items.
            </p>
          </div>

          {buyerOrders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-black/5 space-y-3 shadow-2xs">
              <Package className="w-10 h-10 text-neutral-300 mx-auto" />
              <p className="text-sm font-bold text-neutral-700">
                No orders placed yet
              </p>
              <Link
                href="/marketplace"
                className="inline-block text-xs font-extrabold px-4 py-2 rounded-xl bg-black text-white hover:bg-neutral-800 transition-colors"
              >
                Browse Marketplace →
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {buyerOrders.map((ord) => {
                const currentStep = getStepProgress(ord.status);
                const rawStatusName = (ord.status || "Pending").toUpperCase();

                return (
                  <div
                    key={ord.id}
                    className="bg-white p-5 sm:p-6 rounded-3xl border border-neutral-200/80 shadow-2xs space-y-5 hover:border-black/20 transition-all"
                  >
                    {/* ORDER HEADER WITH ORDER DETAILS BUTTON */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-3">
                      <div>
                        <span className="font-bold text-base text-neutral-900 block">
                          Order #{ord.orderNumber}
                        </span>
                        <span className="text-xs md:text-sm text-neutral-500 font-medium">
                          Placed on{" "}
                          {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                            dateStyle: "medium",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-base font-extrabold text-neutral-900">
                          ₹{Number(ord.totalAmount).toLocaleString()}
                        </span>

                        {/* 🎯 ORDER DETAILS BUTTON RESTORED */}
                        <Link
                          href={`/buyer/orders/${ord.id}`}
                          className="flex items-center gap-1 text-xs font-extrabold text-black hover:text-white hover:bg-black bg-neutral-100 border border-neutral-200 px-3.5 py-1.5 rounded-xl transition-all shadow-2xs"
                        >
                          Order Details <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>

                    {/* ITEMS LIST */}
                    <div className="space-y-3">
                      {ord.items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3.5">
                            <img
                              src={
                                item.productImage ||
                                "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?q=80&w=600"
                              }
                              alt={item.productName}
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-black/10 shrink-0"
                            />
                            <div>
                              <p className="font-extrabold text-xs sm:text-sm text-neutral-900">
                                {item.productName}
                              </p>
                              <p className="text-xs md:text-sm text-neutral-500 font-semibold mt-0.5">
                                Quantity: {item.quantity} meters @ ₹{item.price}
                                /m
                              </p>
                            </div>
                          </div>

                          <span className="font-extrabold text-xs sm:text-sm text-neutral-900 shrink-0">
                            ₹
                            {(
                              Number(item.price) * item.quantity
                            ).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* VISUAL STEPPER TRACKER */}
                    <div className="pt-3 border-t border-black/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-neutral-500 uppercase tracking-wider block">
                          Live Fulfillment Tracker
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-black text-white text-[10px] font-black tracking-wider uppercase">
                          STATUS: {rawStatusName}
                        </span>
                      </div>

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

                        {/* STEP 2: PREPARING */}
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

                    {/* ADDRESS FOOTER */}
                    <div className="pt-1 text-xs text-neutral-500 flex items-center justify-between font-semibold border-t border-black/5">
                      <span className="truncate max-w-[320px] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        Address: {ord.shippingAddress || "Factory Location"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function BuyerOrdersPage() {
  return (
    <Suspense fallback={<OrdersSkeleton />}>
      <OrdersContent />
    </Suspense>
  );
}
