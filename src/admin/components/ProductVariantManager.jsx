import React, { useCallback, useEffect, useState } from "react";
import { adminProductService } from "../services/adminProductService";
import { adminInventoryService } from "../services/adminInventoryService";
import { apiRequest } from "../../services/api";

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

// Quantity-based delivery pricing for each saved variant.
const emptyDeliveryRule = () => ({ minQuantity: "", maxQuantity: "", deliveryCharge: "" });

function DeliveryRuleEditor({ variantId, sku }) {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    apiRequest(`/admin/variants/${variantId}/delivery-rules`)
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("Invalid delivery rules response.");
        if (!cancelled) setRules(data.map((r) => ({
          minQuantity: String(r.minQuantity ?? ""),
          maxQuantity: r.maxQuantity == null ? "" : String(r.maxQuantity),
          deliveryCharge: String(r.deliveryCharge ?? ""),
        })));
      })
      .catch((err) => { if (!cancelled) setError(err.message || "Unable to load delivery rules."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [variantId]);

  const updateRule = (index, field, value) => {
    setRules((old) => old.map((r, i) => i === index ? { ...r, [field]: value } : r));
    setSuccess("");
  };

  async function saveRules() {
    if (saving) return;
    setError(""); setSuccess("");
    try {
      if (rules.length === 0) throw new Error("Add at least one delivery rule.");
      const payload = rules.map((r, i) => {
        const min = Number(r.minQuantity);
        const max = r.maxQuantity.trim() === "" ? null : Number(r.maxQuantity);
        const charge = Number(r.deliveryCharge);
        if (r.minQuantity.trim() === "" || !Number.isSafeInteger(min) || min < 1 || min > 2147483647 ||
            (max !== null && (!Number.isSafeInteger(max) || max < min || max > 2147483647)) ||
            r.deliveryCharge.trim() === "" || !Number.isFinite(charge) || charge < 0 || !/^\d+(\.\d{1,2})?$/.test(r.deliveryCharge.trim())) {
          throw new Error(`Invalid quantity range or delivery charge in row ${i + 1}.`);
        }
        return { minQuantity: min, maxQuantity: max, deliveryCharge: charge };
      });
      const sorted = [...payload].sort((a, b) => a.minQuantity - b.minQuantity);
      if (sorted[0].minQuantity !== 1) throw new Error("First quantity range must start at 1.");
      for (let i = 0; i < sorted.length; i++) {
        if (i < sorted.length - 1) {
          if (sorted[i].maxQuantity === null) throw new Error("Only the last range can have no maximum quantity.");
          if (sorted[i].maxQuantity + 1 !== sorted[i + 1].minQuantity) throw new Error("Quantity ranges must be continuous without gaps or overlaps.");
        } else if (sorted[i].maxQuantity !== null) {
          throw new Error("Last range must have no maximum quantity (unlimited).");
        }
      }
      setSaving(true);
      // Existing apiRequest supplies the customer/admin JWT and JSON handling.
      await apiRequest(`/admin/variants/${variantId}/delivery-rules`, { method: "PUT", body: JSON.stringify(sorted) });
      setRules(sorted.map((r) => ({ minQuantity: String(r.minQuantity), maxQuantity: r.maxQuantity == null ? "" : String(r.maxQuantity), deliveryCharge: String(r.deliveryCharge) })));
      setSuccess("Delivery charges saved successfully.");
    } catch (err) {
      setError(err.message || "Unable to save delivery charges.");
    } finally { setSaving(false); }
  }

  return (
    <div className="mt-4 rounded-xl border border-[#D8E5DF] bg-[#F7FAF8] p-4">
      <h4 className="font-semibold text-[#243A34]">Delivery Charges · {sku}</h4>
      <p className="mt-1 text-xs text-gray-500">Configure delivery charge per quantity range. Leave the final Max Qty empty for unlimited quantities.</p>
      {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {success && <p role="status" className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</p>}
      {loading ? <p className="mt-3 text-sm text-gray-500">Loading delivery charges...</p> : (
        <>
          <div className="mt-3 space-y-3">
            {rules.map((rule, index) => (
              <div key={index} className="grid grid-cols-2 md:grid-cols-[1fr_1fr_1fr_auto] items-end gap-3">
                <label className="text-xs text-gray-700">Min Qty
                  <input type="number" min="1" step="1" value={rule.minQuantity} onChange={(e) => updateRule(index, "minQuantity", e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" />
                </label>
                <label className="text-xs text-gray-700">Max Qty
                  <input type="number" min="1" step="1" placeholder="Unlimited" value={rule.maxQuantity} onChange={(e) => updateRule(index, "maxQuantity", e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" />
                </label>
                <label className="text-xs text-gray-700">Delivery Charge (₹)
                  <input type="number" min="0" step="0.01" value={rule.deliveryCharge} onChange={(e) => updateRule(index, "deliveryCharge", e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" />
                </label>
                <button type="button" disabled={saving} onClick={() => { setRules((old) => old.filter((_, i) => i !== index)); setSuccess(""); }} className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 disabled:opacity-50">Remove</button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" disabled={saving} onClick={() => { setRules((old) => [...old, emptyDeliveryRule()]); setSuccess(""); }} className="rounded-lg border border-[#075e4d] px-4 py-2 text-sm font-medium text-[#075e4d] disabled:opacity-50">+ Add Range</button>
            <button type="button" disabled={saving || rules.length === 0} onClick={saveRules} className="rounded-lg bg-[#075e4d] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : "Save Delivery Charges"}</button>
          </div>
        </>
      )}
    </div>
  );
}

export default function ProductVariantManager({ productId }) {
  const [variants, setVariants] = useState([]);
  const [stock, setStock] = useState({});
  const [newForm, setNewForm] = useState(blank);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(blank);
  const [stockInputs, setStockInputs] = useState({});
  const [deliveryEditorId, setDeliveryEditorId] = useState(null);
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
      if (deliveryEditorId === variant.id) setDeliveryEditorId(null);
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
      <p className="text-sm text-gray-500 mt-1 mb-5">Manage sizes, prices, variant-wise stock and quantity-based delivery charges.</p>
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
                    <button type="button" disabled={busy} onClick={() => setDeliveryEditorId((id) => id === variant.id ? null : variant.id)} className="text-sm font-semibold text-[#075e4d] disabled:opacity-50">{deliveryEditorId === variant.id ? "Close Delivery" : "Delivery Charges"}</button>
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

                {deliveryEditorId === variant.id && <DeliveryRuleEditor key={variant.id} variantId={variant.id} sku={variant.sku} />}

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
