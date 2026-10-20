import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, Images } from 'lucide-react';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1').replace(/\/+$/, '');

export default function ProductGallery({ productId }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [position, setPosition] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const lock = useRef(false);
  const total = images.length;

  useEffect(() => {
    if (!productId) {
      setImages([]);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError('');
    setImages([]);
    setSelected(null);
    fetch(`${API_BASE}/products/${encodeURIComponent(productId)}/images`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Gallery could not load (${response.status}).`);
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Invalid gallery response.');
        setImages(data.filter((image) => image?.imageUrl && !image.primary).slice(0, 4));
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message || 'Gallery could not load.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [productId]);

  useEffect(() => {
    setAnimate(false);
    setPosition(total);
    lock.current = false;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    return () => cancelAnimationFrame(id);
  }, [total]);

  const move = (direction) => {
    if (total < 2 || lock.current) return;
    lock.current = true;
    setAnimate(true);
    setPosition((current) => current + direction);
  };

  useEffect(() => {
    if (paused || selected !== null || total < 2) return undefined;
    const id = window.setInterval(() => move(1), 4000);
    return () => window.clearInterval(id);
  }, [paused, selected, total]);

  const onSlideEnd = (event) => {
    if (event.target !== event.currentTarget || event.propertyName !== 'transform') return;
    if (position < total || position >= 2 * total) {
      setAnimate(false);
      setPosition(((position % total) + total) % total + total);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setAnimate(true);
        lock.current = false;
      }));
    } else {
      lock.current = false;
    }
  };

  useEffect(() => {
    if (selected === null) return undefined;
    const handleKey = (event) => {
      if (event.key === 'Escape') setSelected(null);
      if (event.key === 'ArrowRight') setSelected((current) => (current + 1) % total);
      if (event.key === 'ArrowLeft') setSelected((current) => (current - 1 + total) % total);
    };
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [selected, total]);

  if (!productId || (!loading && !error && total === 0)) return null;

  const repeated = [...images, ...images, ...images];
  const activeIndex = total ? ((position % total) + total) % total : 0;

  return (
    <section
      aria-label="Product gallery"
      className="mb-12 overflow-hidden rounded-3xl border-2 border-[#D7B78C] bg-gradient-to-br from-white via-[#FFF9EE] to-[#FFF1D8] p-5 shadow-[0_12px_36px_rgba(104,70,30,0.12)] sm:p-9"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#E9D5B7] pb-5">
        <div>
          <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#B5563C]">
            <Images size={16} /> Explore our product
          </p>
          <h2 className="font-serif text-2xl font-bold text-[#603719] sm:text-3xl">Product Gallery</h2>
          <p className="mt-2 text-sm text-stone-600">Swipe or use the arrows. Click an image to enlarge.</p>
        </div>
        {total > 1 && (
          <div className="flex gap-2">
            <button type="button" onClick={() => move(-1)} aria-label="Previous gallery image"
              className="rounded-full border border-[#D7B78C] bg-white p-3 text-[#75431F] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#F9E8CE] focus-visible:outline-2 focus-visible:outline-[#075e4d]">
              <ChevronLeft size={21} />
            </button>
            <button type="button" onClick={() => move(1)} aria-label="Next gallery image"
              className="rounded-full border border-[#D7B78C] bg-white p-3 text-[#75431F] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#F9E8CE] focus-visible:outline-2 focus-visible:outline-[#075e4d]">
              <ChevronRight size={21} />
            </button>
          </div>
        )}
      </div>

      {loading && <p className="py-12 text-center text-sm text-stone-500">Loading gallery...</p>}
      {error && <p role="alert" className="py-8 text-sm text-red-600">{error}</p>}
      {!loading && !error && total > 0 && (
        <>
          <style>{`
            .sko-gallery-track { --sko-visible: 1; }
            @media (min-width: 640px) { .sko-gallery-track { --sko-visible: 2; } }
            @media (min-width: 1024px) { .sko-gallery-track { --sko-visible: 3; } }
            @media (prefers-reduced-motion: reduce) { .sko-gallery-track { transition-duration: 0ms !important; } }
          `}</style>
          <div className="overflow-hidden rounded-2xl" onTouchStart={(event) => { event.currentTarget.dataset.touchX = String(event.touches[0].clientX); }}
            onTouchEnd={(event) => {
              const start = Number(event.currentTarget.dataset.touchX);
              const delta = event.changedTouches[0].clientX - start;
              if (Math.abs(delta) > 45) move(delta < 0 ? 1 : -1);
            }}>
            <div
              className="sko-gallery-track flex gap-4"
              onTransitionEnd={onSlideEnd}
              style={{
                transform: `translate3d(calc(-${position} * ((100% - (var(--sko-visible) - 1) * 16px) / var(--sko-visible) + 16px)), 0, 0)`,
                transition: animate ? 'transform 650ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
                willChange: 'transform',
              }}
            >
              {repeated.map((image, index) => (
                <button
                  key={`${image.id ?? image.imageUrl}-${index}`}
                  type="button"
                  onClick={() => setSelected(index % total)}
                  aria-label={`Open gallery image ${(index % total) + 1}`}
                  className="group relative aspect-[4/3] shrink-0 overflow-hidden rounded-2xl border-2 border-[#E7D3B7] bg-[#F6E9D6] shadow-sm transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-[#075e4d]"
                  style={{ width: 'calc((100% - (var(--sko-visible) - 1) * 16px) / var(--sko-visible))' }}
                >
                  <img src={image.imageUrl} alt={`Product gallery ${(index % total) + 1}`} loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute bottom-3 right-3 rounded-full bg-[#2B241D]/80 p-2.5 text-white shadow-md"><ZoomIn size={18} /></span>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2">
            {images.map((image, index) => (
              <button key={image.id ?? index} type="button"
                aria-label={`Go to gallery image ${index + 1}`}
                aria-current={activeIndex === index ? 'true' : undefined}
                onClick={() => { if (lock.current) return; setAnimate(true); setPosition(total + index); }}
                className={`h-2.5 rounded-full transition-all ${activeIndex === index ? 'w-8 bg-[#B5563C]' : 'w-2.5 bg-[#D9BB94] hover:bg-[#B98E59]'}`}
              />
            ))}
          </div>
        </>
      )}

      {selected !== null && images[selected] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          role="dialog" aria-modal="true" aria-label="Product image preview"
          onClick={() => setSelected(null)}>
          <button type="button" onClick={() => setSelected(null)} aria-label="Close gallery"
            className="absolute right-4 top-4 z-10 rounded-full bg-white/20 p-3 text-white hover:bg-white/30"><X size={24} /></button>
          {total > 1 && <button type="button" onClick={(event) => { event.stopPropagation(); setSelected((selected - 1 + total) % total); }}
            aria-label="Previous image" className="absolute left-2 z-10 rounded-full bg-white/20 p-3 text-white hover:bg-white/30 sm:left-6"><ChevronLeft size={28} /></button>}
          <img src={images[selected].imageUrl} alt={`Product gallery enlarged ${selected + 1}`}
            onClick={(event) => event.stopPropagation()} className="max-h-[85vh] max-w-[82vw] rounded-xl object-contain" />
          {total > 1 && <button type="button" onClick={(event) => { event.stopPropagation(); setSelected((selected + 1) % total); }}
            aria-label="Next image" className="absolute right-2 z-10 rounded-full bg-white/20 p-3 text-white hover:bg-white/30 sm:right-6"><ChevronRight size={28} /></button>}
          <span className="absolute bottom-4 text-sm text-white">{selected + 1} / {total}</span>
        </div>
      )}
    </section>
  );
}
