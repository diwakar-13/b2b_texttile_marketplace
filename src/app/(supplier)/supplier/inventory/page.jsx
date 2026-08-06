import React from "react";
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
import { products, productImages } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Plus, Package, Store } from "lucide-react";
import Link from "next/link";
import InventoryTable from "@/components/supplier/InventoryTable";

export default async function SupplierInventoryPage() {
  const { user, profile, supplier } = await getSupplierDashboardData();

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
            Please complete your supplier profile to view your inventory.
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

  // Fetch supplier products with primary images
  const supplierProducts = await db
    .select({
      id: products.id,
      name: products.name,
      material: products.material,
      composition: products.composition,
      gsm: products.gsm,
      width: products.width,
      color: products.color,
      price: products.price,
      stock: products.stock,
      moq: products.moq,
      isAvailable: products.isAvailable,
      createdAt: products.createdAt,
      imageUrl: productImages.imageUrl,
    })
    .from(products)
    .leftJoin(productImages, eq(products.id, productImages.productId))
    .where(eq(products.supplierId, supplier.id))
    .orderBy(desc(products.createdAt));

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar
        userProfile={profile}
        userEmail={user?.email}
        role="SUPPLIER"
      />
      <SidebarInset className="min-h-screen bg-[#FAFBFD] text-neutral-900 font-sans">
        {/* HEADER */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200/60 px-6 sm:px-8 bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4 bg-neutral-200" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-extrabold text-xs tracking-wide text-neutral-900 uppercase">
                    Inventory & Catalog
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <Link
            href="/supplier/inventory/add"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 transition-all text-xs font-bold shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Fabric</span>
          </Link>
        </header>

        {/* BODY CONTENT */}
        <div className="p-4 sm:p-6 md:p-8 max-w-[1300px] mx-auto w-full space-y-6 sm:space-y-8">
          {/* HEADER BANNER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200/70 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight flex items-center gap-2">
                <span>Fabric Catalog & Stock</span>
                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-black bg-neutral-100 text-neutral-900 border border-neutral-200">
                  {supplierProducts.length} Items
                </span>
              </h1>
              <p className="text-xs md:text-sm font-medium text-neutral-500 mt-1">
                Manage your listed fabrics, update stock levels, MOQ, and prices
                per meter.
              </p>
            </div>
          
          </div>

          {/* INVENTORY TABLE COMPONENT */}
          <InventoryTable initialProducts={supplierProducts} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
