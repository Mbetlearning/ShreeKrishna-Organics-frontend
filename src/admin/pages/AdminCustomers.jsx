import React from "react";

import { Users } from "lucide-react";

export default function AdminCustomers() {

  return (
    <div>

      <h1 className="text-2xl font-bold text-[#243A34]">
        Customers
      </h1>

      <p className="text-sm text-gray-500 mt-1">
        View registered customers.
      </p>

      <div className="mt-7 bg-white rounded-2xl border border-[#E8E3D8] min-h-80 flex flex-col items-center justify-center text-gray-400">

        <Users
          size={42}
          strokeWidth={1.3}
        />

        <p className="mt-3 text-sm">
          No customer data yet.
        </p>

        <p className="text-xs mt-1">
          Customer data will load here after backend connection.
        </p>

      </div>

    </div>
  );
}