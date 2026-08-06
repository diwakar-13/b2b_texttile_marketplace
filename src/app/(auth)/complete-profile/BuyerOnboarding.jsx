"use client";

import React from "react";
import Image from "next/image";
import { FiArrowRight, FiCheck } from "react-icons/fi";

export default function BuyerOnboarding({
  buyerStep,
  setBuyerStep,
  buyerForm,
  setBuyerForm,
  stepperList,
  categories,
  toggleCategory,
  handleNextBuyerStep,
  loading,
  setRole,
}) {
  const fabricOptions = [
    "100% Organic Cotton",
    "Linen Blend",
    "Pure Silk",
    "Raw Denim",
    "Merino Wool",
    "Polyester Viscose",
    "Spandex/Elastane Blend",
    "Recycled Nylon",
  ];

  const moqOptions = [
    { label: "500 - 1,000 Meters", value: "1000" },
    { label: "1,000 - 5,000 Meters", value: "5000" },
    { label: "5,000 - 20,000 Meters", value: "20000" },
    { label: "20,000+ Meters (Bulk Container)", value: "50000" },
  ];

  const isStepValid = () => {
    switch (buyerStep) {
      case 1:
        return Boolean(buyerForm.businessType);
      case 2:
        return Boolean(buyerForm.industry);
      case 3:
        return buyerForm.categories.length > 0;
      case 4:
        return Boolean(
          buyerForm.preferredFabric && buyerForm.preferredFabric.trim(),
        );
      case 5:
        return Boolean(buyerForm.typicalMOQ);
      case 6:
        return Boolean(buyerForm.budgetRange);
      case 7:
        return Boolean(buyerForm.location && buyerForm.location.trim());
      default:
        return false;
    }
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-xl rounded-[36px] border border-white/50 shadow-[0_30px_90px_rgba(0,0,0,0.3)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px] transition-all duration-500">
      {/* MOBILE TOP PROGRESS BAR */}
      <div className="lg:hidden p-6 bg-[#F8F9FC] border-b border-neutral-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-neutral-700">
            Step {buyerStep} of 7: {stepperList[buyerStep - 1]?.label}
          </span>
          <span className="text-xs font-extrabold text-[#4F46E5]">
            {Math.round((buyerStep / 7) * 100)}%
          </span>
        </div>
        <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#4F46E5] transition-all duration-300"
            style={{ width: `${(buyerStep / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:flex lg:col-span-4 bg-[#F8F9FC]/90 p-8 border-r border-neutral-200/60 flex-col justify-between relative">
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-neutral-900 tracking-normal leading-snug">
              Let's personalize Textil for your business
            </h3>
            <p className="text-sm text-neutral-500 mt-2">
              This helps us show you the most relevant fabrics and suppliers.
            </p>
          </div>

          <div className="space-y-2.5">
            {stepperList.map((s) => (
              <div key={s.step} className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    buyerStep === s.step
                      ? "bg-[#4F46E5] text-white ring-4 ring-indigo-100 shadow-md scale-110"
                      : buyerStep > s.step
                        ? "bg-emerald-500 text-white"
                        : "bg-neutral-200 text-neutral-500"
                  }`}
                >
                  {buyerStep > s.step ? <FiCheck /> : s.step}
                </div>
                <span
                  className={`text-sm font-semibold transition-colors ${
                    buyerStep === s.step ? "text-[#4F46E5]" : "text-neutral-600"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-28 rounded-md overflow-hidden border border-black/10 shadow-md">
          <Image
            src="/cat_silk.jpg"
            alt="Fabric Swatch"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
            <span className="text-[12px] font-bold text-white">
              Premium Silk & Mill Direct Swatches
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT MAIN CONTENT AREA */}
      <div className="lg:col-span-8 p-6 sm:p-12 flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          {/* STEP 1 */}
          {buyerStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                Select your Business Type
              </h2>
              <p className="text-sm font-semibold text-neutral-600">
                What best describes your procurement operations?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  "Garment Manufacturer",
                  "Fashion Brand / Label",
                  "Wholesaler / Trader",
                  "Retailer / Boutique",
                ].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setBuyerForm({ ...buyerForm, businessType: type })
                    }
                    className={`p-4 rounded-xl border text-left font-bold text-sm transition-all cursor-pointer ${
                      buyerForm.businessType === type
                        ? "border-black bg-neutral-900 text-white shadow-md"
                        : "border-neutral-300 bg-neutral-50 text-neutral-800 hover:bg-neutral-100"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {buyerStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                Select your Primary Industry
              </h2>
              <p className="text-sm font-semibold text-neutral-600">
                Helps us recommend fabrics tailored to your market.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  "Apparel & Fashion",
                  "Home Textiles",
                  "Sportswear & Activewear",
                  "Luxury & Couture",
                ].map((ind) => (
                  <button
                    key={ind}
                    type="button"
                    onClick={() =>
                      setBuyerForm({ ...buyerForm, industry: ind })
                    }
                    className={`p-4 rounded-xl border text-left font-bold text-sm transition-all cursor-pointer ${
                      buyerForm.industry === ind
                        ? "border-black bg-neutral-900 text-white shadow-md"
                        : "border-neutral-300 bg-neutral-50 text-neutral-800 hover:bg-neutral-100"
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {buyerStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-normal">
                  What categories interest you?
                </h2>
                <p className="text-sm font-semibold text-neutral-600 mt-1">
                  Select all that apply to personalize your experience
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {categories.map((cat) => {
                  const isSelected = buyerForm.categories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`p-5 rounded-md border text-center transition-all duration-200 flex flex-col items-center justify-center gap-2 relative cursor-pointer ${
                        isSelected
                          ? "border-[#000] font-extrabold ring-2 ring-white/30 shadow-md scale-[1.02]"
                          : "border-neutral-300/80 bg-neutral-50/50 text-neutral-700 font-bold hover:bg-white hover:border-neutral-500 hover:scale-102"
                      }`}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-sm">{cat.label}</span>
                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[#000] text-white flex items-center justify-center text-[9px] shadow-sm">
                          <FiCheck />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="font-bold text-neutral-700">
                  Other (Specify)
                </label>
                <input
                  type="text"
                  value={buyerForm.customCategory}
                  onChange={(e) =>
                    setBuyerForm({
                      ...buyerForm,
                      customCategory: e.target.value,
                    })
                  }
                  placeholder="Type category name"
                  className="w-full h-11 bg-neutral-50 border border-neutral-200 rounded-xl px-4 text-sm font-semibold text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#000] focus:bg-white transition-all mt-1"
                />
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {buyerStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                Preferred Fabric Blends
              </h2>
              <p className="text-sm font-semibold text-neutral-600">
                Select or type the fabric compositions you regularly order.
              </p>
              <div className="flex flex-wrap gap-2.5 pt-2">
                {fabricOptions.map((f) => {
                  const isSelected = buyerForm.preferredFabric.includes(f);
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => {
                        const currentList = buyerForm.preferredFabric
                          ? buyerForm.preferredFabric
                              .split(", ")
                              .filter(Boolean)
                          : [];
                        let newList = isSelected
                          ? currentList.filter((item) => item !== f)
                          : [...currentList, f];
                        setBuyerForm({
                          ...buyerForm,
                          preferredFabric: newList.join(", "),
                        });
                      }}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? "bg-black text-white border-black shadow-md"
                          : "bg-neutral-50 text-neutral-700 border-neutral-300 hover:bg-neutral-100"
                      }`}
                    >
                      {isSelected && <FiCheck className="text-white" />}
                      {f}
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                value={buyerForm.preferredFabric}
                onChange={(e) =>
                  setBuyerForm({
                    ...buyerForm,
                    preferredFabric: e.target.value,
                  })
                }
                placeholder="Custom blend (e.g. 80% Cotton 20% Silk)"
                className="w-full h-11 bg-neutral-50 border border-neutral-300 rounded-xl px-4 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black mt-2"
              />
            </div>
          )}

          {/* STEP 5 */}
          {buyerStep === 5 && (
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                Typical Order Quantity (MOQ)
              </h2>
              <p className="text-sm font-semibold text-neutral-600">
                Select your average order size per fabric line.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {moqOptions.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() =>
                      setBuyerForm({ ...buyerForm, typicalMOQ: m.value })
                    }
                    className={`p-4 rounded-xl border text-left font-bold text-sm transition-all cursor-pointer ${
                      buyerForm.typicalMOQ === m.value
                        ? "border-black bg-neutral-900 text-white shadow-md"
                        : "border-neutral-300 bg-neutral-50 text-neutral-800 hover:bg-neutral-100"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6 */}
          {buyerStep === 6 && (
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                Estimated Sourcing Budget
              </h2>
              <p className="text-sm font-semibold text-neutral-600">
                Select your average monthly procurement budget.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {["$2,000 - $10,000", "$10,000 - $50,000", "$50,000+"].map(
                  (b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() =>
                        setBuyerForm({ ...buyerForm, budgetRange: b })
                      }
                      className={`p-4 rounded-xl border text-left font-bold text-sm transition-all cursor-pointer ${
                        buyerForm.budgetRange === b
                          ? "border-black bg-neutral-900 text-white shadow-md"
                          : "border-neutral-300 bg-neutral-50 text-neutral-800 hover:bg-neutral-100"
                      }`}
                    >
                      {b}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}

          {/* STEP 7 */}
          {buyerStep === 7 && (
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                Business Location
              </h2>
              <p className="text-sm font-semibold text-neutral-600">
                Where is your main office or factory located?
              </p>
              <input
                type="text"
                value={buyerForm.location}
                onChange={(e) =>
                  setBuyerForm({ ...buyerForm, location: e.target.value })
                }
                placeholder="Country, City"
                className="w-full h-12 bg-neutral-50 border border-neutral-300 rounded-xl px-4 text-sm font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between border-t border-neutral-200/60 pt-6">
          <button
            type="button"
            onClick={() => {
              if (buyerStep > 1) {
                setBuyerStep((prev) => prev - 1);
              } else {
                setRole(null);
              }
            }}
            className="px-8 h-11 bg-neutral-100 text-neutral-700 font-bold rounded-xl hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Back
          </button>

          <div className="flex items-center gap-4">
            <span className="font-bold text-neutral-500 text-sm">
              Step {buyerStep} of 7
            </span>
            <button
              type="button"
              onClick={handleNextBuyerStep}
              disabled={loading || !isStepValid()}
              className="px-9 h-11 bg-[#000] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#000]/30 hover:bg-black/90 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Completing...
                </>
              ) : buyerStep === 7 ? (
                <>
                  Finish & Open Dashboard <FiArrowRight />
                </>
              ) : (
                <>
                  Continue <FiArrowRight />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
