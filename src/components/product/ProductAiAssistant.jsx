"use client";

import React, { useState } from "react";
import { Sparkles, Send, Loader2, Bot, MessageSquare } from "lucide-react";

export default function ProductAiAssistant({ product }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const quickQuestions = [
    "What garments is this fabric best suited for?",
    "What are the wash care and shrinkage specifications?",
    "Is this suitable for summer or winter collections?",
    "Can this fabric be custom dyed?",
  ];

  const handleAskAi = async (userQuestion = prompt) => {
    if (!userQuestion.trim() || loading) return;

    const q = userQuestion;
    setPrompt("");
    setChatHistory((prev) => [...prev, { role: "user", text: q }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/product-qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: q, product }),
      });

      const data = await res.json();
      if (data.success) {
        setChatHistory((prev) => [...prev, { role: "ai", text: data.answer }]);
      } else {
        setChatHistory((prev) => [
          ...prev,
          { role: "ai", text: "Failed to load answer. Please try again." },
        ]);
      }
    } catch (error) {
      console.error("AI Error:", error);
      setChatHistory((prev) => [
        ...prev,
        { role: "ai", text: "Something went wrong connecting to AI engine." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-2xs space-y-5">
      <div className="flex items-center justify-between border-b border-black/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900">
              AI Fabric Technical Assistant
            </h3>
            <p className="text-xs text-neutral-500 font-medium">
              Ask instant questions regarding wash care, GSM behavior, or
              garment suitability
            </p>
          </div>
        </div>
      </div>

      {/* QUICK PRESET QUESTION CHIPS */}
      <div className="flex flex-wrap gap-2">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleAskAi(q)}
            className="px-3.5 py-2 rounded-xl bg-neutral-50 hover:bg-black hover:text-white border border-neutral-200 text-xs font-semibold text-neutral-700 transition-all text-left cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* CHAT LOG */}
      {chatHistory.length > 0 && (
        <div className="space-y-3 pt-2 max-h-[300px] overflow-y-auto">
          {chatHistory.map((item, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 text-xs leading-relaxed ${
                item.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {item.role === "ai" && (
                <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`p-3.5 rounded-2xl max-w-[80%] font-medium ${
                  item.role === "user"
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-800 border border-black/5"
                }`}
              >
                {item.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-semibold p-2">
              <Loader2 className="w-4 h-4 animate-spin text-black" />
              AI is analyzing fabric specs...
            </div>
          )}
        </div>
      )}

      {/* INPUT FIELD */}
      <div className="flex items-center gap-2 rounded-2xl border border-neutral-300 bg-neutral-50 p-2 focus-within:border-black focus-within:bg-white transition-all">
        <MessageSquare className="w-4 h-4 text-neutral-400 ml-2" />
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAskAi()}
          placeholder="Ask anything about this fabric (e.g. GSM suitability, shrinkage, wash care)..."
          className="w-full bg-transparent text-xs font-semibold text-neutral-900 focus:outline-none px-1"
        />
        <button
          onClick={() => handleAskAi()}
          disabled={loading || !prompt.trim()}
          className="h-9 px-4 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 disabled:opacity-40 transition-all cursor-pointer flex items-center gap-1.5"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
