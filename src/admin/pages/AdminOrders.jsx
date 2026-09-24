import React from "react";

import { ShoppingBag } from "lucide-react";

export default function AdminOrders() {

  return (
    <div>

      <h1 className="text-2xl font-bold text-[#243A34]">
        Orders
      </h1>

      <p className="text-sm text-gray-500 mt-1">
        Manage customer orders.
      </p>

      <div className="mt-7 bg-white rounded-2xl border border-[#E8E3D8] min-h-80 flex flex-col items-center justify-center text-gray-400">

        <ShoppingBag
          size={42}
          strokeWidth={1.3}
        />

        <p className="mt-3 text-sm">
          No orders yet.
        </p>

        <p className="text-xs mt-1">
          Orders will load here after backend connection.
        </p>

      </div>

    </div>
  );
}