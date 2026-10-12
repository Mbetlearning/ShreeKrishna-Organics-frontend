

import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

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



export default function AddProduct() {

  const navigate = useNavigate();



  const [form, setForm] = useState(initialForm);

  const [categories, setCategories] = useState([]);

  const [loadingCategories, setLoadingCategories] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");



  // Product ID received after successful creation.

  const [createdProductId, setCreatedProductId] = useState(null);



  useEffect(() => {

    let mounted = true;



    async function loadCategories() {

      try {

        const data = await adminProductService.getCategories();



        if (!Array.isArray(data)) {

          throw new Error("Invalid category response.");

        }



        if (mounted) setCategories(data);

      } catch (err) {

        if (mounted) {

          setError(

            err.message || "Unable to load product categories."

          );

        }

      } finally {

        if (mounted) setLoadingCategories(false);

      }

    }



    loadCategories();



    return () => {

      mounted = false;

    };

  }, []);



  const update = (e) => {

    const { name, value, type, checked } = e.target;



    setForm((prev) => {

      const next = {

        ...prev,

        [name]: type === "checkbox" ? checked : value,

      };



      if (name === "name" && prev.slug === createSlug(prev.name)) {

        next.slug = createSlug(value);

      }



      return next;

    });

  };



  const submit = async (e) => {

    e.preventDefault();



    // Prevent duplicate creation after success.

    if (createdProductId || saving) return;



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

    const payload = {

      categoryId: Number(form.categoryId),

      name: form.name.trim(),

      slug: form.slug.trim(),

      shortDescription: form.shortDescription.trim(),

      description: form.description.trim(),

      // Product-level placeholder; actual selling prices are variant-wise.
      basePrice: 0,
      mrp: null,

      active: form.active,

      featured: form.featured,

      displayOrder: Number(form.displayOrder) || 0,

    };



    setSaving(true);



    try {

      const createdProduct =

        await adminProductService.create(payload);



      if (!createdProduct?.id) {

        throw new Error(

          "Product response did not contain an ID. Check the Products list before retrying."

        );

      }



      setCreatedProductId(createdProduct.id);



      setSuccess(

        `Product #${createdProduct.id} saved successfully. You can now upload images and manage variants and stock.`

      );

    } catch (err) {

      setError(err.message || "Unable to save product.");

    } finally {

      setSaving(false);

    }

  };



  const isCreated = Boolean(createdProductId);



  return (

    <div className="max-w-4xl">

      <h1 className="text-2xl font-bold text-[#243A34]">

        Add Product

      </h1>



      <p className="text-sm text-gray-500 mt-1 mb-7">

        Create product details first. Set size-wise prices and stock after saving.

      </p>



      <form

        onSubmit={submit}

        className="bg-white rounded-2xl border border-[#E8E3D8] p-6 md:p-8"

      >

        {error && (

          <div

            role="alert"

            className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"

          >

            {error}

          </div>

        )}



        {success && (

          <div

            role="status"

            className="mb-5 rounded-xl bg-green-50 p-4 text-sm text-green-700"

          >

            {success}

          </div>

        )}



        <fieldset

          disabled={isCreated || saving}

          className="disabled:opacity-75"

        >

          <div className="grid md:grid-cols-2 gap-5">

            <Field

              label="Product Name"

              name="name"

              value={form.name}

              onChange={update}

              maxLength={200}

              required

            />



            <div>

              <label className="text-xs font-semibold text-gray-600">

                Category

              </label>



              <select

                name="categoryId"

                value={form.categoryId}

                onChange={update}

                required

                disabled={

                  loadingCategories ||

                  categories.length === 0

                }

                className="mt-2 w-full border rounded-xl px-4 py-3 outline-none"

              >

                <option value="">

                  {loadingCategories

                    ? "Loading categories..."

                    : "Select Category"}

                </option>



                {categories.map((category) => (

                  <option

                    key={category.id}

                    value={category.id}

                  >

                    {category.name}

                  </option>

                ))}

              </select>

            </div>



            <Field

              label="Product Slug"

              name="slug"

              value={form.slug}

              onChange={update}

              maxLength={220}

              required

            />



            <Field

              label="Display Order"

              name="displayOrder"

              type="number"

              value={form.displayOrder}

              onChange={update}

            />

          </div>



          <div className="mt-5">

            <label className="text-xs font-semibold text-gray-600">

              Short Description

            </label>



            <textarea

              name="shortDescription"

              value={form.shortDescription}

              onChange={update}

              maxLength={500}

              rows={2}

              className="mt-2 w-full border rounded-xl px-4 py-3 outline-none resize-none"

            />

          </div>



          <div className="mt-5">

            <label className="text-xs font-semibold text-gray-600">

              Description

            </label>



            <textarea

              name="description"

              value={form.description}

              onChange={update}

              rows={5}

              className="mt-2 w-full border rounded-xl px-4 py-3 outline-none resize-none"

            />

          </div>



          <div className="flex flex-wrap gap-6 mt-5">

            <label className="flex items-center gap-2 text-sm">

              <input

                type="checkbox"

                name="active"

                checked={form.active}

                onChange={update}

              />

              Active Product

            </label>



            <label className="flex items-center gap-2 text-sm">

              <input

                type="checkbox"

                name="featured"

                checked={form.featured}

                onChange={update}

              />

              Featured Product

            </label>

          </div>



          {!isCreated && (

            <button

              type="submit"

              disabled={

                saving ||

                loadingCategories ||

                categories.length === 0

              }

              className="mt-6 bg-[#075e4d] hover:bg-[#064c3f] text-white px-7 py-3 rounded-xl font-semibold transition disabled:opacity-50"

            >

              {saving ? "Saving..." : "Save Product"}

            </button>

          )}

        </fieldset>

      </form>



      {!isCreated && (

        <div className="mt-5 border border-dashed border-[#D8D2C4] rounded-2xl p-5 text-sm text-gray-600">

          <h2 className="font-bold text-[#243A34] mb-1">

            Product Images

          </h2>

          Save the product first to enable image upload and variant/inventory management.

        </div>

      )}



      {isCreated && (

        <>

          <ProductImageManager

            productId={createdProductId}

          />

          <ProductVariantManager productId={createdProductId} />



          <div className="flex flex-wrap gap-3 mt-6">

            <button

              type="button"

              onClick={() => navigate("/admin/products")}

              className="bg-[#075e4d] text-white px-6 py-3 rounded-xl font-semibold"

            >

              Go to Products

            </button>



            <button

              type="button"

              onClick={() =>

                navigate(

                  `/admin/products/edit/${createdProductId}`

                )

              }

              className="border border-[#075e4d] text-[#075e4d] px-6 py-3 rounded-xl font-semibold"

            >

              Edit Product Details

            </button>

          </div>

        </>

      )}

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
