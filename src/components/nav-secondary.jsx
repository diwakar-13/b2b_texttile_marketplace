"use client";

import * as React from "react";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavSecondary({ items, ...props }) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items?.map((item) => {
            const IconComponent = item.icon;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton size="sm" className="hover:bg-zinc-300">
                  <Link href={item.url} className="flex items-center gap-2 w-full">
                    {React.isValidElement(IconComponent) ? (
                      IconComponent
                    ) : typeof IconComponent === "function" || typeof IconComponent === "object" ? (
                      <IconComponent className="size-4 shrink-0" />
                    ) : null}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}