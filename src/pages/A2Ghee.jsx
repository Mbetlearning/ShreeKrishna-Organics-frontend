import React, { useEffect, useState } from "react";

import {

  Award,

  Heart,

  Leaf,

  ShieldCheck,

  Sparkles,

  Milk,

  ChevronRight,

} from "lucide-react";

import { Link } from "react-router-dom";

import ProductCard from "../components/ProductCard";

import LoadingSpinner from "../components/LoadingSpinner";

import { productService } from "../services/productService";

export default function A2Ghee() {

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  /* =========================================================

     LOAD A2 GHEE PRODUCTS

  ========================================================= */

  useEffect(() => {

    let active = true;

    const loadProducts = async () => {

      try {

        setLoading(true);

        const allProducts = await productService.getAllProducts({

          sortBy: "featured",

        });

        const gheeProducts = (allProducts || []).filter((product) => {

          const text = `

            ${product.name || ""}

            ${product.slug || ""}

            ${product.tagline || ""}

            ${product.shortDescription || ""}

            ${product.categoryName || ""}

          `.toLowerCase();

          return (

            text.includes("a2") ||

            text.includes("ghee") ||

            text.includes("bilona")

          );

        });

        if (active) {

          setProducts(gheeProducts);

        }

      } catch (error) {

        console.error("Unable to load A2 Ghee products:", error);

        if (active) {

          setProducts([]);

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

      <section className="relative overflow-hidden bg-gradient-to-br from-[#fff8df] via-[#f5df9c] to-[#edc968]">

        {/* Decorative Background */}

        <div className="absolute -top-32 -left-24 w-[360px] h-[360px] rounded-full bg-white/25 blur-3xl" />

        <div className="absolute -bottom-40 right-0 w-[440px] h-[440px] rounded-full bg-[#fff5c8]/35 blur-3xl" />

        <div className="absolute top-10 right-[8%] text-[150px] opacity-[0.06] select-none">

          🐄

        </div>

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

                bg-white/60

                backdrop-blur-sm

                border

                border-[#b88a27]/20

                rounded-full

                px-4

                py-2

                mb-6

              "

            >

              <Sparkles className="w-4 h-4 text-[#8a5d16]" />

              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.17em] text-[#755018]">

                ShreeKrishna Organics

              </span>

            </div>

            <h1

              className="

                font-serif

                font-bold

                text-[#173b32]

                text-4xl

                sm:text-5xl

                lg:text-6xl

                leading-[1.08]

              "

            >

              Traditional

              <span className="block text-[#a66c18] mt-1">

                A2 Bilona Ghee

              </span>

            </h1>

            <p

              className="

                mt-5

                text-[#514630]

                text-base

                sm:text-lg

                leading-7

                max-w-xl

              "

            >

              Crafted with care using the traditional Bilona method for

              authentic aroma, texture and flavour.

            </p>

            <div className="mt-7 flex flex-wrap gap-3">

              <span

                className="

                  inline-flex

                  items-center

                  gap-2

                  bg-white/55

                  border

                  border-white/60

                  rounded-full

                  px-4

                  py-2

                  text-xs

                  sm:text-sm

                  font-semibold

                  text-[#59451e]

                "

              >

                🐄 Indigenous Cow Milk

              </span>

              <span

                className="

                  inline-flex

                  items-center

                  gap-2

                  bg-white/55

                  border

                  border-white/60

                  rounded-full

                  px-4

                  py-2

                  text-xs

                  sm:text-sm

                  font-semibold

                  text-[#59451e]

                "

              >

                🪵 Traditional Bilona

              </span>

              <span

                className="

                  inline-flex

                  items-center

                  gap-2

                  bg-white/55

                  border

                  border-white/60

                  rounded-full

                  px-4

                  py-2

                  text-xs

                  sm:text-sm

                  font-semibold

                  text-[#59451e]

                "

              >

                ✨ Authentic Aroma

              </span>

            </div>

            {/* SHOP BUTTON */}

            <a

              href="#a2-ghee-products"

              className="

                mt-8

                inline-flex

                items-center

                gap-2

                bg-[#075e4d]

                hover:bg-[#064c3f]

                text-white

                px-6

                py-3

                rounded-full

                text-sm

                font-bold

                shadow-lg

                transition-all

                duration-300

                hover:-translate-y-0.5

              "

            >

              Shop A2 Ghee

              <ChevronRight size={17} />

            </a>

          </div>

          {/* RIGHT PRODUCT VISUAL */}

          <div className="relative flex justify-center items-center">

            <div

              className="

                absolute

                w-[290px]

                h-[290px]

                sm:w-[380px]

                sm:h-[380px]

                rounded-full

                bg-white/35

                blur-xl

              "

            />

            {products[0]?.image ? (

              <div

                className="

                  relative

                  z-10

                  w-[280px]

                  h-[280px]

                  sm:w-[360px]

                  sm:h-[360px]

                  lg:w-[400px]

                  lg:h-[400px]

                  rounded-full

                  bg-white/45

                  border

                  border-white/60

                  shadow-[0_25px_60px_rgba(94,66,15,0.18)]

                  p-7

                  flex

                  items-center

                  justify-center

                "

              >

                <img

                  src="/images/shreekrishna-ghee.png"

                  alt="ShreeKrishna A2 Bilona Ghee"

                  className="

                    w-full

                    h-full

                    object-cover

                    rounded-full

                  "

                />

              </div>

            ) : (

              <div

                className="

                  relative

                  z-10

                  w-[280px]

                  h-[280px]

                  rounded-full

                  bg-white/45

                  flex

                  items-center

                  justify-center

                  text-[110px]

                "

              >

                🐄

              </div>

            )}

          </div>

        </div>

      </section>

      {/* =====================================================

          SMALL TRUST FEATURES

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

              icon: Milk,

              title: "Traditional",

              text: "Bilona Method",

            },

            {

              icon: Leaf,

              title: "Pure",

              text: "Simple Ingredients",

            },

            {

              icon: ShieldCheck,

              title: "Carefully",

              text: "Prepared",

            },

            {

              icon: Award,

              title: "Authentic",

              text: "Indian Tradition",

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

                  <Icon className="w-5 h-5 text-[#f0cf72]" />

                </div>

                <div>

                  <p className="text-xs sm:text-sm font-bold text-[#f4d983]">

                    {item.title}

                  </p>

                  <p className="text-[10px] sm:text-xs text-white/75">

                    {item.text}

                  </p>

                </div>

              </div>

            );

          })}

        </div>

      </section>

      {/* =====================================================

          PRODUCTS

      ===================================================== */}

      <section

        id="a2-ghee-products"

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

          <div className="flex items-center justify-center gap-2 text-[#9b6b20]">

            <div className="w-8 h-px bg-[#c89e52]" />

            <span className="text-xs font-bold uppercase tracking-[0.18em]">

              Pure Tradition

            </span>

            <div className="w-8 h-px bg-[#c89e52]" />

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

            Our A2 Ghee Collection

          </h2>

          <p className="mt-4 text-sm sm:text-base text-stone-500 leading-7">

            Explore our traditionally prepared A2 ghee collection.

          </p>

        </div>

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

          <div

            className="

              mt-10

              py-16

              text-center

              rounded-3xl

              border

              border-[#eadfca]

              bg-[#faf6ed]

            "

          >

            <div className="text-6xl mb-4">

              🐄

            </div>

            <h3 className="font-serif text-2xl font-bold text-[#173b32]">

              A2 Ghee Coming Soon

            </h3>

            <p className="mt-2 text-sm text-stone-500">

              Our traditional A2 Ghee collection is being prepared.

            </p>

          </div>

        )}

      </section>

      {/* =====================================================

          TRADITIONAL PROCESS

      ===================================================== */}

      <section className="bg-[#faf2dd] border-y border-[#eadcb9]">

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

            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#a26e1d]">

              Traditional Craft

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

              The Bilona Tradition

            </h2>

            <p className="mt-4 text-sm text-stone-500 max-w-2xl mx-auto leading-7">

              A traditional preparation process inspired by generations of

              Indian ghee-making.

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

                emoji: "🥛",

                title: "Milk",

                text: "Carefully selected milk begins the traditional preparation.",

              },

              {

                number: "02",

                emoji: "🥣",

                title: "Cultured Curd",

                text: "Milk is traditionally cultured before the churning process.",

              },

              {

                number: "03",

                emoji: "🪵",

                title: "Bilona Churning",

                text: "Curd is churned using the traditional Bilona method.",

              },

              {

                number: "04",

                emoji: "✨",

                title: "Slow Preparation",

                text: "The final preparation develops the familiar golden colour and aroma.",

              },

            ].map((step) => (

              <div

                key={step.number}

                className="

                  relative

                  bg-white

                  rounded-2xl

                  border

                  border-[#e8dcc2]

                  p-6

                  shadow-[0_8px_25px_rgba(75,55,20,0.05)]

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

                    text-[#d7bd7c]/35

                  "

                >

                  {step.number}

                </span>

                <div

                  className="

                    w-14

                    h-14

                    rounded-2xl

                    bg-[#fff5d8]

                    flex

                    items-center

                    justify-center

                    text-2xl

                  "

                >

                  {step.emoji}

                </div>

                <h3 className="mt-5 font-serif font-bold text-lg text-[#173b32]">

                  {step.title}

                </h3>

                <p className="mt-2 text-xs sm:text-sm text-stone-500 leading-6">

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

            <span className="text-[#efd27c] text-xs font-bold uppercase tracking-[0.18em]">

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

              Made With Tradition & Care

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

                icon: "🐄",

                title: "Indigenous Tradition",

                text: "Inspired by traditional Indian A2 ghee-making practices.",

              },

              {

                icon: "🪵",

                title: "Bilona Method",

                text: "Traditional churning forms an important part of the process.",

              },

              {

                icon: "🔥",

                title: "Slow Preparation",

                text: "Prepared carefully to develop characteristic aroma and texture.",

              },

              {

                icon: "🌿",

                title: "Simple & Authentic",

                text: "Focused on traditional preparation and straightforward ingredients.",

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

                    text-2xl

                  "

                >

                  {item.icon}

                </div>

                <h3 className="mt-4 font-serif font-bold text-lg text-[#f2d783]">

                  {item.title}

                </h3>

                <p className="mt-2 text-sm leading-6 text-white/70">

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

      <section className="bg-[#fffaf0]">

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

              via-[#fff2c8]

              to-[#e9cb75]

              border

              border-[#dfc178]

              px-6

              sm:px-10

              py-9

              text-center

            "

          >

            <div className="absolute -top-20 -left-20 w-52 h-52 rounded-full bg-white/25" />

            <div className="relative z-10">

              <Heart className="w-8 h-8 text-[#9a651a] mx-auto" />

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

                Bring Traditional A2 Ghee Home

              </h2>

              <p className="mt-3 text-sm text-[#645338] max-w-xl mx-auto">

                Explore the ShreeKrishna Organics A2 Ghee collection.

              </p>

              <div className="mt-6 flex justify-center gap-3 flex-wrap">

                <a

                  href="#a2-ghee-products"

                  className="

                    inline-flex

                    items-center

                    gap-2

                    bg-[#075e4d]

                    hover:bg-[#064c3f]

                    text-white

                    rounded-full

                    px-6

                    py-3

                    text-sm

                    font-bold

                    transition

                  "

                >

                  Shop Now

                  <ChevronRight size={17} />

                </a>

                <Link

                  to="/wood-pressed-oils"

                  className="

                    inline-flex

                    items-center

                    gap-2

                    bg-white/70

                    hover:bg-white

                    border

                    border-[#cba957]

                    text-[#62491c]

                    rounded-full

                    px-6

                    py-3

                    text-sm

                    font-bold

                    transition

                  "

                >

                  Explore Oils

                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>

  );

}
