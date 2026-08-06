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
} from "lucide-react";

// Exact Right Side Layout Skeleton
function OrdersSkeleton() {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar userProfile={null} userEmail="" role="BUYER" />
      <SidebarInset className="min-h-screen bg-[#F8F9FA]">
        {/* HEADER SKELETON */}
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-black/5 px-6 bg-white sticky top-0 z-20">
          <Skeleton className="h-6 w-6 rounded-md" />
          <Separator orientation="vertical" className="h-4 bg-black/10" />
          <Skeleton className="h-4 w-36 rounded-md" />
        </header>

        {/* BODY SKELETON */}
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
                  <BreadcrumbPage className="font-bold text-sm text-neutral-900">
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
              <ShoppingBag className="w-6 h-6 text-green-500" /> My Orders & History
            </h1>
            <p className="text-xs md:text-sm font-semibold text-neutral-500 mt-1">
              View full breakdown, track live shipment status, and inspect items.
            </p>
          </div>

          {buyerOrders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-black/5 space-y-3 shadow-2xs">
              <Package className="w-10 h-10 text-neutral-300 mx-auto" />
              <p className="text-sm font-bold text-neutral-700">No orders placed yet</p>
              <Link
                href="/marketplace"
                className="inline-block text-xs font-extrabold px-4 py-2 rounded-xl bg-black text-white hover:bg-neutral-800 transition-colors"
              >
                Browse Marketplace →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {buyerOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white p-5 sm:p-6 rounded-3xl border border-black/5 shadow-2xs space-y-4 hover:border-black/20 transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-3">
                    <div>
                      <span className="font-bold text-base text-neutral-900 block">
                        Order #{ord.orderNumber}
                      </span>
                      <span className="text-xs md:text-sm text-neutral-500 font-medium">
                        Placed on {new Date(ord.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-base font-extrabold text-neutral-900">
                        ₹{Number(ord.totalAmount).toLocaleString()}
                      </span>
                      <Link
                        href={`/buyer/orders/${ord.id}`}
                        className="flex items-center gap-1 text-xs font-extrabold text-black hover:text-green-500 bg-gray-200 px-3 py-1.5 rounded-xl transition-colors"
                      >
                        Order Details <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* ITEMS LIST */}
                  <div className="space-y-3">
                    {ord.items?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
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
                              Quantity: {item.quantity} meters @ ₹{item.price}/m
                            </p>
                          </div>
                        </div>

                        <span className="font-extrabold text-xs sm:text-sm text-neutral-900 shrink-0">
                          ₹{(Number(item.price) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* QUICK TRACKING STATUS BAR */}
                  <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs md:text-sm">
                    <span className="font-bold text-neutral-500">
                      Status:{" "}
                      <span className="font-extrabold uppercase text-green-600">
                        {ord.status}
                      </span>
                    </span>
                    <span className="text-neutral-500 truncate max-w-[280px] font-semibold">
                      📍 {ord.shippingAddress}
                    </span>
                  </div>
                </div>
              ))}
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