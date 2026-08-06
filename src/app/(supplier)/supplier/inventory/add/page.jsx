"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Loader2,
  CheckCircle2,
  Layers,
  Sparkles,
  PackagePlus,
} from "lucide-react";
import { addProduct } from "@/action/supplier/addProduct";

export default function AddFabricPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    material: "Cotton",
    composition: "100% Organic Cotton",
    gsm: "220",
    width: '58/60"',
    color: "Raw Natural",
    price: "350",
    stock: "1000",
    moq: "100",
    description: "",
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

  // ImageKit File Upload Handler
  const uploadToImageKit = async (file) => {
    try {
      const authRes = await fetch("/api/imagekit-auth");
      const authData = await authRes.json();

      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("fileName", `fabric_${Date.now()}_${file.name}`);
      uploadData.append(
        "publicKey",
        process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
      );
      uploadData.append("signature", authData.signature);
      uploadData.append("expire", authData.expire);
      uploadData.append("token", authData.token);

      const ikRes = await fetch(
        `https://upload.imagekit.io/api/v1/files/upload`,
        {
          method: "POST",
          body: uploadData,
        }
      );

      const ikJson = await ikRes.json();
      return ikJson.url;
    } catch (err) {
      console.error("ImageKit Upload Error:", err);
      return null;
    }   
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage({ type: "", text: "" });

    try {
      let uploadedImageUrl = "";

      if (selectedFile) {
        setStatusMessage({ type: "info", text: "Uploading fabric image..." });
        uploadedImageUrl = await uploadToImageKit(selectedFile);
      }

      setStatusMessage({ type: "info", text: "Saving fabric details..." });

      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (uploadedImageUrl) {
        data.append("imageUrl", uploadedImageUrl);
      }

      const res = await addProduct(data);

      if (res.success) {
        setStatusMessage({
          type: "success",
          text: "Fabric listed successfully!",
        });
        setTimeout(() => {
          router.push("/supplier/inventory");
        }, 1200);
      } else {
        setStatusMessage({
          type: "error",
          text: res.error || "Failed to list fabric.",
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFD] p-4 sm:p-6 md:p-10 text-neutral-900 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* TOP BAR */}
        <div className="flex items-center justify-between border-b border-neutral-200/80 pb-5">
          <Link
            href="/supplier/dashboard"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-neutral-600 hover:text-neutral-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <span className="text-xs md:text-sm font-black uppercase tracking-wider text-neutral-500">
            Catalog Management
          </span>
        </div>

        {/* HEADER */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-950  flex items-center gap-2.5">
            <PackagePlus className="w-7 h-7 text-neutral-900" /> List New Fabric Roll
          </h1>
          <p className="text-xs md:text-sm font-medium text-neutral-500">
            Add specifications, GSM, minimum order quantities (MOQ), and pricing per meter.
          </p>
        </div>

        {/* STATUS ALERT */}
        {statusMessage.text && (
          <div
            className={`p-4 rounded-2xl text-xs font-bold border flex items-center gap-2 ${
              statusMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : statusMessage.type === "error"
                ? "bg-rose-50 text-rose-800 border-rose-200"
                : "bg-neutral-100 text-neutral-800 border-neutral-200"
            }`}
          >
            {statusMessage.type === "success" && (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            )}
            {statusMessage.text}
          </div>
        )}

        {/* MAIN FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. IMAGE UPLOAD CARD */}
          <div className="p-6 bg-white rounded-3xl border border-neutral-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4">
            <h2 className="text-sm font-extrabold text-neutral-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-neutral-700" /> High-Res Swatch Image
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-44 h-44 rounded-2xl border-2 border-dashed border-neutral-300 bg-[#FBFBFC] hover:border-neutral-900 hover:bg-neutral-50 cursor-pointer flex flex-col items-center justify-center p-4 transition-all relative overflow-hidden group"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="size-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="text-center space-y-2">
                    <Camera className="w-8 h-8 text-neutral-400 group-hover:scale-110 transition-transform mx-auto" />
                    <span className="text-[11px] font-bold text-neutral-600 block">
                      Click to Upload Image
                    </span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <div className="text-xs text-neutral-500 space-y-1.5 leading-relaxed">
                <p className="font-bold text-neutral-800">
                  Image Guidelines for B2B Buyers:
                </p>
                <p>• Show clear weave texture under natural lighting.</p>
                <p>• Supported formats: JPG, PNG, WEBP (Max 5MB).</p>
                <p>• Primary swatch will be displayed on the marketplace grid.</p>
              </div>
            </div>
          </div>

          {/* 2. FABRIC SPECIFICATIONS */}
          <div className="p-6 bg-white rounded-3xl border border-neutral-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-5">
            <h2 className="text-sm font-extrabold text-neutral-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-neutral-700" /> Fabric Specifications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-extrabold text-neutral-700">
                  Fabric Name / Title *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Premium Heavyweight Organic Twill Denim"
                  className="w-full h-11 bg-[#FBFBFC] border border-neutral-200/80 rounded-xl px-4 font-bold text-neutral-900 focus:outline-none focus:border-neutral-900 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-neutral-700">
                  Material Type
                </label>
                <select
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  className="w-full h-11 bg-[#FBFBFC] border border-neutral-200/80 rounded-xl px-3.5 font-bold text-neutral-900 focus:outline-none focus:border-neutral-900"
                >
                  <option value="Cotton">Cotton</option>
                  <option value="Denim">Denim</option>
                  <option value="Silk">Silk</option>
                  <option value="Linen">Linen</option>
                  <option value="Synthetic">Synthetic & Polyester</option>
                  <option value="Wool">Wool</option>
                  <option value="Blended">Blended Textile</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-neutral-700">
                  Fiber Composition
                </label>
                <input
                  type="text"
                  name="composition"
                  value={formData.composition}
                  onChange={handleChange}
                  placeholder="e.g. 98% Organic Cotton, 2% Elastane"
                  className="w-full h-11 bg-[#FBFBFC] border border-neutral-200/80 rounded-xl px-4 font-bold text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-neutral-700">
                  GSM (Weight) *
                </label>
                <input
                  type="number"
                  name="gsm"
                  required
                  value={formData.gsm}
                  onChange={handleChange}
                  placeholder="e.g. 240"
                  className="w-full h-11 bg-[#FBFBFC] border border-neutral-200/80 rounded-xl px-4 font-bold text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-neutral-700">
                  Usable Width
                </label>
                <input
                  type="text"
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                  placeholder='e.g. 58/60"'
                  className="w-full h-11 bg-[#FBFBFC] border border-neutral-200/80 rounded-xl px-4 font-bold text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>
          </div>

          {/* 3. PRICING & STOCK TIERS */}
          <div className="p-6 bg-white rounded-3xl border border-neutral-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-5">
            <h2 className="text-sm font-extrabold text-neutral-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-neutral-700" /> B2B Pricing & Quantity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-extrabold text-neutral-700">
                  Wholesale Price (₹/Meter) *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="350"
                  className="w-full h-11 bg-[#FBFBFC] border border-neutral-200/80 rounded-xl px-4 font-black text-neutral-900 text-sm focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-neutral-700">
                  Available Stock (Meters) *
                </label>
                <input
                  type="number"
                  name="stock"
                  required
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="2000"
                  className="w-full h-11 bg-[#FBFBFC] border border-neutral-200/80 rounded-xl px-4 font-bold text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-neutral-700">
                  MOQ (Minimum Order - Meters) *
                </label>
                <input
                  type="number"
                  name="moq"
                  required
                  value={formData.moq}
                  onChange={handleChange}
                  placeholder="100"
                  className="w-full h-11 bg-[#FBFBFC] border border-neutral-200/80 rounded-xl px-4 font-bold text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2 text-xs">
              <label className="font-extrabold text-neutral-700">
                Additional Notes / Mill Specs
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Mention weave type, dyeing process, wash care instructions, or certification details..."
                className="w-full bg-[#FBFBFC] border border-neutral-200/80 rounded-2xl p-4 font-medium text-neutral-900 focus:outline-none focus:border-neutral-900 resize-none"
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/supplier/dashboard"
              className="px-6 py-3 rounded-xl bg-neutral-100 text-neutral-700 font-bold text-xs hover:bg-neutral-200 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl bg-neutral-950 text-white font-extrabold text-xs hover:bg-neutral-800 transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publishing Fabric...
                </>
              ) : (
                "Publish to Marketplace →"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}