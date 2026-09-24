import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Search,
  Leaf,
  Salad,
  Heart,
  Sparkles,
  ChefHat,
} from "lucide-react";

/* =========================================================
   DEMO HEALTHY RECIPES
   Backend connect करण्याची सध्या गरज नाही.
========================================================= */

const healthyRecipes = [
  {
    id: 1,
    title: "Healthy Millet Breakfast",
    slug: "healthy-millet-breakfast",
    category: "Breakfast",
    shortDescription:
      "A simple, wholesome and delicious millet breakfast for a healthy start to your day.",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80",
    ingredients:
      "Millet, vegetables, ghee and spices",
    readTime: "6 min read",
    publishedAt: "2026-09-22",
  },

  {
    id: 2,
    title: "Fresh Vegetable Power Bowl",
    slug: "fresh-vegetable-power-bowl",
    category: "Lunch",
    shortDescription:
      "A colourful bowl filled with fresh vegetables, greens and wholesome ingredients.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    ingredients:
      "Fresh vegetables, greens, seeds and dressing",
    readTime: "5 min read",
    publishedAt: "2026-09-21",
  },

  {
    id: 3,
    title: "Healthy Fruit & Nut Breakfast",
    slug: "healthy-fruit-nut-breakfast",
    category: "Breakfast",
    shortDescription:
      "A naturally delicious breakfast prepared with fresh fruits, nuts and wholesome ingredients.",
    image:
      "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=1200&q=80",
    ingredients:
      "Fresh fruits, nuts, seeds and grains",
    readTime: "4 min read",
    publishedAt: "2026-09-20",
  },

  {
    id: 4,
    title: "Wholesome Vegetable Soup",
    slug: "wholesome-vegetable-soup",
    category: "Dinner",
    shortDescription:
      "A warm and comforting vegetable soup made with simple everyday ingredients.",
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
    ingredients:
      "Vegetables, herbs, spices and natural seasoning",
    readTime: "7 min read",
    publishedAt: "2026-09-19",
  },

  {
    id: 5,
    title: "Fresh Green Salad",
    slug: "fresh-green-salad",
    category: "Salads",
    shortDescription:
      "A light and refreshing green salad packed with colourful vegetables and seeds.",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80",
    ingredients:
      "Leafy greens, cucumber, vegetables and seeds",
    readTime: "4 min read",
    publishedAt: "2026-09-18",
  },

  {
    id: 6,
    title: "Fruit & Seed Energy Bowl",
    slug: "fruit-seed-energy-bowl",
    category: "Snacks",
    shortDescription:
      "A quick and colourful fruit bowl with nuts and seeds for an easy everyday snack.",
    image:
      "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=1200&q=80",
    ingredients:
      "Seasonal fruits, nuts, seeds and grains",
    readTime: "3 min read",
    publishedAt: "2026-09-17",
  },
];

/* =========================================================
   FALLBACK IMAGE
========================================================= */

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80";

/* =========================================================
   HEALTHY RECIPES PAGE
========================================================= */

