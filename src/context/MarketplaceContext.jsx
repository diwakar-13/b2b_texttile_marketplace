"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

const MarketplaceContext = createContext();

export function MarketplaceProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [priceMax, setPriceMax] = useState(2000);
  const [moqMax, setMoqMax] = useState(10000);
  const [selectedMaterial, setSelectedMaterial] = useState("All");
  const [selectedWidth, setSelectedWidth] = useState("All");
  const [minGsm, setMinGsm] = useState(10);
  const [maxGsm, setMaxGsm] = useState(500);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Fetch Initial Products
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setPage(1);
    try {
      const response = await axios.get("/api/products", {
        params: {
          page: 1,
          limit: 8,
          search: searchQuery || undefined,
          category: selectedMaterial !== "All" ? selectedMaterial : undefined,
          minGsm: minGsm || undefined,
          maxGsm: maxGsm || undefined,
          maxMoq: moqMax || undefined,
        },
      });

      const result = response.data;
      if (result.success) {
        setProducts(result.products);
        setHasMore(result.hasMore);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedMaterial, minGsm, maxGsm, moqMax]);

  // Load More Functionality
  const loadMoreProducts = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);

    const nextPage = page + 1;
    try {
      const response = await axios.get("/api/products", {
        params: {
          page: nextPage,
          limit: 8,
          search: searchQuery || undefined,
          category: selectedMaterial !== "All" ? selectedMaterial : undefined,
          minGsm: minGsm || undefined,
          maxGsm: maxGsm || undefined,
          maxMoq: moqMax || undefined,
        },
      });

      const result = response.data;
      if (result.success) {
        setProducts((prev) => [...prev, ...result.products]);
        setPage(nextPage);
        setHasMore(result.hasMore);
      }
    } catch (err) {
      console.error("Failed to load more products:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter((p) => {
    const matchesPrice = Number(p.price) <= priceMax;
    const matchesWidth = selectedWidth === "All" || p.width === selectedWidth;
    const matchesVerified = verifiedOnly ? p.verified : true;

    return matchesPrice && matchesWidth && matchesVerified;
  });

  const resetFilters = () => {
    setSearchQuery("");
    setPriceMax(2000);
    setMoqMax(10000);
    setSelectedMaterial("All");
    setSelectedWidth("All");
    setMinGsm(10);
    setMaxGsm(500);
    setVerifiedOnly(false);
  };

  return (
    <MarketplaceContext.Provider
      value={{
        products: filteredProducts,
        totalCount: filteredProducts.length,
        isLoading,
        isLoadingMore,
        hasMore,
        loadMoreProducts,
        searchQuery,
        setSearchQuery,
        priceMax,
        setPriceMax,
        moqMax,
        setMoqMax,
        selectedMaterial,
        setSelectedMaterial,
        selectedWidth,
        setSelectedWidth,
        minGsm,
        setMinGsm,
        maxGsm,
        setMaxGsm,
        verifiedOnly,
        setVerifiedOnly,
        resetFilters,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export const useMarketplace = () => useContext(MarketplaceContext);