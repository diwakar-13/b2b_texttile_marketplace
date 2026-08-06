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
import {
  products,
  orderItems,
  orders,
  profiles,
  productImages,
} from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { Store } from "lucide-react";
import Link from "next/link";
import SupplierOrdersList from "@/components/supplier/SupplierOrdersList";
import SupplierOrdersSkeleton from "@/components/supplier/SupplierOrdersSkeleton";

async function OrdersContent() {
  const { supplier } = await getSupplierDashboardData();

  if (!supplier) {
    return (
      <div className="min-h-screen bg-[#FAFBFD] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-xl text-center space-y-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
            <Store className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-extrabold text-neutral-900 tracking-tight">
            Onboarding Incomplete
          </h2>
          <p className="text-xs font-semibold text-neutral-500">
            Please complete your supplier profile to view incoming orders.
          </p>
          <Link
            href="/supplier/onboarding"
            className="inline-flex items-center justify-center w-full py-3 bg-neutral-950 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors shadow-xs"
          >
            Start AI Onboarding →
          </Link>
        </div>
      </div>
    );
  }

  // 🎯 FETCH ORDER ITEMS WITH PRIMARY PRODUCT IMAGE
  const supplierOrdersRaw = await db
    .select({
      orderId: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      createdAt: orders.createdAt,
      totalAmount: orders.totalAmount,
      shippingAddress: orders.shippingAddress,
      buyerName: profiles.fullName,
      buyerPhone: profiles.phone,
      itemQuantity: orderItems.quantity,
      itemPrice: orderItems.price,
      productName: products.name,
      productMaterial: products.material,
      productGsm: products.gsm,
      productImage: productImages.imageUrl,
    })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .leftJoin(profiles, eq(orders.profileId, profiles.id))
    .leftJoin(
      productImages,
      and(
        eq(products.id, productImages.productId),
        eq(productImages.isPrimary, true),
      ),
    )
    .where(eq(products.supplierId, supplier.id))
    .orderBy(desc(orders.createdAt));

  const ordersMap = new Map();

  supplierOrdersRaw.forEach((row) => {
    if (!ordersMap.has(row.orderId)) {
      ordersMap.set(row.orderId, {
        id: row.orderId,
        orderNumber: row.orderNumber,
        status: row.status,
        createdAt: row.createdAt,
        totalAmount: row.totalAmount,
        shippingAddress: row.shippingAddress,
        buyerName: row.buyerName || "Buyer",
        buyerPhone: row.buyerPhone || "N/A",
        items: [],
      });
    }

    ordersMap.get(row.orderId).items.push({
      name: row.productName,
      material: row.productMaterial,
      gsm: row.productGsm,
      quantity: row.itemQuantity,
      price: row.itemPrice,
      image: row.productImage,
    });
  });

  const formattedOrders = Array.from(ordersMap.values());

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1300px] mx-auto w-full space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200/70 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight flex items-center gap-2">
            <span>Incoming Customer Orders</span>
            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-black bg-neutral-100 text-neutral-900 border border-neutral-200">
              {formattedOrders.length} Orders
            </span>
          </h1>
          <p className="text-xs md:text-sm font-semibold text-neutral-500 mt-1">
            View order details, track fabric meters, and update dispatch status.
          </p>
        </div>
      </div>

      <SupplierOrdersList initialOrders={formattedOrders} />
    </div>
  );
}

export default async function SupplierOrdersPage() {
  const { user, profile } = await getSupplierDashboardData();

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar
        userProfile={profile}
        userEmail={user?.email}
        role="SUPPLIER"
      />
      <SidebarInset className="min-h-screen bg-[#FAFBFD] text-neutral-950 font-sans">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200/60 px-6 sm:px-8 bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4 bg-neutral-200" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-black text-xs tracking-wide text-neutral-900 uppercase">
                    Order Management
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* 🎯 SKELETON BOUNDARY */}
        <Suspense fallback={<SupplierOrdersSkeleton />}>
          <OrdersContent />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
