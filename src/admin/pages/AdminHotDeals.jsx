import React, { useMemo, useState } from "react";
import { Plus, Trash2, Flame } from "lucide-react";
import { products } from "../../data/products";

const STORAGE_KEY = "shreekrishna_hot_deals";

export default function AdminHotDeals() {
  const [deals, setDeals] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  });

  const [form, setForm] = useState({
    productId: "", offerPrice: "", startDate: "", endDate: "", active: true
  });

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === Number(form.productId)),
    [form.productId]
  );

  const saveDeals = (next) => {
    setDeals(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProduct || !form.offerPrice) return;

    const deal = {
      id: Date.now(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      image: selectedProduct.image,
      normalPrice: selectedProduct.price,
      mrp: selectedProduct.originalPrice || selectedProduct.price,
      offerPrice: Number(form.offerPrice),
      startDate: form.startDate,
      endDate: form.endDate,
      active: form.active,
    };

    saveDeals([deal, ...deals]);
    setForm({ productId: "", offerPrice: "", startDate: "", endDate: "", active: true });
  };

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-[#243A34] flex items-center gap-2">
          <Flame size={23} /> Hot Deals
        </h1>
        <p className="text-sm text-gray-500 mt-1">Create limited-time offers for existing products.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E8E3D8] p-5 md:p-7 mb-7">
        <div className="grid md:grid-cols-2 gap-5">
          <label className="text-sm font-medium">Select Product
            <select required value={form.productId}
              onChange={(e) => setForm({ ...form, productId: e.target.value })}
              className="mt-2 w-full border rounded-xl px-4 py-3 bg-white">
              <option value="">Choose product</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>

          <label className="text-sm font-medium">Offer Price (₹)
            <input required type="number" min="1" value={form.offerPrice}
              onChange={(e) => setForm({ ...form, offerPrice: e.target.value })}
              className="mt-2 w-full border rounded-xl px-4 py-3" placeholder="e.g. 449" />
          </label>

          <label className="text-sm font-medium">Start Date
            <input type="date" value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="mt-2 w-full border rounded-xl px-4 py-3" />
          </label>

          <label className="text-sm font-medium">End Date
            <input type="date" value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="mt-2 w-full border rounded-xl px-4 py-3" />
          </label>
        </div>

        {selectedProduct && (
          <div className="mt-5 p-4 bg-[#FAF8F3] rounded-xl flex items-center gap-4">
            <img src={selectedProduct.image} alt={selectedProduct.name} className="w-16 h-16 object-cover rounded-lg" />
            <div>
              <p className="font-semibold">{selectedProduct.name}</p>
              <p className="text-sm text-gray-500">Current price: ₹{selectedProduct.price}</p>
            </div>
          </div>
        )}

        <label className="mt-5 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })} />
          Active Deal
        </label>

        <button className="mt-6 inline-flex items-center gap-2 bg-[#075e4d] text-white px-5 py-3 rounded-xl font-semibold">
          <Plus size={17} /> Save Hot Deal
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-[#E8E3D8] overflow-hidden">
        <div className="p-5 border-b font-bold text-[#243A34]">Saved Hot Deals</div>
        {deals.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No hot deals added yet.</div>
        ) : deals.map((deal) => (
          <div key={deal.id} className="p-4 border-t flex items-center gap-4">
            <img src={deal.image} alt={deal.productName} className="w-14 h-14 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="font-semibold">{deal.productName}</p>
              <p className="text-sm text-gray-500">₹{deal.normalPrice} → <b className="text-[#B5563C]">₹{deal.offerPrice}</b></p>
              <p className="text-xs text-gray-400">{deal.startDate || "No start date"} — {deal.endDate || "No end date"} · {deal.active ? "Active" : "Inactive"}</p>
            </div>
            <button type="button" onClick={() => saveDeals(deals.filter((d) => d.id !== deal.id))}
              className="w-9 h-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
