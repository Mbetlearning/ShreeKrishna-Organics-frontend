import React, { useEffect, useState } from 'react';
import { adminProductService } from '../services/adminProductService';

const MAX_GALLERY_IMAGES = 4;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function ProductImageManager({ productId }) {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const primaryImage = images.find((image) => image.primary);
  const galleryImages = images.filter((image) => !image.primary);
  // The first uploaded image is designated primary by the existing backend, or
  // the admin can choose one using Set Primary. No new API is required.
  const atLimit = primaryImage ? galleryImages.length >= MAX_GALLERY_IMAGES : images.length >= MAX_GALLERY_IMAGES + 1;

  useEffect(() => {
    let active = true;
    setImages([]);
    setSelectedFile(null);
    setLoading(true);
    setError('');
    if (!productId) { setLoading(false); return undefined; }
    adminProductService.getImages(productId)
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Invalid image response.');
        if (active) setImages(data);
      })
      .catch((err) => { if (active) setError(err.message || 'Unable to load images.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [productId]);

  useEffect(() => {
    if (!selectedFile) { setPreview(''); return undefined; }
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const refreshImages = async () => {
    const data = await adminProductService.getImages(productId);
    if (!Array.isArray(data)) throw new Error('Invalid image response.');
    setImages(data);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    event.target.value = '';
    setError(''); setMessage('');
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return; }
    if (file.size > MAX_FILE_SIZE) { setError('Image size must not exceed 5 MB.'); return; }
    if (atLimit) { setError('Maximum 1 primary + 4 gallery images allowed. Delete an image first.'); return; }
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || busy || atLimit) return;
    setBusy(true); setError(''); setMessage('');
    try {
      // Recheck current count before upload to reduce stale-state mistakes.
      const current = await adminProductService.getImages(productId);
      if (!Array.isArray(current)) throw new Error('Invalid image response.');
      if (current.length >= MAX_GALLERY_IMAGES + 1) {
        setImages(current);
        throw new Error('Image limit reached. Delete an image before uploading another.');
      }
      await adminProductService.uploadImage(productId, selectedFile);
      setSelectedFile(null);
      await refreshImages();
      setMessage('Product image uploaded successfully.');
    } catch (err) { setError(err.message || 'Image upload failed.'); }
    finally { setBusy(false); }
  };

  const handleSetPrimary = async (imageId) => {
    if (busy) return;
    setBusy(true); setError(''); setMessage('');
    try {
      await adminProductService.setPrimaryImage(productId, imageId);
      await refreshImages();
      setMessage('Primary image updated successfully.');
    } catch (err) { setError(err.message || 'Unable to set primary image.'); }
    finally { setBusy(false); }
  };

  const handleDelete = async (imageId) => {
    if (busy || !window.confirm('Delete this product image? This will also request deletion from Cloudinary.')) return;
    setBusy(true); setError(''); setMessage('');
    try {
      await adminProductService.deleteImage(productId, imageId);
      await refreshImages();
      setMessage('Image deleted. Upload a new image to replace it.');
    } catch (err) { setError(err.message || 'Unable to delete image.'); }
    finally { setBusy(false); }
  };

  const renderImage = (image) => (
    <div key={image.id} className="rounded-xl border border-gray-200 p-3">
      <img src={image.imageUrl} alt={`Product image ${image.id}`} className="h-36 w-full rounded-lg bg-gray-100 object-cover" />
      <p className={`mt-3 text-xs font-semibold ${image.primary ? 'text-green-700' : 'text-gray-600'}`}>
        {image.primary ? 'Primary Image' : 'Gallery Image'}
      </p>
      {!image.primary && (
        <button type="button" disabled={busy} onClick={() => handleSetPrimary(image.id)}
          className="mt-2 block text-xs font-semibold text-[#075e4d] disabled:opacity-50">Set as Primary</button>
      )}
      <button type="button" disabled={busy} onClick={() => handleDelete(image.id)}
        className="mt-3 block text-xs font-semibold text-red-600 disabled:opacity-50">Delete / Replace Image</button>
    </div>
  );

  return (
    <section className="mt-7 rounded-2xl border border-[#E8E3D8] bg-white p-6 md:p-8">
      <h2 className="text-lg font-bold text-[#243A34]">Product Images</h2>
      <p className="mb-5 mt-1 text-sm text-gray-500">One primary image + up to four gallery images per product.</p>
      {error && <div role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {message && <div role="status" className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">{message}</div>}
      <div className="rounded-xl border border-dashed border-gray-300 p-5">
        <label htmlFor={`product-image-${productId}`} className="mb-2 block text-sm font-semibold text-gray-700">Select Product Image</label>
        <input id={`product-image-${productId}`} type="file" accept="image/*" onChange={handleFileChange}
          disabled={busy || loading || atLimit} className="block w-full text-sm" />
        <p className="mt-2 text-xs text-gray-500">Gallery: {galleryImages.length}/{MAX_GALLERY_IMAGES} • Total: {images.length}/5 • Maximum 5 MB each</p>
        {preview && <img src={preview} alt="Selected product preview" className="mt-4 h-40 w-40 rounded-xl border object-cover" />}
        <button type="button" onClick={handleUpload} disabled={!selectedFile || busy || loading || atLimit}
          className="mt-4 rounded-xl bg-[#075e4d] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
          {busy ? 'Please wait...' : 'Upload Image'}
        </button>
        {atLimit && <p className="mt-2 text-xs text-amber-800">Limit reached. Delete an existing image to add another.</p>}
      </div>
      {loading ? <p className="mt-6 text-sm text-gray-500">Loading images...</p> : (
        <>
          <h3 className="mb-3 mt-7 text-sm font-bold text-[#243A34]">Primary Image</h3>
          {primaryImage ? <div className="grid grid-cols-2 gap-4 md:grid-cols-3">{renderImage(primaryImage)}</div> :
            <p className="text-sm text-gray-500">No primary image set. Upload an image and use Set as Primary if needed.</p>}
          <h3 className="mb-3 mt-7 text-sm font-bold text-[#243A34]">Gallery Images ({galleryImages.length}/4)</h3>
          {galleryImages.length ? <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{galleryImages.map(renderImage)}</div> :
            <p className="text-sm text-gray-500">No gallery images uploaded yet.</p>}
        </>
      )}
    </section>
  );
}
