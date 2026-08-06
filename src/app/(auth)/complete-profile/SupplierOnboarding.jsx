"use client";

import React from "react";
import Image from "next/image";
import { FiArrowRight, FiCheck } from "react-icons/fi";

export default function SupplierOnboarding({
  supplierStep,
  setSupplierStep,
  supplierForm,
  setSupplierForm,
  handleNextSupplierStep,
  loading,
  setRole,
}) {
  const supplierStepperList = [
    { step: 1, label: "Business Basic Info" },
    { step: 2, label: "Operations & Location" },
    { step: 3, label: "Fabrics Offered" },
    { step: 4, label: "MOQ & Capacity" },
    { step: 5, label: "Review & Finish" },
  ];

  const businessTypeOptions = [
    "Textile Mill",
    "Fabric Manufacturer",
    "Wholesaler / Trader",
    "Yarn Producer",
    "Dyeing & Printing House",
  ];

  const fabricCatalogList = [
    "100% Cotton",
    "Organic Denim",
    "Silk & Satin",
    "Linen Textiles",
    "Synthetic & Polyester",
    "Knit Fabrics",
    "Technical Fabrics",
  ];

  const moqCapacityOptions = [
    { label: "100 - 500 Meters / month", value: "500" },
    { label: "500 - 2,000 Meters / month", value: "2000" },
    { label: "2,000 - 10,000 Meters / month", value: "10000" },
    { label: "10,000+ Industrial Scale / month", value: "50000" },
  ];

  const isSupplierStepValid = () => {
    switch (supplierStep) {
      case 1:
        return Boolean(
          supplierForm.businessName &&
          supplierForm.businessName.trim() &&
          supplierForm.businessType &&
          supplierForm.contactNumber &&
          supplierForm.contactNumber.trim(),
        );
      case 2:
        return Boolean(
          supplierForm.businessAddress &&
          supplierForm.businessAddress.trim() &&
          supplierForm.operatingHours &&
          supplierForm.operatingHours.trim(),
        );
      case 3:
        return Boolean(supplierForm.fabricsOffered);
      case 4:
        return Boolean(supplierForm.moq);
      default:
        return true;
    }
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-xl rounded-[36px] border border-white/50 shadow-[0_30px_90px_rgba(0,0,0,0.3)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px] transition-all duration-500">
      {/* MOBILE PROGRESS */}
      <div className="lg:hidden p-6 bg-[#F8F9FC] border-b border-neutral-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-neutral-700">
            Step {supplierStep} of 5:{" "}
            {supplierStepperList[supplierStep - 1]?.label}
          </span>
          <span className="text-xs font-extrabold text-[#4F46E5]">
            {Math.round((supplierStep / 5) * 100)}%
          </span>
        </div>
        <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#4F46E5] transition-all duration-300"
            style={{ width: `${(supplierStep / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:flex lg:col-span-4 bg-[#F8F9FC]/90 p-8 border-r border-neutral-200/60 flex-col justify-between relative">
        <div className="space-y-5">
          <div>
            <h3 className="text-2xl font-bold text-neutral-900 tracking-normal ">
              Setup Your Supplier Mill Storefront
            </h3>
            <p className=" text-sm text-neutral-600 mt-1.5">
              Verify your factory details to start receiving RFQs.
            </p>
          </div>

          <div className="space-y-2">
            {supplierStepperList.map((s) => (
              <div key={s.step} className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
                    supplierStep === s.step
                      ? "bg-[#000] text-white ring-4 ring-white shadow-md scale-110"
                      : supplierStep > s.step
                        ? "bg-emerald-500 text-white"
                        : "bg-neutral-200 text-neutral-600"
                  }`}
                >
                  {supplierStep > s.step ? <FiCheck /> : s.step}
                </div>
                <span
                  className={`text-sm font-medium transition-colors ${
                    supplierStep === s.step
                      ? "text-[#000] font-semibold"
                      : "text-neutral-600"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-24 rounded-md overflow-hidden border border-black/10 shadow-md">
          <Image
            src="/cat_silk.jpg"
            alt="Fabric Swatch"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
            <span className="text-[11px] font-bold text-white">
              Verified Mill Supplier Badge
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="lg:col-span-8 p-6 sm:p-12 flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          {supplierStep === 1 && (
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-neutral-900">
                Business Basic Info
              </h2>
              <p className=" text-neutral-600">
                Let's start with your mill identity.
              </p>
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-sm md:text-lg font-bold text-neutral-700">
                    Business / Mill Name
                  </label>
                  <input
                    type="text"
                    required
                    value={supplierForm.businessName}
                    onChange={(e) =>
                      setSupplierForm({
                        ...supplierForm,
                        businessName: e.target.value,
                      })
                    }
                    placeholder="e.g. Surat Synthetic Textile Mills Ltd."
                    className="w-full h-11 bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm md:text-lg font-bold text-neutral-700">
                    Business Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    {businessTypeOptions.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setSupplierForm({
                            ...supplierForm,
                            businessType: type,
                          })
                        }
                        className={`p-3 rounded-xl border text-left font-semibold text-sm transition-all cursor-pointer ${
                          supplierForm.businessType === type
                            ? "border-[#000] border-2 bg-white text-[#000] font-bold shadow-md"
                            : "border-neutral-300 bg-neutral-50 text-neutral-800 hover:bg-neutral-100"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm md:text-lg font-bold text-neutral-700">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={supplierForm.contactNumber}
                    onChange={(e) =>
                      setSupplierForm({
                        ...supplierForm,
                        contactNumber: e.target.value,
                      })
                    }
                    placeholder="+91 9876543210"
                    className="w-full h-11 bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {supplierStep === 2 && (
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-neutral-900">
                Business Operations
              </h2>
              <p className=" text-neutral-600">
                Mill location and working timing.
              </p>
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-sm font-bold text-neutral-700">
                    Factory / Mill Address
                  </label>
                  <input
                    type="text"
                    value={supplierForm.businessAddress}
                    onChange={(e) =>
                      setSupplierForm({
                        ...supplierForm,
                        businessAddress: e.target.value,
                      })
                    }
                    placeholder="Factory Plot / Industrial Estate Address"
                    className="w-full h-11 bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-neutral-700">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    value={supplierForm.operatingHours}
                    onChange={(e) =>
                      setSupplierForm({
                        ...supplierForm,
                        operatingHours: e.target.value,
                      })
                    }
                    placeholder="e.g. 09:00 AM - 07:00 PM (Mon-Sat)"
                    className="w-full h-11 bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {supplierStep === 3 && (
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-neutral-900">
                Fabrics Catalog Offered
              </h2>
              <p className=" text-neutral-600">
                Select textiles produced at your mill.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {fabricCatalogList.map((fab) => {
                  const isSelected = supplierForm.fabricsOffered.includes(fab);
                  return (
                    <button
                      key={fab}
                      type="button"
                      onClick={() => {
                        const current = supplierForm.fabricsOffered
                          ? supplierForm.fabricsOffered
                              .split(", ")
                              .filter(Boolean)
                          : [];
                        const updated = isSelected
                          ? current.filter((item) => item !== fab)
                          : [...current, fab];
                        setSupplierForm({
                          ...supplierForm,
                          fabricsOffered: updated.join(", "),
                        });
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#000] text-white border-[#fff] shadow-md"
                          : "bg-neutral-50 text-neutral-700 border-neutral-300 hover:bg-neutral-100"
                      }`}
                    >
                      {fab}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {supplierStep === 4 && (
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-neutral-900">
                Minimum Order Quantity (MOQ)
              </h2>
              <p className=" text-neutral-600">
                What is your monthly production capacity?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {moqCapacityOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setSupplierForm({ ...supplierForm, moq: opt.value })
                    }
                    className={`p-4 rounded-xl border text-left font-semibold text-xs transition-all cursor-pointer ${
                      supplierForm.moq === opt.value
                        ? "border-[#000] border-2 bg-white text-[#000] font-bold shadow-md"
                        : "border-neutral-300 bg-neutral-50 text-neutral-800 hover:bg-neutral-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {supplierStep === 5 && (
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-neutral-900">
                Review & Verification
              </h2>
              <p className="text-neutral-600">
                Ready to publish your mill storefront on Textil B2B Ecosystem.
              </p>
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200  space-y-1 font-semibold text-neutral-900">
                <p>
                  • Business:{" "}
                  <span className="font-medium text-neutral-600 ">{supplierForm.businessName || "Not set"}</span>
                </p>
                <p>
                  • Business Type:{" "}
                  <span className="font-medium text-neutral-600 ">{supplierForm.businessType || "Not set"}</span>
                </p>
                <p>
                  • Contact:{" "}
                  <span className="font-medium text-neutral-600 ">{supplierForm.contactNumber || "Not set"}</span>
                </p>
                <p>
                  • Address:{" "}
                  <span className="font-medium text-neutral-600 ">{supplierForm.businessAddress || "Not set"}</span>
                </p>
                <p>
                  • Operating Hours:{" "}
                  <span className="font-medium text-neutral-600 ">{supplierForm.operatingHours || "Not set"}</span>
                </p>
                <p>
                  • Fabrics Offered:{" "}
                  <span className="font-medium text-neutral-600 ">{supplierForm.fabricsOffered || "Not set"}</span>
                </p>
                <p>
                  • MOQ: <span className="font-medium text-neutral-600 ">{supplierForm.moq} Meters</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between border-t border-neutral-200/60 pt-6">
          <button
            type="button"
            onClick={() => {
              if (supplierStep > 1) {
                setSupplierStep((prev) => prev - 1);
              } else {
                setRole(null);
              }
            }}
            className="px-6 h-11 bg-neutral-100 text-neutral-700 font-bold hover:bg-gray-200 rounded-xl cursor-pointer"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNextSupplierStep}
            disabled={loading || !isSupplierStepValid()}
            className="px-8 h-11 bg-[#000] text-white font-bold  rounded-xl shadow-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Completing...
              </>
            ) : supplierStep === 5 ? (
              "Finish Setup"
            ) : (
              <>
                Continue <FiArrowRight />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
