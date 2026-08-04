"use client";

import BrowseMarketplace from "@/components/home/BrowseMarketPlace";
import PremiumCategories from "@/components/home/Categories";
import FeaturedMarketplace from "@/components/home/FeaturedMarketplace";
import SearchHero from "@/components/home/SearchHero";
import Header from "@/components/layout/Navbar";
import { useState } from "react";

export default function HomePage() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground mesh-gradient relative transition-colors duration-300">
        <div className="noise"></div>

        <Header isDark={isDark} setIsDark={setIsDark} />

        <main className="space-y-6">
          <SearchHero />
          <PremiumCategories />
          <FeaturedMarketplace />
          <BrowseMarketplace />
        </main>
      </div>
    </div>
  );
}
