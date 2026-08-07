"use client";

import BrowseMarketplace from "@/components/home/BrowseMarketPlace";
import PremiumCategories from "@/components/home/Categories";
import FeaturedMarketplace from "@/components/home/FeaturedMarketplace";
import SearchHero from "@/components/home/SearchHero";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Navbar";
import AiFloatingAssistant from "@/components/ai/AiFloatingAssistant";
import { useState } from "react";

export default function HomePage() {
  const [isDark, setIsDark] = useState(false);
  const [aiQuery, setAiQuery] = useState("");

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground mesh-gradient relative transition-colors duration-300 overflow-x-hidden">
        <div className="noise"></div>

        <Header isDark={isDark} setIsDark={setIsDark} />

        <main className="space-y-6">
          <SearchHero onAiSearch={(data) => setAiQuery(data)} />
          <PremiumCategories />
          <FeaturedMarketplace />
          <BrowseMarketplace />
          <Footer />
        </main>

        <AiFloatingAssistant
          externalQuery={aiQuery}
          setExternalQuery={setAiQuery}
        />
      </div>
    </div>
  );
}
