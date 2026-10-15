import React, { useEffect, useState } from "react";

import {
  Package,
  ShoppingBag,
  Users,
  IndianRupee,
  ArrowUpRight,
} from "lucide-react";

import { apiRequest } from "../../services/api";

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState({
  totalProducts: 0,
  totalOrders: 0,
  totalCustomers: 0,
  revenue: 0,
  paidOrders: 0,
  pendingOrders: 0,
  codOrders: 0,
  razorpayOrders: 0,
});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest("/v1/admin/dashboard");
        const ordersData = await apiRequest("/v1/admin/orders?page=0&size=5");

setRecentOrders(ordersData.content || []);

        setDashboard({
  totalProducts: data.totalProducts ?? 0,
  totalOrders: data.totalOrders ?? 0,
  totalCustomers: data.totalCustomers ?? 0,
  revenue: data.revenue ?? 0,
  paidOrders: data.paidOrders ?? 0,
  pendingOrders: data.pendingOrders ?? 0,
  codOrders: data.codOrders ?? 0,
  razorpayOrders: data.razorpayOrders ?? 0,
});
      } catch (err) {
        setError(err.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const cards = [
    {
      title: "Total Products",
      value: loading ? "..." : dashboard.totalProducts,
      icon: Package,
    },
    {
      title: "Total Orders",
      value: loading ? "..." : dashboard.totalOrders,
      icon: ShoppingBag,
    },
    {
      title: "Customers",
      value: loading ? "..." : dashboard.totalCustomers,
      icon: Users,
    },
    {
      title: "Revenue",
      value: loading
        ? "..."
        : `₹${Number(dashboard.revenue || 0).toFixed(2)}`,
      icon: IndianRupee,
    },
  ];

  return (
    <div>
      {/* TITLE */}
      <div className="mb-7">
        <h1 className="text-2xl md:text-3xl font-bold text-[#243A34]">
          Dashboard
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage your ShreeKrishna Organics store.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl">
          {error}
        </div>
      )}

      {/* CARDS */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map(({ title, value, icon: Icon }) => (
          <div
            key={title}
            className="bg-white rounded-2xl border border-[#E8E3D8] p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl bg-[#EEF5F1] text-[#075e4d] flex items-center justify-center">
                <Icon size={21} />
              </div>

              <ArrowUpRight
                size={17}
                className="text-gray-300"
              />
            </div>

            <p className="text-2xl font-bold text-[#243A34] mt-5">
              {value}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              {title}
            </p>
          </div>
        ))}
      </div>

      {/* BOTTOM */}
      <div className="grid lg:grid-cols-2 gap-5 mt-6">
        {/* RECENT ORDERS */}
        <div className="bg-white rounded-2xl border border-[#E8E3D8] p-6 min-h-64">
          <h2 className="font-bold text-[#243A34]">
            Recent Orders
          </h2>

         <div className="mt-4 space-y-3">

  {recentOrders.length === 0 ? (
    <div className="h-40 flex items-center justify-center text-sm text-gray-400">
      No recent orders.
    </div>
  ) : (
    recentOrders.map((order) => (
      <div
        key={order.id}
        className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 last:border-b-0"
      >
        <div className="min-w-0">

          <p className="text-sm font-semibold text-[#243A34] truncate">
            {order.orderNumber}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            {order.shippingFullName}
          </p>

        </div>

        <div className="text-right shrink-0">

          <p className="text-sm font-semibold text-[#243A34]">
            ₹{Number(order.totalAmount || 0).toFixed(2)}
          </p>

          <p className="text-xs text-[#075e4d] mt-1">
            {order.status}
          </p>

        </div>
      </div>
    ))
  )}

</div>
        </div>

        {/* STORE */}
        <div className="bg-white rounded-2xl border border-[#E8E3D8] p-6 min-h-64">
          <h2 className="font-bold text-[#243A34]">
            Store Overview
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-4">

  <div className="rounded-xl bg-[#F7FAF8] border border-[#E5EEE9] p-4">
    <p className="text-xs text-gray-500">
      Paid Orders
    </p>

    <p className="text-xl font-bold text-[#243A34] mt-1">
      {dashboard.paidOrders}
    </p>
  </div>

  <div className="rounded-xl bg-[#F7FAF8] border border-[#E5EEE9] p-4">
    <p className="text-xs text-gray-500">
      Pending Orders
    </p>

    <p className="text-xl font-bold text-[#243A34] mt-1">
      {dashboard.pendingOrders}
    </p>
  </div>

  <div className="rounded-xl bg-[#F7FAF8] border border-[#E5EEE9] p-4">
    <p className="text-xs text-gray-500">
      COD Orders
    </p>

    <p className="text-xl font-bold text-[#243A34] mt-1">
      {dashboard.codOrders}
    </p>
  </div>

  <div className="rounded-xl bg-[#F7FAF8] border border-[#E5EEE9] p-4">
    <p className="text-xs text-gray-500">
      Razorpay Orders
    </p>

    <p className="text-xl font-bold text-[#243A34] mt-1">
      {dashboard.razorpayOrders}
    </p>
  </div>

</div>
        </div>
      </div>
    </div>
  );
}