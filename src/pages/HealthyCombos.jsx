import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgePercent,
  Gift,
  Heart,
  Leaf,
  PackageCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { productService } from "../services/productService";

export default function HealthyCombos() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sliderRef = useRef(null);

  /* =========================================================
     LOAD COMBO PRODUCTS
  ========================================================= */

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const allProducts = await productService.getAllProducts({
          sortBy: "featured",
        });

        /*
          Combo products can currently be stored under
          category "other", so we identify them using
          category + name + slug + tagline.
        */

        const comboProducts = (allProducts || []).filter((product) => {
          const text = `
            ${product.name || ""}
            ${product.slug || ""}
            ${product.tagline || ""}
            ${product.shortDescription || ""}
            ${product.category || ""}
            ${product.categoryName || ""}
          `.toLowerCase();

          return (
            text.includes("combo") ||
            text.includes("bundle") ||
            text.includes("pack of") ||
            text.includes("value pack")
          );
        });

        if (active) {
          setProducts(comboProducts);
        }
      } catch (err) {
        console.error("Unable to load healthy combos:", err);

        if (active) {
          setProducts([]);
          setError("Unable to load combo products right now.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  /* =========================================================
     HORIZONTAL SCROLL
  ========================================================= */

  const scrollProducts = (direction) => {
    if (!sliderRef.current) return;

    const scrollAmount = 320;

    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#fffdf8]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffdf8]">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-gradient-to-br
          from-[#fff7dc]
          via-[#f6e7b6]
          to-[#e5efda]
        "
      >
        {/* BACKGROUND DECORATION */}

        <div
          className="
            absolute
            -top-40
            -left-32
            w-[480px]
            h-[480px]
            rounded-full
            bg-white/40
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-44
            -right-24
            w-[500px]
            h-[500px]
            rounded-full
            bg-[#87ad6d]/20
            blur-3xl
          "
        />

        <Gift
          className="
            absolute
            right-[7%]
            top-12
            w-44
            h-44
            text-[#856519]
            opacity-[0.05]
            rotate-12
          "
        />

        <div
          className="
            relative
            z-10
            max-w-7xl
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            py-14
            md:py-20
            lg:py-24
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-10
            lg:gap-16
            items-center
          "
        >
          {/* LEFT */}

          <div>
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-white/60
                border
                border-[#cba95a]/30
                px-4
                py-2
                backdrop-blur-sm
              "
            >
              <Sparkles className="w-4 h-4 text-[#a47318]" />

              <span
                className="
                  text-[11px]
                  sm:text-xs
                  font-bold
                  uppercase
                  tracking-[0.17em]
                  text-[#795819]
                "
              >
                Better Together
              </span>
            </div>

            <h1
              className="
                mt-6
                font-serif
                font-bold
                text-4xl
                sm:text-5xl
                lg:text-6xl
                leading-[1.06]
                text-[#173b32]
              "
            >
              Healthy
              <span className="block mt-1 text-[#a36e18]">
                Combos
              </span>
            </h1>

            <p
              className="
                mt-5
                max-w-xl
                text-sm
                sm:text-base
                lg:text-lg
                leading-7
                text-[#5f5744]
              "
            >
              Discover thoughtfully paired ShreeKrishna Organics products
              brought together in convenient combo packs for your kitchen
              and everyday needs.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">

              {[
                "Value Combos",
                "Kitchen Essentials",
                "Thoughtful Pairings",
              ].map((item) => (
                <span
                  key={item}
                  className="
                    rounded-full
                    bg-white/55
                    border
                    border-white/70
                    px-4
                    py-2
                    text-xs
                    sm:text-sm
                    font-semibold
                    text-[#554a31]
                  "
                >
                  ✓ {item}
                </span>
              ))}

            </div>

            <a
              href="#combo-products"
              className="
                mt-8
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#075e4d]
                hover:bg-[#064c3f]
                text-white
                px-6
                py-3
                text-sm
                font-bold
                shadow-lg
                transition-all
                duration-300
                hover:-translate-y-0.5
              "
            >
              Shop Combos

              <ArrowRight size={17} />
            </a>
          </div>

          {/* RIGHT VISUAL */}

          <div className="relative flex justify-center">

            <div
              className="
                absolute
                w-[320px]
                h-[320px]
                sm:w-[410px]
                sm:h-[410px]
                rounded-full
                bg-white/40
                blur-xl
              "
            />

            <div
              className="
                relative
                z-10
                w-[290px]
                h-[290px]
                sm:w-[390px]
                sm:h-[390px]
                lg:w-[420px]
                lg:h-[420px]
                rounded-[40px]
                bg-white/55
                border
                border-white/80
                shadow-[0_25px_60px_rgba(85,68,25,0.15)]
                p-7
                flex
                items-center
                justify-center
              "
            >
              {products[0]?.image ? (
                <img
                  src={products[0].image}
                  alt={products[0].name}
                  className="
                    w-full
                    h-full
                    object-cover
                    rounded-[30px]
                  "
                />
              ) : (
                <div className="text-[110px]">
                  🎁
                </div>
              )}
            </div>

            {/* FLOATING LABEL */}

            <div
              className="
                absolute
                z-20
                bottom-3
                left-0
                sm:left-6
                rounded-2xl
                bg-white
                border
                border-[#e8dfc9]
                shadow-xl
                px-4
                py-3
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-[#fff3cc]
                  flex
                  items-center
                  justify-center
                "
              >
                <Gift className="w-5 h-5 text-[#9a691a]" />
              </div>

              <div>
                <p className="text-xs font-bold text-[#173b32]">
                  Healthy Combos
                </p>

                <p className="text-[10px] text-stone-500">
                  More value together
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          BENEFIT STRIP
      ===================================================== */}

      <section className="bg-[#075e4d] text-white">

        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            py-5
            grid
            grid-cols-2
            md:grid-cols-4
            gap-4
          "
        >
          {[
            {
              icon: Gift,
              title: "Smart Combos",
              text: "Useful Pairings",
            },
            {
              icon: BadgePercent,
              title: "Better Value",
              text: "Combo Packs",
            },
            {
              icon: Leaf,
              title: "Everyday",
              text: "Essentials",
            },
            {
              icon: PackageCheck,
              title: "Convenient",
              text: "Shopping",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="
                  flex
                  items-center
                  justify-center
                  gap-3
                  py-2
                "
              >
                <div
                  className="
                    w-10
                    h-10
                    rounded-full
                    bg-white/10
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >
                  <Icon className="w-5 h-5 text-[#efd27b]" />
                </div>

                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#efd27b]">
                    {item.title}
                  </p>

                  <p className="text-[10px] sm:text-xs text-white/70">
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}

        </div>
      </section>

      {/* =====================================================
          HEALTHY COMBOS PRODUCTS
      ===================================================== */}

      <section
        id="combo-products"
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-14
          md:py-20
          scroll-mt-32
        "
      >

        {/* SECTION HEADING */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-end
            justify-between
            gap-5
          "
        >
          <div>

            <div className="flex items-center gap-2">

              <Gift className="w-4 h-4 text-[#a36e18]" />

              <span
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-[#a36e18]
                "
              >
                Combo Collection
              </span>

            </div>

            <h2
              className="
                mt-2
                font-serif
                font-bold
                text-3xl
                sm:text-4xl
                text-[#173b32]
              "
            >
              Healthy Combos
            </h2>

            <p className="mt-3 text-sm text-stone-500 max-w-xl leading-6">
              Shop convenient combinations of your favourite
              ShreeKrishna Organics products.
            </p>

          </div>

          {/* DESKTOP SLIDER BUTTONS */}

          {products.length > 1 && (
            <div className="hidden sm:flex items-center gap-2">

              <button
                type="button"
                onClick={() => scrollProducts("left")}
                className="
                  w-11
                  h-11
                  rounded-full
                  border
                  border-[#dcd5c7]
                  bg-white
                  text-[#075e4d]
                  flex
                  items-center
                  justify-center
                  shadow-sm
                  hover:bg-[#075e4d]
                  hover:text-white
                  transition
                "
                aria-label="Previous products"
              >
                <ArrowLeft size={18} />
              </button>

              <button
                type="button"
                onClick={() => scrollProducts("right")}
                className="
                  w-11
                  h-11
                  rounded-full
                  bg-[#075e4d]
                  text-white
                  flex
                  items-center
                  justify-center
                  shadow-sm
                  hover:bg-[#064c3f]
                  transition
                "
                aria-label="Next products"
              >
                <ArrowRight size={18} />
              </button>

            </div>
          )}

        </div>

        {/* ERROR */}

        {error && (
          <div
            className="
              mt-8
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-600
            "
          >
            {error}
          </div>
        )}

        {/* =================================================
            HORIZONTAL PRODUCT CARDS
        ================================================= */}

        {products.length > 0 ? (
          <div
            ref={sliderRef}
            className="
              mt-9
              flex
              gap-4
              sm:gap-5
              overflow-x-auto
              scroll-smooth
              snap-x
              snap-mandatory
              pb-5

              [&::-webkit-scrollbar]:h-[6px]

              [&::-webkit-scrollbar-track]:bg-[#f1ede5]

              [&::-webkit-scrollbar-thumb]:bg-[#c9bda9]

              [&::-webkit-scrollbar-thumb]:rounded-full
            "
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="
                  flex-none
                  w-[270px]
                  sm:w-[290px]
                  lg:w-[300px]
                  snap-start
                "
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          !error && (
            <div
              className="
                mt-10
                rounded-3xl
                border
                border-[#e7dfcf]
                bg-[#faf6ed]
                px-5
                py-16
                text-center
              "
            >
              <div className="text-6xl">
                🎁
              </div>

              <h3
                className="
                  mt-5
                  font-serif
                  text-2xl
                  font-bold
                  text-[#173b32]
                "
              >
                Healthy Combos Coming Soon
              </h3>

              <p className="mt-2 text-sm text-stone-500">
                New combo packs will appear here automatically.
              </p>

            </div>
          )
        )}

      </section>

      {/* =====================================================
          BUILD YOUR HEALTHY KITCHEN
      ===================================================== */}

      <section
        className="
          bg-[#f5f2e7]
          border-y
          border-[#e7e0d0]
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            py-14
            md:py-20
          "
        >

          <div className="text-center max-w-2xl mx-auto">

            <span
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.18em]
                text-[#99701f]
              "
            >
              Everyday Essentials
            </span>

            <h2
              className="
                mt-3
                font-serif
                font-bold
                text-3xl
                sm:text-4xl
                text-[#173b32]
              "
            >
              More Together
            </h2>

            <p
              className="
                mt-4
                text-sm
                sm:text-base
                leading-7
                text-stone-500
              "
            >
              Explore combinations across our traditional product
              collections.
            </p>

          </div>

          <div
            className="
              mt-10
              grid
              grid-cols-1
              md:grid-cols-3
              gap-5
            "
          >

            {/* OILS */}

            <Link
              to="/wood-pressed-oils"
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                bg-[#eaf2df]
                border
                border-[#d9e3ce]
                p-7
                min-h-[230px]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
              "
            >
              <div className="text-5xl">
                🫙
              </div>

              <h3
                className="
                  mt-6
                  font-serif
                  text-2xl
                  font-bold
                  text-[#173b32]
                "
              >
                Wood-Pressed Oils
              </h3>

              <p className="mt-2 text-sm text-stone-500">
                Explore our traditional oil collection.
              </p>

              <span
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  font-bold
                  text-[#075e4d]
                "
              >
                Explore

                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition"
                />
              </span>

            </Link>

            {/* GHEE */}

            <Link
              to="/a2-ghee"
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                bg-[#fff1c9]
                border
                border-[#ead6a0]
                p-7
                min-h-[230px]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
              "
            >
              <div className="text-5xl">
                🐄
              </div>

              <h3
                className="
                  mt-6
                  font-serif
                  text-2xl
                  font-bold
                  text-[#173b32]
                "
              >
                A2 Ghee
              </h3>

              <p className="mt-2 text-sm text-stone-500">
                Discover traditional A2 Bilona Ghee.
              </p>

              <span
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  font-bold
                  text-[#8c6119]
                "
              >
                Explore

                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition"
                />
              </span>

            </Link>

            {/* JAGGERY */}

            <Link
              to="/jaggery"
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                bg-[#f5e2ca]
                border
                border-[#e5ccb0]
                p-7
                min-h-[230px]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
              "
            >
              <div className="text-5xl">
                🍯
              </div>

              <h3
                className="
                  mt-6
                  font-serif
                  text-2xl
                  font-bold
                  text-[#173b32]
                "
              >
                Jaggery
              </h3>

              <p className="mt-2 text-sm text-stone-500">
                Explore our traditional jaggery collection.
              </p>

              <span
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  font-bold
                  text-[#8a5326]
                "
              >
                Explore

                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition"
                />
              </span>

            </Link>

          </div>

        </div>
      </section>

      {/* =====================================================
          WHY HEALTHY COMBOS
      ===================================================== */}

      <section className="bg-[#075e4d] text-white">

        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            py-14
            md:py-20
          "
        >

          <div className="text-center max-w-2xl mx-auto">

            <span
              className="
                text-[#efd27b]
                text-xs
                font-bold
                uppercase
                tracking-[0.18em]
              "
            >
              ShreeKrishna Organics
            </span>

            <h2
              className="
                mt-3
                font-serif
                font-bold
                text-3xl
                sm:text-4xl
              "
            >
              Why Choose Our Combos?
            </h2>

          </div>

          <div
            className="
              mt-10
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-5
            "
          >

            {[
              {
                emoji: "🎁",
                title: "Thoughtful Pairings",
                text: "Useful products grouped together for convenient shopping.",
              },
              {
                emoji: "💰",
                title: "Value Packs",
                text: "Discover multiple everyday essentials in one combination.",
              },
              {
                emoji: "🌿",
                title: "Traditional Range",
                text: "Explore products across our traditional food collection.",
              },
              {
                emoji: "🏡",
                title: "Kitchen Essentials",
                text: "Convenient combinations designed for everyday households.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="
                  rounded-2xl
                  border
                  border-white/15
                  bg-white/[0.06]
                  p-6
                "
              >
                <div
                  className="
                    w-12
                    h-12
                    rounded-xl
                    bg-[#efd27b]/15
                    flex
                    items-center
                    justify-center
                    text-2xl
                  "
                >
                  {item.emoji}
                </div>

                <h3
                  className="
                    mt-4
                    font-serif
                    font-bold
                    text-lg
                    text-[#efd27b]
                  "
                >
                  {item.title}
                </h3>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-white/70
                  "
                >
                  {item.text}
                </p>

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* =====================================================
          BOTTOM CTA
      ===================================================== */}

      <section className="bg-[#fffdf8]">

        <div
          className="
            max-w-5xl
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            py-14
          "
        >
          <div
            className="
              relative
              overflow-hidden
              rounded-[28px]
              bg-gradient-to-r
              from-[#f3dda0]
              via-[#fff3cf]
              to-[#dcebd0]
              border
              border-[#e0cf9e]
              px-6
              sm:px-10
              py-10
              text-center
            "
          >

            <div
              className="
                absolute
                -top-20
                -left-20
                w-52
                h-52
                rounded-full
                bg-white/30
              "
            />

            <div className="relative z-10">

              <Heart className="w-8 h-8 text-[#9c6a1d] mx-auto" />

              <h2
                className="
                  mt-4
                  font-serif
                  font-bold
                  text-2xl
                  sm:text-3xl
                  text-[#173b32]
                "
              >
                Good Things Are Better Together
              </h2>

              <p
                className="
                  mt-3
                  max-w-xl
                  mx-auto
                  text-sm
                  leading-6
                  text-[#645a45]
                "
              >
                Explore ShreeKrishna Organics combo packs and discover
                convenient combinations for your kitchen.
              </p>

              <a
                href="#combo-products"
                className="
                  mt-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-[#075e4d]
                  hover:bg-[#064c3f]
                  text-white
                  px-7
                  py-3
                  text-sm
                  font-bold
                  transition
                "
              >
                Explore Healthy Combos

                <ArrowRight size={17} />
              </a>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}