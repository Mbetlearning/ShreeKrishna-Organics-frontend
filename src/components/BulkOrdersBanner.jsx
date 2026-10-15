import React, { useEffect, useState } from "react";
import {
  Leaf,
  Handshake,
  Tags,
  ShieldCheck,
  Phone,
  MessageCircle,
  ArrowRight,
  Sprout,
  PackageCheck,
} from "lucide-react";

const PHONE = "9011087310";
const WHATSAPP_MESSAGE =
  "Hello ShreeKrishna Organics, I am interested in Bulk Orders, Reselling or White Labelling. Please share more details.";
const WHATSAPP_LINK = `https://wa.me/91${PHONE}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

const benefits = [
  { icon: Leaf, title: "Premium", subtitle: "Quality Products" },
  { icon: Handshake, title: "Reliable", subtitle: "Supply" },
  { icon: Tags, title: "Competitive", subtitle: "Pricing" },
  { icon: ShieldCheck, title: "Custom Branding", subtitle: "& Packaging" },
];

const animatedHeading =
  "inline-block bg-gradient-to-r from-[#075e4d] via-[#e9ad28] to-[#075e4d] bg-[length:200%_100%] bg-clip-text text-transparent motion-safe:animate-[bulkGradient_5s_ease-in-out_infinite]";

export default function BulkOrdersBanner() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      // New card enters from the left and existing cards move right.
      setActive((current) => (current + benefits.length - 1) % benefits.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <section
      aria-label="Bulk orders, reselling and white labelling"
      className="w-full bg-white px-4 py-8 sm:px-6 lg:px-8"
    >
      <style>{`@keyframes bulkGradient { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }`}</style>
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-[#f0dfbf] bg-gradient-to-br from-[#fff8e9] via-[#fffaf1] to-[#f0f5e5] shadow-[0_8px_30px_rgba(75,60,30,0.12)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-12 -top-12 h-44 w-44 rounded-full bg-[#dcecc7]/50 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -right-10 h-52 w-52 rounded-full bg-[#d5e6b6]/50 blur-3xl"
        />
        <div className="relative px-5 py-9 text-center sm:px-9 sm:py-11 lg:px-12 lg:py-12">
          <div className="mb-4 flex items-center justify-center gap-2 text-[#009c78]">
            <Sprout size={26} aria-hidden="true" />
            <span className="text-xs font-extrabold uppercase tracking-wider sm:text-base">
              Grow Your Business With
            </span>
          </div>
          <h2 className="mx-auto max-w-4xl font-serif text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            <span className={animatedHeading}>Bulk Orders</span>
            <span className="mx-2 text-[#f47a18] sm:mx-4" aria-hidden="true">
              |
            </span>
            <span className={animatedHeading}>Reselling</span>
            <span className="mt-1 block bg-gradient-to-r from-[#075e4d] via-[#e9ad28] to-[#075e4d] bg-[length:200%_100%] bg-clip-text text-transparent motion-safe:animate-[bulkGradient_5s_ease-in-out_infinite]">
              White Labelling
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            Partner with ShreeKrishna Organics and bring the purity and goodness
            of our products to your customers.
          </p>
          {/* Three visible cards on desktop, sliding from left to right. */}
          <div
            className="mx-auto mt-8 max-w-5xl overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget))
                setPaused(false);
            }}
            aria-label="Business benefits carousel"
          >
            <div className="relative h-[150px] sm:h-[155px]">
              {benefits.map(({ icon: Icon, title, subtitle }, index) => {
                const slot =
                  (index - active + benefits.length) % benefits.length;
                const position = slot === 3 ? -1 : slot;
                return (
                  <div
                    key={title}
                    aria-hidden={slot === 3}
                    className="absolute top-0 h-full w-full px-1.5 transition-[transform,opacity] duration-700 ease-in-out sm:w-1/2 lg:w-1/3"
                    style={{
                      transform: `translateX(${position * 100}%)`,
                      opacity: slot === 3 ? 0 : 1,
                      zIndex: slot === 3 ? 0 : 1,
                    }}
                  >
                    <div className="group flex h-full flex-col items-center justify-center rounded-2xl border border-[#e9eadb] bg-white/85 px-3 py-4 shadow-sm transition-shadow hover:shadow-lg">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#e0f0df] transition-transform group-hover:scale-110">
                        <Icon
                          size={23}
                          className="text-[#08765b]"
                          aria-hidden="true"
                        />
                      </div>
                      <h3 className="text-sm font-bold text-[#075e4d]">
                        {title}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-[#075e4d]">
                        {subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              className="mt-3 flex justify-center gap-2"
              aria-label="Carousel navigation"
            >
              {benefits.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  aria-label={`Show ${item.title}`}
                  aria-current={active === index ? "true" : undefined}
                  onClick={() => setActive(index)}
                  className={`h-2 rounded-full transition-all ${active === index ? "w-6 bg-[#075e4d]" : "w-2 bg-[#c7d8c3]"}`}
                />
              ))}
            </div>
          </div>
          <div className="mx-auto mt-9 max-w-4xl border-t border-[#e7ddc8] pt-8 sm:mt-10 sm:pt-9">
            <h3 className="font-serif text-3xl font-bold italic text-[#075e4d] sm:text-4xl">
              Let's Grow Together
            </h3>
            <div
              aria-hidden="true"
              className="mx-auto mt-3 h-1 w-36 -rotate-2 rounded-full bg-[#f47a18]"
            />
            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-gray-600 sm:text-base">
              For Bulk Orders, Reselling or White Labelling Enquiries, get in
              touch with us today!
            </p>
            <div className="mx-auto mt-7 flex max-w-4xl flex-col justify-center gap-4 lg:flex-row lg:gap-5">
              <a
                href={`tel:+91${PHONE}`}
                aria-label={`Call ShreeKrishna Organics at +91 ${PHONE}`}
                className="group flex min-h-[72px] min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-[#005744] px-3 py-4 text-white shadow-lg transition-all duration-300 sm:gap-3 sm:px-5 hover:-translate-y-1 hover:bg-[#003f32] hover:shadow-xl focus-visible:outline focus-visible:outline-4 focus-visible:outline-orange-500 active:scale-95"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#075e4d] sm:h-10 sm:w-10">
                  <Phone size={24} strokeWidth={2.5} aria-hidden="true" />
                </span>
                <span className="flex min-w-0 items-center gap-2 whitespace-nowrap font-sans text-[clamp(11px,3.5vw,20px)] font-bold leading-tight sm:gap-3">
                  <span className="shrink-0">Call Us</span>
                  <span className="shrink-0 tabular-nums">+91 {PHONE}</span>
                </span>
                <ArrowRight
                  size={24}
                  className="ml-auto hidden shrink-0 transition-transform xl:block group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact ShreeKrishna Organics on WhatsApp"
                className="group flex min-h-[72px] min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-[#08a52d] px-3 py-4 text-white shadow-lg transition-all duration-300 sm:gap-3 sm:px-5 hover:-translate-y-1 hover:bg-[#078626] hover:shadow-xl focus-visible:outline focus-visible:outline-4 focus-visible:outline-orange-500 active:scale-95"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#079c39] sm:h-10 sm:w-10">
                  <MessageCircle
                    size={24}
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                </span>
                <span className="flex min-w-0 items-center gap-2 whitespace-nowrap font-sans text-[clamp(11px,3.5vw,20px)] font-bold leading-tight sm:gap-3">
                  <span className="shrink-0">WhatsApp Us</span>
                  <span className="shrink-0 tabular-nums">+91 {PHONE}</span>
                </span>
                <ArrowRight
                  size={24}
                  className="ml-auto hidden shrink-0 transition-transform xl:block group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#08765b]">
              <PackageCheck size={17} aria-hidden="true" />
              <span>Business Enquiries Welcome</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
