"use client";

import * as React from "react";
import Link from "next/link";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Store,
  User,
} from "lucide-react";

export function AppSidebar({
  userProfile,
  userEmail,
  role = "BUYER",
  ...props
}) {
  const isSupplier = role === "SUPPLIER";

  const data = {
    user: {
      name: userProfile?.fullName || (isSupplier ? "Supplier" : "Buyer"),
      email: userEmail || "user@textil.com",
      avatar: userProfile?.avatar || "",
      role: role,
    },
    navMain: isSupplier
      ? [
          {
            title: "Supplier Dashboard",
            url: "/supplier/dashboard",
            icon: LayoutDashboard,
          },
          {
            title: "Inventory & Catalog",
            url: "/supplier/inventory",
            icon: Package,
          },
          {
            title: "Incoming Orders",
            url: "/supplier/orders",
            icon: ShoppingBag,
          },
        ]
      : [
          {
            title: "Dashboard",
            url: "/buyer/dashboard",
            icon: LayoutDashboard,
          },
          {
            title: "My Orders & Tracking",
            url: "/buyer/orders",
            icon: ShoppingBag,
          },
        ],
  };

  return (
    <Sidebar variant="inset" className="bg-white" {...props}>
      <SidebarHeader className="bg-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-neutral-100">
              <Link href="/" className="flex items-center gap-2 w-full">
                <span className="size-7 sm:size-8 rounded-xl bg-[#111111] text-white flex items-center justify-center font-extrabold text-xs sm:text-sm shadow-xs">
                  T
                </span>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-neutral-900">
                    Textil.
                  </span>
                  <span className="truncate text-neutral-500 text-xs">
                    {isSupplier
                      ? "Supplier Portal"
                      : "A B2B Textile Marketplace"}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-white">
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter className="bg-white">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
