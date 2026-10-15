
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  RefreshCw,
} from "lucide-react";

import { adminProductService } from "../services/adminProductService";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await adminProductService.getAll();

      if (!Array.isArray(data)) {
        throw new Error("Invalid products response from server.");
      }

      setProducts(data);
    } catch (err) {
      setError(err.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const query = search.toLowerCase().trim();

    return (
      (product.name || "").toLowerCase().includes(query) ||
      (product.categoryName || "").toLowerCase().includes(query) ||
      (product.slug || "").toLowerCase().includes(query)
    );
  });

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    setDeletingId(product.id);
    setError("");
    setMessage("");

    try {
      await adminProductService.delete(product.id);

      setProducts((prev) =>
        prev.filter((item) => item.id !== product.id)
      );

      setMessage("Product deleted successfully.");
    } catch (err) {
      setError(err.message || "Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="text-2xl font-bold text-[#243A34]">
            Products
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            View and manage store products.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={loadProducts}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 px-4 py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <Link
            to="/admin/products/add"
            className="inline-flex items-center justify-center gap-2 bg-[#075e4d] text-white px-4 py-3 rounded-xl text-sm font-semibold"
          >
            <Plus size={17} />
            Add Product
          </Link>
        </div>
      </div>

      {/* MESSAGES */}
      {error && (
        <div
          role="alert"
          className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm"
        >
          {error}
        </div>
      )}

      {message && (
        <div
          role="status"
          className="mb-4 bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm"
        >
          {message}
        </div>
      )}

      {/* PRODUCT TABLE */}
      <div className="bg-white rounded-2xl border border-[#E8E3D8] overflow-hidden">

        {/* SEARCH */}
        <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="max-w-sm flex items-center gap-2 bg-[#F7F8F7] rounded-xl px-4">
            <Search size={17} className="text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full py-3 bg-transparent outline-none text-sm"
            />
          </div>

          <span className="text-sm text-gray-500">
            Total Products: {products.length}
          </span>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#FAF8F3] text-gray-500 text-xs">
              <tr>
                <th className="text-left px-5 py-4">Product</th>
                <th className="text-left px-5 py-4">Category</th>
                <th className="text-left px-5 py-4">Price</th>
                <th className="text-left px-5 py-4">MRP</th>
                <th className="text-left px-5 py-4">Status</th>
                <th className="text-right px-5 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12 text-gray-500"
                  >
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12 text-gray-500"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t border-gray-100"
                  >
                    {/* PRODUCT */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg bg-[#EEF5F1] text-[#075e4d] flex items-center justify-center">
                          <Package size={20} />
                        </div>

                        <div>
                          <p className="font-semibold text-[#243A34]">
                            {product.name}
                          </p>

                          <p className="text-xs text-gray-400">
                            ID: {product.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className="px-5 py-4 text-gray-500">
                      {product.categoryName || "-"}
                    </td>

                    {/* PRICE */}
                    <td className="px-5 py-4 font-semibold">
                      ₹{Number(product.basePrice ?? 0).toFixed(2)}
                    </td>

                    {/* MRP */}
                    <td className="px-5 py-4 text-gray-500">
                      {product.mrp != null
                        ? `₹${Number(product.mrp).toFixed(2)}`
                        : "-"}
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {product.active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">

                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="w-9 h-9 rounded-lg bg-[#EEF5F1] text-[#075e4d] flex items-center justify-center hover:bg-[#075e4d] hover:text-white transition"
                          title="Edit Product"
                        >
                          <Pencil size={15} />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          disabled={deletingId !== null}
                          className="w-9 h-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition disabled:opacity-50"
                          title="Delete Product"
                        >
                          <Trash2 size={15} />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
