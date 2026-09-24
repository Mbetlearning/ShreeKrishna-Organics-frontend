import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Leaf, Sparkles } from "lucide-react";

import { productService } from "../services/productService";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";

/* =========================================================
   WOOD PRESSED OIL CATEGORY CONFIG
========================================================= */

const OIL_SECTIONS = [
  {
    key: "groundnut",
    title: "Groundnut Oil",
    subtitle: "Traditional wood-pressed goodness for everyday cooking",
    description: "Nutty Aroma • Naturally Pressed • Everyday Essential",
    keywords: ["groundnut", "peanut"],
    emoji: "🥜",
    gradient:
      "linear-gradient(135deg, #fff8dc 0%, #f7e7b2 45%, #efd18b 100%)",
  },

  {
    key: "black-mustard",
    title: "Black Mustard Oil",
    subtitle: "Bold traditional flavour from carefully selected mustard seeds",
    description: "Bold • Pungent • Traditionally Wood-Pressed",
    keywords: ["black mustard"],
    emoji: "🌼",
    gradient:
      "linear-gradient(135deg, #fff8d7 0%, #f6e49c 45%, #e8c65d 100%)",
  },

  {
    key: "sunflower",
    title: "Sunflower Oil",
    subtitle: "Light, clean and naturally pressed",
    description: "Light • Clean • Naturally Extracted",
    keywords: ["sunflower"],
    emoji: "🌻",
    gradient:
      "linear-gradient(135deg, #fff9d9 0%, #f9e58f 48%, #efca4e 100%)",
  },

  {
    key: "virgin-coconut",
    title: "Virgin Coconut Oil",
    subtitle: "Pure coconut goodness inspired by traditional extraction",
    description: "Pure • Natural • Tropical Goodness",
    keywords: ["virgin coconut"],
    emoji: "🥥",
    gradient:
      "linear-gradient(135deg, #effbf1 0%, #d7f0dc 45%, #b9dfc3 100%)",
  },

  {
    key: "black-sesame",
    title: "Black Sesame Oil",
    subtitle: "Deep aroma with the richness of traditional sesame seeds",
    description: "Rich Aroma • Traditional • Deeply Nourishing",
    keywords: ["black sesame", "gingelly"],
    emoji: "🌿",
    gradient:
      "linear-gradient(135deg, #f5f4d6 0%, #dedb91 45%, #b9b451 100%)",
  },

  {
    key: "yellow-mustard",
    title: "Yellow Mustard Oil",
    subtitle: "Golden mustard goodness pressed the traditional way",
    description: "Aromatic • Golden • Traditional Purity",
    keywords: ["yellow mustard"],
    emoji: "🌼",
    gradient:
      "linear-gradient(135deg, #fff8cf 0%, #f5dd7c 45%, #dfb72f 100%)",
  },

  {
    key: "olive",
    title: "Extra Virgin Olive Oil",
    subtitle: "Premium everyday oil with naturally rich flavour",
    description: "Premium • Smooth • Naturally Rich",
    keywords: ["olive"],
    emoji: "🫒",
    gradient:
      "linear-gradient(135deg, #f6f4cf 0%, #dcdf8d 45%, #b8bd4c 100%)",
  },

  {
    key: "coconut",
    title: "Coconut Oil",
    subtitle: "Naturally extracted coconut oil for traditional kitchens",
    description: "Cold-Pressed • Pure • No Shortcuts",
    keywords: ["coconut"],
    emoji: "🥥",
    gradient:
      "linear-gradient(135deg, #eaf8ef 0%, #cce9d4 45%, #9fd1ae 100%)",
  },
];

/* =========================================================
   OIL BANNER
========================================================= */

