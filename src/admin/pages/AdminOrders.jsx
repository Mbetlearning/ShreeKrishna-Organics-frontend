import React, { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { apiRequest } from "../../services/api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest(
          "/v1/admin/orders?page=0&size=20"
        );

        setOrders(data.content || []);
      } catch (err) {
        setError(
          err.message || "Failed to load orders."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);
  const handleViewOrder = async (orderId) => {
  try {
    setDetailsLoading(true);
    setError("");

    const data = await apiRequest(
      `/v1/admin/orders/${orderId}`
    );

    setSelectedOrder(data);
  } catch (err) {
    setError(
      err.message || "Failed to load order details."
    );
  } finally {
    setDetailsLoading(false);
  }
};
const handleStatusUpdate = async (orderId, newStatus) => {
  try {
    setError("");

    const updatedOrder = await apiRequest(
      `/v1/admin/orders/${orderId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({
          status: newStatus,
        }),
      }
    );

    setSelectedOrder(updatedOrder);

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === updatedOrder.id
          ? updatedOrder
          : order
      )
    );
  } catch (err) {
    setError(
      err.message || "Failed to update order status."
    );
  }
};
const handleCodPayment = async (orderId) => {
  try {
    setError("");

    const updatedOrder = await apiRequest(
      `/v1/admin/orders/${orderId}/cod-payment`,
      {
        method: "PATCH",
      }
    );

    setSelectedOrder(updatedOrder);

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === updatedOrder.id
          ? updatedOrder
          : order
      )
    );
  } catch (err) {
    setError(
      err.message || "Failed to record COD payment."
    );
  }
};
const handleCancelOrder = async (orderId) => {
  try {
    setError("");

    const updatedOrder = await apiRequest(
      `/v1/admin/orders/${orderId}/cancel`,
      {
        method: "POST",
      }
    );

    setSelectedOrder(updatedOrder);

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === updatedOrder.id
          ? updatedOrder
          : order
      )
    );
  } catch (err) {
    setError(
      err.message || "Failed to cancel order."
    );
  }
};

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#243A34]">
        Orders
      </h1>

      <p className="text-sm text-gray-500 mt-1">
        Manage customer orders.
      </p>

      <div className="mt-7 bg-white rounded-2xl border border-[#E8E3D8] overflow-hidden">
        {error && (
          <div className="m-5 bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl">
            {error}
          </div>
        )}

        {loading ? (
          <div className="min-h-80 flex items-center justify-center text-sm text-gray-400">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="min-h-80 flex flex-col items-center justify-center text-gray-400">
            <ShoppingBag
              size={42}
              strokeWidth={1.3}
            />

            <p className="mt-3 text-sm">
              No orders yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F6F0] text-left text-gray-600">
                <tr>
                  <th className="px-5 py-4 font-semibold">
                    Order
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Customer
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Payment
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Status
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Total
                  </th>
                  <th className="px-5 py-4 font-semibold">
  Action
</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-gray-100"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#243A34]">
                        {order.orderNumber}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        ID: {order.id}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-[#243A34]">
                        {order.shippingFullName}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {order.shippingMobile}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-[#243A34]">
                        {order.paymentMethod}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {order.paymentStatus}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex px-3 py-1 rounded-full bg-[#EEF5F1] text-[#075e4d] text-xs font-semibold">
                        {order.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-semibold text-[#243A34]">
                      ₹{Number(order.totalAmount || 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-4">
  <button
  onClick={() => handleViewOrder(order.id)}
  className="text-sm font-semibold text-[#075e4d] hover:underline"
>
  View
</button>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {detailsLoading && (
  <div className="mt-6 bg-white rounded-2xl border border-[#E8E3D8] p-6 text-sm text-gray-400">
    Loading order details...
  </div>
)}

{selectedOrder && !detailsLoading && (
  <div className="mt-6 bg-white rounded-2xl border border-[#E8E3D8] p-6">

    <div className="flex items-start justify-between gap-4">

      <div>
        <h2 className="text-lg font-bold text-[#243A34]">
          Order Details
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          {selectedOrder.orderNumber}
        </p>
      </div>

      <button
        onClick={() => setSelectedOrder(null)}
        className="text-sm font-semibold text-[#075e4d] hover:underline"
      >
        Close
      </button>

    </div>

    <div className="grid md:grid-cols-2 gap-6 mt-6">

      <div>
        <p className="text-xs text-gray-500">
          Customer
        </p>

        <p className="font-semibold text-[#243A34] mt-1">
          {selectedOrder.shippingFullName}
        </p>

        <p className="text-sm text-gray-500 mt-1">
          {selectedOrder.shippingMobile}
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-500">
          Payment
        </p>

        <p className="font-semibold text-[#243A34] mt-1">
          {selectedOrder.paymentMethod}
        </p>

        <p className="text-sm text-gray-500 mt-1">
          {selectedOrder.paymentStatus}
        </p>
      </div>
      {selectedOrder.paymentMethod === "COD" &&
  selectedOrder.status === "DELIVERED" &&
  selectedOrder.paymentStatus === "PENDING" && (

    <div className="mt-4">
      <button
        onClick={() =>
          handleCodPayment(selectedOrder.id)
        }
        className="bg-[#075e4d] text-white px-4 py-2 rounded-lg text-sm font-semibold"
      >
        Mark COD Paid
      </button>
    </div>
  )}
       <div>
        <p className="text-xs text-gray-500">
          Order Status
        </p>

        <p className="font-semibold text-[#243A34] mt-1">
          {selectedOrder.status}
        </p>
      </div>
      <div className="mt-4">

  {selectedOrder.status === "PLACED" && (
    <button
      onClick={() =>
        handleStatusUpdate(selectedOrder.id, "CONFIRMED")
      }
      className="bg-[#075e4d] text-white px-4 py-2 rounded-lg text-sm font-semibold"
    >
      Mark as Confirmed
    </button>
  )}

  {selectedOrder.status === "CONFIRMED" && (
    <button
      onClick={() =>
        handleStatusUpdate(selectedOrder.id, "PACKED")
      }
      className="bg-[#075e4d] text-white px-4 py-2 rounded-lg text-sm font-semibold"
    >
      Mark as Packed
    </button>
  )}

  {selectedOrder.status === "PACKED" && (
    <button
      onClick={() =>
        handleStatusUpdate(selectedOrder.id, "SHIPPED")
      }
      className="bg-[#075e4d] text-white px-4 py-2 rounded-lg text-sm font-semibold"
    >
      Mark as Shipped
    </button>
  )}
  {selectedOrder.status === "SHIPPED" && (
    <button
      onClick={() =>
        handleStatusUpdate(selectedOrder.id, "DELIVERED")
      }
      className="bg-[#075e4d] text-white px-4 py-2 rounded-lg text-sm font-semibold"
    >
      Mark as Delivered
    </button>
  )}
  {["PLACED", "CONFIRMED", "PACKED"].includes(selectedOrder.status) && (
  <div className="mt-4">
    <button
      onClick={() =>
        handleCancelOrder(selectedOrder.id)
      }
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
    >
      Cancel Order
    </button>
  </div>
)}
</div>
      <div>
        <p className="text-xs text-gray-500">
          Total Amount
        </p>
        <p className="font-semibold text-[#243A34] mt-1">
          ₹{Number(selectedOrder.totalAmount || 0).toFixed(2)}
        </p>
      </div>
    </div>
    <div className="mt-6">
      <p className="text-xs text-gray-500">
        Shipping Address
      </p>
      <p className="text-sm text-[#243A34] mt-2">
        {selectedOrder.shippingAddressLine1}
        {selectedOrder.shippingAddressLine2
          ? `, ${selectedOrder.shippingAddressLine2}`
          : ""}
        {selectedOrder.shippingLandmark
          ? `, ${selectedOrder.shippingLandmark}`
          : ""}
        , {selectedOrder.shippingCity}
        , {selectedOrder.shippingState}
        - {selectedOrder.shippingPostalCode}
        , {selectedOrder.shippingCountry}
      </p>
    </div>
    <div className="mt-6">
      <h3 className="font-semibold text-[#243A34]">
        Items
      </h3>
      <div className="mt-3 space-y-3">
        {selectedOrder.items?.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b border-gray-100 pb-3"
          >

            <div>
              <p className="text-sm font-semibold text-[#243A34]">
                {item.productName}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {item.sku} · Qty {item.quantity}
              </p>
            </div>

            <p className="text-sm font-semibold text-[#243A34]">
              ₹{Number(item.lineTotal || 0).toFixed(2)}
            </p>

          </div>
        ))}

      </div>
    </div>

  </div>
)}
   </div>
  );
}