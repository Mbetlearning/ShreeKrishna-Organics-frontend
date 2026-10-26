import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1').replace(/\/+$/, '');

// Only normal gallery images appear here. Variant images belong to the main product image.
export default function ProductGallery({ productId }) {
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!productId) {
      setImages([]);
      setSelected(null);
      return undefined;
    }
    const controller = new AbortController();
    setImages([]);
    setSelected(null);
    setError('');
    fetch(`${API_BASE}/products/${encodeURIComponent(productId)}/images`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Gallery could not load (${response.status}).`);
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Invalid gallery response.');
        if (!controller.signal.aborted) {
          setImages(
            data.filter((image) => image?.imageUrl && image.variantId == null && !image.primary)
              .slice(0, 4)
          );
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message || 'Gallery could not load.');
      });
    return () => controller.abort();
  }, [productId]);

  useEffect(() => {
    if (selected === null) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setSelected(null);
      if (event.key === 'ArrowRight') setSelected((index) => (index + 1) % images.length);
      if (event.key === 'ArrowLeft') setSelected((index) => (index - 1 + images.length) % images.length);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selected, images.length]);

  if (error) return <p role="alert" className="text-xs text-red-600">{error}</p>;
  if (images.length === 0) return null;

  return (
    <div aria-label="Product gallery" className="pt-1">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-600">
        Product Gallery
      </p>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {images.map((image, index) => (
          <button
            key={image.id ?? image.imageUrl}
            type="button"
            onClick={() => setSelected(index)}
            aria-label={`Enlarge gallery image ${index + 1}`}
            className="group relative aspect-square overflow-hidden rounded-xl border border-[#E8DFD3] bg-[#FAF6EF] focus-visible:outline-2 focus-visible:outline-[#075e4d]"
          >
            <img
              src={image.imageUrl}
              alt={`Product gallery ${index + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <ZoomIn size={16} className="absolute bottom-2 right-2 rounded bg-black/60 p-0.5 text-white" />
          </button>
        ))}
      </div>

      {selected !== null && images[selected] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image preview"
          onClick={() => setSelected(null)}
        >
          <button type="button" aria-label="Close gallery" onClick={() => setSelected(null)}
            className="absolute right-4 top-4 rounded-full bg-white/20 p-3 text-white">
            <X size={24} />
          </button>
          {images.length > 1 && (
            <button type="button" aria-label="Previous gallery image"
              onClick={(event) => { event.stopPropagation(); setSelected((selected - 1 + images.length) % images.length); }}
              className="absolute left-2 z-10 rounded-full bg-white/20 p-3 text-white sm:left-6">
              <ChevronLeft size={26} />
            </button>
          )}
          <img src={images[selected].imageUrl} alt={`Gallery image ${selected + 1}`}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[85vh] max-w-[80vw] rounded-xl object-contain" />
          {images.length > 1 && (
            <button type="button" aria-label="Next gallery image"
              onClick={(event) => { event.stopPropagation(); setSelected((selected + 1) % images.length); }}
              className="absolute right-2 z-10 rounded-full bg-white/20 p-3 text-white sm:right-6">
              <ChevronRight size={26} />
            </button>
          )}
          <span className="absolute bottom-4 text-sm text-white">{selected + 1} / {images.length}</span>
        </div>
      )}
    </div>
  );
}
