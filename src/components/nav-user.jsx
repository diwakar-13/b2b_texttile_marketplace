"use client";

import { logout } from "@/action/auth/logout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronsUpDownIcon, LogOutIcon, UserIcon } from "lucide-react";
import Link from "next/link";

export function NavUser({ user }) {
  const { isMobile } = useSidebar();

  // Profile link according to role
  const profileLink =
    user.role === "SUPPLIER" ? "/supplier/profile" : "/buyer/profile";
  const fallback = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="aria-expanded:bg-neutral-100"
              />
            }
          >
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-black text-white font-bold">
                {fallback}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-bold text-neutral-900">
                {user.name}
              </span>
              <span className="truncate text-xs text-neutral-500">
                {user.email}
              </span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4 text-neutral-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-md bg-white shadow-lg border border-black/5"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-2 font-normal">
                <div className="flex items-center gap-2.5 text-left text-sm">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-black text-white font-bold">
                      {fallback}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-bold text-neutral-900">
                      {user.name}
                    </span>
                    <span className="truncate text-xs text-neutral-500">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                asChild
                className="cursor-pointer font-bold text-xs py-2"
              >
                <Link
                  href={profileLink}
                  className="flex items-center gap-2 w-full"
                >
                  <UserIcon className="w-4 h-4 text-neutral-600" />
                  <span>Account & Profile</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer font-bold text-xs  py-2"
              onClick={async () => {
                await logout();
              }}
            >
              <LogOutIcon className="w-4 h-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
