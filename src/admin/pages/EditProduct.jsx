import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { products } from "../../data/products";

export default function EditProduct() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    mrp: "",
    description: "",
  });

  useEffect(() => {

    const product = products.find(
      (item) => item.id === Number(id)
    );

    if (!product) {
      return;
    }

    setForm({
      name: product.name || "",
      category: product.category || "",
      price: product.price || "",
      mrp:
        product.originalPrice ||
        product.sizes?.[0]?.mrp ||
        "",
      description: product.description || "",
    });

  }, [id]);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    alert(
      "Edit UI तयार आहे. Spring Boot API जोडल्यानंतर changes database मध्ये save होतील."
    );

  };

  return (
    <div className="max-w-4xl">

      <div className="mb-7">

        <h1 className="text-2xl font-bold text-[#243A34]">
          Edit Product
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Update product information.
        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#E8E3D8] rounded-2xl p-6 md:p-8"
      >

        <div className="grid md:grid-cols-2 gap-5">

          <Field
            label="Product Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <div>

            <label className="text-xs font-semibold text-gray-600">
              Category
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
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

          <Field
            label="Price ₹"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
          />

          <Field
            label="MRP ₹"
            name="mrp"
            type="number"
            value={form.mrp}
            onChange={handleChange}
          />

        </div>

        <div className="mt-5">

          <label className="text-xs font-semibold text-gray-600">
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="6"
            className="mt-2 w-full border rounded-xl px-4 py-3 outline-none resize-none"
          />

        </div>

        <div className="flex gap-3 mt-7">

          <button
            type="submit"
            className="bg-[#075e4d] text-white px-6 py-3 rounded-xl font-semibold"
          >
            Update Product
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/products")
            }
            className="border border-gray-300 px-6 py-3 rounded-xl font-semibold text-gray-600"
          >
            Cancel
          </button>

        </div>

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
        {...props}
        className="mt-2 w-full border rounded-xl px-4 py-3 outline-none focus:border-[#075e4d]"
      />

    </div>
  );
}