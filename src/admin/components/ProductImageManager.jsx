
import React, { useEffect, useState } from "react";
import { adminProductService } from "../services/adminProductService";

export default function ProductImageManager({ productId }) {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadImages() {
      setLoading(true);
      setError("");

      try {
        const data = await adminProductService.getImages(productId);

        if (!Array.isArray(data)) {
          throw new Error("Invalid image response.");
        }

        if (active) setImages(data);
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load images.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    if (productId) loadImages();

    return () => {
      active = false;
    };
  }, [productId]);

  useEffect(() => {
    if (!selectedFile) {
      setPreview("");
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const refreshImages = async () => {
    const data = await adminProductService.getImages(productId);

    if (!Array.isArray(data)) {
      throw new Error("Invalid image response.");
    }

    setImages(data);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    event.target.value = "";

    setError("");
    setMessage("");

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must not exceed 5 MB.");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || busy) return;

    setBusy(true);
    setError("");
    setMessage("");

    try {
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

  const handleSetPrimary = async (imageId) => {
    if (busy) return;

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
      setError(err.message || "Unable to set primary image.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (busy) return;

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
      setMessage("Product image deleted successfully.");
    } catch (err) {
      setError(err.message || "Unable to delete image.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-7 bg-white border border-[#E8E3D8] rounded-2xl p-6 md:p-8">
      <h2 className="text-lg font-bold text-[#243A34]">
        Product Images
      </h2>

      <p className="text-sm text-gray-500 mt-1 mb-5">
        Upload product photos and select the primary image.
      </p>

      {error && (
        <div role="alert" className="mb-4 bg-red-50 text-red-700 p-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {message && (
        <div role="status" className="mb-4 bg-green-50 text-green-700 p-3 rounded-xl text-sm">
          {message}
        </div>
      )}

      <div className="border border-dashed border-gray-300 rounded-xl p-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Product Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={busy}
          className="block w-full text-sm"
        />

        {preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="Selected product preview"
              className="w-40 h-40 object-cover rounded-xl border"
            />

            <p className="text-xs text-gray-500 mt-2">
              {selectedFile?.name}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleUpload}
          disabled={!selectedFile || busy}
          className="mt-4 bg-[#075e4d] text-white px-5 py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
        >
          {busy ? "Please wait..." : "Upload Image"}
        </button>
      </div>

      <h3 className="text-sm font-bold text-[#243A34] mt-7 mb-4">
        Uploaded Images ({images.length})
      </h3>

      {loading ? (
        <p className="text-sm text-gray-500">
          Loading images...
        </p>
      ) : images.length === 0 ? (
        <p className="text-sm text-gray-500">
          No product images uploaded yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="border border-gray-200 rounded-xl p-3"
            >
              <img
                src={image.imageUrl}
                alt={`Product image ${image.id}`}
                className="w-full h-36 object-cover rounded-lg bg-gray-100"
              />

              {image.primary ? (
                <p className="mt-3 text-xs font-semibold text-green-700">
                  Primary Image
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSetPrimary(image.id)}
                  disabled={busy}
                  className="mt-3 text-xs font-semibold text-[#075e4d] disabled:opacity-50"
                >
                  Set as Primary
                </button>
              )}

              <button
                type="button"
                onClick={() => handleDelete(image.id)}
                disabled={busy}
                className="block mt-3 text-xs font-semibold text-red-600 disabled:opacity-50"
              >
                Delete Image
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
