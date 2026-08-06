"use client";

import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function NavMain({ items }) {
  return (
    <SidebarGroup>
     
      <SidebarMenu>
        {items?.map((item) => {
          const IconComponent = item.icon;

          return (
            <Collapsible key={item.title} defaultOpen={item.isActive}>
              <SidebarMenuItem >
                <SidebarMenuButton tooltip={item.title} className="hover:bg-zinc-300 ">
                  <Link
                    href={item.url}
                    className="flex items-center gap-2 w-full "
                  >
                    {React.isValidElement(IconComponent) ? (
                      IconComponent
                    ) : typeof IconComponent === "function" ||
                      typeof IconComponent === "object" ? (
                      <IconComponent className="size-4 shrink-0" />
                    ) : null}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>

                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger>
                      <ChevronRight className="size-4" />
                      <span className="sr-only">Toggle</span>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton>
                              <Link href={subItem.url} className="w-full">
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
