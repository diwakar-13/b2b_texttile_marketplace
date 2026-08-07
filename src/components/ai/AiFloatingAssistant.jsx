"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Mic,
  Send,
  X,
  Loader2,
  ShoppingBag,
  Globe2,
  ChevronRight,
  Volume2,
  VolumeX,
} from "lucide-react";
import { LiquidMetalButton } from "@/components/ui/Liquid-Metal-button";

// 🎯 CLEAN TEXT FORMATTER (Strips raw **, ####, and formats bullet points)
function FormatAiMessage({ text }) {
  if (!text) return null;

  // Strip Markdown Symbols
  const cleanRawText = text.replace(/#{1,6}\s?/g, "").replace(/\*\*/g, "");

  const lines = cleanRawText.split("\n");

  return (
    <div className="space-y-1.5 leading-relaxed text-xs">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={lineIdx} className="h-1" />;

        if (
          trimmed.startsWith("* ") ||
          trimmed.startsWith("- ") ||
          trimmed.startsWith("• ")
        ) {
          return (
            <div key={lineIdx} className="flex items-start gap-1.5 pl-1">
              <span className="text-amber-500 font-bold">•</span>
              <div>{trimmed.replace(/^[*•-]\s*/, "")}</div>
            </div>
          );
        }

        return <p key={lineIdx}>{trimmed}</p>;
      })}
    </div>
  );
}

