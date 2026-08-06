import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getBuyerDashboardData } from "@/action/getBuyerDashboardData";
import { ProfileForm } from "./_components/ProfileForm";
import { User } from "lucide-react";


export default async function BuyerProfilePage() {
  const {
    user = null,
    profile = null,
    buyer = null,
  } = (await getBuyerDashboardData()) || {};

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar userProfile={profile} userEmail={user?.email} role="BUYER" />
      <SidebarInset className="min-h-screen bg-[#F8F9FA] text-neutral-900 font-sans">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-black/5 px-6 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4 bg-black/10" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-bold text-sm text-neutral-900">
                    Profile Details
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="p-4 sm:p-6 md:p-8 max-w-[1000px] mx-auto w-full space-y-6">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-neutral-900 flex items-center gap-2">
              <User className="w-6 h-6 text-black" /> Account & Profile Settings
            </h1>
            <p className="text-sm md:text-lg font-medium text-neutral-600 mt-1">
              Update your personal details, business info, and profile image.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/5 shadow-2xs">
            <ProfileForm profile={profile} user={user} buyer={buyer} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
