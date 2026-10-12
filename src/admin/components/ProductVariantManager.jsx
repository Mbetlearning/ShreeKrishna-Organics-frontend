import React, { useCallback, useEffect, useState } from "react";
import { adminProductService } from "../services/adminProductService";
import { adminInventoryService } from "../services/adminInventoryService";

const blank = () => ({ sku: "", sizeValue: "", sizeUnit: "ML", price: "", mrp: "", active: true });
const units = ["ML", "L", "G", "KG", "PCS"];
const fromVariant = (v) => ({
  sku: v.sku ?? "", sizeValue: String(v.sizeValue ?? ""), sizeUnit: v.sizeUnit ?? "ML",
  price: String(v.price ?? ""), mrp: v.mrp == null ? "" : String(v.mrp), active: v.active !== false,
});

function VariantFields({ value, onChange }) {
  const change = (key, val) => onChange((old) => ({ ...old, [key]: val }));
  const inputClass = "mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#075e4d]";
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <label className="text-sm">SKU *
        <input className={inputClass} maxLength={100} required value={value.sku} placeholder="GNO-1L" onChange={(e) => change("sku", e.target.value)} />
      </label>
      <label className="text-sm">Size Value *
        <input className={inputClass} type="number" min="0.01" step="any" required value={value.sizeValue} onChange={(e) => change("sizeValue", e.target.value)} />
      </label>
      <label className="text-sm">Size Unit *
        <select className={inputClass} value={value.sizeUnit} onChange={(e) => change("sizeUnit", e.target.value)}>
          {!units.includes(value.sizeUnit) && <option value={value.sizeUnit}>{value.sizeUnit}</option>}
          {units.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
        </select>
      </label>
      <label className="text-sm">Selling Price (₹) *
        <input className={inputClass} type="number" min="0" step="0.01" required value={value.price} onChange={(e) => change("price", e.target.value)} />
      </label>
      <label className="text-sm">MRP (₹)
        <input className={inputClass} type="number" min="0" step="0.01" value={value.mrp} onChange={(e) => change("mrp", e.target.value)} />
      </label>
      <label className="flex items-center gap-2 text-sm mt-5">
        <input type="checkbox" checked={value.active} onChange={(e) => change("active", e.target.checked)} /> Active Variant
      </label>
    </div>
  );
}

function makePayload(form, productId) {
  const sku = form.sku.trim();
  const sizeValue = Number(form.sizeValue);
  const price = Number(form.price);
  const mrp = form.mrp.trim() === "" ? null : Number(form.mrp);
  if (!sku || sku.length > 100 || !form.sizeUnit.trim() || form.sizeUnit.length > 20 ||
      form.sizeValue === "" || !Number.isFinite(sizeValue) || sizeValue < 0.01 ||
      form.price === "" || !Number.isFinite(price) || price < 0 ||
      (mrp !== null && (!Number.isFinite(mrp) || mrp < 0))) {
    throw new Error("Enter a valid SKU, size, unit, selling price and MRP.");
  }
  return { productId: Number(productId), sku, sizeValue, sizeUnit: form.sizeUnit.trim(), price, mrp, active: form.active };
}

