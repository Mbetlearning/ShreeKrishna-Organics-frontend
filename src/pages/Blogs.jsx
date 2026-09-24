import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Search,
  Leaf,
  Salad,
  BookOpen,
  Sparkles,
  Heart,
  ChefHat,
  Flower2,
} from "lucide-react";

/* =========================================================
   DEMO BLOG DATA
   Backend connect करण्याची सध्या गरज नाही.
========================================================= */

const blogPosts = [
  {
    id: 1,
    title: "Why Traditional Wood-Pressed Oils Matter",
    slug: "why-traditional-wood-pressed-oils-matter",
    category: "Food & Wellness",
    shortDescription:
      "Discover the traditional process behind wood-pressed oils and how carefully selected seeds become everyday kitchen oils.",
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=80",
    readTime: "6 min read",
    publishedAt: "2026-09-22",
  },

  {
    id: 2,
    title: "A Simple Guide to Choosing Cooking Oils",
    slug: "simple-guide-to-choosing-cooking-oils",
    category: "Kitchen Guide",
    shortDescription:
      "A simple guide to understanding different cooking oils and choosing the right oil for everyday recipes.",
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=80",
    readTime: "5 min read",
    publishedAt: "2026-09-21",
  },

  {
    id: 3,
    title: "Traditional Jaggery in the Indian Kitchen",
    slug: "traditional-jaggery-indian-kitchen",
    category: "Traditional Foods",
    shortDescription:
      "Explore how jaggery has been traditionally used in Indian kitchens, beverages, sweets and everyday recipes.",
    image:
      "https://images.unsplash.com/photo-1605197161470-d0261cac6767?auto=format&fit=crop&w=1200&q=80",
    readTime: "7 min read",
    publishedAt: "2026-09-20",
  },

  {
    id: 4,
    title: "Understanding the Traditional Bilona Method",
    slug: "understanding-traditional-bilona-method",
    category: "Traditional Foods",
    shortDescription:
      "Learn about the traditional bilona method and the steps involved in preparing ghee using an age-old process.",
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=80",
    readTime: "6 min read",
    publishedAt: "2026-09-19",
  },

  {
    id: 5,
    title: "Building a Wholesome Everyday Kitchen",
    slug: "building-wholesome-everyday-kitchen",
    category: "Healthy Living",
    shortDescription:
      "Simple ideas for creating an everyday kitchen centred around wholesome ingredients and home-cooked food.",
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
    readTime: "5 min read",
    publishedAt: "2026-09-18",
  },

  {
    id: 6,
    title: "From Farm Ingredients to Your Kitchen",
    slug: "from-farm-ingredients-to-your-kitchen",
    category: "Our Story",
    shortDescription:
      "A look at why ingredient selection, traditional preparation and thoughtful sourcing matter in everyday food.",
    image:
      "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=1200&q=80",
    readTime: "4 min read",
    publishedAt: "2026-09-17",
  },
];

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80";

/* =========================================================
   BLOG PAGE
========================================================= */

