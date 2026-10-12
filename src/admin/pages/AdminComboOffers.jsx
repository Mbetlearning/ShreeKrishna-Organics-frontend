import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, PackagePlus, Pencil, X, RefreshCw } from "lucide-react";
import { adminProductService } from "../services/adminProductService";
import { adminComboService } from "../services/adminComboService";

const initialForm = () => ({
  name: "",
  description: "",
  comboPrice: "",
  active: true,
  items: [],
});

const asList = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.content)) return value.content;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.variants)) return value.variants;
  if (Array.isArray(value?.data?.items)) return value.data.items;
  if (Array.isArray(value?.data?.content)) return value.data.content;
  if (Array.isArray(value?.data?.variants)) return value.data.variants;
  return [];
};

const productName = (product) =>
  product?.name || product?.productName || product?.title || `Product #${product?.id}`;

const variantLabel = (variant) =>
  `${variant.sizeValue ?? ""} ${variant.sizeUnit ?? ""}`.trim() ||
  variant.sku ||
  `Variant #${variant.id}`;

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export default function AdminComboOffers() {
  const [products, setProducts] = useState([]);
  const [variantsByProduct, setVariantsByProduct] = useState({});
  const [combos, setCombos] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loadingVariants, setLoadingVariants] = useState({});

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [productResult, comboResult] = await Promise.all([
        adminProductService.getAll(),
        adminComboService.getAll(),
      ]);
      setProducts(asList(productResult));
      setCombos(asList(comboResult));
    } catch (err) {
      setError(err.message || "Unable to load combo offers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const loadVariants = useCallback(async (productId) => {
    const id = Number(productId);
    if (!id || (variantsByProduct[id]?.length > 0)) return;
    setLoadingVariants((prev) => ({ ...prev, [id]: true }));
    try {
      const result = await adminProductService.getVariants(id);
      const parsed = asList(result);
      console.log("Combo Product ID:", id);
      console.log("Variant API Result:", result);
      console.log("Parsed Variants:", parsed);
      setVariantsByProduct((prev) => ({ ...prev, [id]: parsed }));
    } catch (err) {
      console.error("Combo variant loading failed:", id, err);
      setError(err.message || `Could not load variants for product #${id}.`);
    } finally {
      setLoadingVariants((prev) => ({ ...prev, [id]: false }));
    }
  }, [variantsByProduct]);

  const productMap = useMemo(
    () => new Map(products.map((product) => [Number(product.id), product])),
    [products]
  );

  const variantMap = useMemo(() => {
    const map = new Map();
    Object.values(variantsByProduct).flat().forEach((variant) => {
      map.set(Number(variant.id), variant);
    });
    return map;
  }, [variantsByProduct]);

  const regularTotal = form.items.reduce((sum, item) => {
    const variant = variantMap.get(Number(item.productVariantId));
    return sum + Number(variant?.price || 0) * Number(item.quantity || 0);
  }, 0);

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { productId: "", productVariantId: "", quantity: 1 }],
    }));
  };

  const updateItem = (index, patch) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => i === index ? { ...item, ...patch } : item),
    }));
  };

  const removeItem = (index) => {
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(initialForm());
  };

  const beginEdit = async (combo) => {
    setError("");
    setNotice("");
    setBusy(true);
    try {
      // Variant API returns productId; load known product variants to map existing combo items.
      const productIds = products.map((product) => Number(product.id)).filter(Boolean);
      const results = await Promise.all(productIds.map(async (id) => {
        if (Object.prototype.hasOwnProperty.call(variantsByProduct, id)) {
          return [id, variantsByProduct[id]];
        }
        return [id, asList(await adminProductService.getVariants(id))];
      }));
      const nextVariants = Object.fromEntries(results);
      setVariantsByProduct((prev) => ({ ...prev, ...nextVariants }));
      const variantToProduct = new Map();
      results.forEach(([productId, variants]) => variants.forEach((variant) => {
        variantToProduct.set(Number(variant.id), Number(variant.productId ?? productId));
      }));
      const items = (combo.items || []).map((item) => ({
        productId: String(variantToProduct.get(Number(item.productVariantId)) || ""),
        productVariantId: String(item.productVariantId),
        quantity: item.quantity,
      }));
      if (items.some((item) => !item.productId)) {
        throw new Error("Some combo variants are missing from the current product list. Please check products before editing.");
      }
      setEditingId(combo.id);
      setForm({
        name: combo.name || "",
        description: combo.description || "",
        comboPrice: String(combo.comboPrice ?? ""),
        active: Boolean(combo.active),
        items,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.message || "Unable to edit this combo.");
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    const items = form.items.map((item) => ({
      productVariantId: Number(item.productVariantId),
      quantity: Number(item.quantity),
    }));
    if (items.length < 2) {
      setError("Select at least two variants for a combo.");
      return;
    }
    if (items.some((item) => !item.productVariantId || !Number.isInteger(item.quantity) || item.quantity < 1)) {
      setError("Select a valid variant and quantity for each item.");
      return;
    }
    if (new Set(items.map((item) => item.productVariantId)).size !== items.length) {
      setError("The same variant cannot be selected twice. Increase its quantity instead.");
      return;
    }
    if (!form.name.trim() || !(Number(form.comboPrice) > 0)) {
      setError("Enter a combo name and a valid combo price.");
      return;
    }

    setBusy(true);
    try {
      if (editingId == null) {
        await adminComboService.create({
          name: form.name.trim(),
          description: form.description,
          comboPrice: Number(form.comboPrice),
          active: form.active,
          items,
        });
      } else {
        // Existing backend exposes separate update endpoints; changes are not atomic.
        const existing = combos.find((combo) => Number(combo.id) === Number(editingId));
        if (!existing) throw new Error("Combo not found. Refresh and try again.");
        if (existing.name !== form.name.trim() || (existing.description || "") !== form.description) {
          await adminComboService.updateDetails(editingId, form.name.trim(), form.description);
        }
        if (Number(existing.comboPrice) !== Number(form.comboPrice)) {
          await adminComboService.updatePrice(editingId, Number(form.comboPrice));
        }
        const oldItems = (existing.items || []).map((item) => `${item.productVariantId}:${item.quantity}`).sort();
        const newItems = items.map((item) => `${item.productVariantId}:${item.quantity}`).sort();
        if (JSON.stringify(oldItems) !== JSON.stringify(newItems)) {
          await adminComboService.updateItems(editingId, items);
        }
        if (Boolean(existing.active) !== Boolean(form.active)) {
          if (form.active) await adminComboService.activate(editingId);
          else await adminComboService.deactivate(editingId);
        }
      }
      resetForm();
      await loadData();
      setNotice(editingId == null ? "Combo created successfully." : "Combo updated successfully.");
    } catch (err) {
      setError(err.message || "Could not save combo. Please refresh before retrying.");
    } finally {
      setBusy(false);
    }
  };

  const toggleActive = async (combo) => {
    setError("");
    setNotice("");
    setBusy(true);
    try {
      if (combo.active) await adminComboService.deactivate(combo.id);
      else await adminComboService.activate(combo.id);
      await loadData();
      setNotice(combo.active ? "Combo deactivated." : "Combo activated.");
    } catch (err) {
      setError(err.message || "Unable to update combo status.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-7 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#243A34] flex items-center gap-2">
            <PackagePlus size={23} /> Combo Offers
          </h1>
          <p className="text-sm text-gray-500 mt-1">Combine product variants into a special offer.</p>
        </div>
        <button type="button" onClick={loadData} disabled={busy || loading}
          className="flex items-center gap-2 border rounded-xl px-3 py-2 text-sm disabled:opacity-50">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {error && <div role="alert" className="mb-4 p-4 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>}
      {notice && <div role="status" className="mb-4 p-4 rounded-xl bg-green-50 text-green-800 text-sm">{notice}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E8E3D8] p-5 md:p-7 mb-7">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[#243A34]">{editingId == null ? "Create Combo Offer" : `Edit Combo #${editingId}`}</h2>
          {editingId != null && <button type="button" onClick={resetForm} disabled={busy} className="text-sm flex gap-1 items-center text-gray-600"><X size={15} /> Cancel Edit</button>}
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <label className="text-sm font-medium">Combo Name
            <input required disabled={busy} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-2 w-full border rounded-xl px-4 py-3" placeholder="e.g. Healthy Oil Combo" />
          </label>
          <label className="text-sm font-medium">Combo Offer Price (₹)
            <input required disabled={busy} type="number" min="0.01" step="0.01" value={form.comboPrice}
              onChange={(e) => setForm({ ...form, comboPrice: e.target.value })}
              className="mt-2 w-full border rounded-xl px-4 py-3" placeholder="e.g. 1249" />
          </label>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center gap-3 mb-3">
            <p className="text-sm font-semibold">Select Products, Variants & Quantities (minimum 2)</p>
            <button type="button" disabled={busy || loading} onClick={addItem}
              className="flex items-center gap-1 text-sm text-[#075e4d] font-semibold disabled:opacity-50">
              <Plus size={16} /> Add Product
            </button>
          </div>
          {form.items.length === 0 && <p className="text-sm text-gray-500 border rounded-xl p-4">Click “Add Product” to build a combo.</p>}
          <div className="space-y-3">
            {form.items.map((item, index) => {
              const variants = variantsByProduct[Number(item.productId)] || [];
              return (
                <div key={index} className="grid md:grid-cols-[2fr_2fr_1fr_auto] gap-3 items-end border rounded-xl p-3 bg-[#FAFAF8]">
                  <label className="text-xs font-medium">Product
                    <select required disabled={busy || loading} value={item.productId}
                      onChange={(e) => {
                        const id = e.target.value;
                        updateItem(index, { productId: id, productVariantId: "" });
                        if (id) loadVariants(id);
                      }} className="mt-2 w-full border rounded-lg px-3 py-2 bg-white">
                      <option value="">Choose product</option>
                      {products.map((product) => <option key={product.id} value={product.id}>{productName(product)}</option>)}
                    </select>
                  </label>
                  <label className="text-xs font-medium">Variant / Size
                    <select required disabled={busy || !item.productId || loadingVariants[Number(item.productId)]}
                      value={item.productVariantId} onChange={(e) => updateItem(index, { productVariantId: e.target.value })}
                      className="mt-2 w-full border rounded-lg px-3 py-2 bg-white">
                      <option value="">{loadingVariants[Number(item.productId)] ? "Loading..." : "Choose size"}</option>
                      {variants.map((variant) => <option key={variant.id} value={variant.id}>
                        {variantLabel(variant)} — {money(variant.price)}
                      </option>)}
                    </select>
                    {item.productId && !loadingVariants[Number(item.productId)] && variants.length === 0 && (
                      <span className="block mt-1 text-amber-700">No variants loaded. Re-select the product to retry.</span>
                    )}
                  </label>
                  <label className="text-xs font-medium">Quantity
                    <input required disabled={busy} type="number" min="1" step="1" value={item.quantity}
                      onChange={(e) => updateItem(index, { quantity: e.target.value })}
                      className="mt-2 w-full border rounded-lg px-3 py-2" />
                  </label>
                  <button type="button" disabled={busy} onClick={() => removeItem(index)}
                    className="border rounded-lg px-3 py-2 text-red-600 disabled:opacity-50" aria-label="Remove item"><X size={18} /></button>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-gray-600">Selected variants: {form.items.length} · Regular total: {money(regularTotal)}</p>
        </div>

        <label className="block mt-5 text-sm font-medium">Description
          <textarea disabled={busy} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-2 w-full border rounded-xl px-4 py-3 min-h-28" />
        </label>
        <label className="mt-4 flex items-center gap-2 text-sm">
          <input type="checkbox" disabled={busy} checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active Combo
        </label>
        <button type="submit" disabled={busy || loading || form.items.length < 2}
          className="mt-6 inline-flex items-center gap-2 bg-[#075e4d] disabled:opacity-40 text-white px-5 py-3 rounded-xl font-semibold">
          {editingId == null ? <Plus size={17} /> : <Pencil size={17} />}
          {busy ? "Saving..." : editingId == null ? "Save Combo Offer" : "Update Combo Offer"}
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-[#E8E3D8] overflow-hidden">
        <div className="p-5 border-b font-bold text-[#243A34]">Saved Combo Offers ({combos.length})</div>
        {loading ? <div className="p-8 text-center text-gray-500">Loading combo offers...</div> :
          combos.length === 0 ? <div className="p-8 text-center text-gray-500">No combo offers added yet.</div> :
          combos.map((combo) => {
            const firstImage = combo.items?.find((item) => item.imageUrl)?.imageUrl;
            const total = (combo.items || []).reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
            return (
              <div key={combo.id} className="p-4 border-t flex flex-wrap items-center gap-4">
                {firstImage ? <img src={firstImage} alt={combo.name} className="w-14 h-14 rounded-lg object-cover" /> :
                  <div className="w-14 h-14 rounded-lg bg-[#EEF5F1] flex items-center justify-center"><PackagePlus size={24} /></div>}
                <div className="flex-1 min-w-[180px]">
                  <p className="font-semibold">{combo.name}</p>
                  <p className="text-sm text-gray-500">{(combo.items || []).map((item) => `${item.productName} (${item.sizeValue} ${item.sizeUnit}) × ${item.quantity}`).join(" + ")}</p>
                  <p className="text-sm">{money(total)} → <b className="text-[#B5563C]">{money(combo.comboPrice)}</b> · {combo.active ? "Active" : "Inactive"}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" disabled={busy} onClick={() => beginEdit(combo)}
                    className="border rounded-lg px-3 py-2 text-sm flex items-center gap-1 disabled:opacity-50"><Pencil size={15} /> Edit</button>
                  <button type="button" disabled={busy} onClick={() => toggleActive(combo)}
                    className="border rounded-lg px-3 py-2 text-sm disabled:opacity-50">
                    {combo.active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
