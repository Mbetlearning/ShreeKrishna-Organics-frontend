import React, { useState } from "react";
import {
  Save,
  Store,
  Mail,
  Phone,
} from "lucide-react";

export default function AdminSettings() {

  const [settings, setSettings] = useState({
    storeName: "ShreeKrishna Organics",
    email: "",
    phone: "",
    freeShipping: "999",
  });

  const handleChange = (e) => {

    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    alert(
      "Settings UI तयार आहे. Backend जोडल्यानंतर settings save होतील."
    );

  };

  return (
    <div className="max-w-4xl">

      <div className="mb-7">

        <h1 className="text-2xl font-bold text-[#243A34]">
          Store Settings
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage your store information.
        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-[#E8E3D8] p-6 md:p-8"
      >

        <div className="grid md:grid-cols-2 gap-5">

          <Input
            icon={Store}
            label="Store Name"
            name="storeName"
            value={settings.storeName}
            onChange={handleChange}
          />

          <Input
            icon={Mail}
            label="Email Address"
            name="email"
            type="email"
            value={settings.email}
            onChange={handleChange}
          />

          <Input
            icon={Phone}
            label="Contact Number"
            name="phone"
            value={settings.phone}
            onChange={handleChange}
          />

          <Input
            label="Free Shipping Above ₹"
            name="freeShipping"
            type="number"
            value={settings.freeShipping}
            onChange={handleChange}
          />

        </div>

        <button
          type="submit"
          className="mt-7 flex items-center gap-2 bg-[#075e4d] text-white px-6 py-3 rounded-xl font-semibold"
        >
          <Save size={17} />
          Save Settings
        </button>

      </form>

    </div>
  );
}

function Input({
  icon: Icon,
  label,
  ...props
}) {

  return (
    <div>

      <label className="text-xs font-semibold text-gray-600">
        {label}
      </label>

      <div className="mt-2 flex items-center gap-3 border rounded-xl px-4">

        {Icon && (
          <Icon
            size={17}
            className="text-gray-400"
          />
        )}

        <input
          {...props}
          className="w-full py-3 outline-none text-sm"
        />

      </div>

    </div>
  );
}