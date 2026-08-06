"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiArrowRight } from "react-icons/fi";
import { completeProfile } from "@/action/completeProfile";
import BuyerOnboarding from "./BuyerOnboarding";
import SupplierOnboarding from "./SupplierOnboarding";

export default function OnboardingPage() {
  const router = useRouter();
  const [role, setRole] = useState(null); // 'BUYER' | 'SUPPLIER'
  const [buyerStep, setBuyerStep] = useState(1);
  const [supplierStep, setSupplierStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // FORM STATES - BUYER
  const [buyerForm, setBuyerForm] = useState({
    businessType: "Brand / Retailer",
    industry: "Apparel & Fashion",
    categories: ["cotton"],
    preferredFabric: "100% Organic Cotton, Silk, Denim",
    typicalMOQ: "1000",
    budgetRange: "$10k - $50k",
    location: "India",
    customCategory: "",
  });

  // FORM STATES - SUPPLIER
  const [supplierForm, setSupplierForm] = useState({
    businessName: "",
    businessType: "Textile Mill",
    contactNumber: "",
    businessAddress: "",
    operatingHours: "09:00 AM - 06:00 PM",
    fabricsOffered: "Cotton, Denim",
    moq: "500",
  });

  // RESTORE STATE ON REFRESH
  useEffect(() => {
    const savedRole = localStorage.getItem("textil_onboarding_role");
    const savedBuyerStep = localStorage.getItem("textil_buyer_step");
    const savedSupplierStep = localStorage.getItem("textil_supplier_step");
    const savedBuyerForm = localStorage.getItem("textil_buyer_form");
    const savedSupplierForm = localStorage.getItem("textil_supplier_form");

    if (savedRole) setRole(savedRole);
    if (savedBuyerStep) setBuyerStep(Number(savedBuyerStep));
    if (savedSupplierStep) setSupplierStep(Number(savedSupplierStep));
    if (savedBuyerForm) {
      try {
        setBuyerForm(JSON.parse(savedBuyerForm));
      } catch (e) {}
    }
    if (savedSupplierForm) {
      try {
        setSupplierForm(JSON.parse(savedSupplierForm));
      } catch (e) {}
    }
  }, []);

  // AUTO-SAVE STATE ON CHANGES
  useEffect(() => {
    if (role) localStorage.setItem("textil_onboarding_role", role);
    localStorage.setItem("textil_buyer_step", buyerStep.toString());
    localStorage.setItem("textil_supplier_step", supplierStep.toString());
    localStorage.setItem("textil_buyer_form", JSON.stringify(buyerForm));
    localStorage.setItem("textil_supplier_form", JSON.stringify(supplierForm));
  }, [role, buyerStep, supplierStep, buyerForm, supplierForm]);

  const categories = [
    { id: "cotton", label: "Cotton Fabrics", icon: "🛍️" },
    { id: "linen", label: "Linen Fabrics", icon: "📄" },
    { id: "silk", label: "Silk Fabrics", icon: "🧵" },
    { id: "denim", label: "Denim Fabrics", icon: "👖" },
    { id: "wool", label: "Wool Fabrics", icon: "🧶" },
    { id: "synthetic", label: "Synthetic Fabrics", icon: "🧪" },
    { id: "blended", label: "Blended Fabrics", icon: "🎒" },
    { id: "technical", label: "Technical Fabrics", icon: "⚙️" },
  ];

  const stepperList = [
    { step: 1, label: "Business Type" },
    { step: 2, label: "Industry" },
    { step: 3, label: "Interested Categories" },
    { step: 4, label: "Preferred Fabrics" },
    { step: 5, label: "Typical MOQ" },
    { step: 6, label: "Budget Range" },
    { step: 7, label: "Business Location" },
  ];

  const toggleCategory = (id) => {
    setBuyerForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(id)
        ? prev.categories.filter((item) => item !== id)
        : [...prev.categories, id],
    }));
  };

  const handleNextBuyerStep = () => {
    if (buyerStep < 7) {
      setBuyerStep((prev) => prev + 1);
    } else {
      handleFinalSubmit();
    }
  };

  // 🔴 FIXED HERE: Changed 8 to 5 because Supplier flow has 5 steps
  const handleNextSupplierStep = () => {
    if (supplierStep < 5) {
      setSupplierStep((prev) => prev + 1);
    } else {
      handleFinalSubmit();
    }
  };

  async function handleFinalSubmit() {
    setLoading(true);
    const formData = new FormData();
    formData.append("role", role);

    if (role === "BUYER") {
      formData.append("businessType", buyerForm.businessType);
      formData.append("industry", buyerForm.industry);
      formData.append(
        "preferredFabric",
        buyerForm.preferredFabric || buyerForm.categories.join(", "),
      );
      formData.append("typicalOrderQuantity", buyerForm.typicalMOQ);
      formData.append("budgetRange", buyerForm.budgetRange);
    } else {
      formData.append("businessName", supplierForm.businessName);
      formData.append("businessType", supplierForm.businessType);
      formData.append("contactNumber", supplierForm.contactNumber);
      formData.append("businessAddress", supplierForm.businessAddress);
      formData.append("operatingHours", supplierForm.operatingHours);
      formData.append("fabricsOffered", supplierForm.fabricsOffered);
      formData.append("minimumOrderQuantity", supplierForm.moq);
    }

    const res = await completeProfile(formData);

    // Clear local storage
    localStorage.removeItem("textil_onboarding_role");
    localStorage.removeItem("textil_buyer_step");
    localStorage.removeItem("textil_supplier_step");
    localStorage.removeItem("textil_buyer_form");
    localStorage.removeItem("textil_supplier_form");

    if (res?.success) {
      router.push(
        role === "SUPPLIER" ? "/supplier/dashboard" : "/buyer/dashboard",
      );
    } else {
      setLoading(false);
      alert(res?.message || "Profile completed!");
      router.push(
        role === "SUPPLIER" ? "/supplier/dashboard" : "/buyer/dashboard",
      );
    }
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 sm:p-8 font-sans overflow-hidden bg-neutral-900">
      {/* BACKGROUND IMAGE */}
      <Image
        src="/cat_silk.jpg"
        alt="Silk Fabric Texture Background"
        fill
        priority
        quality={100}
        className="object-cover object-center z-0 scale-105 animate-pulse"
        style={{ animationDuration: "12s" }}
      />

      <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px] z-10" />

      {/* HEADER LOGO */}
      <header className="relative z-20 w-full max-w-[1300px] mx-auto flex items-center justify-between py-2">
        <Link
          href="/"
          className="text-3xl font-black text-white tracking-tight drop-shadow-md"
        >
          Textil.
        </Link>
        <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center gap-2 font-bold border border-white/30 shadow-lg text-xs">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Onboarding...
        </span>
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-20 w-full max-w-[1280px] mx-auto my-auto py-4">
        {/* ROLE SELECTION CARD */}
        {!role && (
          <div className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-xl rounded-[32px] p-8 border border-white/40 shadow-[0_25px_60px_rgba(0,0,0,0.25)] transition-all duration-500 hover:scale-[1.01]">
            <div className="text-center space-y-2 mb-8">
              <h1 className="text-3xl font-black text-neutral-900 tracking-medium">
                How will you use Textil?
              </h1>
              <p className="font-semibold text-neutral-600 text-sm">
                Select the option that best describes you
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  setRole("BUYER");
                  setBuyerStep(1);
                }}
                className="w-full p-5 rounded-2xl border border-neutral-500/80 bg-neutral-50/50 hover:bg-white hover:border-[#000] hover:shadow-xl transition-all duration-300 group flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                    🛍️
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900">I'm a Buyer</h3>
                    <p className="text-[12px] font-medium text-neutral-600 mt-0.5">
                      • Source fabrics • Place orders • Shipments
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-[#000] group-hover:text-white flex items-center justify-center transition-colors">
                  <FiArrowRight />
                </div>
              </button>

              <button
                onClick={() => {
                  setRole("SUPPLIER");
                  setSupplierStep(1);
                }}
                className="w-full p-5 rounded-2xl border border-neutral-500/80 bg-neutral-50/50 hover:bg-white hover:border-[#000] hover:shadow-xl transition-all duration-300 group flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                    🏭
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900">
                      I'm a Supplier
                    </h3>
                    <p className="text-[12px] font-medium text-neutral-600 mt-0.5">
                      • List products • Manage stock • Orders
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-[#000] group-hover:text-white flex items-center justify-center transition-colors">
                  <FiArrowRight />
                </div>
              </button>
            </div>
          </div>
        )}

        {/* BUYER COMPONENT */}
        {role === "BUYER" && (
          <BuyerOnboarding
            buyerStep={buyerStep}
            setBuyerStep={setBuyerStep}
            buyerForm={buyerForm}
            setBuyerForm={setBuyerForm}
            stepperList={stepperList}
            categories={categories}
            toggleCategory={toggleCategory}
            handleNextBuyerStep={handleNextBuyerStep}
            loading={loading}
            setRole={setRole}
          />
        )}

        {/* SUPPLIER COMPONENT */}
        {role === "SUPPLIER" && (
          <SupplierOnboarding
            supplierStep={supplierStep}
            setSupplierStep={setSupplierStep}
            supplierForm={supplierForm}
            setSupplierForm={setSupplierForm}
            handleNextSupplierStep={handleNextSupplierStep}
            loading={loading}
            setRole={setRole}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="relative z-20 text-center text-[11px] font-bold text-white/60 py-2">
        Textil B2B Ecosystem © 2026
      </footer>
    </div>
  );
}
