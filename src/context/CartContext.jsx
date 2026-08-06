"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const supabase = createClient();

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/cart");
      if (res.data.success) {
        setCart(res.data.cart || []);
      }
    } catch (err) {
      console.error("Cart fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function initUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
      if (session?.user) fetchCart();
      else setLoading(false);
    }
    initUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
      if (session?.user) fetchCart();
      else setCart([]);
    });

    return () => listener?.subscription?.unsubscribe();
  }, [fetchCart]);

  // Add To Cart with Optimistic UI & Toast
  const addToCart = async (product) => {
    if (!user) {
      toast.error("Please login first!", {
        description: "You need an account to add items to cart.",
      });
      return false;
    }

    const qtyToAdd = Number(product.quantity) || 1;

    // Optimistic UI Update
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + qtyToAdd }
            : item,
        );
      } else {
        return [
          ...prev,
          {
            id: "temp-" + Date.now(),
            productId: product.id,
            title: product.title || product.name,
            price: product.price,
            image: product.image,
            quantity: qtyToAdd,
          },
        ];
      }
    });

    toast.success("Added to Cart!", {
      description: `${qtyToAdd} meters of ${product.title || product.name} added.`,
    });

    try {
      const res = await axios.post("/api/cart", {
        productId: product.id,
        quantity: qtyToAdd,
        price: product.price,
      });

      if (res.data.success) {
        fetchCart();
        return true;
      }
    } catch (err) {
      toast.error("Failed to add product to cart");
      fetchCart();
      return false;
    }
  };

  // Instant Counter Update
  const updateQuantity = async (productId, price, newQuantity) => {
    if (newQuantity < 1) return;

    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );

    try {
      await axios.post("/api/cart", {
        productId,
        quantity: newQuantity,
        price,
        isAbsolute: true,
      });
    } catch (err) {
      console.error("Update quantity failed:", err);
      fetchCart();
    }
  };

  const removeFromCart = async (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    try {
      await axios.delete(`/api/cart?id=${cartItemId}`);
    } catch (err) {
      console.error("Remove failed:", err);
      fetchCart();
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount: cart.length,
        totalMeters: cart.reduce((sum, item) => sum + item.quantity, 0),
        addToCart,
        updateQuantity,
        removeFromCart,
        loading,
        user,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
