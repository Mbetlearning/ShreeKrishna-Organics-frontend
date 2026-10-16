import React, { useEffect, useState } from "react";
import { ShoppingBag, X, Loader2 } from "lucide-react";
import { apiRequest } from "../../services/api";

const money = (value) => `₹${Number(value ?? 0).toFixed(2)}`;
const nextStatus = { PLACED: "CONFIRMED", CONFIRMED: "PACKED", PACKED: "SHIPPED", SHIPPED: "DELIVERED" };
const nextLabel = { CONFIRMED: "Mark as Confirmed", PACKED: "Mark as Packed", SHIPPED: "Mark as Shipped", DELIVERED: "Mark as Delivered" };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await apiRequest("/admin/orders?page=0&size=20");
        if (active) setOrders(data.content || []);
      } catch (err) {
        if (active) setError(err.message || "Failed to load orders.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const closeModal = () => {
    if (busy) return;
    setModalOpen(false);
    setSelectedOrder(null);
    setError("");
  };

  const handleViewOrder = async (orderId) => {
    setModalOpen(true);
    setSelectedOrder(null);
    setDetailsLoading(true);
    setError("");
    try {
      const data = await apiRequest(`/admin/orders/${orderId}`);
      setSelectedOrder(data);
    } catch (err) {
      setError(err.message || "Failed to load order details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const applyUpdate = async (path, method, body) => {
    if (!selectedOrder || busy) return;
    setBusy(true);
    setError("");
    try {
      const updated = await apiRequest(path, {
        method,
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      // Reload details so the modal always reflects the persisted backend state.
      const fresh = await apiRequest(`/admin/orders/${selectedOrder.id}`);
      setSelectedOrder(fresh);
      setOrders((current) => current.map((order) =>
        order.id === selectedOrder.id
          ? { ...order, ...updated, ...fresh }
          : order
      ));
    } catch (err) {
      setError(err.message || "Could not update order.");
    } finally {
      setBusy(false);
    }
  };

  const updateStatus = (status) => applyUpdate(
    `/admin/orders/${selectedOrder.id}/status`, "PATCH", { status }
  );
  const markCodPaid = () => applyUpdate(
    `/admin/orders/${selectedOrder.id}/cod-payment`, "PATCH"
  );
  const cancelOrder = () => {
    if (!window.confirm("Cancel this order? This action may affect reserved stock and payments.")) return;
    applyUpdate(`/admin/orders/${selectedOrder.id}/cancel`, "POST");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#243A34]">Orders</h1>
      <p className="text-sm text-gray-500 mt-1">Manage customer orders.</p>

      <div className="mt-7 bg-white rounded-2xl border border-[#E8E3D8] overflow-hidden">
        {error && !modalOpen && (
          <p role="alert" className="m-5 rounded-xl bg-red-50 border border-red-200 text-red-700 p-3 text-sm">{error}</p>
        )}
        {loading ? (
          <div className="min-h-80 flex items-center justify-center text-gray-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="min-h-80 flex flex-col items-center justify-center text-gray-400">
            <ShoppingBag size={42} strokeWidth={1.3} />
            <p className="mt-3 text-sm">No orders yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F6F0] text-left text-gray-600">
                <tr>{["Order", "Customer", "Payment", "Status", "Total", "Action"].map((name) => (
                  <th key={name} className="px-5 py-4 font-semibold">{name}</th>
                ))}</tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-gray-100">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#243A34]">{order.orderNumber}</p>
                      <p className="text-xs text-gray-400 mt-1">ID: {order.id}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p>{order.shippingFullName}</p>
                      <p className="text-xs text-gray-400 mt-1">{order.shippingMobile}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p>{order.paymentMethod}</p>
                      <p className="text-xs text-gray-400 mt-1">{order.paymentStatus}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex px-3 py-1 rounded-full bg-[#EEF5F1] text-[#075e4d] text-xs font-semibold">{order.status}</span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-[#243A34]">{money(order.totalAmount)}</td>
                    <td className="px-5 py-4">
                      <button type="button" onClick={() => handleViewOrder(order.id)}
                        className="text-sm font-semibold text-[#075e4d] hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-3 sm:p-6"
          role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
          <div role="dialog" aria-modal="true" aria-label="Order details"
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-[#E8E3D8]">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 sm:px-7 py-4 flex items-start justify-between gap-4 z-10">
              <div>
                <h2 className="text-xl font-bold text-[#243A34]">Order Details</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 break-all">{selectedOrder?.orderNumber || "Loading order..."}</p>
              </div>
              <button type="button" aria-label="Close order details" onClick={closeModal} disabled={busy}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 disabled:opacity-50"><X size={20}/></button>
            </div>
            <div className="p-5 sm:p-7">
              {error && <p role="alert" className="mb-5 rounded-xl bg-red-50 border border-red-200 text-red-700 p-3 text-sm">{error}</p>}
              {detailsLoading ? (
                <div className="py-16 flex items-center justify-center gap-3 text-gray-500"><Loader2 className="animate-spin" size={20}/>Loading order details...</div>
              ) : selectedOrder ? (
                <>
                  <div className="grid sm:grid-cols-2 gap-5 text-sm">
                    <section><p className="text-xs text-gray-500">Customer</p>
                      <p className="font-semibold mt-1 text-[#243A34]">{selectedOrder.shippingFullName}</p>
                      <p className="text-gray-500">{selectedOrder.shippingMobile}</p>
                    </section>
                    <section><p className="text-xs text-gray-500">Payment</p>
                      <p className="font-semibold mt-1">{selectedOrder.paymentMethod}</p>
                      <p className="text-gray-500">{selectedOrder.paymentStatus}</p>
                    </section>
                    <section><p className="text-xs text-gray-500">Order Status</p>
                      <p className="font-semibold mt-1">{selectedOrder.status}</p>
                    </section>
                    <section><p className="text-xs text-gray-500">Order ID</p>
                      <p className="font-semibold mt-1">{selectedOrder.id}</p>
                    </section>
                  </div>

                  <section className="mt-6 border-t pt-5">
                    <h3 className="font-semibold text-[#243A34]">Shipping Address</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {[selectedOrder.shippingAddressLine1, selectedOrder.shippingAddressLine2,
                        selectedOrder.shippingLandmark, selectedOrder.shippingCity, selectedOrder.shippingState,
                        selectedOrder.shippingPostalCode, selectedOrder.shippingCountry]
                        .filter(Boolean).join(", ")}
                    </p>
                  </section>

                  <section className="mt-6 border-t pt-5">
                    <h3 className="font-semibold text-[#243A34]">Items</h3>
                    <div className="mt-3 divide-y divide-gray-100">
                      {(selectedOrder.items || []).map((item, index) => (
                        <div key={item.id ?? `${item.variantId}-${index}`} className="py-3 flex justify-between gap-4 text-sm">
                          <div><p className="font-semibold text-[#243A34]">{item.productName}</p>
                            <p className="text-xs text-gray-500 mt-1">{item.sku} · Qty {item.quantity}</p></div>
                          <p className="font-semibold whitespace-nowrap">{money(item.lineTotal)}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="mt-6 border-t pt-5 text-sm space-y-2">
                    <h3 className="font-semibold text-[#243A34] mb-3">Price Summary</h3>
                    <div className="flex justify-between"><span>Product Subtotal</span><span>{money(selectedOrder.subtotal)}</span></div>
                    <div className="flex justify-between"><span>GST (included/excluded as configured)</span><span>{money(selectedOrder.taxAmount)}</span></div>
                    <div className="flex justify-between"><span>Delivery Charge</span><span>{money(selectedOrder.deliveryCharge)}</span></div>
                    {Number(selectedOrder.codCharge || 0) > 0 && (
                      <div className="flex justify-between"><span>COD Charge</span><span>{money(selectedOrder.codCharge)}</span></div>
                    )}
                    {Number(selectedOrder.discountAmount || 0) > 0 && (
                      <div className="flex justify-between"><span>Discount</span><span>-{money(selectedOrder.discountAmount)}</span></div>
                    )}
                    <div className="flex justify-between border-t pt-3 font-bold text-[#243A34] text-base">
                      <span>Total Payable</span><span>{money(selectedOrder.totalAmount)}</span>
                    </div>
                    <p className="text-xs text-gray-500">GST is informational here; included GST must not be added again to the total.</p>
                  </section>

                  <section className="mt-6 border-t pt-5 flex flex-wrap gap-3">
                    {nextStatus[selectedOrder.status] && (
                      <button type="button" disabled={busy} onClick={() => updateStatus(nextStatus[selectedOrder.status])}
                        className="bg-[#075e4d] hover:bg-[#064c3e] text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
                        {busy ? "Updating..." : nextLabel[nextStatus[selectedOrder.status]]}
                      </button>
                    )}
                    {selectedOrder.paymentMethod === "COD" && selectedOrder.status === "DELIVERED" && selectedOrder.paymentStatus === "PENDING" && (
                      <button type="button" disabled={busy} onClick={markCodPaid}
                        className="bg-[#075e4d] text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">Mark COD Paid</button>
                    )}
                    {["PLACED", "CONFIRMED", "PACKED"].includes(selectedOrder.status) && (
                      <button type="button" disabled={busy} onClick={cancelOrder}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">Cancel Order</button>
                    )}
                  </section>
                </>
              ) : !error ? <p className="text-sm text-gray-500">Order details unavailable.</p> : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
