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

import { LayoutDashboard, User, ShoppingBag } from "lucide-react";

export function AppSidebar({ userProfile, userEmail, ...props }) {
  const data = {
    user: {
      name: userProfile?.fullName || "Buyer",
      email: userEmail || "buyer@textil.com",
      avatar: userProfile?.avatar || "",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/buyer/dashboard",
        icon: LayoutDashboard,
        isActive: true,
      },
      {
        title: "My Orders & Tracking",
        url: "/buyer/orders",
        icon: ShoppingBag,
      },
    ],
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
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
                  <span className="truncate text-neutral-500 text-xs ">
                    A B2B Textile Marketplace
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