export default function Blogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  /* =======================================================
     CATEGORIES
  ======================================================= */

  const categories = useMemo(() => {
    const uniqueCategories = blogPosts
      .map((post) => post.category)
      .filter(Boolean);

    return ["All", ...new Set(uniqueCategories)];
  }, []);

  /* =======================================================
     FILTER BLOGS
  ======================================================= */

  const filteredPosts = useMemo(() => {
    let result = [...blogPosts];

    if (selectedCategory !== "All") {
      result = result.filter(
        (post) => post.category === selectedCategory
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();

      result = result.filter((post) => {
        const searchableText = `
          ${post.title || ""}
          ${post.shortDescription || ""}
          ${post.category || ""}
        `.toLowerCase();

        return searchableText.includes(query);
      });
    }

    return result;
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#26362F]">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#075e4d] text-white">

        {/* DECORATION */}

        <div
          className="
            absolute
            -top-28
            -right-20
            w-80
            h-80
            rounded-full
            bg-[#D9B85B]/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-32
            -left-20
            w-80
            h-80
            rounded-full
            bg-white/5
            blur-3xl
          "
        />

        <div
          className="
            absolute
            top-12
            left-[25%]
            w-40
            h-40
            rounded-full
            bg-[#7FB069]/10
            blur-3xl
          "
        />

        <div
          className="
            relative
            max-w-7xl
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            py-16
            md:py-20
          "
        >
          <div className="max-w-3xl">

            {/* BADGE */}

            <div
              className="
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                border
                border-[#E6CC7A]/30
                bg-white/5
                text-[#F4D77E]
                text-xs
                sm:text-sm
                font-semibold
                mb-6
              "
            >
              <BookOpen size={16} />

              Stories • Recipes • Wellness
            </div>

            {/* TITLE */}

            <h1
              className="
                font-serif
                text-4xl
                sm:text-5xl
                lg:text-6xl
                font-bold
                leading-tight
              "
            >
              ShreeKrishna
              <span className="text-[#F0CF70]">
                {" "}
                Blogs
              </span>
            </h1>

            {/* DESCRIPTION */}

            <p
              className="
                mt-5
                max-w-2xl
                text-sm
                sm:text-base
                md:text-lg
                leading-8
                text-white/80
              "
            >
              Explore traditional food wisdom, wholesome recipes,
              ingredient stories and simple ideas for a thoughtful
              everyday kitchen.
            </p>

            {/* FEATURES */}

            <div
              className="
                mt-8
                flex
                flex-wrap
                items-center
                gap-5
                text-xs
                sm:text-sm
                text-white/80
              "
            >
              <span className="flex items-center gap-2">
                <Leaf
                  size={16}
                  className="text-[#F0CF70]"
                />
                Natural Living
              </span>

              <span className="flex items-center gap-2">
                <ChefHat
                  size={16}
                  className="text-[#F0CF70]"
                />
                Recipes
              </span>

              <span className="flex items-center gap-2">
                <Sparkles
                  size={16}
                  className="text-[#F0CF70]"
                />
                Traditional Wisdom
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          BLOG COLLECTIONS
      ===================================================== */}

      <section
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

        <div className="text-center">

          <p
            className="
              text-[#B17A25]
              text-xs
              font-bold
              uppercase
              tracking-[0.18em]
            "
          >
            Explore Our Collections
          </p>

          <h2
            className="
              mt-2
              font-serif
              text-2xl
              sm:text-3xl
              font-bold
              text-[#213B32]
            "
          >
            Recipes & Stories for Everyday Living
          </h2>

          <p
            className="
              max-w-2xl
              mx-auto
              mt-3
              text-sm
              leading-6
              text-gray-500
            "
          >
            Browse our recipe collections or discover articles
            about food, ingredients and traditional preparation.
          </p>

        </div>

        {/* COLLECTION CARDS */}

        <div
          className="
            mt-9
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
          "
        >

          {/* MEDICINAL RECIPES */}

          <Link
            to="/blogs/medicinal-recipes"
            className="
              group
              relative
              overflow-hidden
              min-h-[280px]
              rounded-3xl
              bg-[#123F34]
              shadow-sm
              hover:shadow-xl
              transition-all
              duration-300
            "
          >

            <img
              src="https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=1200&q=80"
              alt="Medicinal Recipes"
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
                opacity-35
                group-hover:scale-105
                transition-transform
                duration-700
              "
            />

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-[#073d32]
                via-[#073d32]/70
                to-transparent
              "
            />

            <div
              className="
                relative
                z-10
                h-full
                min-h-[280px]
                flex
                flex-col
                justify-end
                p-7
                sm:p-8
              "
            >
              <div
                className="
                  w-12
                  h-12
                  rounded-full
                  bg-[#F0CF70]
                  text-[#075e4d]
                  flex
                  items-center
                  justify-center
                  mb-5
                "
              >
                <Flower2 size={23} />
              </div>

              <p
                className="
                  text-[#F0CF70]
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.15em]
                "
              >
                Traditional Kitchen
              </p>

              <h3
                className="
                  mt-2
                  font-serif
                  text-2xl
                  sm:text-3xl
                  font-bold
                  text-white
                "
              >
                Medicinal Recipes
              </h3>

              <p
                className="
                  mt-3
                  max-w-md
                  text-sm
                  leading-6
                  text-white/75
                "
              >
                Explore traditional recipes made with herbs,
                spices and familiar Indian kitchen ingredients.
              </p>

              <span
                className="
                  inline-flex
                  items-center
                  gap-2
                  mt-5
                  text-sm
                  font-bold
                  text-[#F0CF70]
                "
              >
                Explore Recipes

                <ArrowRight
                  size={17}
                  className="
                    group-hover:translate-x-1
                    transition-transform
                  "
                />
              </span>
            </div>

          </Link>

          {/* HEALTHY RECIPES */}

          <Link
            to="/blogs/healthy-recipes"
            className="
              group
              relative
              overflow-hidden
              min-h-[280px]
              rounded-3xl
              bg-[#123F34]
              shadow-sm
              hover:shadow-xl
              transition-all
              duration-300
            "
          >

            <img
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80"
              alt="Healthy Recipes"
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
                opacity-40
                group-hover:scale-105
                transition-transform
                duration-700
              "
            />

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-[#073d32]
                via-[#073d32]/70
                to-transparent
              "
            />

            <div
              className="
                relative
                z-10
                h-full
                min-h-[280px]
                flex
                flex-col
                justify-end
                p-7
                sm:p-8
              "
            >
              <div
                className="
                  w-12
                  h-12
                  rounded-full
                  bg-[#F0CF70]
                  text-[#075e4d]
                  flex
                  items-center
                  justify-center
                  mb-5
                "
              >
                <Salad size={23} />
              </div>

              <p
                className="
                  text-[#F0CF70]
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.15em]
                "
              >
                Wholesome Kitchen
              </p>

              <h3
                className="
                  mt-2
                  font-serif
                  text-2xl
                  sm:text-3xl
                  font-bold
                  text-white
                "
              >
                Healthy Recipes
              </h3>

              <p
                className="
                  mt-3
                  max-w-md
                  text-sm
                  leading-6
                  text-white/75
                "
              >
                Discover simple, colourful and wholesome recipe
                ideas for your everyday kitchen.
              </p>

              <span
                className="
                  inline-flex
                  items-center
                  gap-2
                  mt-5
                  text-sm
                  font-bold
                  text-[#F0CF70]
                "
              >
                Explore Recipes

                <ArrowRight
                  size={17}
                  className="
                    group-hover:translate-x-1
                    transition-transform
                  "
                />
              </span>
            </div>

          </Link>

        </div>
      </section>

      {/* =====================================================
          SEARCH + CATEGORY
      ===================================================== */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          pb-10
        "
      >
        <div
          className="
            bg-white
            border
            border-[#E7DED0]
            rounded-2xl
            shadow-sm
            p-4
            md:p-5
          "
        >
          <div
            className="
              flex
              flex-col
              lg:flex-row
              lg:items-center
              justify-between
              gap-5
            "
          >

            {/* SEARCH */}

            <div
              className="
                flex
                items-center
                gap-3
                bg-[#F8F5EE]
                border
                border-[#E7DED0]
                rounded-xl
                px-4
                h-12
                w-full
                lg:max-w-md
              "
            >
              <Search
                size={18}
                className="text-[#6E7B75]"
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Search ShreeKrishna blogs..."
                className="
                  flex-1
                  bg-transparent
                  outline-none
                  text-sm
                  text-[#26362F]
                  placeholder:text-gray-400
                "
              />
            </div>

            {/* CATEGORIES */}

            <div
              className="
                flex
                items-center
                gap-2
                overflow-x-auto
                pb-1
              "
            >
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                  className={`
                    shrink-0
                    px-4
                    py-2.5
                    rounded-full
                    text-xs
                    font-semibold
                    transition

                    ${
                      selectedCategory === category
                        ? "bg-[#075e4d] text-white"
                        : "bg-[#F4F0E7] text-[#4D5A54] hover:bg-[#EAE4D8]"
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          BLOG ARTICLES
      ===================================================== */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          pb-20
        "
      >

        {/* HEADING */}

        <div
          className="
            flex
            items-end
            justify-between
            gap-4
            mb-7
          "
        >
          <div>

            <p
              className="
                text-[#B17A25]
                text-xs
                font-bold
                uppercase
                tracking-[0.18em]
              "
            >
              From Our Journal
            </p>

            <h2
              className="
                mt-2
                font-serif
                text-2xl
                sm:text-3xl
                font-bold
                text-[#213B32]
              "
            >
              Latest Stories & Articles
            </h2>

          </div>

          <p className="hidden sm:block text-sm text-gray-500">
            {filteredPosts.length} Articles
          </p>

        </div>

        {/* NO RESULT */}

        {filteredPosts.length === 0 && (
          <div
            className="
              bg-white
              border
              border-[#E7DED0]
              rounded-2xl
              py-14
              px-5
              text-center
            "
          >
            <Search
              size={30}
              className="mx-auto text-gray-300"
            />

            <h3
              className="
                mt-4
                font-bold
                text-[#26362F]
              "
            >
              No articles found
            </h3>

            <p
              className="
                mt-2
                text-sm
                text-gray-500
              "
            >
              Try another search or category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="
                mt-5
                bg-[#075e4d]
                hover:bg-[#064c3f]
                text-white
                px-5
                py-2.5
                rounded-full
                text-xs
                font-semibold
                transition
              "
            >
              Show All Articles
            </button>
          </div>
        )}

        {/* BLOG GRID */}

        {filteredPosts.length > 0 && (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-6
            "
          >
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="
                  group
                  bg-white
                  rounded-2xl
                  border
                  border-[#E7DED0]
                  overflow-hidden
                  shadow-sm
                  hover:shadow-xl
                  hover:-translate-y-1
                  transition-all
                  duration-300
                "
              >

                {/* IMAGE */}

                <div
                  className="
                    relative
                    aspect-[16/10]
                    overflow-hidden
                    bg-[#EEE9DF]
                  "
                >
                  <img
                    src={post.image || FALLBACK_IMAGE}
                    alt={post.title}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        FALLBACK_IMAGE;
                    }}
                    className="
                      w-full
                      h-full
                      object-cover
                      group-hover:scale-105
                      transition-transform
                      duration-500
                    "
                  />

                  <span
                    className="
                      absolute
                      top-4
                      left-4
                      bg-[#075e4d]
                      text-white
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      px-3
                      py-1.5
                      rounded-full
                    "
                  >
                    {post.category}
                  </span>

                  <span
                    className="
                      absolute
                      top-4
                      right-4
                      w-9
                      h-9
                      rounded-full
                      bg-white/95
                      shadow-sm
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <BookOpen
                      size={16}
                      className="text-[#075e4d]"
                    />
                  </span>
                </div>

                {/* CONTENT */}

                <div className="p-5">

                  {/* META */}

                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-4
                      text-[11px]
                      text-gray-400
                      mb-3
                    "
                  >
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={13} />

                      {new Date(
                        post.publishedAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Clock3 size={13} />
                      {post.readTime}
                    </span>
                  </div>

                  {/* TITLE */}

                  <h3
                    className="
                      font-serif
                      text-xl
                      font-bold
                      leading-snug
                      text-[#213B32]
                      group-hover:text-[#075e4d]
                      transition
                      line-clamp-2
                    "
                  >
                    {post.title}
                  </h3>

                  {/* DESCRIPTION */}

                  <p
                    className="
                      mt-3
                      text-sm
                      leading-6
                      text-gray-500
                      line-clamp-3
                    "
                  >
                    {post.shortDescription}
                  </p>

                  {/* READ ARTICLE
                      Detail page route नंतर add करू.
                  */}

                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2
                      mt-5
                      text-sm
                      font-bold
                      text-[#075e4d]
                    "
                  >
                    Read Article

                    <ArrowRight
                      size={16}
                      className="
                        group-hover:translate-x-1
                        transition-transform
                      "
                    />
                  </div>

                </div>
              </article>
            ))}
          </div>
        )}

      </section>

      {/* =====================================================
          WHY OUR BLOG
      ===================================================== */}

      <section
        className="
          bg-white
          border-y
          border-[#E7DED0]
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
            md:py-16
          "
        >

          <div className="text-center">

            <p
              className="
                text-[#B17A25]
                text-xs
                font-bold
                uppercase
                tracking-[0.18em]
              "
            >
              ShreeKrishna Journal
            </p>

            <h2
              className="
                mt-2
                font-serif
                text-2xl
                sm:text-3xl
                font-bold
                text-[#213B32]
              "
            >
              Food, Tradition & Everyday Living
            </h2>

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

            {/* CARD 1 */}

            <div
              className="
                bg-[#FAF7F0]
                border
                border-[#E7DED0]
                rounded-2xl
                p-6
                text-center
              "
            >
              <div
                className="
                  w-12
                  h-12
                  mx-auto
                  rounded-full
                  bg-[#EDF5E8]
                  flex
                  items-center
                  justify-center
                "
              >
                <Leaf
                  size={22}
                  className="text-[#075e4d]"
                />
              </div>

              <h3
                className="
                  mt-4
                  font-serif
                  text-lg
                  font-bold
                  text-[#213B32]
                "
              >
                Ingredient Stories
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-gray-500
                "
              >
                Learn more about traditional ingredients
                and how they are used in everyday cooking.
              </p>
            </div>

            {/* CARD 2 */}

            <div
              className="
                bg-[#FAF7F0]
                border
                border-[#E7DED0]
                rounded-2xl
                p-6
                text-center
              "
            >
              <div
                className="
                  w-12
                  h-12
                  mx-auto
                  rounded-full
                  bg-[#EDF5E8]
                  flex
                  items-center
                  justify-center
                "
              >
                <ChefHat
                  size={22}
                  className="text-[#075e4d]"
                />
              </div>

              <h3
                className="
                  mt-4
                  font-serif
                  text-lg
                  font-bold
                  text-[#213B32]
                "
              >
                Kitchen Ideas
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-gray-500
                "
              >
                Discover simple recipe ideas and practical
                inspiration for the home kitchen.
              </p>
            </div>

            {/* CARD 3 */}

            <div
              className="
                bg-[#FAF7F0]
                border
                border-[#E7DED0]
                rounded-2xl
                p-6
                text-center
              "
            >
              <div
                className="
                  w-12
                  h-12
                  mx-auto
                  rounded-full
                  bg-[#EDF5E8]
                  flex
                  items-center
                  justify-center
                "
              >
                <Heart
                  size={22}
                  className="text-[#075e4d]"
                />
              </div>

              <h3
                className="
                  mt-4
                  font-serif
                  text-lg
                  font-bold
                  text-[#213B32]
                "
              >
                Thoughtful Living
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-gray-500
                "
              >
                Explore simple ideas centred around
                wholesome food and everyday living.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          BOTTOM CTA
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
            text-center
          "
        >
          <BookOpen
            size={32}
            className="
              mx-auto
              text-[#F0CF70]
            "
          />

          <h2
            className="
              mt-4
              font-serif
              text-2xl
              sm:text-3xl
              font-bold
            "
          >
            Discover More from ShreeKrishna
          </h2>

          <p
            className="
              max-w-2xl
              mx-auto
              mt-3
              text-sm
              sm:text-base
              leading-7
              text-white/75
            "
          >
            Explore traditional recipes, wholesome food ideas
            and stories inspired by ingredients from the
            ShreeKrishna Organics kitchen.
          </p>

          <div
            className="
              mt-7
              flex
              flex-col
              sm:flex-row
              justify-center
              gap-3
            "
          >

            <Link
              to="/blogs/medicinal-recipes"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                px-6
                py-3
                rounded-xl
                bg-[#F0CF70]
                hover:bg-[#E5C25E]
                text-[#075e4d]
                text-sm
                font-bold
                transition
              "
            >
              Medicinal Recipes
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/blogs/healthy-recipes"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                px-6
                py-3
                rounded-xl
                border
                border-white/25
                bg-white/5
                hover:bg-white/10
                text-white
                text-sm
                font-bold
                transition
              "
            >
              Healthy Recipes
              <ArrowRight size={16} />
            </Link>

          </div>

        </div>
      </section>

    </div>
  );
}