export default function HealthyRecipes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  /* =======================================================
     CATEGORIES
  ======================================================= */

  const categories = useMemo(() => {
    const uniqueCategories = healthyRecipes
      .map((recipe) => recipe.category)
      .filter(Boolean);

    return ["All", ...new Set(uniqueCategories)];
  }, []);

  /* =======================================================
     SEARCH + CATEGORY FILTER
  ======================================================= */

  const filteredRecipes = useMemo(() => {
    let result = [...healthyRecipes];

    if (selectedCategory !== "All") {
      result = result.filter(
        (recipe) => recipe.category === selectedCategory
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();

      result = result.filter((recipe) => {
        const searchableText = `
          ${recipe.title || ""}
          ${recipe.shortDescription || ""}
          ${recipe.category || ""}
          ${recipe.ingredients || ""}
        `.toLowerCase();

        return searchableText.includes(query);
      });
    }

    return result;
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#26362F]">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#075e4d] text-white">

        {/* BACKGROUND DECORATION */}

        <div
          className="
            absolute
            -top-24
            -right-24
            w-72
            h-72
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
              <Salad size={16} />

              Wholesome • Simple • Delicious
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
              Healthy
              <span className="text-[#F0CF70]">
                {" "}
                Recipes
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
              Discover simple and delicious recipes prepared
              with wholesome ingredients for your everyday
              kitchen.
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
                Natural Ingredients
              </span>

              <span className="flex items-center gap-2">
                <Heart
                  size={16}
                  className="text-[#F0CF70]"
                />
                Everyday Wellness
              </span>

              <span className="flex items-center gap-2">
                <ChefHat
                  size={16}
                  className="text-[#F0CF70]"
                />
                Easy to Prepare
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          SEARCH + CATEGORY FILTER
      ===================================================== */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-10
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
                placeholder="Search healthy recipes..."
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
          RECIPES
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

        {/* SECTION TITLE */}

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
              ShreeKrishna Organics
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
              Explore Healthy Recipes
            </h2>
          </div>

          <p className="hidden sm:block text-sm text-gray-500">
            {filteredRecipes.length} Recipes
          </p>
        </div>

        {/* ===================================================
            NO SEARCH RESULTS
        =================================================== */}

        {filteredRecipes.length === 0 && (
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
              No recipes found
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
              Show All Recipes
            </button>
          </div>
        )}

        {/* ===================================================
            RECIPE GRID
        =================================================== */}

        {filteredRecipes.length > 0 && (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-6
            "
          >
            {filteredRecipes.map((recipe) => (
              <article
                key={recipe.id}
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

                <Link
                  to={`/blogs/healthy-recipes/${recipe.slug}`}
                  className="
                    block
                    relative
                    aspect-[16/10]
                    overflow-hidden
                    bg-[#EEE9DF]
                  "
                >
                  <img
                    src={recipe.image || FALLBACK_IMAGE}
                    alt={recipe.title}
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

                  {/* CATEGORY */}

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
                    {recipe.category}
                  </span>

                  {/* HEART */}

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
                    <Heart
                      size={16}
                      className="text-[#075e4d]"
                    />
                  </span>
                </Link>

                {/* CARD CONTENT */}

                <div className="p-5">

                  {/* DATE + READ TIME */}

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
                    <span
                      className="
                        flex
                        items-center
                        gap-1.5
                      "
                    >
                      <CalendarDays size={13} />

                      {new Date(
                        recipe.publishedAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>

                    <span
                      className="
                        flex
                        items-center
                        gap-1.5
                      "
                    >
                      <Clock3 size={13} />

                      {recipe.readTime}
                    </span>
                  </div>

                  {/* TITLE */}

                  <Link
                    to={`/blogs/healthy-recipes/${recipe.slug}`}
                  >
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
                      {recipe.title}
                    </h3>
                  </Link>

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
                    {recipe.shortDescription}
                  </p>

                  {/* READ MORE */}

                  <Link
                    to={`/blogs/healthy-recipes/${recipe.slug}`}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      mt-5
                      text-sm
                      font-bold
                      text-[#075e4d]
                      hover:text-[#B17A25]
                      transition
                    "
                  >
                    View Recipe

                    <ArrowRight
                      size={16}
                      className="
                        group-hover:translate-x-1
                        transition-transform
                      "
                    />
                  </Link>

                </div>
              </article>
            ))}
          </div>
        )}

      </section>

      {/* =====================================================
          WHY HEALTHY RECIPES
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

          {/* TITLE */}

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
              Eat Better Every Day
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
              Simple Food. Better Choices.
            </h2>

          </div>

          {/* FEATURES */}

          <div
            className="
              mt-10
              grid
              grid-cols-1
              md:grid-cols-3
              gap-5
            "
          >

            {/* FEATURE 1 */}

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
                Wholesome Ingredients
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-gray-500
                "
              >
                Recipes focused on simple
                and thoughtfully selected
                ingredients.
              </p>
            </div>

            {/* FEATURE 2 */}

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
                Easy Cooking
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-gray-500
                "
              >
                Practical recipes designed
                for your everyday home
                kitchen.
              </p>
            </div>

            {/* FEATURE 3 */}

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
                <Sparkles
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
                Fresh Ideas
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-gray-500
                "
              >
                Discover new ways to bring
                wholesome food into everyday
                meals.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          BOTTOM SECTION
      ===================================================== */}

      <section
        className="
          bg-[#075e4d]
          text-white
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            py-12
            text-center
          "
        >
          <Salad
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
            Healthy Food Can Be Simple
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
            Explore easy recipes, wholesome
            ingredients and delicious ideas
            for your everyday kitchen.
          </p>

        </div>
      </section>

    </div>
  );
}