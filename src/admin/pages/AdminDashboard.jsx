import React from "react";

import {
  Package,
  ShoppingBag,
  Users,
  IndianRupee,
  ArrowUpRight,
} from "lucide-react";

export default function AdminDashboard() {

  const cards = [
    {
      title: "Total Products",
      value: "10",
      icon: Package,
    },
    {
      title: "Total Orders",
      value: "0",
      icon: ShoppingBag,
    },
    {
      title: "Customers",
      value: "0",
      icon: Users,
    },
    {
      title: "Revenue",
      value: "₹0",
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

      {/* CARDS */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {cards.map(
          ({
            title,
            value,
            icon: Icon,
          }) => (

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

          )
        )}

      </div>

      {/* BOTTOM */}
      <div className="grid lg:grid-cols-2 gap-5 mt-6">

        {/* RECENT ORDERS */}
        <div className="bg-white rounded-2xl border border-[#E8E3D8] p-6 min-h-64">

          <h2 className="font-bold text-[#243A34]">
            Recent Orders
          </h2>

          <div className="h-44 flex items-center justify-center text-sm text-gray-400">
            Orders will appear here after backend connection.
          </div>

        </div>

        {/* STORE */}
        <div className="bg-white rounded-2xl border border-[#E8E3D8] p-6 min-h-64">

          <h2 className="font-bold text-[#243A34]">
            Store Overview
          </h2>

          <div className="h-44 flex items-center justify-center text-sm text-gray-400">
            Sales data will appear here.
          </div>

        </div>

      </div>

    </div>
  );
}