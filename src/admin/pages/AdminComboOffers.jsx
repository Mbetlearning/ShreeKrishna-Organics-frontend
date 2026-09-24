import React, { useState } from "react";
import { Plus, Trash2, PackagePlus } from "lucide-react";
import { products } from "../../data/products";

const STORAGE_KEY = "shreekrishna_combo_offers";

export default function AdminComboOffers() {
  const [combos, setCombos] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  });

  const [form, setForm] = useState({
    name: "", productIds: [], comboPrice: "", image: "", description: "", active: true
  });

  const toggleProduct = (id) => {
    setForm((prev) => ({
      ...prev,
      productIds: prev.productIds.includes(id)
        ? prev.productIds.filter((x) => x !== id)
        : [...prev.productIds, id],
    }));
  };

  const selectedProducts = products.filter((p) => form.productIds.includes(p.id));
  const totalPrice = selectedProducts.reduce((sum, p) => sum + Number(p.price || 0), 0);

  const saveCombos = (next) => {
    setCombos(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.productIds.length < 2 || !form.name || !form.comboPrice) return;

    const combo = {
      id: Date.now(),
      name: form.name,
      productIds: form.productIds,
      products: selectedProducts.map((p) => ({
        id: p.id, name: p.name, image: p.image, price: p.price
      })),
      totalPrice,
      comboPrice: Number(form.comboPrice),
      image: form.image || selectedProducts[0]?.image || "",
      description: form.description,
      active: form.active,
    };

    saveCombos([combo, ...combos]);
    setForm({ name: "", productIds: [], comboPrice: "", image: "", description: "", active: true });
  };

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-[#243A34] flex items-center gap-2">
          <PackagePlus size={23} /> Combo Offers
        </h1>
        <p className="text-sm text-gray-500 mt-1">Combine two or more products into a special offer.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E8E3D8] p-5 md:p-7 mb-7">
        <div className="grid md:grid-cols-2 gap-5">
          <label className="text-sm font-medium">Combo Name
            <input required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-2 w-full border rounded-xl px-4 py-3" placeholder="e.g. Healthy Oil Combo" />
          </label>

          <label className="text-sm font-medium">Combo Offer Price (₹)
            <input required type="number" min="1" value={form.comboPrice}
              onChange={(e) => setForm({ ...form, comboPrice: e.target.value })}
              className="mt-2 w-full border rounded-xl px-4 py-3" placeholder="e.g. 1249" />
          </label>

          <label className="text-sm font-medium md:col-span-2">Combo Image URL (optional)
            <input value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="mt-2 w-full border rounded-xl px-4 py-3" placeholder="https://..." />
          </label>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold mb-3">Select Products (minimum 2)</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.map((p) => (
              <label key={p.id}
                className={`border rounded-xl p-3 flex items-center gap-3 cursor-pointer ${form.productIds.includes(p.id) ? "border-[#075e4d] bg-[#EEF5F1]" : "border-gray-200"}`}>
                <input type="checkbox" checked={form.productIds.includes(p.id)}
                  onChange={() => toggleProduct(p.id)} />
                <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                <span className="text-xs font-medium">{p.name}<br />
                  <span className="text-gray-400">₹{p.price}</span>
                </span>
              </label>
            ))}
          </div>
          {form.productIds.length > 0 && (
            <p className="mt-3 text-sm text-gray-500">
              Selected: {form.productIds.length} · Regular total: ₹{totalPrice}
            </p>
          )}
        </div>

        <label className="block mt-5 text-sm font-medium">Description
          <textarea value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-2 w-full border rounded-xl px-4 py-3 min-h-28" />
        </label>

        <label className="mt-4 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })} />
          Active Combo
        </label>

        <button disabled={form.productIds.length < 2}
          className="mt-6 inline-flex items-center gap-2 bg-[#075e4d] disabled:opacity-40 text-white px-5 py-3 rounded-xl font-semibold">
          <Plus size={17} /> Save Combo Offer
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-[#E8E3D8] overflow-hidden">
        <div className="p-5 border-b font-bold text-[#243A34]">Saved Combo Offers</div>
        {combos.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No combo offers added yet.</div>
        ) : combos.map((combo) => (
          <div key={combo.id} className="p-4 border-t flex items-center gap-4">
            <img src={combo.image} alt={combo.name} className="w-14 h-14 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="font-semibold">{combo.name}</p>
              <p className="text-sm text-gray-500">{combo.products.map((p) => p.name).join(" + ")}</p>
              <p className="text-sm">₹{combo.totalPrice} → <b className="text-[#B5563C]">₹{combo.comboPrice}</b> · {combo.active ? "Active" : "Inactive"}</p>
            </div>
            <button type="button" onClick={() => saveCombos(combos.filter((c) => c.id !== combo.id))}
              className="w-9 h-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
