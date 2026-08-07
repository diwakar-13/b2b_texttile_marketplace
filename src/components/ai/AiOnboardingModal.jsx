"use client";

import React, { useState } from "react";
import { Sparkles, Mic, Send, Loader2, CheckCircle2 } from "lucide-react";
import { completeProfile } from "@/action/completeProfile";

export default function AiOnboardingModal({ role, onComplete }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [extractedProfile, setExtractedProfile] = useState(null);
  const [summary, setSummary] = useState("");

  const startVoiceInput = () => {
    if (
      typeof window === "undefined" ||
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    setIsListening(true);
    recognition.start();

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      processAiOnboarding(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  const processAiOnboarding = async (textToSend = input) => {
    if (!textToSend.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/ai/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textToSend, role }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setExtractedProfile(json.data);
        setSummary(
          json.data.summaryMessage || "Profile details extracted successfully!",
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // DIRECT DATABASE SAVE & HOME PAGE REDIRECT FOR BUYER
  const handleConfirmAndSave = async () => {
    if (!extractedProfile) return;
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("role", role);

      if (role === "BUYER") {
        formData.append(
          "businessType",
          extractedProfile.businessType || "Garment Manufacturer",
        );
        formData.append(
          "industry",
          extractedProfile.industry || "Apparel & Fashion",
        );
        formData.append(
          "preferredFabric",
          extractedProfile.preferredFabric || "Cotton",
        );
        formData.append(
          "typicalOrderQuantity",
          extractedProfile.typicalOrderQuantity || 500,
        );
        formData.append(
          "budgetRange",
          extractedProfile.budgetRange || "$10,000",
        );
      } else {
        formData.append(
          "businessName",
          extractedProfile.businessName || "Textile Business",
        );
        formData.append(
          "businessType",
          extractedProfile.businessType || "Mill",
        );
        formData.append("contactNumber", extractedProfile.contactNumber || "");
        formData.append(
          "businessAddress",
          extractedProfile.businessAddress || "",
        );
        formData.append(
          "operatingHours",
          extractedProfile.operatingHours || "",
        );
        formData.append(
          "fabricsOffered",
          extractedProfile.fabricsOffered || "Cotton",
        );
        formData.append(
          "minimumOrderQuantity",
          extractedProfile.minimumOrderQuantity || 500,
        );
      }

      // Execute Server Action
      const res = await completeProfile(formData);

      if (res?.success) {
        // Clear Local Storage
        localStorage.removeItem("textil_onboarding_role");
        localStorage.removeItem("textil_buyer_step");
        localStorage.removeItem("textil_supplier_step");

        // 🎯 BUYER -> Home Page ('/'), SUPPLIER -> Dashboard ('/supplier/dashboard')
        const targetRoute =
          res.redirectTo || (role === "SUPPLIER" ? "/supplier/dashboard" : "/");
        window.location.href = targetRoute;
      } else {
        alert(res?.message || "Error completing profile!");
        setIsSaving(false);
      }
    } catch (error) {
      console.error("Direct AI Onboarding Save Error:", error);
      alert("Something went wrong during save!");
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-zinc-900">
      <div className="flex items-center gap-3 border-b border-black/5 pb-4 dark:border-white/10">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white dark:bg-white dark:text-black">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            AI Voice & Chat Onboarding
          </h3>
          <p className="text-xs text-neutral-500">
            Tell AI about your business in plain English or Hinglish
          </p>
        </div>
      </div>

      {!extractedProfile ? (
        <div className="mt-6 space-y-4">
          <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
            {role === "BUYER"
              ? 'e.g. "I run a streetwear brand making heavyweight hoodies. I need 200+ GSM cotton fabrics with a budget around $10k."'
              : 'e.g. "We are Vardhman Textile Mill located in Ludhiana. We supply Cotton, Denim, and Twill with 500 meters MOQ."'}
          </p>

          <div className="flex items-center gap-2 rounded-2xl border border-neutral-300 bg-neutral-50 p-2 dark:border-zinc-700 dark:bg-zinc-800">
            <button
              type="button"
              onClick={startVoiceInput}
              className={`p-2.5 rounded-xl transition-all ${
                isListening
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-white text-neutral-700 dark:bg-zinc-700 dark:text-white"
              }`}
            >
              <Mic className="h-4 w-4" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && processAiOnboarding()}
              placeholder="Speak or type your requirement..."
              className="w-full bg-transparent px-2 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none"
            />

            <button
              type="button"
              onClick={() => processAiOnboarding()}
              disabled={loading}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white hover:opacity-80 dark:bg-white dark:text-black"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-3 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <p className="text-xs font-semibold">{summary}</p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-xs dark:border-zinc-800 dark:bg-zinc-800/50 space-y-1.5 text-neutral-800 dark:text-neutral-200 font-medium">
            {Object.entries(extractedProfile).map(
              ([key, val]) =>
                key !== "summaryMessage" && (
                  <div
                    key={key}
                    className="flex justify-between border-b border-black/5 pb-1 dark:border-white/5"
                  >
                    <span className="capitalize font-bold text-neutral-500">
                      {key}:
                    </span>
                    <span>{String(val)}</span>
                  </div>
                ),
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setExtractedProfile(null)}
              disabled={isSaving}
              className="w-full rounded-xl border border-neutral-300 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100 dark:border-zinc-700 dark:text-neutral-300 disabled:opacity-50"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={handleConfirmAndSave}
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-black py-2.5 text-xs font-bold text-white hover:opacity-80 dark:bg-white dark:text-black disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                "Confirm & Save Profile"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
