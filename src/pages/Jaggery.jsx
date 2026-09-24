import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Heart,
  Leaf,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Wheat,
} from "lucide-react";
import { Link } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { productService } from "../services/productService";

export default function Jaggery() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD JAGGERY PRODUCTS
  ========================================================= */

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await productService.getAllProducts({
          category: "jaggery",
          sortBy: "featured",
        });

        if (active) {
          setProducts(data || []);
        }
      } catch (err) {
        console.error("Unable to load jaggery products:", err);

        if (active) {
          setProducts([]);
          setError("Unable to load jaggery products right now.");
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
          from-[#fff4dc]
          via-[#f1d2a5]
          to-[#d7a66d]
        "
      >
        {/* BACKGROUND DECORATIONS */}

        <div
          className="
            absolute
            -top-40
            -left-28
            w-[500px]
            h-[500px]
            rounded-full
            bg-white/30
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-48
            -right-24
            w-[520px]
            h-[520px]
            rounded-full
            bg-[#8d552f]/15
            blur-3xl
          "
        />

        <Leaf
          className="
            absolute
            top-10
            right-[8%]
            w-48
            h-48
            text-[#75401f]
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
          {/* LEFT CONTENT */}

          <div>
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-white/60
                border
                border-[#8c542b]/20
                px-4
                py-2
                backdrop-blur-sm
              "
            >
              <Sparkles className="w-4 h-4 text-[#8a5326]" />

              <span
                className="
                  text-[11px]
                  sm:text-xs
                  font-bold
                  uppercase
                  tracking-[0.17em]
                  text-[#75401f]
                "
              >
                Traditional Sweetness
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
                text-[#2b241d]
              "
            >
              Naturally Delicious

              <span className="block mt-1 text-[#8a5326]">
                Jaggery
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
                text-[#604b3b]
              "
            >
              Discover our traditional jaggery collection, including
              palm jaggery and sugarcane jaggery made for everyday
              Indian kitchens.
            </p>

            {/* HERO POINTS */}

            <div
              className="
                mt-7
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-3
                max-w-xl
              "
            >
              {[
                "Traditional Preparation",
                "Rich Natural Flavour",
                "Everyday Kitchen Essential",
                "Simple Ingredients",
              ].map((item) => (
                <div
                  key={item}
                  className="
                    flex
                    items-center
                    gap-2.5
                    rounded-xl
                    bg-white/45
                    border
                    border-white/60
                    px-3
                    py-2.5
                  "
                >
                  <div
                    className="
                      w-5
                      h-5
                      rounded-full
                      bg-[#8a5326]
                      text-white
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                  >
                    <Check size={12} />
                  </div>

                  <span
                    className="
                      text-xs
                      sm:text-sm
                      font-semibold
                      text-[#544337]
                    "
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <a
              href="#jaggery-products"
              className="
                mt-8
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
                shadow-lg
                transition-all
                duration-300
                hover:-translate-y-0.5
              "
            >
              Shop Jaggery

              <ArrowRight size={17} />
            </a>
          </div>

          {/* RIGHT PRODUCT IMAGE */}

          <div className="relative flex items-center justify-center">

            <div
              className="
                absolute
                w-[300px]
                h-[300px]
                sm:w-[400px]
                sm:h-[400px]
                rounded-full
                bg-white/35
                blur-xl
              "
            />

            <div
              className="
                relative
                z-10
                w-[290px]
                h-[290px]
                sm:w-[380px]
                sm:h-[380px]
                lg:w-[420px]
                lg:h-[420px]
                rounded-[42px]
                bg-white/50
                border
                border-white/70
                shadow-[0_25px_60px_rgba(94,57,29,0.18)]
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
                    rounded-[32px]
                  "
                />
              ) : (
                <div className="text-[110px]">
                  🍯
                </div>
              )}
            </div>

            {/* FLOATING CARD */}

            <div
              className="
                absolute
                z-20
                bottom-2
                left-0
                sm:left-5
                rounded-2xl
                bg-white
                border
                border-[#ead9c7]
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
                  bg-[#fff1dd]
                  flex
                  items-center
                  justify-center
                  text-xl
                "
              >
                🍯
              </div>

              <div>
                <p className="text-xs font-bold text-[#2b241d]">
                  Traditional Jaggery
                </p>

                <p className="text-[10px] text-stone-500">
                  Naturally rich flavour
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TRUST STRIP
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
              emoji: "🌿",
              title: "Traditional",
              text: "Preparation",
            },
            {
              emoji: "🍯",
              title: "Natural",
              text: "Sweetness",
            },
            {
              emoji: "🌾",
              title: "Simple",
              text: "Ingredients",
            },
            {
              emoji: "🏡",
              title: "Everyday",
              text: "Kitchen Use",
            },
          ].map((item) => (
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
                  text-lg
                "
              >
                {item.emoji}
              </div>

              <div>
                <p
                  className="
                    text-xs
                    sm:text-sm
                    font-bold
                    text-[#f0d27b]
                  "
                >
                  {item.title}
                </p>

                <p
                  className="
                    text-[10px]
                    sm:text-xs
                    text-white/70
                  "
                >
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          PRODUCT SECTION
      ===================================================== */}

      <section
        id="jaggery-products"
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
        {/* HEADING */}

        <div className="text-center max-w-2xl mx-auto">

          <div className="flex items-center justify-center gap-3">

            <span className="w-8 h-px bg-[#c59b70]" />

            <span
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.18em]
                text-[#8a5326]
              "
            >
              Our Collection
            </span>

            <span className="w-8 h-px bg-[#c59b70]" />

          </div>

          <h2
            className="
              mt-3
              font-serif
              font-bold
              text-3xl
              sm:text-4xl
              text-[#2b241d]
            "
          >
            Explore Our Jaggery
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
            Discover traditional jaggery varieties for cooking,
            beverages, sweets and everyday use.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div
            className="
              mt-8
              max-w-xl
              mx-auto
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-center
              text-sm
              text-red-600
            "
          >
            {error}
          </div>
        )}

        {/* PRODUCT GRID */}

        {products.length > 0 ? (
          <div
            className="
              mt-10
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              gap-5
              lg:gap-6
            "
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          !error && (
            <div
              className="
                mt-10
                py-16
                px-5
                text-center
                rounded-3xl
                border
                border-[#eadfd3]
                bg-[#faf4ec]
              "
            >
              <div className="text-6xl">
                🍯
              </div>

              <h3
                className="
                  mt-5
                  font-serif
                  text-2xl
                  font-bold
                  text-[#2b241d]
                "
              >
                Jaggery Products Coming Soon
              </h3>

              <p className="mt-2 text-sm text-stone-500">
                New jaggery products will appear here automatically.
              </p>
            </div>
          )
        )}
      </section>

      {/* =====================================================
          JAGGERY TYPES
      ===================================================== */}

      <section
        className="
          bg-[#faf0e4]
          border-y
          border-[#eadbca]
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
                text-[#8a5326]
              "
            >
              Traditional Varieties
            </span>

            <h2
              className="
                mt-3
                font-serif
                font-bold
                text-3xl
                sm:text-4xl
                text-[#2b241d]
              "
            >
              Discover Different Jaggery Varieties
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
              Different sources create their own distinctive colour,
              aroma, texture and flavour.
            </p>
          </div>

          <div
            className="
              mt-10
              grid
              grid-cols-1
              md:grid-cols-2
              gap-6
              max-w-5xl
              mx-auto
            "
          >
            {/* PALM JAGGERY */}

            <div
              className="
                relative
                overflow-hidden
                rounded-[28px]
                bg-gradient-to-br
                from-[#7d4728]
                to-[#a76c3c]
                text-white
                p-7
                sm:p-9
                min-h-[280px]
              "
            >
              <div
                className="
                  absolute
                  -right-12
                  -bottom-12
                  w-48
                  h-48
                  rounded-full
                  bg-white/5
                "
              />

              <div className="relative z-10">

                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-white/10
                    flex
                    items-center
                    justify-center
                    text-3xl
                  "
                >
                  🌴
                </div>

                <h3
                  className="
                    mt-6
                    font-serif
                    font-bold
                    text-2xl
                    sm:text-3xl
                  "
                >
                  Palm Jaggery
                </h3>

                <p
                  className="
                    mt-3
                    max-w-md
                    text-sm
                    leading-7
                    text-white/75
                  "
                >
                  A traditional jaggery variety known for its distinctive
                  deep colour and rich flavour.
                </p>

                <a
                  href="#jaggery-products"
                  className="
                    mt-6
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    font-bold
                    text-[#ffe1a7]
                  "
                >
                  View Products

                  <ArrowRight size={16} />
                </a>

              </div>
            </div>

            {/* SUGARCANE JAGGERY */}

            <div
              className="
                relative
                overflow-hidden
                rounded-[28px]
                bg-gradient-to-br
                from-[#dcae55]
                to-[#bd7d32]
                text-white
                p-7
                sm:p-9
                min-h-[280px]
              "
            >
              <div
                className="
                  absolute
                  -right-12
                  -bottom-12
                  w-48
                  h-48
                  rounded-full
                  bg-white/10
                "
              />

              <div className="relative z-10">

                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-white/15
                    flex
                    items-center
                    justify-center
                    text-3xl
                  "
                >
                  🌾
                </div>

                <h3
                  className="
                    mt-6
                    font-serif
                    font-bold
                    text-2xl
                    sm:text-3xl
                  "
                >
                  Sugarcane Jaggery
                </h3>

                <p
                  className="
                    mt-3
                    max-w-md
                    text-sm
                    leading-7
                    text-white/85
                  "
                >
                  A familiar traditional sweetener made from sugarcane
                  and used across Indian kitchens.
                </p>

                <a
                  href="#jaggery-products"
                  className="
                    mt-6
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    font-bold
                    text-white
                  "
                >
                  View Products

                  <ArrowRight size={16} />
                </a>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          FROM SOURCE TO KITCHEN
      ===================================================== */}

      <section className="bg-[#fffdf8]">

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

            <Wheat className="w-7 h-7 text-[#8a5326] mx-auto" />

            <span
              className="
                block
                mt-3
                text-xs
                font-bold
                uppercase
                tracking-[0.18em]
                text-[#8a5326]
              "
            >
              Traditional Process
            </span>

            <h2
              className="
                mt-3
                font-serif
                font-bold
                text-3xl
                sm:text-4xl
                text-[#2b241d]
              "
            >
              From Source To Your Kitchen
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
                number: "01",
                emoji: "🌱",
                title: "Source",
                text: "The process begins with the selected natural source.",
              },
              {
                number: "02",
                emoji: "🔥",
                title: "Prepare",
                text: "Traditional preparation develops the characteristic jaggery texture.",
              },
              {
                number: "03",
                emoji: "🍯",
                title: "Set",
                text: "The prepared jaggery is allowed to develop its familiar form and colour.",
              },
              {
                number: "04",
                emoji: "📦",
                title: "Pack",
                text: "The finished product is packed for convenient everyday use.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="
                  relative
                  rounded-2xl
                  bg-white
                  border
                  border-[#eadfd3]
                  p-6
                  shadow-[0_8px_25px_rgba(77,52,31,0.05)]
                "
              >
                <span
                  className="
                    absolute
                    top-4
                    right-5
                    font-serif
                    text-3xl
                    font-bold
                    text-[#b58b66]/20
                  "
                >
                  {step.number}
                </span>

                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-[#fff1e1]
                    flex
                    items-center
                    justify-center
                    text-2xl
                  "
                >
                  {step.emoji}
                </div>

                <h3
                  className="
                    mt-5
                    font-serif
                    font-bold
                    text-lg
                    text-[#2b241d]
                  "
                >
                  {step.title}
                </h3>

                <p
                  className="
                    mt-2
                    text-xs
                    sm:text-sm
                    leading-6
                    text-stone-500
                  "
                >
                  {step.text}
                </p>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =====================================================
          WHY CHOOSE
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
              Traditional Sweetness For Your Kitchen
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
                icon: Leaf,
                title: "Traditional",
                text: "Inspired by familiar Indian jaggery-making traditions.",
              },
              {
                icon: ShieldCheck,
                title: "Simple",
                text: "A straightforward traditional kitchen ingredient.",
              },
              {
                icon: PackageCheck,
                title: "Convenient",
                text: "Packed for easy storage and everyday household use.",
              },
              {
                icon: Heart,
                title: "Versatile",
                text: "Use it in traditional recipes, sweets and beverages.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
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
                    "
                  >
                    <Icon className="w-6 h-6 text-[#efd27b]" />
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
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          OTHER COLLECTIONS
      ===================================================== */}

      <section className="bg-[#faf6ef]">

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
          <div className="text-center">

            <span
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.18em]
                text-[#8a5326]
              "
            >
              Explore More
            </span>

            <h2
              className="
                mt-3
                font-serif
                font-bold
                text-3xl
                text-[#2b241d]
              "
            >
              More From ShreeKrishna Organics
            </h2>

          </div>

          <div
            className="
              mt-9
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
                rounded-3xl
                bg-[#e8f0df]
                border
                border-[#d8e2cd]
                p-7
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
              "
            >
              <div className="text-4xl">
                🫙
              </div>

              <h3
                className="
                  mt-5
                  font-serif
                  text-xl
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

            {/* A2 GHEE */}

            <Link
              to="/a2-ghee"
              className="
                group
                rounded-3xl
                bg-[#fff0c9]
                border
                border-[#ead8a8]
                p-7
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
              "
            >
              <div className="text-4xl">
                🐄
              </div>

              <h3
                className="
                  mt-5
                  font-serif
                  text-xl
                  font-bold
                  text-[#173b32]
                "
              >
                A2 Ghee
              </h3>

              <p className="mt-2 text-sm text-stone-500">
                Discover our traditional A2 Ghee.
              </p>

              <span
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  font-bold
                  text-[#91631b]
                "
              >
                Explore

                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition"
                />
              </span>
            </Link>

            {/* COMBOS */}

            <Link
              to="/healthy-combos"
              className="
                group
                rounded-3xl
                bg-[#f7e5d9]
                border
                border-[#e9d2c3]
                p-7
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
              "
            >
              <div className="text-4xl">
                🎁
              </div>

              <h3
                className="
                  mt-5
                  font-serif
                  text-xl
                  font-bold
                  text-[#173b32]
                "
              >
                Healthy Combos
              </h3>

              <p className="mt-2 text-sm text-stone-500">
                Discover convenient product combinations.
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
              from-[#f4dfc4]
              via-[#fff0d5]
              to-[#dfbd91]
              border
              border-[#e3c6a5]
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

            <div
              className="
                absolute
                -bottom-24
                -right-16
                w-56
                h-56
                rounded-full
                bg-[#8a5326]/10
              "
            />

            <div className="relative z-10">

              <div className="text-4xl">
                🍯
              </div>

              <h2
                className="
                  mt-4
                  font-serif
                  text-2xl
                  sm:text-3xl
                  font-bold
                  text-[#2b241d]
                "
              >
                Bring Traditional Sweetness Home
              </h2>

              <p
                className="
                  mt-3
                  max-w-xl
                  mx-auto
                  text-sm
                  leading-6
                  text-[#665346]
                "
              >
                Explore the ShreeKrishna Organics jaggery collection.
              </p>

              <a
                href="#jaggery-products"
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
                Shop Jaggery

                <ArrowRight size={17} />
              </a>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}