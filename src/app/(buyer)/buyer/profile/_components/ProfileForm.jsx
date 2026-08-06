"use client";

import React, { useState, useRef } from "react";
import { updateBuyerProfile } from "@/action/updateBuyerProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2, CheckCircle2 } from "lucide-react";

const BUSINESS_TYPE_OPTIONS = [
  "Garment Manufacturer",
  "Fabric Wholesaler / Distributor",
  "Apparel Exporter",
  "Fashion Retailer / Brand",
  "Independent Textile Buyer",
  "Buying House Agent",
];

const INDUSTRY_SECTOR_OPTIONS = [
  "Textile Apparel & Sourcing",
  "Home Textiles & Furnishing",
  "Industrial Textiles",
  "Ethnic & Traditional Wear",
  "Activewear & Sportswear",
  "Luxury & High Fashion",
];

export function ProfileForm({ profile, user, buyer }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(profile?.avatar || "");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  // Phone number extraction for +91 prefix
  const rawPhone = profile?.phone || "";
  const initialPhone = rawPhone.startsWith("+91")
    ? rawPhone.replace("+91", "").trim()
    : rawPhone;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadToImageKit = async (file) => {
    const authRes = await fetch("/api/imagekit-auth");
    const authData = await authRes.json();

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("fileName", `buyer_${Date.now()}_${file.name}`);
    uploadData.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY);
    uploadData.append("signature", authData.signature);
    uploadData.append("expire", authData.expire);
    uploadData.append("token", authData.token);

    const ikRes = await fetch(
      `https://upload.imagekit.io/api/v1/files/upload`,
      {
        method: "POST",
        body: uploadData,
      },
    );

    const ikJson = await ikRes.json();
    if (!ikRes.ok) throw new Error(ikJson.message || "Upload failed");

    return ikJson.url;
  };

  async function handleSubmit(e) {
    e.preventDefault();

    // 🎯 FIX: Form values Pehle Extract honge PHIR isSaving true hoga (taaki null na jaye)
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    setIsSaving(true);
    setMessage("");

    try {
      let finalAvatarUrl = profile?.avatar || "";

      if (selectedFile) {
        finalAvatarUrl = await uploadToImageKit(selectedFile);
      }

      // Format full phone with country code
      const phoneCode = formData.get("phoneCode") || "+91";
      const phoneNumber = formData.get("phoneNumber") || "";
      const fullPhone = phoneNumber ? `${phoneCode} ${phoneNumber}` : "";

      formData.set("phone", fullPhone);
      formData.set("avatar", finalAvatarUrl);

      const res = await updateBuyerProfile(formData);

      if (res.success) {
        setMessage("Profile updated successfully!");
        setSelectedFile(null);
      } else {
        setMessage("Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Upload error occurred!");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-xs font-sans">
      {message && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* AVATAR SECTION */}
      <div className="flex items-center gap-5 border-b border-black/5 pb-6">
        <div className="relative group shrink-0">
          <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border border-black/10">
            <AvatarImage src={previewUrl} className="object-cover" />
            <AvatarFallback className="bg-black text-white font-bold text-xl ">
              {profile?.fullName ? profile.fullName.charAt(0) : "U"}
            </AvatarFallback>
          </Avatar>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-2 rounded-full bg-black text-white hover:bg-neutral-800 active:scale-95 border-2 border-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Camera className="w-4 h-4" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            disabled={isSaving}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div>
          <h3 className="font-bold text-xl text-neutral-900">
            {profile?.fullName || "Buyer Account"}
          </h3>
          <p className="text-[13px] font-medium text-neutral-500 mt-0.5">
            Click the camera icon to pick a new picture.
          </p>
        </div>
      </div>

      {/* FORM INPUTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="font-bold text-lg text-neutral-700 block">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            readOnly={isSaving}
            defaultValue={profile?.fullName || ""}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-neutral-50 font-bold text-neutral-900 text-sm focus:outline-none focus:border-black disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-lg text-neutral-700 block">
            Email Address
          </label>
          <input
            type="email"
            defaultValue={user?.email || ""}
            disabled
            className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-neutral-200 text-neutral-500 text-sm font-bold cursor-not-allowed"
          />
        </div>

        {/* 🎯 COUNTRY CODE + PHONE NUMBER INPUT */}
        <div className="space-y-1.5">
          <label className="font-bold text-lg text-neutral-700 block">
            Phone Number
          </label>
          <div className="flex items-center rounded-xl border border-black/10 bg-neutral-50 focus-within:border-black overflow-hidden">
            <select
              name="phoneCode"
              disabled={isSaving}
              defaultValue="+91"
              className="px-3 py-2.5 bg-neutral-200 text-neutral-900 text-sm font-bold border-r border-black/10 focus:outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="+91">🇮🇳 +91</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+971">🇦🇪 +971</option>
            </select>
            <input
              type="tel"
              name="phoneNumber"
              readOnly={isSaving}
              defaultValue={initialPhone}
              placeholder="98765 43210"
              className="w-full px-3 py-2.5 bg-transparent font-bold text-neutral-900 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* 🎯 BUSINESS TYPE DROPDOWN */}
        <div className="space-y-1.5">
          <label className="font-bold text-lg text-neutral-700 block">
            Business Type
          </label>
          <select
            name="businessType"
            disabled={isSaving}
            defaultValue={buyer?.businessType || BUSINESS_TYPE_OPTIONS[0]}
            className="w-full px-4 py-2.5 rounded-xl border text-sm border-black/10 bg-neutral-50 font-bold text-neutral-900 focus:outline-none focus:border-black cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {BUSINESS_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* 🎯 INDUSTRY SECTOR DROPDOWN */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="font-bold text-lg text-neutral-700 block">
            Industry Sector
          </label>
          <select
            name="industry"
            disabled={isSaving}
            defaultValue={buyer?.industry || INDUSTRY_SECTOR_OPTIONS[0]}
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-black/10 bg-neutral-50 font-bold text-neutral-900 focus:outline-none focus:border-black cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {INDUSTRY_SECTOR_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold  transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{isSaving ? "Saving Details..." : "Save Profile Details"}</span>
        </button>
      </div>
    </form>
  );
}
