import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgePercent,
  Clock3,
  Flame,
  Gift,
  ShoppingBag,
  Sparkles,
  Tag,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { productService } from "../services/productService";

export default function HotDeals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sliderRef = useRef(null);

  /* =========================================================
     LOAD PRODUCTS
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

        if (active) {
          setProducts(allProducts || []);
        }
      } catch (err) {
        console.error("Unable to load hot deals:", err);

        if (active) {
          setProducts([]);
          setError("Unable to load deals right now.");
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
     FIND DISCOUNTED PRODUCTS
  ========================================================= */

  const dealProducts = useMemo(() => {
    return products
      .filter((product) => {
        const sizes = product.sizes || [];

        const hasSizeDiscount = sizes.some((size) => {
          const price = Number(size.price || 0);
          const mrp = Number(size.mrp || 0);

          return mrp > price && price > 0;
        });

        const productPrice = Number(product.price || 0);
        const productMrp = Number(product.originalPrice || 0);

        const hasProductDiscount =
          productMrp > productPrice && productPrice > 0;

        const text = `
          ${product.name || ""}
          ${product.slug || ""}
          ${product.badge || ""}
          ${product.tagline || ""}
        `.toLowerCase();

        const markedAsDeal =
          text.includes("deal") ||
          text.includes("offer") ||
          text.includes("sale") ||
          text.includes("combo");

        return hasSizeDiscount || hasProductDiscount || markedAsDeal;
      })
      .sort((a, b) => getDiscount(b) - getDiscount(a));
  }, [products]);

  /* =========================================================
     CALCULATE DISCOUNT
  ========================================================= */

  function getDiscount(product) {
    const defaultSize =
      product.sizes?.find((size) => size.isDefault) ||
      product.sizes?.[0];

    const price = Number(
      defaultSize?.price ||
      product.price ||
      0
    );

    const mrp = Number(
      defaultSize?.mrp ||
      product.originalPrice ||
      0
    );

    if (!price || !mrp || mrp <= price) {
      return 0;
    }

    return Math.round(((mrp - price) / mrp) * 100);
  }

  /* =========================================================
     SCROLL PRODUCTS
  ========================================================= */

  const scrollProducts = (direction) => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: direction === "left" ? -330 : 330,
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
          from-[#fff1dc]
          via-[#ffe5bb]
          to-[#f5c88c]
        "
      >
        {/* BACKGROUND */}

        <div
          className="
            absolute
            -top-40
            -left-32
            w-[500px]
            h-[500px]
            rounded-full
            bg-white/40
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
            bg-[#c95f38]/15
            blur-3xl
          "
        />

        <Flame
          className="
            absolute
            top-10
            right-[7%]
            w-48
            h-48
            text-[#b5563c]
            opacity-[0.06]
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
                bg-white/60
                border
                border-[#b5563c]/20
                rounded-full
                px-4
                py-2
                backdrop-blur-sm
              "
            >
              <Flame className="w-4 h-4 text-[#b5563c]" />

              <span
                className="
                  text-[11px]
                  sm:text-xs
                  font-bold
                  uppercase
                  tracking-[0.17em]
                  text-[#9e442b]
                "
              >
                Special Savings
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
              Hot Deals

              <span className="block mt-1 text-[#b5563c]">
                You’ll Love
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
                text-[#66584b]
              "
            >
              Discover special prices across selected ShreeKrishna
              Organics products and combo packs.
            </p>

            {/* BADGES */}

            <div className="mt-7 flex flex-wrap gap-3">

              <span
                className="
                  inline-flex
                  items-center
                  gap-2
                  bg-white/55
                  border
                  border-white/70
                  rounded-full
                  px-4
                  py-2
                  text-xs
                  sm:text-sm
                  font-semibold
                  text-[#59483c]
                "
              >
                <BadgePercent size={15} />

                Special Prices
              </span>

              <span
                className="
                  inline-flex
                  items-center
                  gap-2
                  bg-white/55
                  border
                  border-white/70
                  rounded-full
                  px-4
                  py-2
                  text-xs
                  sm:text-sm
                  font-semibold
                  text-[#59483c]
                "
              >
                <Gift size={15} />

                Combo Savings
              </span>

              <span
                className="
                  inline-flex
                  items-center
                  gap-2
                  bg-white/55
                  border
                  border-white/70
                  rounded-full
                  px-4
                  py-2
                  text-xs
                  sm:text-sm
                  font-semibold
                  text-[#59483c]
                "
              >
                <Sparkles size={15} />

                Selected Products
              </span>

            </div>

            <a
              href="#hot-deals"
              className="
                mt-8
                inline-flex
                items-center
                gap-2
                bg-[#b5563c]
                hover:bg-[#9e442b]
                text-white
                rounded-full
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
              Shop Hot Deals

              <ArrowRight size={17} />
            </a>

          </div>

          {/* RIGHT */}

          <div className="relative flex items-center justify-center">

            <div
              className="
                absolute
                w-[300px]
                h-[300px]
                sm:w-[400px]
                sm:h-[400px]
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
                shadow-[0_25px_60px_rgba(126,63,34,0.15)]
                p-7
                flex
                items-center
                justify-center
              "
            >
              {dealProducts[0]?.image ? (
                <img
                  src={dealProducts[0].image}
                  alt={dealProducts[0].name}
                  className="
                    w-full
                    h-full
                    object-cover
                    rounded-[30px]
                  "
                />
              ) : (
                <div className="text-[110px]">
                  🔥
                </div>
              )}
            </div>

            {/* SALE BADGE */}

            <div
              className="
                absolute
                z-20
                top-0
                right-2
                sm:right-6
                w-20
                h-20
                sm:w-24
                sm:h-24
                rounded-full
                bg-[#b5563c]
                text-white
                flex
                flex-col
                items-center
                justify-center
                shadow-xl
                border-4
                border-[#fff4df]
                rotate-6
              "
            >
              <span className="text-[10px] uppercase font-bold">
                Hot
              </span>

              <span className="text-lg sm:text-xl font-black">
                DEALS
              </span>
            </div>

            {/* BOTTOM BADGE */}

            <div
              className="
                absolute
                z-20
                bottom-2
                left-0
                sm:left-5
                bg-white
                rounded-2xl
                shadow-xl
                border
                border-[#eadbc8]
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
                  bg-[#fff0e8]
                  flex
                  items-center
                  justify-center
                "
              >
                <Zap className="w-5 h-5 text-[#b5563c]" />
              </div>

              <div>
                <p className="text-xs font-bold text-[#2b241d]">
                  Special Offers
                </p>

                <p className="text-[10px] text-stone-500">
                  Selected products
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          DEAL BENEFITS BAR
      ===================================================== */}

      <section className="bg-[#2b241d] text-white">

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
              icon: BadgePercent,
              title: "Save More",
              text: "Selected Products",
            },
            {
              icon: Flame,
              title: "Hot Deals",
              text: "Special Prices",
            },
            {
              icon: Gift,
              title: "Combo Offers",
              text: "More Together",
            },
            {
              icon: ShoppingBag,
              title: "Easy Shopping",
              text: "Add To Cart",
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
                  "
                >
                  <Icon className="w-5 h-5 text-[#efc36d]" />
                </div>

                <div>

                  <p className="text-xs sm:text-sm font-bold text-[#efc36d]">
                    {item.title}
                  </p>

                  <p className="text-[10px] sm:text-xs text-white/65">
                    {item.text}
                  </p>

                </div>
              </div>
            );
          })}

        </div>
      </section>

      {/* =====================================================
          HOT DEAL PRODUCTS
      ===================================================== */}

      <section
        id="hot-deals"
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

              <Flame className="w-4 h-4 text-[#b5563c]" />

              <span
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-[#b5563c]
                "
              >
                Best Offers
              </span>

            </div>

            <h2
              className="
                mt-2
                font-serif
                font-bold
                text-3xl
                sm:text-4xl
                text-[#2b241d]
              "
            >
              Today's Hot Deals
            </h2>

            <p className="mt-3 text-sm text-stone-500 max-w-xl leading-6">
              Save on selected products from across the ShreeKrishna
              Organics collection.
            </p>

          </div>

          {/* ARROWS */}

          {dealProducts.length > 1 && (
            <div className="hidden sm:flex items-center gap-2">

              <button
                type="button"
                onClick={() => scrollProducts("left")}
                className="
                  w-11
                  h-11
                  rounded-full
                  border
                  border-[#ddd4c9]
                  bg-white
                  text-[#b5563c]
                  flex
                  items-center
                  justify-center
                  hover:bg-[#b5563c]
                  hover:text-white
                  transition
                "
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
                  bg-[#b5563c]
                  text-white
                  flex
                  items-center
                  justify-center
                  hover:bg-[#9e442b]
                  transition
                "
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
              bg-red-50
              border
              border-red-200
              rounded-xl
              px-4
              py-3
              text-red-600
              text-sm
            "
          >
            {error}
          </div>
        )}

        {/* PRODUCTS */}

        {dealProducts.length > 0 ? (

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

              [&::-webkit-scrollbar-track]:bg-[#f1ede8]

              [&::-webkit-scrollbar-thumb]:bg-[#c9b9a8]

              [&::-webkit-scrollbar-thumb]:rounded-full
            "
          >

            {dealProducts.map((product) => (

              <div
                key={product.id}
                className="
                  relative
                  flex-none
                  w-[270px]
                  sm:w-[290px]
                  lg:w-[300px]
                  snap-start
                "
              >

                {/* EXTRA HOT DEAL BADGE */}

                {getDiscount(product) > 0 && (
                  <div
                    className="
                      absolute
                      -top-2
                      -right-2
                      z-30
                      min-w-[54px]
                      h-[54px]
                      px-2
                      rounded-full
                      bg-[#075e4d]
                      text-white
                      flex
                      flex-col
                      items-center
                      justify-center
                      shadow-lg
                      border-2
                      border-white
                    "
                  >
                    <span className="text-sm font-black leading-none">
                      {getDiscount(product)}%
                    </span>

                    <span className="text-[8px] font-bold uppercase">
                      Off
                    </span>
                  </div>
                )}

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
                border-[#eadfd4]
                bg-[#fff7ef]
                px-5
                py-16
                text-center
              "
            >

              <div className="text-6xl">
                🔥
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
                New Deals Coming Soon
              </h3>

              <p className="mt-2 text-sm text-stone-500">
                Discounted products will automatically appear here.
              </p>

              <Link
                to="/shop"
                className="
                  mt-6
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
                Browse Products

                <ArrowRight size={16} />
              </Link>

            </div>
          )
        )}

      </section>

      {/* =====================================================
          DEAL CATEGORIES
      ===================================================== */}

      <section
        className="
          bg-[#faf3e8]
          border-y
          border-[#eadfce]
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

            <Tag className="w-7 h-7 text-[#b5563c] mx-auto" />

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
              Explore More & Save
            </h2>

            <p className="mt-4 text-sm text-stone-500 leading-7">
              Browse our collections and find products for your
              everyday kitchen.
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

            {/* OILS */}

            <Link
              to="/wood-pressed-oils"
              className="
                group
                rounded-3xl
                bg-[#e9f0df]
                border
                border-[#d9e1cd]
                p-6
                min-h-[210px]
                hover:-translate-y-1
                hover:shadow-xl
                transition-all
                duration-300
              "
            >

              <div className="text-4xl">
                🫙
              </div>

              <h3 className="mt-5 font-serif font-bold text-xl text-[#173b32]">
                Wood-Pressed Oils
              </h3>

              <p className="mt-2 text-xs text-stone-500">
                Explore our oil collection.
              </p>

              <span
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-1
                  text-sm
                  font-bold
                  text-[#075e4d]
                "
              >
                Shop Now

                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1 transition"
                />
              </span>

            </Link>

            {/* GHEE */}

            <Link
              to="/a2-ghee"
              className="
                group
                rounded-3xl
                bg-[#fff1c9]
                border
                border-[#ead8a7]
                p-6
                min-h-[210px]
                hover:-translate-y-1
                hover:shadow-xl
                transition-all
                duration-300
              "
            >

              <div className="text-4xl">
                🐄
              </div>

              <h3 className="mt-5 font-serif font-bold text-xl text-[#173b32]">
                A2 Ghee
              </h3>

              <p className="mt-2 text-xs text-stone-500">
                Discover traditional A2 Ghee.
              </p>

              <span
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-1
                  text-sm
                  font-bold
                  text-[#90631b]
                "
              >
                Shop Now

                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1 transition"
                />
              </span>

            </Link>

            {/* JAGGERY */}

            <Link
              to="/jaggery"
              className="
                group
                rounded-3xl
                bg-[#f3e0c9]
                border
                border-[#e5cdb3]
                p-6
                min-h-[210px]
                hover:-translate-y-1
                hover:shadow-xl
                transition-all
                duration-300
              "
            >

              <div className="text-4xl">
                🍯
              </div>

              <h3 className="mt-5 font-serif font-bold text-xl text-[#173b32]">
                Jaggery
              </h3>

              <p className="mt-2 text-xs text-stone-500">
                Explore our jaggery collection.
              </p>

              <span
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-1
                  text-sm
                  font-bold
                  text-[#8a5326]
                "
              >
                Shop Now

                <ArrowRight
                  size={15}
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
                bg-[#fbe7df]
                border
                border-[#edd1c5]
                p-6
                min-h-[210px]
                hover:-translate-y-1
                hover:shadow-xl
                transition-all
                duration-300
              "
            >

              <div className="text-4xl">
                🎁
              </div>

              <h3 className="mt-5 font-serif font-bold text-xl text-[#173b32]">
                Healthy Combos
              </h3>

              <p className="mt-2 text-xs text-stone-500">
                Convenient product combinations.
              </p>

              <span
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-1
                  text-sm
                  font-bold
                  text-[#b5563c]
                "
              >
                Shop Now

                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1 transition"
                />
              </span>

            </Link>

          </div>

        </div>
      </section>

      {/* =====================================================
          OFFER INFO
      ===================================================== */}

      <section className="bg-[#2b241d] text-white">

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

            <Clock3 className="w-7 h-7 text-[#efc36d] mx-auto" />

            <h2
              className="
                mt-4
                font-serif
                font-bold
                text-3xl
                sm:text-4xl
              "
            >
              Don't Miss Our Special Deals
            </h2>

            <p
              className="
                mt-4
                text-sm
                sm:text-base
                leading-7
                text-white/65
              "
            >
              Offers shown on products are based on their current
              listed price and MRP.
            </p>

          </div>

          <div
            className="
              mt-10
              grid
              grid-cols-1
              sm:grid-cols-3
              gap-5
            "
          >

            {[
              {
                emoji: "🔥",
                title: "Hot Prices",
                text: "Discounted products are collected together for easy browsing.",
              },
              {
                emoji: "🏷️",
                title: "Clear Savings",
                text: "Product cards show the current price, MRP and available discount.",
              },
              {
                emoji: "🛒",
                title: "Easy Add To Cart",
                text: "Select your preferred size and add products directly to your cart.",
              },
            ].map((item) => (

              <div
                key={item.title}
                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.05]
                  p-6
                  text-center
                "
              >

                <div className="text-3xl">
                  {item.emoji}
                </div>

                <h3
                  className="
                    mt-4
                    font-serif
                    font-bold
                    text-lg
                    text-[#efc36d]
                  "
                >
                  {item.title}
                </h3>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-white/65
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
              from-[#ffe3c7]
              via-[#fff2d9]
              to-[#f5d6b6]
              border
              border-[#eac9aa]
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
                bg-[#b5563c]/10
              "
            />

            <div className="relative z-10">

              <Flame className="w-9 h-9 text-[#b5563c] mx-auto" />

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
                Grab Your Favourite Deals
              </h2>

              <p
                className="
                  mt-3
                  max-w-xl
                  mx-auto
                  text-sm
                  leading-6
                  text-[#66584b]
                "
              >
                Explore discounted products and combo packs from
                ShreeKrishna Organics.
              </p>

              <a
                href="#hot-deals"
                className="
                  mt-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-[#b5563c]
                  hover:bg-[#9e442b]
                  text-white
                  px-7
                  py-3
                  text-sm
                  font-bold
                  transition
                "
              >
                Shop Hot Deals

                <ArrowRight size={17} />
              </a>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}