export default function AiFloatingAssistant({
  externalQuery,
  setExternalQuery,
  currentProduct = null,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState("en");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);

  const defaultTexture =
    "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=300&auto=format&fit=crop";

  const initialWelcome = {
    en: currentProduct
      ? `Asking AI about "${currentProduct.title || currentProduct.name}": Ask wash care, GSM behavior, or garment suitability.`
      : "Hello! I am your AI Fabric Consultant. Ask me about GSM, weave types, fabric comparison, or select an option below:",
    hi: currentProduct
      ? `Aap "${currentProduct.title || currentProduct.name}" ke baare mein pooch rahe hain: Wash care ya GSM details pucho.`
      : "Namaste! Main aapka AI Fabric Consultant hoon. GSM, material, comparison ya matching fabrics ke baare mein pucho:",
  };

  const samplePrompts = currentProduct
    ? [
        {
          en: "🧵 Best garments for this fabric?",
          hi: "🧵 Is fabric se kya banega?",
        },
        {
          en: "🧼 Wash care & shrinkage %?",
          hi: "🧼 Wash care aur shrinkage kitna hai?",
        },
        {
          en: "🎨 Dyeing & printing suitability?",
          hi: "🎨 Dyeing aur printing ho sakti hai?",
        },
        {
          en: "📦 MOQ & bulk price terms?",
          hi: "📦 MOQ aur bulk price details",
        },
      ]
    : [
        {
          en: "🔍 Compare Denim vs Linen",
          hi: "🔍 Denim aur Linen ka comparison",
        },
        {
          en: "🧵 200+ GSM Cotton for Hoodies",
          hi: "🧵 Hoodies ke liye 200+ GSM Cotton",
        },
        {
          en: "☀️ Lightweight Summer Fabrics",
          hi: "☀️ Garmiyon ke liye halka fabric",
        },
        {
          en: "📦 Bulk Pricing & MOQ Details",
          hi: "📦 Wholesale Price aur MOQ",
        },
      ];

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: initialWelcome[lang],
      products: [],
      showChips: true,
    },
  ]);

  useEffect(() => {
    if (externalQuery) {
      setIsOpen(true);
      handleSend(externalQuery);
      if (setExternalQuery) setExternalQuery("");
    }
  }, [externalQuery]);

  const speakText = (text) => {
    if (
      typeof window !== "undefined" &&
      "speechSynthesis" in window &&
      autoSpeak
    ) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/\*\*/g, "").replace(/#{1,6}\s?/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = lang === "en" ? "en-US" : "hi-IN";
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleLanguage = () => {
    const nextLang = lang === "en" ? "hi" : "en";
    setLang(nextLang);
    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text:
          nextLang === "en" ? "Switched to English." : "Hinglish mode active.",
        products: [],
        showChips: true,
      },
    ]);
  };

  const startVoiceInput = () => {
    if (
      typeof window === "undefined" ||
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert("Voice input is not supported in this browser.");
      return;
    }
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang === "en" ? "en-US" : "hi-IN";
    setIsListening(true);
    recognition.start();

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      handleSend(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  const handleSend = async (customPrompt = null) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: textToSend, showChips: false },
    ]);
    if (!customPrompt) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend,
          productContext: currentProduct,
        }),
      });

      const json = await res.json();

      if (json.success) {
        const aiMessage = json.data.message;
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: aiMessage,
            products: json.data.recommendedProducts || [],
            showChips: false,
          },
        ]);
        speakText(aiMessage);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "Something went wrong. Please try again.",
            showChips: false,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Unable to connect to AI server.",
          showChips: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🌫️ 100% FULLSCREEN BACKDROP BLUR FOR MOBILE & DESKTOP BACKGROUND */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-md transition-all duration-300 sm:hidden"
        />
      )}

      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex flex-col items-end font-sans max-w-[95vw]">
        {isOpen && (
          /* 🧊 GLASSY FROSTED CONTAINER */
          <div className="mb-3 flex h-[82vh] max-h-[560px] w-[92vw] sm:w-[420px] flex-col overflow-hidden rounded-[28px] border border-white/60 dark:border-white/20 bg-white/70 dark:bg-[#111115]/80 backdrop-blur-2xl shadow-[0_12px_40px_0_rgba(0,0,0,0.25)] transition-all">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 px-4 sm:px-5 py-3.5 bg-white/30 dark:bg-zinc-900/30 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-black dark:bg-white text-white dark:text-black font-extrabold text-xs sm:text-sm shadow-xs">
                  T
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <span>Textil AI Assistant</span>
                    {currentProduct && (
                      <span className="px-1.5 py-0.5 rounded-md bg-amber-100/90 text-amber-800 text-[9px] font-extrabold">
                        Product Q&A
                      </span>
                    )}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-gray-600 dark:text-gray-400 font-semibold">
                    {currentProduct
                      ? "Fabric Specs Expert"
                      : "Smart Fabric Sourcing"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  onClick={() => setAutoSpeak(!autoSpeak)}
                  className="p-1.5 rounded-full text-gray-600 hover:text-black dark:hover:text-white cursor-pointer transition-colors"
                >
                  {autoSpeak ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </button>

                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-semibold bg-black/10 dark:bg-zinc-800/60 text-gray-800 dark:text-gray-200 cursor-pointer backdrop-blur-xs"
                >
                  <Globe2 className="h-3 w-3" />
                  <span>{lang === "en" ? "EN" : "Hinglish"}</span>
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1.5 text-gray-500 hover:text-black dark:hover:text-white cursor-pointer transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* MESSAGES LOG */}
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 text-xs">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[90%] rounded-[20px] px-4 py-3 shadow-2xs border ${
                      msg.sender === "user"
                        ? "bg-black/90 text-white dark:bg-white/90 dark:text-black font-medium border-transparent"
                        : "bg-white/80 dark:bg-zinc-800/80 text-gray-900 dark:text-gray-100 border-white/60 dark:border-zinc-700/50 backdrop-blur-md"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      msg.text
                    ) : (
                      <FormatAiMessage text={msg.text} />
                    )}
                  </div>

                  {/* SUGGESTION CHIPS */}
                  {msg.showChips && (
                    <div className="mt-3 grid grid-cols-1 gap-2 w-full">
                      {samplePrompts.map((chip, chipIdx) => (
                        <button
                          key={chipIdx}
                          onClick={() => handleSend(chip[lang])}
                          className="flex items-center justify-between rounded-xl border border-black/10 dark:border-zinc-700/60 bg-white/70 dark:bg-zinc-800/50 backdrop-blur-md px-3.5 py-2.5 text-left text-[11px] font-semibold text-gray-800 dark:text-gray-200 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all group cursor-pointer shadow-2xs"
                        >
                          <span>{chip[lang]}</span>
                          <ChevronRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-current" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* DYNAMIC DB PRODUCT CARDS */}
                  {msg.products?.length > 0 && (
                    <div className="mt-3 w-full space-y-2">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                        Recommended Fabrics
                      </p>
                      {msg.products.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between rounded-2xl border border-black/10 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-3 shadow-2xs hover:border-black dark:hover:border-white transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative h-11 w-11 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-xl border border-black/10 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800">
                              <img
                                src={
                                  p.imageUrl && p.imageUrl.trim() !== ""
                                    ? p.imageUrl
                                    : defaultTexture
                                }
                                alt={p.name}
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = defaultTexture;
                                }}
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-xs text-gray-900 dark:text-white truncate w-32 sm:w-36">
                                {p.name}
                              </p>
                              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                GSM {p.gsm || "N/A"} • ₹{p.price}/m
                              </p>
                            </div>
                          </div>
                          <a
                            href={`/product/${p.id}`}
                            className="rounded-xl bg-black/10 dark:bg-zinc-800 p-2.5 text-gray-900 dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                          >
                            <ShoppingBag className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 p-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Analyzing
                  fabric specifications...
                </div>
              )}
            </div>

            {/* INPUT BAR */}
            <div className="p-3 sm:p-3.5 border-t border-black/10 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
              <div className="flex items-center gap-2 rounded-full border border-black/10 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md p-1.5 shadow-2xs">
                <button
                  onClick={startVoiceInput}
                  className={`p-2 rounded-full cursor-pointer ${
                    isListening
                      ? "bg-red-500 text-white animate-pulse"
                      : "text-gray-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <Mic className="h-4 w-4" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={
                    currentProduct
                      ? "Ask about wash care, GSM, or suitability..."
                      : lang === "en"
                        ? "Ask AI fabric specs or compare..."
                        : "Fabrics ke baare mein pucho..."
                  }
                  className="w-full bg-transparent px-1 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={loading}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black hover:opacity-80 cursor-pointer shadow-xs"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TRIGGER BUTTON */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="relative cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 group"
        >
          <LiquidMetalButton viewMode="icon">
            <div className="relative flex items-center justify-center">
              {isOpen ? (
                <X className="h-5 w-5 text-white" />
              ) : (
                <Sparkles className="h-5 w-5 text-white" />
              )}
            </div>
          </LiquidMetalButton>
        </div>
      </div>
    </>
  );
}