export default function ProductVariantManager({ productId }) {
  const [variants, setVariants] = useState([]);
  const [stock, setStock] = useState({});
  const [newForm, setNewForm] = useState(blank);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(blank);
  const [stockInputs, setStockInputs] = useState({});
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async (isCancelled = () => false) => {
    const data = await adminProductService.getVariants(productId);
    if (!Array.isArray(data)) throw new Error("Invalid variants response.");
    const results = await Promise.all(data.map(async (variant) => {
      try {
        const result = await adminInventoryService.getAvailableStock(variant.id);
        return [variant.id, { exists: true, available: result.availableQuantity }];
      } catch (err) {
        return [variant.id, err.status === 404
          ? { exists: false, available: null }
          : { exists: null, available: null, error: err.message || "Stock unavailable" }];
      }
    }));
    if (!isCancelled()) {
      setVariants(data);
      setStock(Object.fromEntries(results));
    }
  }, [productId]);

  useEffect(() => {
    if (!productId) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    setEditId(null);
    setNewForm(blank());
    load(() => cancelled)
      .catch((err) => { if (!cancelled) setError(err.message || "Failed to load variants."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [productId, load]);

  async function createVariant(e) {
    e.preventDefault();
    if (busy) return;
    let payload;
    try { payload = makePayload(newForm, productId); }
    catch (err) { setError(err.message); return; }
    setBusy(true); setError(""); setMessage("");
    try {
      await adminProductService.createVariant(payload);
      setNewForm(blank());
      await load();
      setMessage("Variant created. Create its initial stock below.");
    } catch (err) { setError(err.message || "Unable to create variant."); }
    finally { setBusy(false); }
  }

  function startEdit(variant) {
    setEditId(variant.id);
    setEditForm(fromVariant(variant));
    setError(""); setMessage("");
  }

  async function updateVariant(e, variantId) {
    e.preventDefault();
    if (busy) return;
    let payload;
    try { payload = makePayload(editForm, productId); }
    catch (err) { setError(err.message); return; }
    setBusy(true); setError(""); setMessage("");
    try {
      await adminProductService.updateVariant(variantId, payload);
      await load();
      setEditId(null);
      setMessage("Variant updated successfully.");
    } catch (err) { setError(err.message || "Unable to update variant."); }
    finally { setBusy(false); }
  }

  async function deleteVariant(variant) {
    if (busy || !window.confirm(`Deactivate variant ${variant.sku}?`)) return;
    setBusy(true); setError(""); setMessage("");
    try {
      await adminProductService.deleteVariant(variant.id);
      await load();
      if (editId === variant.id) setEditId(null);
      setMessage("Variant deactivated successfully.");
    } catch (err) { setError(err.message || "Unable to delete variant."); }
    finally { setBusy(false); }
  }

  async function saveStock(variantId, exists) {
    if (busy) return;
    const raw = String(stockInputs[variantId] ?? "").trim();
    const quantity = Number(raw);
    if (!raw || !Number.isSafeInteger(quantity) || quantity < (exists ? 1 : 0) || quantity > 2147483647) {
      setError(exists ? "Enter a positive whole number to add stock." : "Enter a non-negative whole number for initial stock.");
      return;
    }
    setBusy(true); setError(""); setMessage("");
    try {
      if (exists) await adminInventoryService.addStock(variantId, quantity);
      else await adminInventoryService.createInventory(variantId, quantity);
      setStockInputs((previous) => ({ ...previous, [variantId]: "" }));
      await load();
      setMessage(exists ? "Stock added successfully." : "Initial inventory created successfully.");
    } catch (err) { setError(err.message || "Unable to save stock."); }
    finally { setBusy(false); }
  }

  if (!productId) return null;
  return (
    <section className="mt-7 bg-white border border-[#E8E3D8] rounded-2xl p-6 md:p-8">
      <h2 className="text-lg font-bold text-[#243A34]">Product Variants &amp; Inventory</h2>
      <p className="text-sm text-gray-500 mt-1 mb-5">Manage sizes, prices and variant-wise stock.</p>
      {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {message && <p role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</p>}

      <form onSubmit={createVariant} className="rounded-xl border border-gray-200 p-4 mb-6">
        <h3 className="font-semibold mb-4">Add New Variant</h3>
        <VariantFields value={newForm} onChange={setNewForm} />
        <button type="submit" disabled={busy} className="mt-4 bg-[#075e4d] text-white rounded-lg px-4 py-2 disabled:opacity-50">
          {busy ? "Saving..." : "Add Variant"}
        </button>
      </form>

      <h3 className="font-semibold mb-3">Existing Variants ({variants.length})</h3>
      {loading ? <p className="text-sm text-gray-500">Loading variants...</p> : variants.length === 0 ? (
        <p className="text-sm text-gray-500">No variants yet.</p>
      ) : (
        <div className="space-y-4">
          {variants.map((variant) => {
            const inventory = stock[variant.id];
            const isEditing = editId === variant.id;
            return (
              <div key={variant.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{variant.sizeValue} {variant.sizeUnit} · {variant.sku}</p>
                    <p className="text-sm text-gray-600">Price ₹{variant.price}{variant.mrp != null ? ` · MRP ₹${variant.mrp}` : ""}</p>
                    <p className="text-xs text-gray-500">{variant.active ? "Active" : "Inactive"}</p>
                  </div>
                  <div className="flex gap-3">
                    <button type="button" disabled={busy} onClick={() => isEditing ? setEditId(null) : startEdit(variant)} className="text-sm font-semibold text-[#075e4d] disabled:opacity-50">
                      {isEditing ? "Close Edit" : "Edit"}
                    </button>
                    <button type="button" disabled={busy} onClick={() => deleteVariant(variant)} className="text-sm font-semibold text-red-600 disabled:opacity-50">Delete</button>
                  </div>
                </div>

                {isEditing && (
                  <form onSubmit={(e) => updateVariant(e, variant.id)} className="mt-4 rounded-lg border border-[#D8E5DF] bg-[#F7FAF8] p-4">
                    <h4 className="font-semibold mb-3">Edit {variant.sku}</h4>
                    <VariantFields value={editForm} onChange={setEditForm} />
                    <div className="flex flex-wrap gap-3 mt-4">
                      <button type="submit" disabled={busy} className="bg-[#075e4d] text-white rounded-lg px-4 py-2 disabled:opacity-50">{busy ? "Saving..." : "Save Variant Changes"}</button>
                      <button type="button" disabled={busy} onClick={() => setEditId(null)} className="border rounded-lg px-4 py-2">Cancel</button>
                    </div>
                  </form>
                )}

                <div className="mt-4 pt-3 border-t flex flex-wrap items-center gap-3">
                  <span className="text-sm">Available Stock: <strong>{inventory?.exists === true ? inventory.available : inventory?.exists === false ? "Not created" : inventory?.error || "Loading..."}</strong></span>
                  {inventory && inventory.exists !== null && (
                    <>
                      <input type="number" min={inventory.exists ? "1" : "0"} step="1" value={stockInputs[variant.id] ?? ""} onChange={(e) => setStockInputs((p) => ({ ...p, [variant.id]: e.target.value }))} placeholder={inventory.exists ? "Qty to add" : "Initial qty"} className="border rounded-lg p-2 w-36 text-sm" />
                      <button type="button" disabled={busy} onClick={() => saveStock(variant.id, inventory.exists)} className="rounded-lg bg-[#075e4d] text-white px-3 py-2 text-sm disabled:opacity-50">{inventory.exists ? "Add Stock" : "Create Stock"}</button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