function OilBanner({ section, products }) {
  const firstProduct = products[0];

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[28px]
        min-h-[220px]
        md:min-h-[250px]
        lg:min-h-[270px]
        border
        border-[#eadfbd]
        shadow-[0_10px_35px_rgba(77,62,31,0.08)]
      "
      style={{
        background: section.gradient,
      }}
    >
      {/* Decorative circles */}

      <div className="absolute -top-24 -left-20 w-64 h-64 rounded-full bg-white/25" />

      <div className="absolute -bottom-28 right-[20%] w-72 h-72 rounded-full bg-white/20" />

      <div className="absolute top-6 right-8 opacity-[0.08] text-[150px] leading-none select-none">
        🌳
      </div>

      <div
        className="
          relative
          z-10
          h-full
          min-h-[220px]
          md:min-h-[250px]
          lg:min-h-[270px]
          grid
          grid-cols-1
          md:grid-cols-[1fr_280px]
          lg:grid-cols-[1fr_360px]
          items-center
          gap-6
          px-7
          sm:px-10
          lg:px-14
          py-8
        "
      >
        {/* TEXT */}

        <div className="max-w-3xl">
          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#166653]/20
              bg-white/50
              backdrop-blur-sm
              px-4
              py-2
              mb-5
            "
          >
            <Leaf className="w-4 h-4 text-[#096653]" />

            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] text-[#096653]">
              ShreeKrishna Organics
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-4xl sm:text-5xl">{section.emoji}</span>

            <h2
              className="
                font-serif
                text-[34px]
                sm:text-[42px]
                lg:text-[52px]
                leading-[1.05]
                font-bold
                text-[#173b32]
              "
            >
              {section.title}
            </h2>
          </div>

          <p
            className="
              mt-4
              text-base
              sm:text-lg
              lg:text-xl
              text-[#3f4d42]
              font-medium
            "
          >
            {section.subtitle}
          </p>

          <div
            className="
              mt-5
              inline-flex
              items-center
              gap-2
              text-[#7b451d]
              font-bold
              text-sm
              sm:text-base
            "
          >
            <Sparkles className="w-4 h-4" />

            {section.description}
          </div>
        </div>

        {/* PRODUCT IMAGE */}

        <div className="hidden md:flex justify-center items-center">
          {firstProduct?.image ? (
            <div className="relative">
              <div
                className="
                  absolute
                  inset-0
                  rounded-full
                  bg-white/40
                  blur-3xl
                  scale-90
                "
              />

              <img
                src={firstProduct.image}
                alt={firstProduct.name}
                className="
                  relative
                  z-10
                  w-[230px]
                  lg:w-[280px]
                  h-[200px]
                  lg:h-[235px]
                  object-contain
                  drop-shadow-[0_20px_25px_rgba(0,0,0,0.18)]
                "
              />
            </div>
          ) : (
            <div className="text-[110px] opacity-80">
              {section.emoji}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PRODUCT ROW
========================================================= */

function OilProductRow({ products }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    const distance = 340;

    scrollRef.current.scrollBy({
      left: direction === "right" ? distance : -distance,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative mt-5">
      {/* LEFT ARROW */}

      {products.length > 3 && (
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Scroll products left"
          className="
            hidden
            md:flex
            absolute
            z-20
            left-[-20px]
            top-[42%]
            -translate-y-1/2
            w-11
            h-11
            rounded-full
            bg-white
            border
            border-[#d9d3c8]
            shadow-lg
            items-center
            justify-center
            text-[#096653]
            hover:bg-[#096653]
            hover:text-white
            transition-all
          "
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* PRODUCTS */}

      <div
        ref={scrollRef}
        className="
          flex
          gap-4
          sm:gap-5
          overflow-x-auto
          scroll-smooth
          pb-5
          px-1
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="
              min-w-[270px]
              sm:min-w-[290px]
              lg:min-w-[300px]
              max-w-[300px]
            "
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* RIGHT ARROW */}

      {products.length > 3 && (
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll products right"
          className="
            hidden
            md:flex
            absolute
            z-20
            right-[-20px]
            top-[42%]
            -translate-y-1/2
            w-11
            h-11
            rounded-full
            bg-white
            border
            border-[#d9d3c8]
            shadow-lg
            items-center
            justify-center
            text-[#096653]
            hover:bg-[#096653]
            hover:text-white
            transition-all
          "
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function WoodPressedOils() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =======================================================
     LOAD WOOD-PRESSED PRODUCTS
  ======================================================= */

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        setLoading(true);

        const data = await productService.getAllProducts({
          category: "wood-pressed",
          sortBy: "featured",
        });

        if (active) {
          setProducts(data || []);
        }
      } catch (error) {
        console.error("Unable to load wood-pressed oils:", error);

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

  /* =======================================================
     CREATE SECTIONS FROM PRODUCTS
  ======================================================= */

  const oilSections = useMemo(() => {
    return OIL_SECTIONS.map((section) => {
      const matchedProducts = products.filter((product) => {
        const searchableText = `
          ${product.name || ""}
          ${product.slug || ""}
          ${product.tagline || ""}
        `.toLowerCase();

        return section.keywords.some((keyword) =>
          searchableText.includes(keyword.toLowerCase())
        );
      });

      return {
        ...section,
        products: matchedProducts,
      };
    }).filter((section) => section.products.length > 0);
  }, [products]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#fffdf8]">
        <LoadingSpinner />
      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="bg-[#fffdf8] min-h-screen">

      {/* ===================================================
          PAGE HERO
      =================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-gradient-to-br
          from-[#064f43]
          via-[#086a59]
          to-[#064f43]
          text-white
        "
      >
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#e8c56b]/10 blur-3xl" />

        <div className="absolute -bottom-40 -right-24 w-[450px] h-[450px] rounded-full bg-[#e8c56b]/10 blur-3xl" />

        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            py-14
            md:py-20
            relative
            z-10
          "
        >
          <div className="max-w-3xl">

            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[#e8c56b]/40
                bg-white/5
                px-4
                py-2
                mb-5
              "
            >
              <Leaf className="w-4 h-4 text-[#f2d17b]" />

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#f2d17b]">
                Traditional Purity
              </span>
            </div>

            <h1
              className="
                font-serif
                font-bold
                text-4xl
                sm:text-5xl
                lg:text-6xl
                leading-tight
              "
            >
              Wood-Pressed Oils
            </h1>

            <p
              className="
                mt-5
                text-sm
                sm:text-base
                lg:text-lg
                leading-7
                text-emerald-50/85
                max-w-2xl
              "
            >
              Discover traditionally extracted oils crafted from carefully
              selected seeds using slow, natural pressing methods.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">

              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs sm:text-sm">
                🪵 Traditional Extraction
              </span>

              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs sm:text-sm">
                🌿 Naturally Made
              </span>

              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs sm:text-sm">
                ✨ Unrefined
              </span>

            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          CATEGORY SECTIONS
      =================================================== */}

      <main
        className="
          max-w-[1320px]
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-10
          md:py-14
        "
      >
        {oilSections.length > 0 ? (
          <div className="space-y-14 md:space-y-16">

            {oilSections.map((section) => (
              <section
                key={section.key}
                id={section.key}
                className="scroll-mt-32"
              >

                {/* CATEGORY BANNER */}

                <OilBanner
                  section={section}
                  products={section.products}
                />

                {/* PRODUCTS */}

                <OilProductRow products={section.products} />

              </section>
            ))}

          </div>
        ) : (
          <div
            className="
              py-24
              text-center
              rounded-3xl
              border
              border-[#e9dfcf]
              bg-[#faf6ef]
            "
          >
            <div className="text-6xl mb-5">🌿</div>

            <h2 className="font-serif text-2xl font-bold text-[#173b32]">
              Wood-Pressed Oils Coming Soon
            </h2>

            <p className="mt-3 text-sm text-stone-500">
              Our traditional oil collection is being prepared.
            </p>
          </div>
        )}
      </main>

      {/* ===================================================
          WHY WOOD PRESSED
      =================================================== */}

      <section className="bg-[#075f50] text-white">
        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            py-12
            md:py-16
          "
        >
          <div className="text-center max-w-2xl mx-auto">

            <span className="text-[#e8c56b] text-xs font-bold uppercase tracking-[0.18em]">
              ShreeKrishna Organics
            </span>

            <h2
              className="
                mt-3
                font-serif
                text-3xl
                md:text-4xl
                font-bold
              "
            >
              Traditionally Pressed. Naturally Pure.
            </h2>

          </div>

          <div
            className="
              mt-9
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-4
            "
          >
            {[
              {
                icon: "🪵",
                title: "Traditional Pressing",
                text: "Slow extraction inspired by traditional Indian oil-making methods.",
              },

              {
                icon: "🌱",
                title: "Selected Seeds",
                text: "Carefully selected raw ingredients for authentic flavour and aroma.",
              },

              {
                icon: "🧪",
                title: "No Harsh Refining",
                text: "Made without unnecessary industrial refining processes.",
              },

              {
                icon: "💚",
                title: "Made With Care",
                text: "Prepared for families who value traditional and mindful food choices.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="
                  rounded-2xl
                  border
                  border-white/15
                  bg-white/[0.06]
                  p-5
                  backdrop-blur-sm
                "
              >
                <div
                  className="
                    w-11
                    h-11
                    rounded-xl
                    bg-[#e8c56b]/15
                    flex
                    items-center
                    justify-center
                    text-xl
                    mb-4
                  "
                >
                  {item.icon}
                </div>

                <h3 className="font-serif font-bold text-base text-[#f5df9f]">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-emerald-50/75">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}