import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Flame, Plus, Pencil, X, RefreshCw } from "lucide-react";
import { adminProductService } from "../services/adminProductService";
import { adminOfferService } from "../services/adminOfferService";

const emptyForm = {
  productId: "", discountType: "PERCENTAGE", discountValue: "",
  startDate: "", endDate: "", active: true,
};

const asList = (data) => Array.isArray(data) ? data :
  Array.isArray(data?.content) ? data.content :
  Array.isArray(data?.products) ? data.products :
  Array.isArray(data?.items) ? data.items :
  data && typeof data === "object" && data.id != null ? [data] : [];

const toLocalInput = (value) => value ? String(value).slice(0, 16) : "";
const toApiDate = (value) => value.length === 16 ? `${value}:00` : value;
const labelFor = (product) => product?.name || product?.productName || product?.title || `Product #${product?.id}`;

export default function AdminHotDeals() {
  const [products, setProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [offersResult, productsResult] = await Promise.all([
        adminOfferService.getAll(), adminProductService.getAll(),
      ]);
      setDeals(asList(offersResult));
      setProducts(asList(productsResult));
    } catch (err) {
      setError(err.message || "Failed to load Hot Deals.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const productMap = useMemo(() => new Map(products.map((p) => [Number(p.id), p])), [products]);
  const selectedProduct = productMap.get(Number(form.productId));

  const resetForm = () => { setEditingId(null); setForm(emptyForm); };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    const value = Number(form.discountValue);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Discount must be greater than zero."); return;
    }
    if (form.discountType === "PERCENTAGE" && value > 100) {
      setError("Percentage discount cannot exceed 100."); return;
    }
    if (!form.startDate || !form.endDate || form.startDate >= form.endDate) {
      setError("End date must be after start date."); return;
    }
    if (!editingId && !form.productId) {
      setError("Select a product."); return;
    }

    const payload = {
      discountType: form.discountType,
      discountValue: value,
      startDate: toApiDate(form.startDate),
      endDate: toApiDate(form.endDate),
    };
    setBusy(true);
    try {
      if (editingId != null) {
        await adminOfferService.update(editingId, payload);
        setSuccess("Offer updated successfully.");
      } else {
        await adminOfferService.create({
          ...payload, productId: Number(form.productId), active: form.active,
        });
        setSuccess("Offer created successfully.");
      }
      resetForm();
      await loadData();
    } catch (err) {
      setError(err.message || "Could not save offer.");
    } finally {
      setBusy(false);
    }
  };

  const startEditing = (deal) => {
    setEditingId(deal.id);
    setError(""); setSuccess("");
    setForm({
      productId: String(deal.productId),
      discountType: deal.discountType,
      discountValue: String(deal.discountValue),
      startDate: toLocalInput(deal.startDate),
      endDate: toLocalInput(deal.endDate),
      active: Boolean(deal.active),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleActive = async (deal) => {
    setError(""); setSuccess(""); setBusy(true);
    try {
      if (deal.active) await adminOfferService.deactivate(deal.id);
      else await adminOfferService.activate(deal.id);
      setSuccess(`Offer ${deal.active ? "deactivated" : "activated"} successfully.`);
      await loadData();
    } catch (err) {
      setError(err.message || "Could not change offer status.");
    } finally { setBusy(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#243A34] flex items-center gap-2"><Flame size={23} /> Hot Deals</h1>
          <p className="text-sm text-gray-500 mt-1">Manage product discounts from the backend.</p>
        </div>
        <button type="button" disabled={loading || busy} onClick={loadData} className="border rounded-xl px-4 py-2 inline-flex items-center gap-2 disabled:opacity-50"><RefreshCw size={16} /> Refresh</button>
      </div>

      {error && <div role="alert" className="rounded-xl bg-red-50 border border-red-200 text-red-700 p-4">{error}</div>}
      {success && <div role="status" className="rounded-xl bg-green-50 border border-green-200 text-green-800 p-4">{success}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E8E3D8] p-5 md:p-7">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-[#243A34]">{editingId != null ? `Edit Offer #${editingId}` : "Create Hot Deal"}</h2>
          {editingId != null && <button type="button" onClick={resetForm} className="text-sm flex items-center gap-1"><X size={16} /> Cancel Edit</button>}
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <label className="text-sm font-medium">Select Product
            <select required disabled={editingId != null || busy} value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} className="mt-2 w-full border rounded-xl px-4 py-3 bg-white disabled:bg-gray-100">
              <option value="">Choose product</option>
              {products.map((p) => <option key={p.id} value={p.id}>{labelFor(p)}</option>)}
              {editingId != null && !selectedProduct && <option value={form.productId}>Product #{form.productId}</option>}
            </select>
          </label>
          <label className="text-sm font-medium">Discount Type
            <select value={form.discountType} disabled={busy} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="mt-2 w-full border rounded-xl px-4 py-3 bg-white">
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED">Fixed Amount (₹)</option>
            </select>
          </label>
          <label className="text-sm font-medium">Discount Value
            <input required type="number" min="0.01" max={form.discountType === "PERCENTAGE" ? "100" : undefined} step="0.01" disabled={busy} value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className="mt-2 w-full border rounded-xl px-4 py-3" placeholder={form.discountType === "PERCENTAGE" ? "e.g. 15" : "e.g. 100"} />
          </label>
          <div className="hidden md:block" />
          <label className="text-sm font-medium">Start Date & Time
            <input required type="datetime-local" disabled={busy} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="mt-2 w-full border rounded-xl px-4 py-3" />
          </label>
          <label className="text-sm font-medium">End Date & Time
            <input required type="datetime-local" disabled={busy} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="mt-2 w-full border rounded-xl px-4 py-3" />
          </label>
        </div>
        {selectedProduct && <p className="text-sm text-gray-600 mt-4">Selected: <strong>{labelFor(selectedProduct)}</strong> — discount applies to eligible active variants.</p>}
        {editingId == null && <label className="mt-5 flex items-center gap-2 text-sm"><input type="checkbox" disabled={busy} checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active Deal</label>}
        <button disabled={busy || loading} type="submit" className="mt-6 inline-flex items-center gap-2 bg-[#075e4d] text-white px-5 py-3 rounded-xl font-semibold disabled:opacity-50">
          {editingId != null ? <Pencil size={17} /> : <Plus size={17} />}{busy ? "Saving..." : editingId != null ? "Update Offer" : "Save Hot Deal"}
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-[#E8E3D8] overflow-hidden">
        <div className="p-5 border-b font-bold text-[#243A34]">Saved Hot Deals ({deals.length})</div>
        {loading ? <div className="p-8 text-center text-gray-500">Loading offers...</div> : deals.length === 0 ?
          <div className="p-8 text-center text-gray-500">No hot deals found.</div> :
          deals.map((deal) => {
            const product = productMap.get(Number(deal.productId));
            return <div key={deal.id} className="p-4 border-t flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <p className="font-semibold">{product ? labelFor(product) : `Product #${deal.productId}`} <span className="text-xs text-gray-400">(Offer #{deal.id})</span></p>
                <p className="text-sm text-[#B5563C] font-medium">{deal.discountType === "PERCENTAGE" ? `${deal.discountValue}% OFF` : `₹${deal.discountValue} OFF`}</p>
                <p className="text-xs text-gray-500">{deal.startDate} — {deal.endDate}</p>
                <p className="text-xs mt-1">{deal.active ? "Enabled" : "Disabled"}</p>
              </div>
              <button type="button" disabled={busy} onClick={() => startEditing(deal)} className="border rounded-lg px-3 py-2 inline-flex items-center gap-1 disabled:opacity-50"><Pencil size={15} /> Edit</button>
              <button type="button" disabled={busy} onClick={() => toggleActive(deal)} className={`rounded-lg px-3 py-2 font-medium disabled:opacity-50 ${deal.active ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{deal.active ? "Deactivate" : "Activate"}</button>
            </div>;
          })}
      </div>
    </div>
  );
}
