import React, { Suspense } from "react";
import Link from "next/link";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink,
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
  ArrowLeft,
  CheckCircle2,
  Truck,
  PackageCheck,
  MapPin,
  Calendar,
  CreditCard,
  Package,
  RotateCw,
} from "lucide-react";

// Exact Order Details Skeleton matching layout
function OrderDetailSkeleton() {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar userProfile={null} userEmail="" role="BUYER" />
      <SidebarInset className="min-h-screen bg-[#F8F9FA]">
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-black/5 px-6 bg-white sticky top-0 z-20">
          <Skeleton className="h-6 w-6 rounded-md" />
          <Separator orientation="vertical" className="h-4 bg-black/10" />
          <Skeleton className="h-4 w-48 rounded-md" />
        </header>
        <main className="p-4 sm:p-6 md:p-8 max-w-[1200px] mx-auto w-full space-y-6">
          <Skeleton className="h-4 w-32 rounded-md" />
          {/* TOP BAR SKELETON */}
          <div className="bg-white p-6 rounded-3xl border border-black/5 flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-5 w-28 rounded-full" />
              <Skeleton className="h-8 w-48 rounded-xl" />
              <Skeleton className="h-4 w-40 rounded-md" />
            </div>
            <div className="space-y-2 text-right">
              <Skeleton className="h-4 w-24 rounded-md ml-auto" />
              <Skeleton className="h-8 w-32 rounded-xl ml-auto" />
            </div>
          </div>
          {/* TIMELINE SKELETON */}
          <div className="bg-white p-6 rounded-3xl border border-black/5 space-y-4">
            <Skeleton className="h-6 w-48 rounded-md" />
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </div>
          </div>
          {/* TWO COLUMN SKELETON */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-black/5 space-y-4">
              <Skeleton className="h-6 w-40 rounded-md" />
              <div className="p-4 rounded-2xl bg-neutral-50 flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-full shrink-0" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48 rounded-md" />
                    <Skeleton className="h-4 w-32 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-md" />
              </div>
            </div>
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-black/5 space-y-4">
              <Skeleton className="h-6 w-48 rounded-md" />
              <Skeleton className="h-20 w-full rounded-2xl" />
              <Skeleton className="h-16 w-full rounded-2xl" />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

// Stepper Progress Numerical Helper
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

async function OrderDetailContent({ params }) {
  const resolvedParams = await params;
  const orderId = resolvedParams.id;
  const {
    user = null,
    profile = null,
    buyerOrders = [],
  } = (await getBuyerDashboardData()) || {};

  const order = buyerOrders.find((o) => o.id === orderId) || buyerOrders[0];

  if (!order) {
    return (
      <SidebarProvider defaultOpen={true}>
        <AppSidebar
          userProfile={profile}
          userEmail={user?.email}
          role="BUYER"
        />
        <SidebarInset className="min-h-screen bg-[#F8F9FA] p-8 text-center">
          <p className="text-sm font-bold text-neutral-500">Order not found.</p>
          <Link
            href="/buyer/orders"
            className="text-indigo-600 text-xs font-bold hover:underline mt-2 inline-block"
          >
            ← Back to Orders
          </Link>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // 🎯 Accurate Case-Insensitive Step Calculation
  const currentStep = getStepProgress(order.status);
  const rawStatusName = (order.status || "Pending").toUpperCase();

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
                  <BreadcrumbLink
                    href="/buyer/orders"
                    className="text-xs font-semibold text-neutral-500 hover:text-black"
                  >
                    Orders
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-extrabold text-xs text-neutral-900 uppercase tracking-wider">
                    Order #{order.orderNumber}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* MAIN BODY */}
        <main className="p-4 sm:p-6 md:p-8 max-w-[1200px] mx-auto w-full space-y-6">
          <Link
            href="/buyer/orders"
            className="inline-flex items-center gap-1 text-xs font-bold text-neutral-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to My Orders
          </Link>

          {/* TOP ORDER BAR */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black text-white bg-black px-3 py-1 rounded-md uppercase tracking-wider">
                Order Status:{" "}
                <span className="text-emerald-400">{rawStatusName}</span>
              </span>
              <h1 className="text-2xl font-bold text-neutral-900 mt-2">
                Order #{order.orderNumber}
              </h1>
              <p className="text-xs md:text-sm font-semibold text-neutral-500 mt-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  dateStyle: "full",
                })}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs md:text-sm font-bold text-neutral-500 block uppercase">
                Total Amount
              </span>
              <span className="text-2xl font-bold text-neutral-900">
                ₹{Number(order.totalAmount).toLocaleString()}
              </span>
            </div>
          </div>

          {/* 🎯 LIVE STEPPER FULFILLMENT TIMELINE */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="text-sm md:text-base font-black text-neutral-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-black" /> Live Shipment Progress
              </h2>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase">
                Current Stage: Step {currentStep} of 4
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs pt-2">
              {/* STEP 1: PLACED */}
              <div
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                  currentStep >= 1
                    ? currentStep === 1
                      ? "bg-black text-white border-black ring-4 ring-neutral-200 shadow-md"
                      : "bg-emerald-600 text-white border-emerald-600"
                    : "bg-neutral-50 text-neutral-400 border-neutral-200"
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-extrabold">1. Order Placed</span>
                <span className="text-[10px] opacity-80">Confirmed</span>
              </div>

              {/* STEP 2: PREPARING / PROCESSING */}
              <div
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                  currentStep >= 2
                    ? currentStep === 2
                      ? "bg-black text-white border-black ring-4 ring-neutral-200 shadow-md"
                      : "bg-emerald-600 text-white border-emerald-600"
                    : "bg-neutral-50 text-neutral-400 border-neutral-200"
                }`}
              >
                <RotateCw
                  className={`w-5 h-5 ${currentStep === 2 ? "animate-spin" : ""}`}
                />
                <span className="font-extrabold">2. Preparing / Weaving</span>
                <span className="text-[10px] opacity-80">Mill Production</span>
              </div>

              {/* STEP 3: DISPATCHED / SHIPPED */}
              <div
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                  currentStep >= 3
                    ? currentStep === 3
                      ? "bg-black text-white border-black ring-4 ring-neutral-200 shadow-md"
                      : "bg-emerald-600 text-white border-emerald-600"
                    : "bg-neutral-50 text-neutral-400 border-neutral-200"
                }`}
              >
                <Truck className="w-5 h-5" />
                <span className="font-extrabold">3. Dispatched Roll</span>
                <span className="text-[10px] opacity-80">In Transit</span>
              </div>

              {/* STEP 4: DELIVERED / COMPLETED */}
              <div
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                  currentStep >= 4
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                    : "bg-neutral-50 text-neutral-400 border-neutral-200"
                }`}
              >
                <PackageCheck className="w-5 h-5" />
                <span className="font-extrabold">4. Delivered</span>
                <span className="text-[10px] opacity-80">Fulfilled</span>
              </div>
            </div>
          </div>

          {/* TWO COLUMN PRODUCT DETAILS & SHIPPING INFO */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT: PRODUCTS LIST */}
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-2xs space-y-4">
              <h2 className="text-sm md:text-base font-black text-neutral-900 border-b border-neutral-100 pb-3">
                Ordered Fabric Items
              </h2>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#FBFBFC] border border-neutral-200/80 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          item.productImage ||
                          "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?q=80&w=600"
                        }
                        alt={item.productName}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-neutral-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-sm sm:text-base text-neutral-900">
                          {item.productName}
                        </h3>
                        <p className="text-xs text-neutral-500 font-bold">
                          {item.quantity} meters @ ₹{item.price}/meter
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-extrabold text-sm sm:text-base text-neutral-900 block">
                        ₹{(Number(item.price) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: SHIPPING ADDRESS & PAYMENT */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-2xs space-y-4">
              <h2 className="text-sm md:text-base font-black text-neutral-900 border-b border-neutral-100 pb-3">
                Delivery & Shipping Address
              </h2>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#FBFBFC] border border-neutral-200/80">
                  <MapPin className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-neutral-500 block uppercase text-[10px] tracking-wider">
                      Shipping Address
                    </span>
                    <p className="font-bold text-neutral-900 mt-1 leading-relaxed">
                      {order.shippingAddress || "Factory Address"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-[#FBFBFC] border border-neutral-200/80">
                  <CreditCard className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-neutral-500 block uppercase text-[10px] tracking-wider">
                      Payment Method
                    </span>
                    <p className="font-bold mt-0.5 text-neutral-900">
                      Direct Mill Checkout (Paid)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function BuyerOrderDetailPage(props) {
  return (
    <Suspense fallback={<OrderDetailSkeleton />}>
      <OrderDetailContent {...props} />
    </Suspense>
  );
}
