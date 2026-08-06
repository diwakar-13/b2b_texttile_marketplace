"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Trash2,
  Package,
  Layers,
  Loader2,
  Edit2,
  Power,
  ExternalLink,
  X,
  Camera,
} from "lucide-react";
import Link from "next/link";
import { deleteProduct } from "@/action/supplier/deleteProduct";
import {
  updateProduct,
  toggleProductAvailability,
} from "@/action/supplier/products";
import InventorySkeleton from "./InventorySkeleton";
import { toast } from "sonner";

export default function InventoryTable({ initialProducts = [] }) {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simulate Skeleton Loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Filter Search
  const filteredProducts = products.filter((prod) => {
    const query = searchQuery.toLowerCase();
    return (
      prod.name.toLowerCase().includes(query) ||
      (prod.material && prod.material.toLowerCase().includes(query)) ||
      (prod.composition && prod.composition.toLowerCase().includes(query))
    );
  });

  // Toggle Available / Out of Stock Status
  const handleToggleAvailability = async (productId, currentStatus) => {
    try {
      const res = await toggleProductAvailability(productId, currentStatus);
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, isAvailable: !currentStatus } : p,
          ),
        );
        toast.success(
          !currentStatus
            ? "Fabric marked as Available"
            : "Fabric marked as Out of Stock",
        );
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // Delete Action
  const handleDelete = async (productId, productName) => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) return;

    setDeletingId(productId);
    try {
      const res = await deleteProduct(productId);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        toast.success("Fabric deleted successfully");
      } else {
        toast.error(res.error || "Failed to delete fabric");
      }
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  // Submit Edit Form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.target);
      const res = await updateProduct(editingProduct.id, formData);

      if (res.success) {
        toast.success("Product updated successfully!");
        window.location.reload();
      } else {
        toast.error(res.error || "Failed to update product");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <InventorySkeleton />;

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/70 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden space-y-4 p-6 font-sans">
      {/* SEARCH AND CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-neutral-100 pb-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fabric name, material, GSM..."
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-[#FBFBFC] border border-neutral-200/80 text-xs font-bold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-all"
          />
        </div>
        <span className="text-xs font-bold text-neutral-400 self-end sm:self-center">
          Showing {filteredProducts.length} of {products.length} fabrics
        </span>
      </div>

      {/* INVENTORY TABLE */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-[#FBFBFC] rounded-2xl border border-dashed border-neutral-200">
          <div className="w-12 h-12 bg-neutral-100 text-neutral-400 rounded-2xl flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-neutral-800">
            {searchQuery
              ? "No matching fabrics found."
              : "No fabrics in inventory yet."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 text-[11px] font-extrabold uppercase tracking-wider text-neutral-500 bg-[#FBFBFC]">
                <th className="py-3 px-4 rounded-l-xl">Fabric</th>
                <th className="py-3 px-4">Specs (GSM / Width)</th>
                <th className="py-3 px-4">Price / MOQ</th>
                <th className="py-3 px-4">Stock & Status</th>
                <th className="py-3 px-4 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs">
              {filteredProducts.map((prod) => (
                <tr
                  key={prod.id}
                  className="hover:bg-[#FBFBFC] transition-colors"
                >
                  {/* FABRIC NAME & SWATCH */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-xl bg-neutral-100 border border-neutral-200/80 overflow-hidden shrink-0 flex items-center justify-center">
                        {prod.imageUrl ? (
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="size-full object-cover"
                          />
                        ) : (
                          <Layers className="w-5 h-5 text-neutral-400" />
                        )}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <span className="font-extrabold text-neutral-950 text-xs block truncate max-w-[200px]">
                          {prod.name}
                        </span>
                        <span className="text-[11px] font-bold text-neutral-500 block truncate">
                          {prod.material || "Cotton"} •{" "}
                          {prod.composition || "100% Cotton"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* SPECS */}
                  <td className="py-4 px-4 font-bold text-neutral-700 text-[11px]">
                    <p>{prod.gsm ? `${prod.gsm} GSM` : "N/A"}</p>
                    <p className="text-neutral-400">{prod.width || '58/60"'}</p>
                  </td>

                  {/* PRICING & MOQ */}
                  <td className="py-4 px-4">
                    <span className="font-black text-neutral-950 text-sm block">
                      ₹{Number(prod.price).toLocaleString()}/m
                    </span>
                    <span className="text-[10px] font-bold text-neutral-400 block">
                      MOQ: {prod.moq}m
                    </span>
                  </td>

                  {/* STOCK & AVAILABILITY TOGGLE */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleToggleAvailability(prod.id, prod.isAvailable)
                        }
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black border flex items-center gap-1 cursor-pointer transition-all ${
                          prod.isAvailable && prod.stock > 0
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        {prod.isAvailable && prod.stock > 0
                          ? "Available"
                          : "Out of Stock"}
                      </button>
                      <span className="text-[11px] font-bold text-neutral-500">
                        ({prod.stock}m)
                      </span>
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* EDIT BUTTON */}
                      <button
                        onClick={() => setEditingProduct(prod)}
                        className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600 hover:text-neutral-950 transition-colors"
                        title="Edit Fabric"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* VIEW BUTTON */}
                      <Link
                        href={`/product/${prod.id}`}
                        target="_blank"
                        className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      {/* DELETE BUTTON */}
                      <button
                        onClick={() => handleDelete(prod.id, prod.name)}
                        disabled={deletingId === prod.id}
                        className="p-2 rounded-lg hover:bg-rose-50 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        {deletingId === prod.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🎯 EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-extrabold text-neutral-950">
                Edit Fabric Details
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 hover:bg-neutral-100 rounded-lg"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-extrabold text-neutral-700">
                  Fabric Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingProduct.name}
                  required
                  className="w-full h-10 bg-[#FBFBFC] border border-neutral-200 rounded-xl px-3 font-bold text-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-neutral-700">
                    Material
                  </label>
                  <input
                    type="text"
                    name="material"
                    defaultValue={editingProduct.material}
                    className="w-full h-10 bg-[#FBFBFC] border border-neutral-200 rounded-xl px-3 font-bold"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-neutral-700">
                    GSM Weight
                  </label>
                  <input
                    type="number"
                    name="gsm"
                    defaultValue={editingProduct.gsm}
                    className="w-full h-10 bg-[#FBFBFC] border border-neutral-200 rounded-xl px-3 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-extrabold text-neutral-700">
                    Price (₹/m)
                  </label>
                  <input
                    type="number"
                    name="price"
                    defaultValue={editingProduct.price}
                    required
                    className="w-full h-10 bg-[#FBFBFC] border border-neutral-200 rounded-xl px-3 font-bold"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-neutral-700">
                    Stock (Meters)
                  </label>
                  <input
                    type="number"
                    name="stock"
                    defaultValue={editingProduct.stock}
                    required
                    className="w-full h-10 bg-[#FBFBFC] border border-neutral-200 rounded-xl px-3 font-bold"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-neutral-700">
                    MOQ (Meters)
                  </label>
                  <input
                    type="number"
                    name="moq"
                    defaultValue={editingProduct.moq}
                    required
                    className="w-full h-10 bg-[#FBFBFC] border border-neutral-200 rounded-xl px-3 font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-neutral-950 text-white rounded-xl font-bold flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
