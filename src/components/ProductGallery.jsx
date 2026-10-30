import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1').replace(/\/+$/, '');
const DESKTOP_COUNT = 3;
const ANIMATION_MS = 650;

export default function ProductGallery({ productId }) {
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [index, setIndex] = useState(DESKTOP_COUNT);
  const [animated, setAnimated] = useState(true);
  const [paused, setPaused] = useState(false);
  const moving = useRef(false);
  const timer = useRef(null);

  useEffect(() => {
    setImages([]);
    setSelected(null);
    setIndex(DESKTOP_COUNT);
    setAnimated(true);
    setError('');
    moving.current = false;
    if (!productId) return undefined;
    const controller = new AbortController();
    fetch(`${API_BASE}/products/${encodeURIComponent(productId)}/images`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Gallery could not load (${response.status}).`);
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Invalid gallery response.');
        if (!controller.signal.aborted) {
          setImages(data
            .filter((image) => image?.imageUrl && image.variantId == null && !image.primary)
            .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
            .slice(0, 4));
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError' && !controller.signal.aborted) {
          setError(err.message || 'Gallery could not load.');
        }
      });
    return () => controller.abort();
  }, [productId]);

  const move = useCallback((step) => {
    if (images.length < 2 || moving.current) return;
    moving.current = true;
    setAnimated(true);
    setIndex((current) => current + step);
  }, [images.length]);

  const onTransitionEnd = (event) => {
    if (event.target !== event.currentTarget || event.propertyName !== 'transform') return;
    // Jump invisibly from a cloned image back to its matching real image.
    if (index >= DESKTOP_COUNT + images.length) {
      setAnimated(false);
      setIndex(DESKTOP_COUNT);
    } else if (index < DESKTOP_COUNT) {
      setAnimated(false);
      setIndex(DESKTOP_COUNT + images.length - 1);
    }
    moving.current = false;
  };

  useEffect(() => {
    if (!animated) {
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimated(true));
      });
      return () => cancelAnimationFrame(frame);
    }
    return undefined;
  }, [animated]);

  useEffect(() => {
    if (paused || selected !== null || images.length < 2) return undefined;
    timer.current = window.setInterval(() => move(1), 4000);
    return () => window.clearInterval(timer.current);
  }, [paused, selected, images.length, move]);

  useEffect(() => {
    if (selected === null || images.length === 0) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setSelected(null);
      if (event.key === 'ArrowRight') setSelected((current) => (current + 1) % images.length);
      if (event.key === 'ArrowLeft') setSelected((current) => (current - 1 + images.length) % images.length);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selected, images.length]);

  if (error) return <p role="alert" className="mb-8 text-xs text-red-600">{error}</p>;
  if (images.length === 0) return null;

  const count = images.length;
  const looped = count > 1
    ? [...Array.from({ length: DESKTOP_COUNT }, (_, i) => images[(count - DESKTOP_COUNT + i + count) % count]),
       ...images,
       ...Array.from({ length: DESKTOP_COUNT }, (_, i) => images[i % count])]
    : images;
  const position = count > 1 ? ((index - DESKTOP_COUNT) % count + count) % count : 0;

  return (
    <section aria-label="Product gallery"
      className="mb-12 rounded-3xl border border-[#E8DFD3] bg-[#FFF4DE] p-6 shadow-subtle sm:p-10"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
      <style>{`
        .sko-gallery-track { display: flex; transform: translateX(calc(-1 * var(--gallery-index) * 100%)); }
        .sko-gallery-slot { flex: 0 0 100%; min-width: 0; padding: 0 8px; }
        @media (min-width: 640px) {
          .sko-gallery-track { transform: translateX(calc(-1 * var(--gallery-index) * 33.333333%)); }
          .sko-gallery-slot { flex-basis: 33.333333%; }
        }
        @media (prefers-reduced-motion: reduce) { .sko-gallery-track { transition: none !important; } }
      `}</style>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-[#B5563C]">The ShreeKrishna Way</p>
          <h2 className="font-serif text-2xl font-bold text-[#874317] sm:text-3xl">Product Gallery</h2>
          <p className="mt-2 text-sm text-stone-600">Explore more photos of this product.</p>
        </div>
        {count > 1 && (
          <div className="flex shrink-0 items-center gap-2">
            <button type="button" onClick={() => move(-1)} aria-label="Previous gallery photos"
              className="rounded-full border border-[#E6C8A4] bg-white p-2.5 text-[#874317] transition hover:bg-[#874317] hover:text-white focus-visible:outline-2 focus-visible:outline-[#075e4d]">
              <ChevronLeft size={20} />
            </button>
            <button type="button" onClick={() => move(1)} aria-label="Next gallery photos"
              className="rounded-full border border-[#E6C8A4] bg-white p-2.5 text-[#874317] transition hover:bg-[#874317] hover:text-white focus-visible:outline-2 focus-visible:outline-[#075e4d]">
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="overflow-hidden" aria-label="Gallery carousel">
        <div className="sko-gallery-track -mx-2"
          style={{ '--gallery-index': count > 1 ? index : 0,
            transition: animated && count > 1 ? `transform ${ANIMATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)` : 'none' }}
          onTransitionEnd={onTransitionEnd}>
          {looped.map((image, slot) => {
            const actualIndex = count > 1 ? (slot - DESKTOP_COUNT + count * 2) % count : slot;
            return (
              <div key={`${image.id ?? image.imageUrl}-${slot}`} className="sko-gallery-slot">
                <button type="button" onClick={() => setSelected(actualIndex)}
                  aria-label={`Enlarge gallery image ${actualIndex + 1}`}
                  className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#FAF6EF] shadow-sm transition-shadow duration-300 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-[#075e4d]">
                  <img src={image.imageUrl} alt={`Product gallery ${actualIndex + 1}`} loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <span className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent" />
                  <ZoomIn size={24} className="absolute bottom-3 right-3 rounded-lg bg-black/60 p-1 text-white" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-5 flex justify-center gap-2" aria-label="Gallery position">
          {images.map((image, dot) => (
            <button key={image.id ?? image.imageUrl} type="button"
              aria-label={`Show gallery image ${dot + 1}`}
              aria-current={position === dot ? 'true' : undefined}
              onClick={() => { if (!moving.current && position !== dot) { moving.current = true; setAnimated(true); setIndex(DESKTOP_COUNT + dot); } }}
              className={`h-2.5 rounded-full transition-all duration-300 ${position === dot ? 'w-8 bg-[#B5563C]' : 'w-2.5 bg-[#D8BA94] hover:bg-[#B5563C]/60'}`} />
          ))}
        </div>
      )}

      {selected !== null && images[selected] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          role="dialog" aria-modal="true" aria-label="Gallery image preview" onClick={() => setSelected(null)}>
          <button type="button" aria-label="Close gallery" onClick={() => setSelected(null)}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/20 p-3 text-white"><X size={24} /></button>
          {count > 1 && (
            <button type="button" aria-label="Previous gallery image"
              onClick={(event) => { event.stopPropagation(); setSelected((current) => (current - 1 + count) % count); }}
              className="absolute left-2 z-10 rounded-full bg-white/20 p-3 text-white sm:left-6"><ChevronLeft size={26} /></button>
          )}
          <img src={images[selected].imageUrl} alt={`Gallery image ${selected + 1}`}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[85vh] max-w-[80vw] rounded-xl object-contain" />
          {count > 1 && (
            <button type="button" aria-label="Next gallery image"
              onClick={(event) => { event.stopPropagation(); setSelected((current) => (current + 1) % count); }}
              className="absolute right-2 z-10 rounded-full bg-white/20 p-3 text-white sm:right-6"><ChevronRight size={26} /></button>
          )}
          <span className="absolute bottom-4 text-sm text-white">{selected + 1} / {count}</span>
        </div>
      )}
    </section>
  );
}
