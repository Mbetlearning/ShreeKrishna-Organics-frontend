import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { adminProductService } from "../services/adminProductService";

import ProductImageManager from "../components/ProductImageManager";

import ProductVariantManager from "../components/ProductVariantManager";

const initialForm = {

  name: "",

  categoryId: "",

  slug: "",

  shortDescription: "",

  description: "",



  active: true,

  featured: false,

  displayOrder: "0",

};

function createSlug(value) {

  return value

    .toLowerCase()

    .trim()

    .replace(/[^a-z0-9]+/g, "-")

    .replace(/^-+|-+$/g, "");

}

export default function EditProduct() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");
  const [originalPricing, setOriginalPricing] = useState({ basePrice: 0, mrp: null });

  useEffect(() => {

    let mounted = true;

    async function loadProduct() {

      setLoading(true);

      setError("");

      try {

        const [product, categoryData] = await Promise.all([

          adminProductService.getById(id),

          adminProductService.getCategories(),

        ]);

        if (!product || !product.id) {

          throw new Error("Product not found.");

        }

        if (!Array.isArray(categoryData)) {

          throw new Error("Invalid categories response.");

        }

        if (!mounted) return;

        setCategories(categoryData);
        // Preserve existing product-level values for backend compatibility.
        setOriginalPricing({ basePrice: product.basePrice ?? 0, mrp: product.mrp ?? null });

        setForm({

          name: product.name ?? "",

          categoryId: String(product.categoryId ?? ""),

          slug: product.slug ?? "",

          shortDescription: product.shortDescription ?? "",

          description: product.description ?? "",


          active: product.active ?? true,

          featured: product.featured ?? false,

          displayOrder: String(product.displayOrder ?? 0),

        });

      } catch (err) {

        if (mounted) {

          setError(err.message || "Failed to load product.");

        }

      } finally {

        if (mounted) setLoading(false);

      }

    }

    loadProduct();

    return () => {

      mounted = false;

    };

  }, [id]);

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setForm((prev) => {

      const next = {

        ...prev,

        [name]: type === "checkbox" ? checked : value,

      };

      if (

        name === "name" &&

        prev.slug === createSlug(prev.name)

      ) {

        next.slug = createSlug(value);

      }

      return next;

    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setSuccess("");

    if (!form.categoryId) {

      setError("Please select a category.");

      return;

    }

    if (!form.name.trim() || !form.slug.trim()) {

      setError("Product name and slug are required.");

      return;

    }

    if (form.name.length > 200 || form.slug.length > 220) {

      setError("Product name or slug is too long.");

      return;

    }

    if (form.shortDescription.length > 500) {

      setError("Short description cannot exceed 500 characters.");

      return;

    }

    const displayOrder = Number(form.displayOrder);

    if (
      form.displayOrder !== "" &&

      (!Number.isInteger(displayOrder) ||

        displayOrder < -2147483648 ||

        displayOrder > 2147483647)

    ) {

      setError("Please enter a valid display order.");

      return;

    }

    const payload = {

      categoryId: Number(form.categoryId),

      name: form.name.trim(),

      slug: form.slug.trim(),

      shortDescription: form.shortDescription.trim(),

      description: form.description.trim(),

      // Keep stored product-level values; edit prices via variants.
      basePrice: originalPricing.basePrice,
      mrp: originalPricing.mrp,

      active: form.active,

      featured: form.featured,

      displayOrder:

        form.displayOrder === "" ? 0 : displayOrder,

    };

    setSaving(true);

    try {

      await adminProductService.update(id, payload);

      setSuccess("Product updated successfully.");

      navigate("/admin/products", { replace: true });

    } catch (err) {

      setError(err.message || "Failed to update product.");

    } finally {

      setSaving(false);

    }

  };

  if (loading) {

    return (

      <div className="max-w-4xl bg-white rounded-2xl p-8 text-gray-500">

        Loading product details...

      </div>

    );

  }

  return (

    <div className="max-w-4xl">

      {/* HEADER */}

      <div className="mb-7">

        <h1 className="text-2xl font-bold text-[#243A34]">

          Edit Product

        </h1>

        <p className="text-sm text-gray-500 mt-1">

          Update product information. Manage size-wise prices below.

        </p>

      </div>

      {/* FORM */}

      <form
        id="edit-product-form"

        onSubmit={handleSubmit}

        className="bg-white border border-[#E8E3D8] rounded-2xl p-6 md:p-8"

      >

        {error && (

          <div

            role="alert"

            className="mb-5 bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm"

          >

            {error}

          </div>

        )}

        {success && (

          <div

            role="status"

            className="mb-5 bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm"

          >

            {success}

          </div>

        )}

        <div className="grid md:grid-cols-2 gap-5">

          {/* NAME */}

          <Field

            label="Product Name"

            name="name"

            value={form.name}

            onChange={handleChange}

            maxLength={200}

            required

          />

          {/* CATEGORY */}

          <div>

            <label className="text-xs font-semibold text-gray-600">

              Category <span className="text-red-500">*</span>

            </label>

            <select

              name="categoryId"

              value={form.categoryId}

              onChange={handleChange}

              required

              className="mt-2 w-full border rounded-xl px-4 py-3 outline-none"

            >

              <option value="">Select Category</option>

              {form.categoryId &&

                !categories.some(

                  (category) =>

                    String(category.id) === form.categoryId

                ) && (

                  <option value={form.categoryId}>

                    Current Category (ID: {form.categoryId})

                  </option>

                )}

              {categories.map((category) => (

                <option key={category.id} value={category.id}>

                  {category.name}

                </option>

              ))}

            </select>

          </div>

          {/* SLUG */}

          <Field

            label="Product Slug"

            name="slug"

            value={form.slug}

            onChange={handleChange}

            maxLength={220}

            required

          />

          {/* BASE PRICE */}

          {/* MRP */}

          {/* DISPLAY ORDER */}

          <Field

            label="Display Order"

            name="displayOrder"

            type="number"

            step="1"

            value={form.displayOrder}

            onChange={handleChange}

          />

        </div>

        {/* SHORT DESCRIPTION */}

        <div className="mt-5">

          <label className="text-xs font-semibold text-gray-600">

            Short Description

          </label>

          <textarea

            name="shortDescription"

            value={form.shortDescription}

            onChange={handleChange}

            maxLength={500}

            rows={2}

            className="mt-2 w-full border rounded-xl px-4 py-3 outline-none resize-none"

          />

        </div>

        {/* DESCRIPTION */}

        <div className="mt-5">

          <label className="text-xs font-semibold text-gray-600">

            Description

          </label>

          <textarea

            name="description"

            value={form.description}

            onChange={handleChange}

            rows={6}

            className="mt-2 w-full border rounded-xl px-4 py-3 outline-none resize-none"

          />

        </div>

        {/* STATUS */}

        <div className="flex flex-wrap gap-6 mt-5">

          <label className="flex items-center gap-2 text-sm">

            <input

              type="checkbox"

              name="active"

              checked={form.active}

              onChange={handleChange}

            />

            Active Product

          </label>

          <label className="flex items-center gap-2 text-sm">

            <input

              type="checkbox"

              name="featured"

              checked={form.featured}

              onChange={handleChange}

            />

            Featured Product

          </label>

        </div>

        {/* ACTION BUTTONS */}

        <div className="flex gap-3 mt-7">

          <button

            type="submit"

            disabled={saving || Boolean(error && !form.name)}

            className="bg-[#075e4d] hover:bg-[#064c3f] text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"

          >

            {saving ? "Updating..." : "Update Product"}

          </button>

          <button

            type="button"

            onClick={() => navigate("/admin/products")}

            className="border border-gray-300 px-6 py-3 rounded-xl font-semibold text-gray-600"

          >

            Cancel

          </button>

        </div>

      </form>

      <ProductImageManager productId={id} />

      <ProductVariantManager productId={id} />

      <div className="mt-6 mb-8 flex justify-end rounded-2xl border border-[#E8E3D8] bg-white p-5">
        <button
          type="submit"
          form="edit-product-form"
          disabled={saving}
          className="rounded-xl bg-[#075e4d] px-7 py-3 font-semibold text-white hover:bg-[#064c3f] disabled:opacity-50"
        >
          {saving ? "Updating..." : "Update Product"}
        </button>
      </div>

    </div>

  );

}

function Field({ label, required, ...props }) {

  return (

    <div>

      <label className="text-xs font-semibold text-gray-600">

        {label}

        {required && (

          <span className="text-red-500"> *</span>

        )}

      </label>

      <input

        {...props}

        required={required}

        className="mt-2 w-full border rounded-xl px-4 py-3 outline-none focus:border-[#075e4d]"

      />

    </div>

  );

}
