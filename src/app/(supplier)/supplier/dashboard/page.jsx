import React, { Suspense } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getSupplierDashboardData } from "@/action/getSupplierDashboardData";
import { db } from "@/db";
import { products, orderItems, orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  Package,
  Clock,
  TrendingUp,
  Store,
  MapPin,
  Phone,
  Plus,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import SupplierDashboardSkeleton from "@/components/supplier/SupplierDashboardSkeleton";

async function DashboardContent() {
  const { profile, supplier } = await getSupplierDashboardData();

  if (!supplier) {
    return (
      <div className="min-h-screen bg-[#FAFBFD] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-xl text-center space-y-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
            <Store className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-extrabold text-neutral-900 tracking-tight">
            Onboarding Incomplete
          </h2>
          <p className="text-xs font-semibold text-neutral-500">
            Please complete your supplier profile to access your dashboard.
          </p>
          <Link
            href="/complete-profile"
            className="inline-flex items-center justify-center w-full py-3 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors"
          >
            Complete Setup
          </Link>
        </div>
      </div>
    );
  }

  const supplierProducts = await db
    .select()
    .from(products)
    .where(eq(products.supplierId, supplier.id));

  const incomingOrderItems = await db
    .select({
      orderItemId: orderItems.id,
      quantity: orderItems.quantity,
      price: orderItems.price,
      status: orders.status,
      productName: products.name,
    })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(eq(products.supplierId, supplier.id));

  const totalProducts = supplierProducts.length;
  const pendingOrdersCount = incomingOrderItems.filter(
    (o) => o.status === "pending" || o.status === "processing",
  ).length;
  const totalRevenue = incomingOrderItems.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0,
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1300px] mx-auto w-full space-y-6 sm:space-y-8">
      {/* WELCOME BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 p-6 rounded-3xl border border-neutral-200/70 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight flex items-center gap-2">
              <span>
                Welcome,{" "}
                {supplier?.businessName || profile?.fullName || "Supplier"}
              </span>
              <span
                className="inline-block animate-bounce text-2xl"
                style={{ animationDuration: "2s" }}
              >
                🏭
              </span>
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Mill
            </span>
          </div>
          <p className="text-xs md:text-sm font-medium text-neutral-500 mt-1">
            Manage your textile inventory, set price tiers, and fulfill buyer
            RFQs.
          </p>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-6 rounded-3xl bg-white/80 border border-neutral-200/70 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-wider text-neutral-500">
              Total Catalog Products
            </span>
            <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-black text-neutral-950 tracking-tight">
              {totalProducts}
            </p>
            <span className="text-[11px] font-bold text-neutral-400">
              Fabrics Listed
            </span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-neutral-200/70 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-wider text-neutral-500">
              Pending Orders
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-black text-amber-600 tracking-tight">
              {pendingOrdersCount}
            </p>
            <span className="text-[11px] font-bold text-amber-600/80 bg-amber-50 px-2 py-0.5 rounded-md">
              Action Required
            </span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-neutral-200/70 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-wider text-neutral-500">
              Total Sales Volume
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-black text-neutral-950 tracking-tight">
              ₹{totalRevenue.toLocaleString()}
            </p>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
              Gross Revenue <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* SUMMARY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-neutral-200/70 space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <h2 className="text-sm md:text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Store className="w-4 h-4 text-neutral-700" /> Mill & Business
              Profile
            </h2>
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-[#FBFBFC] border border-neutral-200/50 space-y-1">
              <span className="text-[12px] font-bold text-neutral-500 uppercase tracking-wider block">
                Company Name
              </span>
              <p className="font-bold text-neutral-950 text-sm">
                {supplier?.businessName || "Not Set"}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FBFBFC] border border-neutral-200/50 space-y-1">
              <span className="text-[12px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                <Phone className="w-3 h-3" /> Contact Phone
              </span>
              <p className="font-bold text-neutral-800 text-xs">
                {supplier?.contactNumber || profile?.phone || "Not Set"}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FBFBFC] border border-neutral-200/50 space-y-1">
              <span className="text-[12px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Mill Address
              </span>
              <p className="font-bold text-neutral-800 text-xs leading-relaxed">
                {supplier?.businessAddress || "Not Set"}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-neutral-200/70 space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm md:text-lg font-bold text-neutral-900">
                Fabric Inventory
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[12px] font-black bg-neutral-100 text-neutral-700">
                {supplierProducts.length}
              </span>
            </div>
            <Link
              href="/supplier/inventory"
              className="text-xs md:text-sm font-bold text-neutral-900 hover:text-neutral-600 flex items-center gap-1"
            >
              Manage Catalog <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {supplierProducts.length === 0 ? (
            <div className="py-12 px-6 text-center bg-[#FBFBFC] rounded-2xl border border-dashed border-neutral-200 space-y-3">
              <Package className="w-6 h-6 text-neutral-400 mx-auto" />
              <p className="text-xs font-bold text-neutral-800">
                No fabrics listed yet.
              </p>
              <Link
                href="/supplier/inventory/add"
                className="inline-flex items-center px-4 py-2 bg-neutral-950 text-white rounded-xl text-xs font-bold"
              >
                + Add Your First Fabric
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {supplierProducts.slice(0, 4).map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 rounded-2xl bg-[#FBFBFC] border border-neutral-200/60 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <span className="font-extrabold text-neutral-950 text-sm block truncate">
                      {prod.name}
                    </span>
                    <div className="flex items-center gap-3 text-[11px] text-neutral-500 font-semibold">
                      <span>
                        Stock:{" "}
                        <strong className="text-neutral-800">
                          {prod.stock}m
                        </strong>
                      </span>
                      <span>•</span>
                      <span>
                        MOQ:{" "}
                        <strong className="text-neutral-800">
                          {prod.moq}m
                        </strong>
                      </span>
                    </div>
                  </div>
                  <span className="font-black text-neutral-950 text-base shrink-0 bg-white px-3 py-1.5 rounded-xl border border-neutral-200/60">
                    ₹{Number(prod.price).toLocaleString()}/m
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function SupplierDashboardPage() {
  const { user, profile } = await getSupplierDashboardData();

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar
        userProfile={profile}
        userEmail={user?.email}
        role="SUPPLIER"
      />
      <SidebarInset className="min-h-screen bg-[#FAFBFD] text-neutral-900 font-sans">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200/60 px-6 sm:px-8 bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4 bg-neutral-200" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-extrabold text-xs tracking-wide text-neutral-900 uppercase">
                    Supplier Workspace
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <Link
            href="/supplier/inventory/add"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 text-white hover:bg-neutral-950 transition-all text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Add Fabric</span>
          </Link>
        </header>

        {/* 🎯 SKELETON BOUNDARY */}
        <Suspense fallback={<SupplierDashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
