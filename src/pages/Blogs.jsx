import React, { useEffect, useMemo, useState } from "react";
import { blogApi } from "../services/blogApi";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Search,
  Leaf,
  BookOpen,
  Sparkles,
  Heart,
  ChefHat,
} from "lucide-react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80";

const toPlainText = (value = "") => String(value).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const getReadTime = (content) => `${Math.max(1, Math.ceil(toPlainText(content).split(/\s+/).filter(Boolean).length / 200))} min read`;

/* =========================================================
   BLOG PAGE
========================================================= */

export default function Blogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    blogApi.getPublishedBlogs()
      .then((items) => {
        if (!active) return;
        const normalized = (Array.isArray(items) ? items : []).map((item) => ({
          ...item,
          category: "Articles",
          image: item.imageUrl || FALLBACK_IMAGE,
          shortDescription: toPlainText(item.content).slice(0, 180) + (toPlainText(item.content).length > 180 ? "..." : ""),
          readTime: getReadTime(item.content),
        }));
        setBlogPosts(normalized);
      })
      .catch((err) => { if (active) setLoadError(err.message || "Unable to load articles."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  /* =======================================================
     CATEGORIES
  ======================================================= */

  const categories = useMemo(() => {
    const uniqueCategories = blogPosts
      .map((post) => post.category)
      .filter(Boolean);

    return ["All", ...new Set(uniqueCategories)];
  }, [blogPosts]);

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
  }, [blogPosts, searchQuery, selectedCategory]);

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
              Shreekrishna
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

        {loading && <div className="rounded-2xl border border-[#E7DED0] bg-white px-5 py-12 text-center text-sm text-gray-500">Loading articles...</div>}
        {loadError && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-5 text-center text-sm text-red-700">{loadError}</div>}

        {/* NO RESULT */}

        {!loading && !loadError && filteredPosts.length === 0 && (
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
              {blogPosts.length === 0 ? "No published blogs yet. Please check back soon." : "Try another search or category."}
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

        {!loading && !loadError && filteredPosts.length > 0 && (
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

                  {/* READ ARTICLE */}

                  <Link
                    to={`/blogs/${post.slug}`}
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
                  </Link>

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
              Shreekrishna Journal
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
            Discover More from Shreekrishna
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
            Explore our latest articles, ingredient stories and traditional food wisdom from Shreekrishna Organics.
          </p>



        </div>
      </section>

    </div>
  );
}