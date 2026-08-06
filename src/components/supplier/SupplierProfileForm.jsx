"use client";

import React, { useState, useRef } from "react";
import {
  Store,
  Clock,
  User,
  Mail,
  Loader2,
  CheckCircle2,
  Camera,
} from "lucide-react";
import { updateSupplierProfile } from "@/action/supplier/updateSupplierProfile";
import { toast } from "sonner";

export default function SupplierProfileForm({ profile, supplier, userEmail }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(profile?.avatar || "");
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: profile?.fullName || "",
    phone: profile?.phone || supplier?.contactNumber || "",
    businessName: supplier?.businessName || "",
    businessType: supplier?.businessType || "Textile Mill",
    contactNumber: supplier?.contactNumber || profile?.phone || "",
    businessAddress: supplier?.businessAddress || "",
    operatingHours: supplier?.operatingHours || "09:00 AM - 07:00 PM (Mon-Sat)",
    fabricsOffered:
      supplier?.fabricsOffered || "Organic Cotton, Denim, Linen, Silk",
    minimumOrderQuantity: supplier?.minimumOrderQuantity || "100",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // ImageKit Upload
  const uploadToImageKit = async (file) => {
    try {
      const authRes = await fetch("/api/imagekit-auth");
      const authData = await authRes.json();

      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("fileName", `avatar_${Date.now()}_${file.name}`);
      uploadData.append(
        "publicKey",
        process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
      );
      uploadData.append("signature", authData.signature);
      uploadData.append("expire", authData.expire);
      uploadData.append("token", authData.token);

      const ikRes = await fetch(
        "https://upload.imagekit.io/api/v1/files/upload",
        {
          method: "POST",
          body: uploadData,
        },
      );

      const ikJson = await ikRes.json();
      return ikJson.url;
    } catch (err) {
      console.error("Avatar Upload Error:", err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let avatarUrl = profile?.avatar || "";

      if (selectedFile) {
        toast.info("Uploading profile picture...");
        const uploadedUrl = await uploadToImageKit(selectedFile);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }

      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      data.append("avatarUrl", avatarUrl);

      const res = await updateSupplierProfile(data);

      if (res.success) {
        toast.success("Profile & Avatar updated successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(res.error || "Failed to update profile");
      }
    } catch (err) {
      toast.error("An error occurred while updating profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans">
      {/* 🎯 AVATAR & ACCOUNT OWNER */}
      <div className="p-6 bg-white rounded-3xl border border-neutral-200/70 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-5">
        <h2 className="text-sm font-extrabold text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-3">
          <User className="w-4 h-4 text-neutral-700" /> Account Owner & Profile
          Avatar
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* 🎯 CIRCULAR AVATAR WITH CAMERA ICON AT BOTTOM */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="size-24 rounded-full border-2 border-neutral-200 bg-[#FBFBFC] hover:border-neutral-950 cursor-pointer flex items-center justify-center relative overflow-hidden group transition-all shadow-xs"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Avatar Preview"
                  className="size-full object-cover"
                />
              ) : (
                <span className="text-2xl font-black text-neutral-900">
                  {formData.fullName?.[0] || "U"}
                </span>
              )}

              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                Change
              </div>
            </div>

            {/* CAMERA BUTTON DIRECTLY BELOW CIRCLE */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-[11px] font-extrabold text-neutral-800 transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-neutral-700" />
              <span>Change Photo</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs w-full">
            <div className="space-y-1.5">
              <label className="font-extrabold text-neutral-700">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Diwakar Pandey"
                className="w-full h-11 bg-[#FBFBFC] border border-neutral-200/80 rounded-xl px-4 font-bold text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-extrabold text-neutral-700">
                Account Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full h-11 bg-[#FBFBFC] border border-neutral-200/80 rounded-xl px-4 font-bold text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-extrabold text-neutral-700">
                Account Email (Read Only)
              </label>
              <div className="w-full h-11 bg-neutral-100/70 border border-neutral-200/60 rounded-xl px-4 font-bold text-neutral-500 flex items-center gap-2 select-none">
                <Mail className="w-4 h-4 text-neutral-400" />
                <span>{userEmail || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MILL & BUSINESS DETAILS */}
      <div className="p-6 bg-white rounded-3xl border border-neutral-200/70 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4">
        <h2 className="text-sm font-extrabold text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-3">
          <Store className="w-4 h-4 text-neutral-700" /> Mill & Organization
          Specs
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-extrabold text-neutral-700">
              Business / Mill Name *
            </label>
            <input
              type="text"
              name="businessName"
              required
              value={formData.businessName}
              onChange={handleChange}
              placeholder="e.g. Mahesmati Textiles Pvt Ltd"
              className="w-full h-11 bg-[#FBFBFC] border border-neutral-200/80 rounded-xl px-4 font-bold text-neutral-900 focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-extrabold text-neutral-700">
              Business Type
            </label>
            <select
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              className="w-full h-11 bg-[#FBFBFC] border border-neutral-200/80 rounded-xl px-3.5 font-bold text-neutral-900 focus:outline-none focus:border-neutral-900"
            >
              <option value="Textile Mill">Textile Mill & Manufacturer</option>
              <option value="Wholesale Distributor">
                Wholesale Fabric Distributor
              </option>
              <option value="Dyeing House">Dyeing & Processing Unit</option>
              <option value="Exporter">Fabric Exporter</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-extrabold text-neutral-700">
              Contact Phone Number *
            </label>
            <input
              type="text"
              name="contactNumber"
              required
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="+91 9876543210"
              className="w-full h-11 bg-[#FBFBFC] border border-neutral-200/80 rounded-xl px-4 font-bold text-neutral-900 focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-extrabold text-neutral-700">
              Mill / Factory Address *
            </label>
            <textarea
              name="businessAddress"
              rows={2}
              required
              value={formData.businessAddress}
              onChange={handleChange}
              placeholder="Complete factory or mill office address with state and pincode..."
              className="w-full bg-[#FBFBFC] border border-neutral-200/80 rounded-xl p-3.5 font-bold text-neutral-900 focus:outline-none focus:border-neutral-900 resize-none"
            />
          </div>
        </div>
      </div>

      {/* OPERATIONAL GUIDELINES */}
      <div className="p-6 bg-white rounded-3xl border border-neutral-200/70 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4">
        <h2 className="text-sm font-extrabold text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-3">
          <Clock className="w-4 h-4 text-neutral-700" /> Operational Hours &
          Capabilities
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-extrabold text-neutral-700">
              Operating Hours
            </label>
            <input
              type="text"
              name="operatingHours"
              value={formData.operatingHours}
              onChange={handleChange}
              placeholder="09:00 AM - 07:00 PM (Mon-Sat)"
              className="w-full h-11 bg-[#FBFBFC] border border-neutral-200/80 rounded-xl px-4 font-bold text-neutral-900 focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-extrabold text-neutral-700">
              Standard Mill MOQ (Meters)
            </label>
            <input
              type="number"
              name="minimumOrderQuantity"
              value={formData.minimumOrderQuantity}
              onChange={handleChange}
              placeholder="100"
              className="w-full h-11 bg-[#FBFBFC] border border-neutral-200/80 rounded-xl px-4 font-bold text-neutral-900 focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-extrabold text-neutral-700">
              Fabrics Specialties Offered
            </label>
            <input
              type="text"
              name="fabricsOffered"
              value={formData.fabricsOffered}
              onChange={handleChange}
              placeholder="e.g. Twill Denim, Khadi Cotton, Viscose Rayon, Raw Silk"
              className="w-full h-11 bg-[#FBFBFC] border border-neutral-200/80 rounded-xl px-4 font-bold text-neutral-900 focus:outline-none focus:border-neutral-900"
            />
          </div>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 rounded-xl bg-neutral-950 text-white font-extrabold text-xs hover:bg-neutral-800 transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving Profile...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" /> Save Profile Settings
            </>
          )}
        </button>
      </div>
    </form>
  );
}
