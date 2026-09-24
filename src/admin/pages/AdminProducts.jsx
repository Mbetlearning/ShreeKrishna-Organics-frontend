import React from "react";

import { Link } from "react-router-dom";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
} from "lucide-react";

import { products } from "../../data/products";

export default function AdminProducts() {
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

        <Link
          to="/admin/products/add"
          className="inline-flex items-center justify-center gap-2 bg-[#075e4d] text-white px-4 py-3 rounded-xl text-sm font-semibold"
        >
          <Plus size={17} />
          Add Product
        </Link>

      </div>

      {/* PRODUCT TABLE */}
      <div className="bg-white rounded-2xl border border-[#E8E3D8] overflow-hidden">

        {/* SEARCH */}
        <div className="p-4 border-b">

          <div className="max-w-sm flex items-center gap-2 bg-[#F7F8F7] rounded-xl px-4">

            <Search
              size={17}
              className="text-gray-400"
            />

            <input
              type="text"
              placeholder="Search products..."
              className="w-full py-3 bg-transparent outline-none text-sm"
            />

          </div>

        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-[#FAF8F3] text-gray-500 text-xs">

              <tr>
                <th className="text-left px-5 py-4">
                  Product
                </th>

                <th className="text-left px-5 py-4">
                  Category
                </th>

                <th className="text-left px-5 py-4">
                  Price
                </th>

                <th className="text-right px-5 py-4">
                  Actions
                </th>
              </tr>

            </thead>

            <tbody>

              {products.map((product) => (

                <tr
                  key={product.id}
                  className="border-t border-gray-100"
                >

                  {/* PRODUCT */}
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-11 h-11 rounded-lg object-cover bg-gray-100"
                      />

                      <span className="font-semibold text-[#243A34]">
                        {product.name}
                      </span>

                    </div>

                  </td>

                  {/* CATEGORY */}
                  <td className="px-5 py-4 text-gray-500">
                    {product.categoryName || product.category}
                  </td>

                  {/* PRICE */}
                  <td className="px-5 py-4 font-semibold">
                    ₹{product.price}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-5 py-4">

                    <div className="flex justify-end gap-2">

                      {/* EDIT */}
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="w-9 h-9 rounded-lg bg-[#EEF5F1] text-[#075e4d] flex items-center justify-center hover:bg-[#075e4d] hover:text-white transition"
                        title="Edit Product"
                      >
                        <Pencil size={15} />
                      </Link>

                      {/* DELETE */}
                      <button
                        type="button"
                        className="w-9 h-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition"
                        title="Delete Product"
                      >
                        <Trash2 size={15} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}
