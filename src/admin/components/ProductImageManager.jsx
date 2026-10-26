import React, { useEffect, useState } from "react";
import { adminProductService } from "../services/adminProductService";

const MAX_GALLERY_IMAGES = 4;
const MAX_NORMAL_IMAGES = MAX_GALLERY_IMAGES + 1;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function validateImageFile(file) {
  if (!file) {
    return "Please select an image.";
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Only JPG, PNG and WEBP images are allowed.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "Image size must not exceed 5 MB.";
  }

  return "";
}

function getVariantLabel(variant) {
  const size = variant.sizeValue ?? "";
  const unit = variant.sizeUnit ?? "";

  if (size !== "" || unit !== "") {
    return `${size} ${unit}`.trim();
  }

  return variant.sku || `Variant #${variant.id}`;
}

export default function ProductImageManager({ productId }) {
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [busyVariantId, setBusyVariantId] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ==========================================
  // SEPARATE NORMAL AND VARIANT IMAGES
  // ==========================================

  const normalImages = images.filter(
    (image) => image.variantId == null
  );

  const variantImages = images.filter(
    (image) => image.variantId != null
  );

  const primaryImage = normalImages.find(
    (image) => image.primary
  );

  const galleryImages = normalImages.filter(
    (image) => !image.primary
  );

  const atLimit = normalImages.length >= MAX_NORMAL_IMAGES;

  const isBusy = busy || busyVariantId !== null;

  // ==========================================
  // LOAD PRODUCT IMAGES AND VARIANTS
  // ==========================================

  useEffect(() => {
    let active = true;

    setImages([]);
    setVariants([]);
    setSelectedFile(null);
    setLoading(true);
    setError("");
    setMessage("");

    if (!productId) {
      setLoading(false);
      return undefined;
    }

    Promise.all([
      adminProductService.getImages(productId),
      adminProductService.getVariants(productId),
    ])
      .then(([imageData, variantData]) => {
        if (!Array.isArray(imageData)) {
          throw new Error("Invalid image response.");
        }

        if (!Array.isArray(variantData)) {
          throw new Error("Invalid variant response.");
        }

        if (active) {
          setImages(imageData);
          setVariants(variantData);
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            err.message ||
              "Unable to load product images and variants."
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [productId]);

  // ==========================================
  // NORMAL IMAGE PREVIEW
  // ==========================================

  useEffect(() => {
    if (!selectedFile) {
      setPreview("");
      return undefined;
    }

    const url = URL.createObjectURL(selectedFile);

    setPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  // ==========================================
  // REFRESH IMAGES
  // ==========================================

  const refreshImages = async () => {
    const data = await adminProductService.getImages(productId);

    if (!Array.isArray(data)) {
      throw new Error("Invalid image response.");
    }

    setImages(data);

    return data;
  };

  // ==========================================
  // NORMAL IMAGE FILE SELECTION
  // ==========================================

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;

    event.target.value = "";

    setError("");
    setMessage("");

    if (!file) return;

    const validationError = validateImageFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    if (atLimit) {
      setError(
        "Maximum 1 primary + 4 gallery images allowed. Delete an image first."
      );
      return;
    }

    setSelectedFile(file);
  };

  // ==========================================
  // UPLOAD NORMAL PRODUCT IMAGE
  // ==========================================

  const handleUpload = async () => {
    if (!selectedFile || isBusy || atLimit) return;

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const current = await adminProductService.getImages(
        productId
      );

      if (!Array.isArray(current)) {
        throw new Error("Invalid image response.");
      }

      const currentNormalImages = current.filter(
        (image) => image.variantId == null
      );

      if (currentNormalImages.length >= MAX_NORMAL_IMAGES) {
        setImages(current);

        throw new Error(
          "Image limit reached. Delete a normal product image before uploading another."
        );
      }

      await adminProductService.uploadImage(
        productId,
        selectedFile
      );

      setSelectedFile(null);

      await refreshImages();

      setMessage("Product image uploaded successfully.");
    } catch (err) {
      setError(err.message || "Image upload failed.");
    } finally {
      setBusy(false);
    }
  };

  // ==========================================
  // SET PRIMARY IMAGE
  // ==========================================

  const handleSetPrimary = async (imageId) => {
    if (isBusy) return;

    setBusy(true);
    setError("");
    setMessage("");

    try {
      await adminProductService.setPrimaryImage(
        productId,
        imageId
      );

      await refreshImages();

      setMessage("Primary image updated successfully.");
    } catch (err) {
      setError(
        err.message || "Unable to set primary image."
      );
    } finally {
      setBusy(false);
    }
  };

  // ==========================================
  // DELETE NORMAL PRODUCT IMAGE
  // ==========================================

  const handleDelete = async (imageId) => {
    if (isBusy) return;

    const confirmed = window.confirm(
      "Delete this product image? This will also request deletion from Cloudinary."
    );

    if (!confirmed) return;

    setBusy(true);
    setError("");
    setMessage("");

    try {
      await adminProductService.deleteImage(
        productId,
        imageId
      );

      await refreshImages();

      setMessage(
        "Image deleted. Upload a new image to replace it."
      );
    } catch (err) {
      setError(err.message || "Unable to delete image.");
    } finally {
      setBusy(false);
    }
  };

  // ==========================================
  // VARIANT IMAGE UPLOAD / REPLACE
  // ==========================================

  const handleVariantImageUpload = async (
    variantId,
    file
  ) => {
    if (!file || isBusy) return;

    const validationError = validateImageFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    setBusyVariantId(variantId);
    setError("");
    setMessage("");

    try {
      /*
       * Existing API:
       *
       * POST /api/v1/admin/products/{productId}/images
       *
       * FormData:
       * file = selected image
       * variantId = selected variant
       *
       * Backend replaces existing image for this variant.
       */

      await adminProductService.uploadImage(
        productId,
        file,
        variantId
      );

      await refreshImages();

      setMessage(
        "Variant image uploaded successfully."
      );
    } catch (err) {
      setError(
        err.message || "Variant image upload failed."
      );
    } finally {
      setBusyVariantId(null);
    }
  };

  // ==========================================
  // DELETE VARIANT IMAGE
  // ==========================================

  const handleDeleteVariantImage = async (
    imageId,
    variantId
  ) => {
    if (isBusy) return;

    const confirmed = window.confirm(
      "Delete this variant image?"
    );

    if (!confirmed) return;

    setBusyVariantId(variantId);
    setError("");
    setMessage("");

    try {
      await adminProductService.deleteImage(
        productId,
        imageId
      );

      await refreshImages();

      setMessage("Variant image deleted successfully.");
    } catch (err) {
      setError(
        err.message || "Unable to delete variant image."
      );
    } finally {
      setBusyVariantId(null);
    }
  };

  // ==========================================
  // NORMAL IMAGE CARD
  // ==========================================

  const renderImage = (image) => (
    <div
      key={image.id}
      className="rounded-xl border border-gray-200 p-3"
    >
      <img
        src={image.imageUrl}
        alt={`Product image ${image.id}`}
        className="h-36 w-full rounded-lg bg-gray-100 object-cover"
      />

      <p
        className={`mt-3 text-xs font-semibold ${
          image.primary
            ? "text-green-700"
            : "text-gray-600"
        }`}
      >
        {image.primary
          ? "Primary Image"
          : "Gallery Image"}
      </p>

      {!image.primary && (
        <button
          type="button"
          disabled={isBusy}
          onClick={() => handleSetPrimary(image.id)}
          className="mt-2 block text-xs font-semibold text-[#075e4d] disabled:opacity-50"
        >
          Set as Primary
        </button>
      )}

      <button
        type="button"
        disabled={isBusy}
        onClick={() => handleDelete(image.id)}
        className="mt-3 block text-xs font-semibold text-red-600 disabled:opacity-50"
      >
        Delete / Replace Image
      </button>
    </div>
  );

  // ==========================================
  // VARIANT IMAGE CARD
  // ==========================================

  const renderVariantImage = (variant) => {
    const variantId = variant.id;

    const image = variantImages.find(
      (item) =>
        String(item.variantId) === String(variantId)
    );

    const uploading = busyVariantId === variantId;

    return (
      <div
        key={variantId}
        className="rounded-xl border border-gray-200 bg-[#FAFAF8] p-4"
      >
        <div className="mb-3">
          <h4 className="text-sm font-bold text-[#243A34]">
            {getVariantLabel(variant)}
          </h4>

          {variant.sku && (
            <p className="mt-1 text-xs text-gray-500">
              SKU: {variant.sku}
            </p>
          )}
        </div>

        {image ? (
          <img
            src={image.imageUrl}
            alt={`${getVariantLabel(variant)} variant`}
            className="h-40 w-full rounded-lg border border-gray-200 bg-white object-contain"
          />
        ) : (
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white">
            <p className="text-center text-xs text-gray-400">
              No variant image uploaded
            </p>
          </div>
        )}

        <p className="mt-3 text-xs font-medium text-gray-600">
          {image
            ? "Variant image available"
            : "Upload one image for this variant"}
        </p>

        <label className="mt-3 block">
          <span className="mb-2 block text-xs font-semibold text-[#075e4d]">
            {uploading
              ? "Uploading..."
              : image
              ? "Replace Image"
              : "Upload Image"}
          </span>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={loading || isBusy}
            onChange={(event) => {
              const file =
                event.target.files?.[0] || null;

              event.target.value = "";

              if (file) {
                handleVariantImageUpload(
                  variantId,
                  file
                );
              }
            }}
            className="block w-full text-xs text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#E7F3EE] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#075e4d] disabled:opacity-50"
          />
        </label>

        {image && (
          <button
            type="button"
            disabled={isBusy}
            onClick={() =>
              handleDeleteVariantImage(
                image.id,
                variantId
              )
            }
            className="mt-3 text-xs font-semibold text-red-600 disabled:opacity-50"
          >
            Delete Variant Image
          </button>
        )}
      </div>
    );
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <section className="mt-7 rounded-2xl border border-[#E8E3D8] bg-white p-6 md:p-8">
      <h2 className="text-lg font-bold text-[#243A34]">
        Product Images
      </h2>

      <p className="mb-5 mt-1 text-sm text-gray-500">
        One primary image + up to four gallery images
        per product.
      </p>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {message && (
        <div
          role="status"
          className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-700"
        >
          {message}
        </div>
      )}

      {/* ======================================
          NORMAL PRODUCT IMAGE UPLOAD
      ====================================== */}

      <div className="rounded-xl border border-dashed border-gray-300 p-5">
        <label
          htmlFor={`product-image-${productId}`}
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Select Product Image
        </label>

        <input
          id={`product-image-${productId}`}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={isBusy || loading || atLimit}
          className="block w-full text-sm"
        />

        <p className="mt-2 text-xs text-gray-500">
          Gallery: {galleryImages.length}/
          {MAX_GALLERY_IMAGES}
          {" • "}
          Total: {normalImages.length}/
          {MAX_NORMAL_IMAGES}
          {" • "}
          Maximum 5 MB each
        </p>

        {preview && (
          <img
            src={preview}
            alt="Selected product preview"
            className="mt-4 h-40 w-40 rounded-xl border object-cover"
          />
        )}

        <button
          type="button"
          onClick={handleUpload}
          disabled={
            !selectedFile ||
            isBusy ||
            loading ||
            atLimit
          }
          className="mt-4 rounded-xl bg-[#075e4d] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Please wait..." : "Upload Image"}
        </button>

        {atLimit && (
          <p className="mt-2 text-xs text-amber-800">
            Limit reached. Delete an existing image
            to add another.
          </p>
        )}
      </div>

      {/* ======================================
          PRIMARY AND GALLERY IMAGES
      ====================================== */}

      {loading ? (
        <p className="mt-6 text-sm text-gray-500">
          Loading images...
        </p>
      ) : (
        <>
          <h3 className="mb-3 mt-7 text-sm font-bold text-[#243A34]">
            Primary Image
          </h3>

          {primaryImage ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {renderImage(primaryImage)}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No primary image set.
            </p>
          )}

          <h3 className="mb-3 mt-7 text-sm font-bold text-[#243A34]">
            Gallery Images ({galleryImages.length}/4)
          </h3>

          {galleryImages.length ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {galleryImages.map(renderImage)}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No gallery images uploaded yet.
            </p>
          )}

          {/* ======================================
              VARIANT-WISE IMAGE MANAGEMENT
          ====================================== */}

          <div className="mt-10 border-t border-gray-200 pt-7">
            <h3 className="text-lg font-bold text-[#243A34]">
              Variant Images
            </h3>

            <p className="mb-5 mt-1 text-sm text-gray-500">
              Upload one image for each product size.
              Replacing a variant image will not
              affect the primary or gallery images.
            </p>

            {variants.length === 0 ? (
              <p className="text-sm text-gray-500">
                No product variants found.
                Add product variants first.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {variants.map(renderVariantImage)}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}