"use client";

import React, { useState, useRef } from "react";
import {
  Camera,
  Upload,
  Loader2,
  Sparkles,
  X,
  ShoppingBag,
} from "lucide-react";

export default function VisualSearchModal({ isOpen, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResults(null);
    }
  };

  const handleAnalyze = async () => {
    if (!previewUrl || loading) return;
    setLoading(true);

    try {
      const sampleImg =
        "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=600";

      const res = await fetch("/api/ai/visual-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: sampleImg }),
      });

      const json = await res.json();
      if (json.success) {
        setResults(json.data);
      }
    } catch (err) {
      console.error("Visual Search Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative border border-neutral-200 dark:border-zinc-800">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b pb-3 border-neutral-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center">
              <Camera className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white">
                AI Visual Fabric Search
              </h3>
              <p className="text-[11px] font-semibold text-neutral-500">
                Upload a swatch photo to find matching catalog rolls
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* UPLOAD DROPZONE */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="h-44 rounded-2xl border-2 border-dashed border-neutral-300 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800/50 hover:bg-neutral-100 cursor-pointer flex flex-col items-center justify-center p-4 transition-all relative overflow-hidden"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Swatch Preview"
              className="h-full w-full object-cover rounded-xl"
            />
          ) : (
            <div className="text-center space-y-2">
              <Upload className="w-8 h-8 text-neutral-400 mx-auto" />
              <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block">
                Click to upload fabric swatch photo
              </span>
              <span className="text-[10px] font-semibold text-neutral-400 block">
                JPG, PNG, WEBP supported
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

        {/* ANALYZE BUTTON */}
        {previewUrl && !results && (
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-black text-white text-xs font-extrabold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Fabric Pattern & Texture...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                Find Matching Fabric Rolls
              </>
            )}
          </button>
        )}

        {/* AI VISUAL RESULTS */}
        {results && (
          <div className="space-y-3 pt-2">
            <div className="p-3 bg-neutral-100 dark:bg-zinc-800 rounded-2xl text-xs space-y-1">
              <span className="text-[10px] font-extrabold text-neutral-500 uppercase block">
                Detected Pattern: {results.detectedTexture}
              </span>
              <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                {results.message}
              </p>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {results.recommendedProducts?.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-2xl border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <p className="font-extrabold text-xs text-neutral-900 dark:text-white">
                        {p.name}
                      </p>
                      <p className="text-[10px] font-bold text-neutral-500">
                        GSM {p.gsm} • ₹{p.price}/m
                      </p>
                    </div>
                  </div>
                  <a
                    href={`/product/${p.id}`}
                    className="p-2 rounded-xl bg-neutral-100 dark:bg-zinc-800 text-neutral-900 dark:text-white hover:bg-black hover:text-white transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
