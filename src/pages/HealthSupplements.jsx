import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Heart,
  Leaf,
  ShieldCheck,
  Sparkles,
  Sprout,
} from "lucide-react";
import { Link } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { productService } from "../services/productService";

export default function HealthSupplements() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD HEALTH SUPPLEMENT PRODUCTS
  ========================================================= */

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await productService.getAllProducts({
          category: "supplements",
          sortBy: "featured",
        });

        /*
          A2 Ghee has also been stored under "supplements"
          in the current demo catalog.

          Because A2 Ghee already has its own page,
          we exclude ghee products here.
        */

        const supplementProducts = (data || []).filter((product) => {
          const searchableText = `
            ${product.name || ""}
            ${product.slug || ""}
            ${product.tagline || ""}
            ${product.shortDescription || ""}
          `.toLowerCase();

          return !(
            searchableText.includes("ghee") ||
            searchableText.includes("bilona")
          );
        });

        if (active) {
          setProducts(supplementProducts);
        }
      } catch (err) {
        console.error("Unable to load health supplements:", err);

        if (active) {
          setProducts([]);
          setError("Unable to load products right now.");
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
          HERO
      ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-gradient-to-br
          from-[#eaf5df]
          via-[#f8f2d8]
          to-[#e2efcc]
        "
      >
        {/* DECORATION */}

        <div
          className="
            absolute
            -top-32
            -left-28
            w-[420px]
            h-[420px]
            rounded-full
            bg-white/40
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-40
            -right-24
            w-[480px]
            h-[480px]
            rounded-full
            bg-[#a8ce8d]/30
            blur-3xl
          "
        />

        <Leaf
          className="
            absolute
            top-12
            right-[8%]
            w-40
            h-40
            text-[#315f45]
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
                border
                border-[#3c7555]/20
                bg-white/60
                backdrop-blur-sm
                px-4
                py-2
              "
            >
              <Sprout className="w-4 h-4 text-[#17634c]" />

              <span
                className="
                  text-[11px]
                  sm:text-xs
                  font-bold
                  uppercase
                  tracking-[0.17em]
                  text-[#17634c]
                "
              >
                Natural Wellness
              </span>
            </div>

            <h1
              className="
                mt-6
                font-serif
                font-bold
                text-[#173b32]
                text-4xl
                sm:text-5xl
                lg:text-6xl
                leading-[1.07]
              "
            >
              Health
              <span className="block text-[#7b8d32] mt-1">
                Supplements
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
                text-[#536057]
              "
            >
              Discover thoughtfully selected traditional wellness products
              made with simple ingredients and careful preparation.
            </p>

            {/* HERO POINTS */}

            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">

              {[
                "Carefully Selected Ingredients",
                "Traditional Preparation",
                "Simple & Transparent",
                "Made With Care",
              ].map((item) => (
                <div
                  key={item}
                  className="
                    flex
                    items-center
                    gap-2.5
                    rounded-xl
                    bg-white/50
                    border
                    border-white/70
                    px-3
                    py-2.5
                  "
                >
                  <div
                    className="
                      w-5
                      h-5
                      rounded-full
                      bg-[#17634c]
                      text-white
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                  >
                    <Check size={12} />
                  </div>

                  <span className="text-xs sm:text-sm font-semibold text-[#405149]">
                    {item}
                  </span>
                </div>
              ))}

            </div>

            <a
              href="#health-products"
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
              Explore Collection

              <ArrowRight size={17} />
            </a>
          </div>

          {/* RIGHT VISUAL */}

          <div className="relative flex justify-center items-center">

            <div
              className="
                absolute
                w-[290px]
                h-[290px]
                sm:w-[390px]
                sm:h-[390px]
                rounded-full
                bg-white/45
                blur-xl
              "
            />

            <div
              className="
                relative
                z-10
                w-[280px]
                h-[280px]
                sm:w-[370px]
                sm:h-[370px]
                lg:w-[410px]
                lg:h-[410px]
                rounded-full
                bg-white/55
                border
                border-white/80
                shadow-[0_25px_60px_rgba(39,81,58,0.14)]
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
                    rounded-full
                  "
                />
              ) : (
                <div className="text-[100px] sm:text-[130px]">
                  🌿
                </div>
              )}
            </div>

            {/* FLOATING BADGE */}

            <div
              className="
                absolute
                z-20
                bottom-5
                sm:bottom-10
                left-0
                sm:left-6
                bg-white
                rounded-2xl
                shadow-xl
                border
                border-[#e1eadc]
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
                  bg-[#edf6e6]
                  flex
                  items-center
                  justify-center
                "
              >
                <Leaf className="w-5 h-5 text-[#17634c]" />
              </div>

              <div>
                <p className="text-xs font-bold text-[#173b32]">
                  Traditional
                </p>

                <p className="text-[10px] text-stone-500">
                  Wellness Collection
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
              title: "Selected",
              text: "Ingredients",
            },
            {
              emoji: "✨",
              title: "Simple",
              text: "Preparation",
            },
            {
              emoji: "🪷",
              title: "Traditional",
              text: "Inspiration",
            },
            {
              emoji: "💚",
              title: "Made",
              text: "With Care",
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
                <p className="text-xs sm:text-sm font-bold text-[#f0d27b]">
                  {item.title}
                </p>

                <p className="text-[10px] sm:text-xs text-white/70">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <section
        id="health-products"
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

        <div className="max-w-2xl mx-auto text-center">

          <div className="flex items-center justify-center gap-3">

            <span className="w-8 h-px bg-[#a7b66c]" />

            <span
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.18em]
                text-[#66802d]
              "
            >
              Wellness Collection
            </span>

            <span className="w-8 h-px bg-[#a7b66c]" />

          </div>

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
            Explore Health Supplements
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
            Explore our collection of traditional wellness products and
            naturally prepared everyday essentials.
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

        {/* PRODUCTS */}

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
                rounded-3xl
                border
                border-[#dfe8d8]
                bg-[#f5f9f1]
                py-16
                px-5
                text-center
              "
            >
              <div className="text-6xl">
                🌿
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
                More Wellness Products Coming Soon
              </h3>

              <p className="mt-2 text-sm text-stone-500">
                Our health supplement collection is growing.
              </p>
            </div>
          )
        )}
      </section>

      {/* =====================================================
          WELLNESS PHILOSOPHY
      ===================================================== */}

      <section className="bg-[#f3f7e9] border-y border-[#e1e8d3]">
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
                text-[#66802d]
              "
            >
              Our Philosophy
            </span>

            <h2
              className="
                mt-3
                font-serif
                text-3xl
                sm:text-4xl
                font-bold
                text-[#173b32]
              "
            >
              Rooted in Traditional Wellness
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
              Our approach focuses on simple ingredients, traditional
              preparation and mindful everyday choices.
            </p>

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
                title: "Select",
                text: "Carefully selected ingredients form the foundation of each product.",
              },
              {
                number: "02",
                emoji: "🪷",
                title: "Prepare",
                text: "Traditional preparation methods inspire our wellness collection.",
              },
              {
                number: "03",
                emoji: "✨",
                title: "Keep It Simple",
                text: "We focus on straightforward products and transparent ingredients.",
              },
              {
                number: "04",
                emoji: "💚",
                title: "Share",
                text: "Products designed to become part of mindful everyday routines.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="
                  relative
                  rounded-2xl
                  bg-white
                  border
                  border-[#dfe7d4]
                  p-6
                  shadow-[0_8px_25px_rgba(46,74,39,0.05)]
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
                    text-[#8ba166]/20
                  "
                >
                  {step.number}
                </span>

                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-[#eef5e7]
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
                    text-[#173b32]
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
          WHY SHREEKRISHNA
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
                text-[#efd27c]
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
                text-3xl
                sm:text-4xl
                font-bold
              "
            >
              Wellness With Simplicity
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
                title: "Ingredient Focused",
                text: "Carefully selected ingredients are at the centre of our collection.",
              },
              {
                icon: ShieldCheck,
                title: "Transparent",
                text: "Clear product information helps you understand what you are choosing.",
              },
              {
                icon: Sparkles,
                title: "Traditional",
                text: "Products inspired by familiar Indian food and wellness traditions.",
              },
              {
                icon: Heart,
                title: "Made With Care",
                text: "Thoughtfully prepared products for everyday household use.",
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
                    backdrop-blur-sm
                  "
                >
                  <div
                    className="
                      w-12
                      h-12
                      rounded-xl
                      bg-[#e7c766]/15
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Icon className="w-6 h-6 text-[#efd27c]" />
                  </div>

                  <h3
                    className="
                      mt-4
                      font-serif
                      font-bold
                      text-lg
                      text-[#f2d783]
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
              border
              border-[#dce7d4]
              bg-gradient-to-r
              from-[#e8f3df]
              via-[#f9f5dd]
              to-[#e2efce]
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
                bg-white/35
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
                bg-[#98bd7a]/15
              "
            />

            <div className="relative z-10">

              <Leaf className="w-8 h-8 text-[#17634c] mx-auto" />

              <h2
                className="
                  mt-4
                  font-serif
                  text-2xl
                  sm:text-3xl
                  font-bold
                  text-[#173b32]
                "
              >
                Explore Natural Wellness
              </h2>

              <p
                className="
                  mt-3
                  max-w-xl
                  mx-auto
                  text-sm
                  leading-6
                  text-[#586359]
                "
              >
                Discover the ShreeKrishna Organics wellness collection and
                other traditional products.
              </p>

              <div
                className="
                  mt-6
                  flex
                  justify-center
                  flex-wrap
                  gap-3
                "
              >
                <a
                  href="#health-products"
                  className="
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
                    transition
                  "
                >
                  Shop Supplements

                  <ArrowRight size={17} />
                </a>

                <Link
                  to="/a2-ghee"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-white/75
                    hover:bg-white
                    border
                    border-[#a8bd8f]
                    text-[#315743]
                    px-6
                    py-3
                    text-sm
                    font-bold
                    transition
                  "
                >
                  Explore A2 Ghee
                </Link>

              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}