import React from "react";
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
import SupplierProfileForm from "@/components/supplier/SupplierProfileForm";

export default async function SupplierProfilePage() {
  const { user, profile, supplier } = await getSupplierDashboardData();

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar
        userProfile={profile}
        userEmail={user?.email}
        role="SUPPLIER"
      />
      <SidebarInset className="min-h-screen bg-[#FAFBFD] text-neutral-950 font-sans">
        {/* HEADER */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200/60 px-6 sm:px-8 bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4 bg-neutral-200" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-black text-xs tracking-wide text-neutral-900 uppercase">
                    Mill & Business Profile
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* BODY CONTENT */}
        <div className="p-4 sm:p-6 md:p-8 max-w-[1000px] mx-auto w-full space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200/70 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight">
                Business & Mill Profile Settings
              </h1>
              <p className="text-xs font-semibold text-neutral-500 mt-1">
                Update your textile mill name, operating hours, contact details, and MOQ guidelines.
              </p>
            </div>
          </div>

          {/* EDIT FORM COMPONENT */}
          <SupplierProfileForm
            profile={profile}
            supplier={supplier}
            userEmail={user?.email}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}