import React from "react";
import Link from "next/link";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getBuyerDashboardData } from "@/action/getBuyerDashboardData";
import {
  Search,
  ArrowRight,
  ArrowUpRight,
  ShoppingBag,
  Layers,
  Wallet,
  Sparkles,
  PackageCheck,
  Clock,
  ChevronRight,
} from "lucide-react";

export default async function BuyerDashboardPage() {
  const {
    user = null,
    profile = null,
    buyer = null,
    catalogProducts = [],
    buyerOrders = [],
  } = (await getBuyerDashboardData()) || {};

  const trendingTags = ["Cotton", "Organic Cotton", "Silk", "Linen", "Denim"];

  return (
    <SidebarProvider>
      {/* Real profile and user.email passed directly to Sidebar */}
      <AppSidebar userProfile={profile} userEmail={user?.email} role="BUYER" />

      <SidebarInset className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] mesh-gradient overflow-hidden">
        <div className="noise" />

        {/* HEADER */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--border)] px-6 backdrop-blur-md bg-[var(--glass)] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1 text-[var(--foreground)]" />
            <Separator
              orientation="vertical"
              className="h-4 bg-[var(--border)]"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink
                    href="/buyer/dashboard"
                    className="text-[var(--text-secondary)] hover:text-[var(--foreground)] font-semibold"
                  >
                    Buyer Portal
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-bold text-[var(--foreground)]">
                    Dashboard Overview
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <Link
            href="/buyer/ai-chat"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 hover:bg-[var(--accent)] hover:text-white transition-all text-xs font-bold shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Fabric Assistant</span>
          </Link>
        </header>

        {/* DASHBOARD CONTENT BODY */}
        <div className="flex flex-1 flex-col gap-8 p-6 md:p-8 relative z-10 max-w-[1500px] mx-auto w-full">
          {/* SEARCH HERO SECTION */}
          <section className="relative w-full min-h-[360px] md:min-h-[420px] rounded-[32px] overflow-hidden flex items-center p-6 sm:p-10 border border-[var(--border)] shadow-md">
            <div className="absolute inset-0 w-full h-full z-0">
              <img
                src="/hero.jpg"
                alt="Hero Background"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 w-full max-w-[580px] bg-[var(--glass)] backdrop-blur-xl p-6 sm:p-8 rounded-[28px] border border-[var(--glass-border)] shadow-lg space-y-5">
              <div>
                <span className="text-[11px] font-bold text-[var(--accent)] tracking-wider uppercase px-3 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20">
                  Buyer Workspace
                </span>
                <h1 className="text-2xl sm:text-3xl font-heading font-medium text-[var(--foreground)] mt-2">
                  Welcome back, {profile?.fullName?.split(" ")[0] || "Buyer"}
                </h1>
                <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium">
                  {user?.email}
                </p>
              </div>

              <div className="relative flex items-center bg-[var(--surface-2)] rounded-full p-2 border border-[var(--border)]">
                <Search className="w-5 h-5 text-[var(--text-muted)] ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search fabrics, GSM, MOQ, material..."
                  className="w-full bg-transparent px-3 text-xs sm:text-sm font-semibold text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none"
                />
                <button className="size-10 rounded-full bg-[var(--accent)] hover:bg-indigo-600 text-white flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-md">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-bold text-[var(--text-muted)] tracking-wider uppercase">
                  Trending Fabric Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {trendingTags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-[var(--surface-3)] hover:bg-[var(--surface-2)] text-[var(--foreground)] border border-[var(--border)] flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
                    >
                      {tag}{" "}
                      <ArrowUpRight className="w-3 h-3 text-[var(--text-muted)]" />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* METRIC CARDS */}
          <div className="grid auto-rows-min gap-5 md:grid-cols-3">
            <div className="p-6 rounded-[24px] glass-card space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  Business Type
                </span>
                <div className="p-2.5 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
                  <Layers className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-black text-[var(--foreground)]">
                {buyer?.businessType || "N/A"}
              </p>
            </div>

            <div className="p-6 rounded-[24px] glass-card space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  Target Industry
                </span>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-black text-[var(--foreground)]">
                {buyer?.industry || "N/A"}
              </p>
            </div>

            <div className="p-6 rounded-[24px] glass-card space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  Budget Capacity
                </span>
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-black text-[var(--foreground)]">
                {buyer?.budgetRange || "N/A"}
              </p>
            </div>
          </div>

          {/* RECENT ORDERS & CATALOG GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 rounded-[32px] glass-card p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                <div className="flex items-center gap-2">
                  <PackageCheck className="w-5 h-5 text-[var(--accent)]" />
                  <h2 className="text-xl font-heading font-medium text-[var(--foreground)]">
                    Your Orders
                  </h2>
                </div>
                <Link
                  href="/buyer/orders"
                  className="text-xs font-bold text-[var(--accent)] hover:underline flex items-center gap-1"
                >
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {buyerOrders && buyerOrders.length > 0 ? (
                <div className="space-y-3">
                  {buyerOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-[var(--foreground)]">
                          {ord.orderNumber}
                        </span>
                        <p className="text-xs font-medium text-[var(--text-secondary)]">
                          Total: ${ord.totalAmount}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                        <Clock className="w-3 h-3" />
                        {ord.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center border border-dashed border-[var(--border)] rounded-[20px] bg-[var(--surface-2)]/40 space-y-2">
                  <p className="text-xs font-bold text-[var(--text-secondary)]">
                    No active orders placed yet.
                  </p>
                  <Link
                    href="/explore"
                    className="inline-block text-xs font-bold text-[var(--accent)] hover:underline"
                  >
                    Start Sourcing Fabrics →
                  </Link>
                </div>
              )}
            </div>

            <div className="lg:col-span-6 rounded-[32px] glass-card p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                <h2 className="text-xl font-heading font-medium text-[var(--foreground)]">
                  Live Products Catalog
                </h2>
                <Link
                  href="/explore"
                  className="text-xs font-bold text-[var(--accent)] hover:underline"
                >
                  Browse All
                </Link>
              </div>

              {catalogProducts && catalogProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {catalogProducts.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--accent)] transition-all space-y-3"
                    >
                      <div className="h-28 rounded-xl bg-[var(--surface-3)] overflow-hidden relative">
                        <img
                          src={item.imageUrl || "/hero.jpg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[var(--foreground)] truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                          ${item.price}/m • MOQ: {item.moq || 0}m
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center border border-dashed border-[var(--border)] rounded-[20px] bg-[var(--surface-2)]/40 space-y-2">
                  <p className="text-xs font-bold text-[var(--text-secondary)]">
                    Matching Preferences:{" "}
                    <span className="text-[var(--accent)] font-bold">
                      {buyer?.preferredFabric || "Cotton, Silk"}
                    </span>
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    No products added in supplier inventory yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
