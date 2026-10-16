import React, { useCallback, useEffect, useState } from "react";

import { Star, MessageSquare, Check, Trash2, Pencil, X, ShoppingBag } from "lucide-react";

import { productService } from "../../services/productService";

import {

  getAdminReviews,

  addReview,

  updateReview,

  deleteReview,

  approveReview,

  rejectReview,

} from "../../services/reviewApi";



const emptyForm = { customerName: "", rating: 5, comment: "" };

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1").replace(/\/+$/, "");

const AUTH_TOKEN_KEY = "prakriti_auth_token";



async function purchaseApi(path, options = {}) {

  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  const response = await fetch(`${API_BASE}${path}`, {

    ...options,

    headers: {

      "Content-Type": "application/json",

      ...(token ? { Authorization: `Bearer ${token}` } : {}),

      ...options.headers,

    },

  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {

    throw new Error(body?.message || `Purchase settings request failed (${response.status})`);

  }

  return body;

}



export default function AdminReviews() {

  const [products, setProducts] = useState([]);

  const [productId, setProductId] = useState("");
  const [purchaseProductId, setPurchaseProductId] = useState("");

  const [reviews, setReviews] = useState([]);

  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");



  const [purchaseCount, setPurchaseCount] = useState("0");

  const [showPurchaseCount, setShowPurchaseCount] = useState(false);

  const [purchaseLoading, setPurchaseLoading] = useState(false);

  const [purchaseSaving, setPurchaseSaving] = useState(false);

  const [purchaseError, setPurchaseError] = useState("");

  const [purchaseMessage, setPurchaseMessage] = useState("");



  useEffect(() => {

    let active = true;

    productService.getAllProducts()

      .then(data => {

        if (!active) return;

        const list = Array.isArray(data) ? data : [];

        setProducts(list);

        if (list.length) {
          setProductId(String(list[0].id));
          setPurchaseProductId(String(list[0].id));
        }

      })

      .catch(err => {

        if (active) setError(err.message || "Unable to load products.");

      });

    return () => { active = false; };

  }, []);



  useEffect(() => {

    let active = true;

    setPurchaseCount("0");

    setShowPurchaseCount(false);

    setPurchaseError("");

    setPurchaseMessage("");

    if (!purchaseProductId) {

      setPurchaseLoading(false);

      return () => { active = false; };

    }

    setPurchaseLoading(true);

    purchaseApi(`/products/${encodeURIComponent(purchaseProductId)}`)

      .then(data => {

        if (!active) return;

        setPurchaseCount(String(data?.purchaseCount ?? 0));

        setShowPurchaseCount(data?.showPurchaseCount === true);

      })

      .catch(err => {

        if (active) setPurchaseError(err.message || "Unable to load purchase settings.");

      })

      .finally(() => {

        if (active) setPurchaseLoading(false);

      });

    return () => { active = false; };

  }, [purchaseProductId]);



  const loadReviews = useCallback(async () => {

    if (!productId) {

      setReviews([]);

      return;

    }

    setLoading(true);

    setError("");

    try {

      const data = await getAdminReviews(productId);

      setReviews(Array.isArray(data) ? data : []);

    } catch (err) {

      setReviews([]);

      setError(err.message);

    } finally {

      setLoading(false);

    }

  }, [productId]);



  useEffect(() => {

    loadReviews();

  }, [loadReviews]);



  async function savePurchaseSettings(e) {

    e.preventDefault();

    if (!purchaseProductId || purchaseLoading || purchaseSaving) return;

    const count = Number(purchaseCount);

    if (!Number.isSafeInteger(count) || count < 0 || purchaseCount.trim() === "") {

      setPurchaseError("Enter a valid whole number (0 or greater).");

      setPurchaseMessage("");

      return;

    }

    const selectedId = purchaseProductId;

    setPurchaseSaving(true);

    setPurchaseError("");

    setPurchaseMessage("");

    try {

      const updated = await purchaseApi(`/admin/products/${encodeURIComponent(selectedId)}/purchase-display`, {

        method: "PUT",

        body: JSON.stringify({ purchaseCount: count, showPurchaseCount }),

      });

      if (selectedId === purchaseProductId) {

        setPurchaseCount(String(updated?.purchaseCount ?? count));

        setShowPurchaseCount(updated?.showPurchaseCount ?? showPurchaseCount);

        setPurchaseMessage("Purchase count settings saved successfully.");

      }

    } catch (err) {

      if (selectedId === purchaseProductId) setPurchaseError(err.message || "Unable to save purchase settings.");

    } finally {

      setPurchaseSaving(false);

    }

  }



  function resetForm() {

    setForm({ ...emptyForm });

    setEditingId(null);

  }



  async function handleSubmit(e) {

    e.preventDefault();

    if (!productId || saving) return;



    setSaving(true);

    setError("");

    setMessage("");



    const data = {

      productId: Number(productId),

      customerName: form.customerName.trim(),

      rating: Number(form.rating),

      comment: form.comment.trim(),

    };



    try {

      if (editingId !== null) {

        await updateReview(editingId, data);

        setMessage("Review updated. Approval is required again.");

      } else {

        await addReview(data);

        setMessage("Review added. Approve it to show on the website.");

      }

      resetForm();

      await loadReviews();

    } catch (err) {

      setError(err.message);

    } finally {

      setSaving(false);

    }

  }



  async function handleAction(action, review) {

    if (saving) return;

    if (action === "delete" &&

        !window.confirm("Delete this review permanently?")) return;



    setSaving(true);

    setError("");

    setMessage("");



    try {

      if (action === "approve") await approveReview(review.id);

      if (action === "reject") await rejectReview(review.id);

      if (action === "delete") await deleteReview(review.id);

      setMessage(`Review ${action}d successfully.`);

      await loadReviews();

    } catch (err) {

      setError(err.message);

    } finally {

      setSaving(false);

    }

  }



  const pending = reviews.filter(r => r.status === "PENDING").length;

  const approved = reviews.filter(r => r.status === "APPROVED");

  const average = approved.length

    ? (approved.reduce((sum, r) => sum + Number(r.rating), 0) /

       approved.length).toFixed(1)

    : "0.0";



  return (

    <div className="space-y-6">

      <div>

        <h1 className="text-2xl font-bold text-[#243A34]">

          Customer Reviews

        </h1>

        <p className="text-sm text-gray-500 mt-1">

          Manage product ratings and reviews.

        </p>

      </div>



      {error && (

        <p role="alert" className="p-3 bg-red-50 text-red-700 rounded-xl">

          {error}

        </p>

      )}

      {message && (

        <p role="status" className="p-3 bg-green-50 text-green-700 rounded-xl">

          {message}

        </p>

      )}







      <div className="bg-white p-5 rounded-2xl border border-[#E8E3D8]">

        <label className="block text-sm font-semibold mb-2">

          Select Product for Purchase Count

        </label>

        <select

          className="w-full border rounded-lg p-3"

          value={purchaseProductId}

          onChange={e => {

            setPurchaseProductId(e.target.value);

          }}

        >

          {!products.length && <option value="">No products available</option>}

          {products.map(p => (

            <option key={p.id} value={p.id}>{p.name}</option>

          ))}

        </select>

      </div>



      <form onSubmit={savePurchaseSettings} className="bg-white p-5 rounded-2xl border border-[#E8E3D8] space-y-4">

        <div className="flex items-center gap-2">

          <ShoppingBag size={20} className="text-[#075e4d]" />

          <h2 className="font-bold text-lg">Purchase Count Settings</h2>

        </div>

        <p className="text-sm text-gray-500">Manual display only. Not linked to inventory, stock, orders or payments.</p>

        {purchaseError && <p role="alert" className="p-3 bg-red-50 text-red-700 rounded-lg">{purchaseError}</p>}

        {purchaseMessage && <p role="status" className="p-3 bg-green-50 text-green-700 rounded-lg">{purchaseMessage}</p>}

        <div>

          <label htmlFor="purchase-count" className="block text-sm font-semibold mb-2">Purchase Count</label>

          <input id="purchase-count" type="number" min="0" step="1" required

            disabled={!purchaseProductId || purchaseLoading || purchaseSaving}

            value={purchaseCount} onChange={e => setPurchaseCount(e.target.value)}

            className="w-full border rounded-lg p-3" />

        </div>

        <label className="flex items-center gap-3 text-sm font-medium">

          <input type="checkbox" checked={showPurchaseCount}

            disabled={!purchaseProductId || purchaseLoading || purchaseSaving}

            onChange={e => setShowPurchaseCount(e.target.checked)}

            className="w-4 h-4 accent-[#075e4d]" />

          Show on Customer Website

        </label>

        <div className="rounded-lg bg-[#F4F7F5] p-3 text-sm">

          <span className="text-gray-500">Website Preview: </span>

          {showPurchaseCount && Number(purchaseCount) > 0

            ? `${purchaseCount}+ bought in the last month`

            : "Hidden"}

        </div>

        <button type="submit" disabled={!purchaseProductId || purchaseLoading || purchaseSaving}

          className="bg-[#075e4d] text-white px-5 py-2 rounded-lg disabled:opacity-50">

          {purchaseSaving ? "Saving..." : purchaseLoading ? "Loading..." : "Save Purchase Count"}

        </button>

      </form>



      <div className="bg-white p-5 rounded-2xl border border-[#E8E3D8]">

        <label className="block text-sm font-semibold mb-2">

          Select Product for Reviews

        </label>

        <select

          className="w-full border rounded-lg p-3"

          value={productId}

          onChange={e => {

            setProductId(e.target.value);

            resetForm();

          }}

        >

          {!products.length && <option value="">No products available</option>}

          {products.map(p => (

            <option key={p.id} value={p.id}>{p.name}</option>

          ))}

        </select>

      </div>



      <div className="grid sm:grid-cols-3 gap-5">

        <Stat title="Total Reviews" value={reviews.length} icon={MessageSquare} />

        <Stat title="Average Approved Rating" value={average} icon={Star} />

        <Stat title="Pending" value={pending} icon={Check} />

      </div>

      <form

        onSubmit={handleSubmit}

        className="bg-white p-5 rounded-2xl border border-[#E8E3D8] space-y-4"

      >

        <h2 className="font-bold text-lg">

          {editingId !== null ? "Edit Review" : "Add Review"}

        </h2>



        <input

          required

          maxLength={150}

          placeholder="Customer Name"

          className="w-full border rounded-lg p-3"

          value={form.customerName}

          onChange={e => setForm({ ...form, customerName: e.target.value })}

        />



        <select

          className="w-full border rounded-lg p-3"

          value={form.rating}

          onChange={e => setForm({ ...form, rating: Number(e.target.value) })}

        >

          {[5, 4, 3, 2, 1].map(n => (

            <option key={n} value={n}>{n} Star{n > 1 ? "s" : ""}</option>

          ))}

        </select>



        <textarea

          placeholder="Review Comment"

          rows={3}

          className="w-full border rounded-lg p-3"

          value={form.comment}

          onChange={e => setForm({ ...form, comment: e.target.value })}

        />



        <div className="flex gap-3">

          <button

            type="submit"

            disabled={!productId || saving}

            className="bg-[#075e4d] text-white px-5 py-2 rounded-lg disabled:opacity-50"

          >

            {saving ? "Saving..." : editingId !== null ? "Update Review" : "Add Review"}

          </button>

          {editingId !== null && (

            <button type="button" onClick={resetForm}

              className="border px-5 py-2 rounded-lg">

              Cancel

            </button>

          )}

        </div>

      </form>



      <div className="bg-white rounded-2xl border border-[#E8E3D8]">

        {loading ? (

          <p className="p-6 text-gray-500">Loading reviews...</p>

        ) : reviews.length === 0 ? (

          <p className="p-8 text-center text-gray-400">

            No customer reviews yet.

          </p>

        ) : reviews.map(review => (

          <div key={review.id}

            className="p-5 border-b flex flex-wrap justify-between gap-4">

            <div>

              <p className="font-semibold">{review.customerName}</p>

              <p className="text-yellow-600">

                {"★".repeat(Number(review.rating))}

                {"☆".repeat(5 - Number(review.rating))}

              </p>

              <p className="text-sm mt-1">{review.comment}</p>

              <p className="text-xs text-gray-500 mt-2">

                Status: {review.status}

              </p>

            </div>



            <div className="flex gap-2 flex-wrap items-start">

              <button

                type="button"

                disabled={saving}

                title="Edit"

                onClick={() => {

                  setEditingId(review.id);

                  setForm({

                    customerName: review.customerName ?? "",

                    rating: review.rating ?? 5,

                    comment: review.comment ?? "",

                  });

                }}

                className="p-2 border rounded-lg"

              >

                <Pencil size={17} />

              </button>

              <button type="button" disabled={saving}

                onClick={() => handleAction("approve", review)}

                className="px-3 py-2 bg-green-100 text-green-700 rounded-lg">

                <Check size={17} />

              </button>

              <button type="button" disabled={saving}

                onClick={() => handleAction("reject", review)}

                className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg">

                <X size={17} />

              </button>

              <button type="button" disabled={saving}

                onClick={() => handleAction("delete", review)}

                className="px-3 py-2 bg-red-100 text-red-600 rounded-lg">

                <Trash2 size={17} />

              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}



function Stat({ title, value, icon: Icon }) {

  return (

    <div className="bg-white border border-[#E8E3D8] rounded-2xl p-5">

      <div className="w-10 h-10 bg-[#EEF5F1] text-[#075e4d] rounded-xl flex items-center justify-center">

        <Icon size={19} />

      </div>

      <p className="text-2xl font-bold text-[#243A34] mt-4">{value}</p>

      <p className="text-xs text-gray-500 mt-1">{title}</p>

    </div>

  );

}
