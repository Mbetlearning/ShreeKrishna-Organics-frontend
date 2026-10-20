import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    image: '/images/wood-pressed-oils-hero.png',
    title: 'Naturally Sourced',
    subtitle: 'Carefully Selected Ingredients',
    description: 'Rooted in nature and chosen with care.',
  },
  {
    id: 2,
    image: '/images/shreekrishna-ghee.png',
    title: 'Traditionally Prepared',
    subtitle: 'Preserving Natural Goodness',
    description: 'Inspired by time-honoured traditions.',
  },
  {
    id: 3,
    image: '/images/groundnut-oil.png',
    title: 'Pure & Authentic',
    subtitle: 'Quality You Can Trust',
    description: 'Simple ingredients for everyday cooking.',
  },
  {
    id: 4,
    image: '/images/sunflower-oil.png',
    title: 'Made with Care',
    subtitle: 'Tradition for Every Kitchen',
    description: 'Bringing natural goodness to your table.',
  },
];

export default function ProductIngredientsSlider({ slides = SLIDES }) {
  const total = slides.length;
  const [position, setPosition] = useState(total);
  const [animated, setAnimated] = useState(true);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  // Three copies let the track move smoothly across the first/last card.
  const repeatedSlides = [...slides, ...slides, ...slides];

  useEffect(() => {
    setAnimated(false);
    setPosition(total);
    const frame = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(frame);
  }, [total]);

  useEffect(() => {
    if (paused || total < 2) return;
    timerRef.current = window.setInterval(() => {
      setPosition((previous) => previous + 1);
    }, 4000);
    return () => window.clearInterval(timerRef.current);
  }, [paused, total]);

  const move = (direction) => {
    if (total < 2) return;
    setAnimated(true);
    setPosition((previous) => previous + direction);
  };

  const handleTransitionEnd = (event) => {
    if (event.target !== event.currentTarget || event.propertyName !== 'transform') return;
    if (position >= total * 2 || position < total) {
      setAnimated(false);
      setPosition(((position % total) + total) % total + total);
    }
  };

  // Re-enable animation after the invisible wrap-around jump has rendered.
  useEffect(() => {
    if (animated) return;
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimated(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [animated, position]);

  if (!total) return null;

  const activeIndex = ((position % total) + total) % total;

  return (
    <section
      className="my-12 rounded-3xl bg-[#FFF4DE] px-4 py-10 sm:px-8 sm:py-12"
      aria-label="ShreeKrishna Organics traditions and ingredients"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div className="mb-7 flex items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#B5563C]">
            The ShreeKrishna Way
          </p>
          <h2 className="font-serif text-2xl font-bold text-[#78451F] sm:text-3xl">
            Pure Ingredients. Pure Traditions.
          </h2>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => move(-1)} disabled={total < 2}
            aria-label="Previous slide"
            className="rounded-full border border-[#DCC5A4] bg-white p-2 text-[#78451F] transition hover:bg-[#F9E6C6] disabled:opacity-40">
            <ChevronLeft size={20} />
          </button>
          <button type="button" onClick={() => move(1)} disabled={total < 2}
            aria-label="Next slide"
            className="rounded-full border border-[#DCC5A4] bg-white p-2 text-[#78451F] transition hover:bg-[#F9E6C6] disabled:opacity-40">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* The entire row physically slides left/right, rather than swapping cards. */}
      <div
        className="overflow-hidden"
        style={{ '--visible-cards': 1, '--card-gap': '16px' }}
      >
        <style>{`
          .sko-slider-track { --visible-cards: 1; }
          @media (min-width: 640px) { .sko-slider-track { --visible-cards: 2; } }
          @media (min-width: 1024px) { .sko-slider-track { --visible-cards: 3; } }
        `}</style>
        <div
          className="sko-slider-track flex gap-4"
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translate3d(calc(-${position} * ((100% - (var(--visible-cards) - 1) * 16px) / var(--visible-cards) + 16px)), 0, 0)`,
            transition: animated ? 'transform 650ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
            willChange: 'transform',
          }}
        >
          {repeatedSlides.map((slide, index) => (
            <article
              key={`${slide.id}-${index}`}
              className="group relative h-[330px] shrink-0 overflow-hidden rounded-2xl bg-[#E9D9BD] shadow-md sm:h-[370px]"
              style={{
                width: 'calc((100% - (var(--visible-cards) - 1) * 16px) / var(--visible-cards))',
              }}
            >
              <img
                src={slide.image}
                alt={slide.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-200">
                  {slide.subtitle}
                </p>
                <h3 className="font-serif text-xl font-bold sm:text-2xl">{slide.title}</h3>
                <p className="mt-2 text-sm text-white/90">{slide.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2" aria-label="Slider position">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => { setAnimated(true); setPosition(total + index); }}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={activeIndex === index ? 'true' : undefined}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              activeIndex === index ? 'w-8 bg-[#B5563C]' : 'w-2.5 bg-[#D6B994] hover:bg-[#A87848]'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
