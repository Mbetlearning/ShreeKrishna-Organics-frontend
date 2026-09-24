import React, { useState } from "react";

export default function AddProduct() {

  const [form, setForm] = useState({
    name: "",
    category: "wood-pressed",
    price: "",
    mrp: "",
    stock: "",
    description: "",
  });

  const update = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const submit = (e) => {

    e.preventDefault();

    alert(
      "Product form तयार आहे. Spring Boot API जोडल्यानंतर product database मध्ये save होईल."
    );

  };

  return (
    <div className="max-w-4xl">

      {/* HEADER */}
      <h1 className="text-2xl font-bold text-[#243A34]">
        Add Product
      </h1>

      <p className="text-sm text-gray-500 mt-1 mb-7">
        Create a new store product.
      </p>

      {/* FORM */}
      <form
        onSubmit={submit}
        className="bg-white rounded-2xl border border-[#E8E3D8] p-6 md:p-8"
      >

        <div className="grid md:grid-cols-2 gap-5">

          {/* NAME */}
          <Field
            label="Product Name"
            name="name"
            value={form.name}
            onChange={update}
          />

          {/* CATEGORY */}
          <div>

            <label className="text-xs font-semibold text-gray-600">
              Category
            </label>

            <select
              name="category"
              value={form.category}
              onChange={update}
              className="mt-2 w-full border rounded-xl px-4 py-3 outline-none"
            >

              <option value="wood-pressed">
                Wood-Pressed Oils
              </option>

              <option value="supplements">
                Health Supplements
              </option>

              <option value="jaggery">
                Jaggery
              </option>

              <option value="other">
                Other
              </option>

            </select>

          </div>

          {/* PRICE */}
          <Field
            label="Price (₹)"
            name="price"
            type="number"
            value={form.price}
            onChange={update}
          />

          {/* MRP */}
          <Field
            label="MRP (₹)"
            name="mrp"
            type="number"
            value={form.mrp}
            onChange={update}
          />

          {/* STOCK */}
          <Field
            label="Stock"
            name="stock"
            type="number"
            value={form.stock}
            onChange={update}
          />

          {/* IMAGE */}
          <div>

            <label className="text-xs font-semibold text-gray-600">
              Product Image
            </label>

            <input
              type="file"
              accept="image/*"
              className="mt-2 w-full border rounded-xl px-4 py-2.5 text-sm"
            />

          </div>

        </div>

        {/* DESCRIPTION */}
        <div className="mt-5">

          <label className="text-xs font-semibold text-gray-600">
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={update}
            rows="5"
            className="mt-2 w-full border rounded-xl px-4 py-3 outline-none resize-none"
          />

        </div>

        {/* SAVE */}
        <button
          type="submit"
          className="mt-6 bg-[#075e4d] hover:bg-[#064c3f] text-white px-7 py-3 rounded-xl font-semibold transition"
        >
          Save Product
        </button>

      </form>

    </div>
  );
}

function Field({
  label,
  ...props
}) {

  return (
    <div>

      <label className="text-xs font-semibold text-gray-600">
        {label}
      </label>

      <input
        required
        {...props}
        className="mt-2 w-full border rounded-xl px-4 py-3 outline-none focus:border-[#075e4d]"
      />

    </div>
  );
}