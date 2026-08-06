"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavMain({ items }) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu className="space-y-1">
        {items?.map((item) => {
          const IconComponent = item.icon;

          const isActive =
            pathname === item.url ||
            (item.url.startsWith("#") &&
              typeof window !== "undefined" &&
              window.location.hash === item.url);

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isActive}
                className={`transition-colors duration-150 ${
                  isActive
                    ? "bg-neutral-200 text-black font-bold"
                    : "hover:bg-neutral-100 text-neutral-700"
                }`}
              >
                <Link
                  href={item.url}
                  className="flex items-center gap-3 w-full py-1"
                >
                  {React.isValidElement(IconComponent) ? (
                    IconComponent
                  ) : typeof IconComponent === "function" ||
                    typeof IconComponent === "object" ? (
                    <IconComponent
                      className={`size-4 shrink-0 ${
                        isActive ? "text-black" : "text-neutral-500"
                      }`}
                    />
                  ) : null}
                  <span className="font-medium text-xs">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
