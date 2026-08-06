"use client";

import * as React from "react";
import Link from "next/link";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
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
  Compass,
  Bot,
  ShoppingCart,
  ShoppingBag,
  User,
  LifeBuoy,
  Send,
} from "lucide-react";

export function AppSidebar({ userProfile, userEmail, ...props }) {
  const data = {
    user: {
      name: userProfile?.fullName || "Diwakar Pandey",
      email: userEmail || "buyer@textil.com",
      avatar: userProfile?.avatar || "/avatars/buyer.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/buyer/dashboard",
        icon: LayoutDashboard,
        isActive: true,
      },
      {
        title: "Marketplace Discovery",
        url: "/explore",
        icon: Compass,
      },
      {
        title: "AI Assistant",
        url: "/buyer/ai-chat",
        icon: Bot,
      },
      {
        title: "Shopping Cart",
        url: "/cart",
        icon: ShoppingCart,
      },
      {
        title: "Orders & History",
        url: "/buyer/orders",
        icon: ShoppingBag,
      },
      {
        title: "Buyer Profile",
        url: "/buyer/profile",
        icon: User,
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-zinc-300">
              <Link href="/" className="flex items-center gap-2 w-full">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <span className="size-7 sm:size-8 rounded-xl bg-[#111111] text-white flex items-center justify-center font-extrabold text-xs sm:text-sm shadow-xs">
                    T
                  </span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-extrabold">Textil.</span>
                  <span className="truncate text-xs">
                    B2B Textile Marketplace
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
