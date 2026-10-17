import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Leaf,
  ShieldCheck,
  FlaskConical,
  Tractor,
  Star,
  CheckCircle2,
  Play,
  X,
  Phone,
  MessageCircle,
} from "lucide-react";
import { productService } from "../services/productService";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
/* =========================================================
   HERO SLIDES
========================================================= */
const HERO_SLIDES = [
  {
    id: 1,
    image: "/images/wood-pressed-oils-hero.png",
    smallTitle: "100% PURE & TRADITIONAL",
    title: "Wood-Pressed Oils",
    subtitle: "Purity You Can Taste",
    description:
      "Traditionally extracted at low temperature to preserve natural nutrition, aroma and authentic taste.",
    button: "SHOP NOW",
    link: "/wood-pressed-oils",
  },
  {
    id: 2,
    image: "/images/shreekrishna-ghee.png",
    smallTitle: "TRADITIONALLY PREPARED",
    title: "Pure A2 Cow Ghee",
    subtitle: "Golden Goodness For Your Family",
    description:
      "Made using traditional methods for rich aroma, authentic flavour and wholesome goodness.",
    button: "EXPLORE GHEE",
    link: "/a2-ghee",
  },
  {
    id: 3,
    image: "/images/health-supplements-hero2.png",
    smallTitle: "NATURAL NUTRITION FOR A HEALTHIER TOMORROW",
    title: "Health Supplements",
    subtitle: "Pure Nutrition For A Stronger You",
    description:
      "Naturally sourced supplements to support immunity, energy, digestion and overall well-being.",
    button: "SHOP NOW",
    link: "/health-supplements",
  },
  // 4TH HERO SLIDE - JAGGERY
  {
    id: 4,
    image: "/images/jaggery-banner-01.png",
    smallTitle: "PURE • NATURAL • TRADITIONAL",
    title: "Natural Jaggery",
    subtitle: "Traditional Sweetness, Naturally",
    description:
      "Traditionally prepared jaggery with authentic taste and natural goodness for your family.",
    button: "EXPLORE JAGGERY",
    link: "/jaggery",
  },
];
/* =========================================================
   CATEGORIES
========================================================= */
const CATEGORIES = [
  {
    name: "All",
    icon: "🌿",
    link: "/shop",
  },
  {
    name: "Oils",
    icon: "💧",
    link: "/shop?category=wood-pressed",
  },
  {
    name: "Ghee",
    icon: "🐄",
    link: "/shop?category=a2-ghee",
  },
  {
    name: "Jaggery",
    icon: "🟫",
    link: "/shop?category=jaggery",
  },
  {
    name: "Wellness",
    icon: "🌱",
    link: "/shop",
  },
];
/* =========================================================
   HOME CATEGORY PRODUCT ROWS
========================================================= */
const HOME_PRODUCT_SECTIONS = [
  { key: "oils", title: "Wood-Pressed Oils", subtitle: "Traditionally pressed, naturally pure", link: "/wood-pressed-oils" },
  { key: "ghee", title: "A2 Cow Ghee", subtitle: "Rich aroma and traditional goodness", link: "/a2-ghee" },
  { key: "jaggery", title: "Natural Jaggery", subtitle: "A naturally sweet tradition", link: "/jaggery" },
  { key: "supplements", title: "Health Supplements", subtitle: "Everyday wellness, naturally", link: "/health-supplements" },
];

function homeProductCategory(product) {
  const category = product.category;
  const parts = [
    typeof category === "string" ? category : category?.name,
    category?.slug,
    product.categoryName,
    product.categorySlug,
    product.categoryType,
  ];
  const value = parts.filter(Boolean).join(" ").toLowerCase().replace(/[_-]/g, " ");
  if (/supplement|wellness|health/.test(value)) return "supplements";
  if (/jaggery|gur|jaggri/.test(value)) return "jaggery";
  if (/ghee/.test(value)) return "ghee";
  if (/oil|wood pressed|cold pressed/.test(value)) return "oils";
  return null;
}

/* =========================================================
   WHY CHOOSE
========================================================= */
const BENEFITS = [
  {
    icon: Leaf,
    title: "Native Sourcing",
    text: "Carefully selected raw materials sourced from trusted growing regions across India.",
  },
  {
    icon: Tractor,
    title: "Traditional Processing",
    text: "Minimally processed using time-tested traditional methods for maximum natural goodness.",
  },
  {
    icon: FlaskConical,
    title: "Extensive Quality Checks",
    text: "Every product goes through careful quality checks before reaching your family.",
  },
  {
    icon: ShieldCheck,
    title: "Purity First",
    text: "Honest ingredients, traditional methods and uncompromised purity in every product.",
  },
];
/* =========================================================
   NATIVE INGREDIENTS
========================================================= */
const INGREDIENTS = [
  {
    title: "From Native Geographies",
    subtitle: "To Ideal Growing Seasons",
    description: "We take care of every factor while sourcing our ingredients.",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=85",
  },
  {
    title: "What Do We Look For?",
    subtitle: "Purity. Nutrition. Authenticity.",
    description:
      "Not high yield. Not lower cost. Just flavour, nutrition and honest ingredients.",
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=700&q=85",
  },
  {
    title: "Impurities, Out.",
    subtitle: "Goodness, In.",
    description: "Only carefully selected ingredients make the cut.",
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=700&q=85",
  },
  {
    title: "Direct From Farmers",
    subtitle: "Honest Ingredients",
    description:
      "Sourcing closer to the farm helps us maintain quality and authenticity.",
    image:
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=700&q=85",
  },
];
/* =========================================================
   QUALITY CHECKS
========================================================= */
const QUALITY_ITEMS = [
  {
    title: "Carefully Selected",
    text: "Only carefully selected raw materials are used for our products.",
    icon: "🌿",
  },
  {
    title: "Multiple Quality Checks",
    text: "Every batch is checked carefully before packaging.",
    icon: "🔬",
  },
  {
    title: "Traditional Processing",
    text: "Traditional techniques help retain authentic flavour and goodness.",
    icon: "⚙️",
  },
  {
    title: "Transparency First",
    text: "Our goal is to deliver food your family can trust every day.",
    icon: "📋",
  },
];
/* CUSTOMER REVIEWS — loaded from the website testimonials API */
/* =========================================================
   HOME COMPONENT
========================================================= */
export default function Home() {
  /* =======================================================
       STATES
    ======================================================= */
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [websiteVideos, setWebsiteVideos] = useState([]);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(false);

  /* =======================================================
       PRODUCT SCROLL
    ======================================================= */
  const productScrollRef = useRef(null);
  const reviewScrollRef = useRef(null);
  const benefitsScrollRef = useRef(null);
  const benefitsDirectionRef = useRef(1);
  const ingredientsScrollRef = useRef(null);
  const qualityScrollRef = useRef(null);
  const rawMaterialScrollRef = useRef(null);
  const ingredientsDirectionRef = useRef(1);
  /* =======================================================
       LOAD PRODUCTS
    ======================================================= */
  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await productService.getAllProducts({
  category: "all",
  sortBy: "featured",
});
        setFeaturedProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading products:", error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);
  /* =======================================================
        LOAD WEBSITE TESTIMONIALS
     ======================================================= */
  useEffect(() => {
    const controller = new AbortController();
    const apiBase = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080")
      .replace(/\/$/, "");

    async function loadReviews() {
      try {
        const response = await fetch(`${apiBase}/api/v1/testimonials`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Reviews API: ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Unexpected reviews response");
        setReviews(
          data
            .filter((item) => item && item.active !== false)
            .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
            .slice(0, 4)
        );
        setReviewsError(false);
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error("Error loading testimonials:", error);
        setReviewsError(true);
      } finally {
        if (!controller.signal.aborted) setReviewsLoading(false);
      }
    }
    loadReviews();
    return () => controller.abort();
  }, []);

  /* =======================================================
        LOAD PUBLIC YOUTUBE VIDEOS
     ======================================================= */
  useEffect(() => {
    const controller = new AbortController();
    const apiBase = (import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1")
      .replace(/\/+$/, "");

    async function loadVideos() {
      try {
        const response = await fetch(`${apiBase}/videos`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Videos API: ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Unexpected videos response");
        setWebsiteVideos(
          data.filter((video) => video && video.active !== false &&
            /^[A-Za-z0-9_-]{11}$/.test(video.videoId || ""))
        );
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error loading website videos:", error);
        }
      }
    }
    loadVideos();
    return () => controller.abort();
  }, []);

  const rawMaterialItems = [
    ...websiteVideos.map((video) => ({
      key: `video-${video.id}`,
      badge: "Shreekrishna",
      duration: "WATCH VIDEO",
      eyebrow: "SHREEKRISHNA ORGANICS",
      title: video.title,
      description: video.description || "Watch our video to learn more.",
      image: video.thumbnailUrl || `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`,
      videoId: video.videoId,
    })),
  ];

  /* =======================================================
       HERO AUTO SLIDE
    ======================================================= */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((current) => {
        return (current + 1) % HERO_SLIDES.length;
      });
    }, 6000);
    return () => clearInterval(timer);
  }, []);
  /* =======================================================
       CURRENT HERO SLIDE
    ======================================================= */
  const slide = HERO_SLIDES[currentSlide];
  /* =======================================================
       NEXT HERO
    ======================================================= */
  const nextSlide = () => {
    setCurrentSlide((current) => (current + 1) % HERO_SLIDES.length);
  };
  /* =======================================================
       PREVIOUS HERO
    ======================================================= */
  const previousSlide = () => {
    setCurrentSlide(
      (current) => (current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
    );
  };
  /* =======================================================
       PRODUCT SCROLL
    ======================================================= */
  const scrollProducts = (direction) => {
    if (!productScrollRef.current) {
      return;
    }
    productScrollRef.current.scrollBy({
      left: direction === "right" ? 900 : -900,
      behavior: "smooth",
    });
  };
  /* =======================================================
       REVIEW SCROLL
    ======================================================= */
  const scrollReviews = (direction) => {
    if (!reviewScrollRef.current) return;
    reviewScrollRef.current.scrollBy({
      left: direction === "right" ? 370 : -370,
      behavior: "smooth",
    });
  };
  /* =======================================================
       BENEFITS SCROLL
    ======================================================= */
  const scrollBenefits = (direction) => {
    if (!benefitsScrollRef.current) return;
    benefitsScrollRef.current.scrollBy({
      left: direction === "right" ? 360 : -360,
      behavior: "smooth",
    });
  };
  /* =======================================================
       BENEFITS AUTO SLIDE - FORWARD / BACKWARD
    ======================================================= */
  useEffect(() => {
    const timer = setInterval(() => {
      const container = benefitsScrollRef.current;
      if (!container) return;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll <= 0) return;
      const atEnd = container.scrollLeft >= maxScroll - 10;
      const atStart = container.scrollLeft <= 10;
      if (atEnd) {
        benefitsDirectionRef.current = -1;
      } else if (atStart) {
        benefitsDirectionRef.current = 1;
      }
      const step = Math.max(300, container.clientWidth * 0.32);
      container.scrollBy({
        left: step * benefitsDirectionRef.current,
        behavior: "smooth",
      });
    }, 2500);
    return () => clearInterval(timer);
  }, []);
  /* =======================================================
       INGREDIENTS SCROLL
    ======================================================= */
  const scrollIngredients = (direction) => {
    if (!ingredientsScrollRef.current) return;
    ingredientsScrollRef.current.scrollBy({
      left: direction === "right" ? 330 : -330,
      behavior: "smooth",
    });
  };
  /* =======================================================
       INGREDIENTS AUTO SLIDE - FORWARD ONLY
    ======================================================= */
  useEffect(() => {
    const timer = setInterval(() => {
      const container = ingredientsScrollRef.current;
      if (!container) return;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll <= 0) return;
      const firstCard = container.firstElementChild;
      const step = firstCard
        ? firstCard.getBoundingClientRect().width + 20
        : 330;
      const atEnd = container.scrollLeft >= maxScroll - 10;
      if (atEnd) {
        container.scrollTo({
          left: 0,
          behavior: "auto",
        });
        return;
      }
      container.scrollBy({
        left: step,
        behavior: "smooth",
      });
    }, 2500);
    return () => clearInterval(timer);
  }, []);
  /* =======================================================
       QUALITY AUTO SLIDE - LEFT / FORWARD ONLY
    ======================================================= */
  useEffect(() => {
    const timer = setInterval(() => {
      const container = qualityScrollRef.current;
      if (!container) return;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll <= 0) return;
      const firstCard = container.firstElementChild;
      const step = firstCard
        ? firstCard.getBoundingClientRect().width + 20
        : 330;
      const atEnd = container.scrollLeft >= maxScroll - 10;
      if (atEnd) {
        container.scrollTo({
          left: 0,
          behavior: "auto",
        });
        return;
      }
      container.scrollBy({
        left: step,
        behavior: "smooth",
      });
    }, 2500);
    return () => clearInterval(timer);
  }, []);
  /* =======================================================
       RAW MATERIAL AUTO SLIDE - LEFT / FORWARD ONLY
    ======================================================= */
  useEffect(() => {
    if (playingVideoId) return;
    const timer = setInterval(() => {
      const container = rawMaterialScrollRef.current;
      if (!container) return;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll <= 0) return;
      const firstCard = container.firstElementChild;
      const step = firstCard
        ? firstCard.getBoundingClientRect().width + 20
        : 330;
      const atEnd = container.scrollLeft >= maxScroll - 10;
      if (atEnd) {
        container.scrollTo({
          left: 0,
          behavior: "auto",
        });
        return;
      }
      container.scrollBy({
        left: step,
        behavior: "smooth",
      });
    }, 2500);
    return () => clearInterval(timer);
  }, [playingVideoId]);
  const scrollQuality = (direction) => {
    const container = qualityScrollRef.current;
    if (!container) return;
    const firstCard = container.firstElementChild;
    const step = firstCard ? firstCard.getBoundingClientRect().width + 20 : 330;
    container.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };
  const scrollRawMaterial = (direction) => {
    const container = rawMaterialScrollRef.current;
    if (!container) return;
    const firstCard = container.firstElementChild;
    const step = firstCard ? firstCard.getBoundingClientRect().width + 20 : 330;
    container.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };
  /* =======================================================
       CUSTOMER REVIEWS AUTO SLIDE - LEFT / FORWARD ONLY
    ======================================================= */
  useEffect(() => {
    const timer = setInterval(() => {
      const container = reviewScrollRef.current;
      if (!container) return;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll <= 0) return;
      const firstCard = container.firstElementChild;
      const step = firstCard
        ? firstCard.getBoundingClientRect().width + 20
        : 350;
      const atEnd = container.scrollLeft >= maxScroll - 10;
      if (atEnd) {
        container.scrollTo({
          left: 0,
          behavior: "auto",
        });
        return;
      }
      container.scrollBy({
        left: step,
        behavior: "smooth",
      });
    }, 2500);
    return () => clearInterval(timer);
  }, []);
  /* =======================================================
       PAGE
    ======================================================= */
  return (
    <main className="min-h-screen bg-white">
      {/* =====================================================
            HERO SECTION
        ===================================================== */}
      <section className="relative w-full overflow-hidden bg-[#edf5e8]">
        <div className="relative w-full lg:min-h-[590px]">
          {/* HERO IMAGE */}
          <div className="relative w-full aspect-[16/9] lg:absolute lg:inset-0 lg:aspect-auto lg:h-full">
            <img
              key={slide.id}
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-contain lg:object-cover"
            />
          </div>
          {/* IMAGE OVERLAY */}
          <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-[#edf5e8] via-[#edf5e8]/90 to-transparent" />
          {/* HERO CONTENT */}
          <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-8 lg:py-0 lg:min-h-[590px] flex items-center">
            <div className="max-w-2xl">
              <span className="inline-block bg-[#075e4d] text-white text-xs font-bold tracking-[0.15em] px-4 py-2 rounded-full mb-5">
                {slide.smallTitle}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold text-[#075e4d] leading-[1.05]">
                {slide.title}
              </h1>
              <h2 className="text-2xl lg:text-4xl mt-3 font-serif text-[#176c58]">
                {slide.subtitle}
              </h2>
              <p className="mt-5 max-w-xl text-gray-700 text-base lg:text-lg leading-relaxed">
                {slide.description}
              </p>
              <Link
                to={slide.link}
                className="inline-flex items-center gap-3 mt-8 bg-[#ef7d18] hover:bg-[#db6d0e] text-white font-bold px-9 py-4 rounded-full transition"
              >
                {slide.button}
                <ShoppingCart size={19} />
              </Link>
            </div>
          </div>
          {/* PREVIOUS BUTTON */}
          <button
            type="button"
            onClick={previousSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 hover:bg-white hidden lg:flex items-center justify-center shadow"
            aria-label="Previous slide"
          >
            <ChevronLeft />
          </button>
          {/* NEXT BUTTON */}
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 hover:bg-white hidden lg:flex items-center justify-center shadow"
            aria-label="Next slide"
          >
            <ChevronRight />
          </button>
          {/* HERO DOTS */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex gap-2">
            {HERO_SLIDES.map((item, index) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`
                    h-2.5
                    rounded-full
                    transition-all
                    ${
                      index === currentSlide
                        ? "w-8 bg-[#075e4d]"
                        : "w-2.5 bg-white"
                    }
                  `}
              />
            ))}
          </div>
        </div>
      </section>
      {/* =====================================================
            WELCOME + CATEGORIES
        ===================================================== */}
      <section className="relative overflow-hidden pt-12 pb-5 bg-gradient-to-r from-[#FFF8E7] via-[#F8E8B8] to-[#FFF8E7]">
        <div className="absolute top-0 left-[-35%] w-[35%] h-full bg-gradient-to-r from-transparent via-white/45 to-transparent skew-x-[-20deg] animate-[goldenWelcome_5s_ease-in-out_infinite] pointer-events-none" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[550px] h-[250px] rounded-full bg-[#F4D77C]/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="welcome-golden-text font-serif text-3xl lg:text-4xl font-bold">
              Welcome To ShreeKrishna Organics!
            </h2>
            <p className="welcome-golden-text font-serif text-xl lg:text-3xl mt-2">
              You're One Step Closer to Purity
            </p>
          </div>
          {/* CATEGORIES */}
          <div className="flex justify-start md:justify-center items-center gap-8 lg:gap-12 mt-8 overflow-x-auto pb-2">
            {CATEGORIES.map((category) => (
              <Link
                key={category.name}
                to={category.link}
                className="group min-w-[70px] text-center transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-3xl transition-transform duration-300 group-hover:scale-110">
                  {category.icon}
                </div>
                <p className="text-sm mt-2 text-gray-700 group-hover:text-[#075e4d]">
                  {category.name}
                </p>
                {category.name === "All" && (
                  <div className="h-[3px] bg-[#075e4d] rounded mt-3" />
                )}
              </Link>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes goldenWelcome {
            0% { left: -40%; opacity: 0; }
            15% { opacity: 1; }
            60% { opacity: 0.8; }
            100% { left: 120%; opacity: 0; }
          }
          .welcome-golden-text {
            color: #075e4d;
            background: linear-gradient(
              110deg,
              #075e4d 0%,
              #075e4d 30%,
              #c69528 42%,
              #f5c44f 50%,
              #e1ad37 58%,
              #075e4d 70%,
              #075e4d 100%
            );
            background-size: 250% 100%;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: welcomeGoldenTextMove 2.4s linear infinite;
          }
          @keyframes welcomeGoldenTextMove {
            0% { background-position: 150% center; }
            100% { background-position: -150% center; }
          }
        `}</style>
      </section>
      {/* =====================================================
            FEATURED PRODUCTS
        ===================================================== */}
      <section className="bg-white py-5 border-t border-gray-100">
        <div className="relative">
          {loading ? (
            <div className="py-20">
              <LoadingSpinner />
            </div>
          ) : featuredProducts.length === 0 ? (
            <p className="text-center py-12 text-gray-500">
              Products are currently unavailable.
            </p>
          ) : (
            <>
              <div
  ref={productScrollRef}
  className="flex gap-5 overflow-x-auto scroll-smooth px-4 sm:px-6 lg:px-12 pb-6"
>
  {featuredProducts.map((product) => (
    <div
      key={product.id}
      className="flex-none w-[240px] sm:w-[260px] lg:w-[280px]"
    >
      <ProductCard product={product} />
    </div>
  ))}
</div>
              {/* PRODUCT LEFT */}
              <button
                type="button"
                onClick={() => scrollProducts("left")}
                className="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-white shadow-lg border rounded-full items-center justify-center"
                aria-label="Previous products"
              >
                <ChevronLeft />
              </button>
              {/* PRODUCT RIGHT */}
              <button
                type="button"
                onClick={() => scrollProducts("right")}
                className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-white shadow-lg border rounded-full items-center justify-center"
                aria-label="Next products"
              >
                <ChevronRight />
              </button>
            </>
          )}
        </div>
        {/* SEE ALL */}
        <div className="text-center mt-5">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 border border-[#075e4d] text-[#075e4d] px-7 py-3 rounded-full font-semibold hover:bg-[#075e4d] hover:text-white transition"
          >
            See All
            <span>→</span>
          </Link>
        </div>
      </section>
      {/* CATEGORY-WISE PRODUCT ROWS — directly below See All */}
      {!loading && HOME_PRODUCT_SECTIONS.map((section) => {
        const products = featuredProducts.filter(
          (product) => homeProductCategory(product) === section.key
        );
        if (products.length === 0) return null;

        return (
          <section key={section.key} className="bg-white py-9 border-t border-[#e9eee9]">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 mb-7 text-center">
              <h2 className="welcome-golden-text inline-block font-serif text-3xl sm:text-4xl font-bold">
                {section.title}
              </h2>
              <p className="welcome-golden-text mx-auto mt-2 w-fit font-serif text-base sm:text-lg">
                {section.subtitle}
              </p>
              <Link
                to={section.link}
                className="mt-4 inline-flex rounded-full border border-[#075e4d] px-5 py-2 text-sm font-semibold text-[#075e4d] hover:bg-[#075e4d] hover:text-white transition"
              >
                View All →
              </Link>
            </div>
            <div className="relative">
              <div
                id={`home-products-${section.key}`}
                className="flex gap-5 overflow-x-auto scroll-smooth px-4 sm:px-6 lg:px-12 pb-5"
              >
                {products.map((product) => (
                  <div key={product.id} className="flex-none w-[240px] sm:w-[260px] lg:w-[280px]">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              {products.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label={`Previous ${section.title} products`}
                    onClick={() => document.getElementById(`home-products-${section.key}`)?.scrollBy({ left: -900, behavior: "smooth" })}
                    className="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-white shadow-lg border rounded-full items-center justify-center"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    type="button"
                    aria-label={`Next ${section.title} products`}
                    onClick={() => document.getElementById(`home-products-${section.key}`)?.scrollBy({ left: 900, behavior: "smooth" })}
                    className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-white shadow-lg border rounded-full items-center justify-center"
                  >
                    <ChevronRight />
                  </button>
                </>
              )}
            </div>
          </section>
        );
      })}
      {/* Compact bulk enquiries section with original animated heading and contact actions. */}
      <section aria-label="Bulk orders, reselling and white labelling" className="relative overflow-hidden border-y border-[#efe4cc] bg-gradient-to-r from-[#fff8e9] via-[#fffaf1] to-[#f0f5e5] px-4 py-8 sm:py-10">
        <style>{`@keyframes bulkGradient { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }`}</style>
        <div className="relative mx-auto max-w-5xl text-center">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#009c78] sm:text-sm">Grow Your Business With</p>
          <h2 className="font-serif text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl">
            <span className="inline-block bg-gradient-to-r from-[#075e4d] via-[#e9ad28] to-[#075e4d] bg-[length:200%_100%] bg-clip-text text-transparent motion-safe:animate-[bulkGradient_5s_ease-in-out_infinite]">Bulk Orders</span>
            <span className="mx-2 text-[#f47a18]" aria-hidden="true">|</span>
            <span className="inline-block bg-gradient-to-r from-[#075e4d] via-[#e9ad28] to-[#075e4d] bg-[length:200%_100%] bg-clip-text text-transparent motion-safe:animate-[bulkGradient_5s_ease-in-out_infinite]">Reselling</span>
            <span className="mx-2 text-[#f47a18]" aria-hidden="true">|</span>
            <span className="inline-block bg-gradient-to-r from-[#075e4d] via-[#e9ad28] to-[#075e4d] bg-[length:200%_100%] bg-clip-text text-transparent motion-safe:animate-[bulkGradient_5s_ease-in-out_infinite]">White Labelling</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">For Bulk Orders, Reselling or White Labelling Enquiries, get in touch with us today!</p>
          <div className="mx-auto mt-5 flex max-w-2xl flex-col justify-center gap-3 sm:flex-row">
            <a href="tel:+919011087310" aria-label="Call ShreeKrishna Organics at +91 9011087310" className="flex min-h-12 flex-1 items-center justify-center gap-3 rounded-full bg-[#005744] px-5 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#003f32] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005744]">
              <Phone size={20} aria-hidden="true" /> Call Us <span className="tabular-nums">+91 9011087310</span>
            </a>
            <a href={`https://wa.me/919011087310?text=${encodeURIComponent("Hello ShreeKrishna Organics, I am interested in Bulk Orders, Reselling or White Labelling. Please share more details.")}`} target="_blank" rel="noopener noreferrer" aria-label="Contact ShreeKrishna Organics on WhatsApp" className="flex min-h-12 flex-1 items-center justify-center gap-3 rounded-full bg-[#08a52d] px-5 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#078626] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#08a52d]">
              <MessageCircle size={20} aria-hidden="true" /> WhatsApp Us
            </a>
          </div>
        </div>
      </section>
      {/* =====================================================
            WHY CHOOSE
        ===================================================== */}
      <section className="bg-[#fcfdfb] py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-3xl lg:text-4xl font-serif font-bold text-[#075e4d] mb-12">
            Why Choose ShreeKrishna Organics?
          </h2>
          <div className="relative">
            <div
              ref={benefitsScrollRef}
              className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {BENEFITS.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={index}
                    className="group min-w-[85%] sm:min-w-[47%] lg:min-w-[31%] snap-start text-center px-5 py-7 rounded-2xl bg-white border border-[#e5eee9] shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-lg"
                  >
                    <div className="flex justify-center mb-7">
                      <Icon
                        size={64}
                        strokeWidth={1.4}
                        className="text-[#176c58] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
                      />
                    </div>
                    <h3 className="font-serif font-bold text-xl text-[#075e4d]">
                      {benefit.title}
                    </h3>
                    <p className="mt-3 text-gray-600 leading-relaxed max-w-[270px] mx-auto">
                      {benefit.text}
                    </p>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => scrollBenefits("left")}
              aria-label="Previous benefits"
              className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-[#dce8e2] text-[#075e4d] shadow-md flex items-center justify-center hover:bg-[#075e4d] hover:text-white active:scale-95 transition-all duration-300"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => scrollBenefits("right")}
              aria-label="Next benefits"
              className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-[#dce8e2] text-[#075e4d] shadow-md flex items-center justify-center hover:bg-[#075e4d] hover:text-white active:scale-95 transition-all duration-300"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>
      {/* =====================================================
            NATIVE INGREDIENTS
        ===================================================== */}
      <section className="bg-[#fff5d7] py-20">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-center text-3xl lg:text-4xl font-serif font-bold text-[#b87425] mb-12">
            Native Ingredients. No Substitutes.
          </h2>
          <div className="relative">
            <div
              ref={ingredientsScrollRef}
              className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {INGREDIENTS.map((item, index) => (
                <div
                  key={index}
                  className="relative min-w-[85%] sm:min-w-[47%] lg:min-w-[31%] snap-start rounded-xl overflow-hidden h-[440px] group"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/10 to-black/30" />
                  <div className="relative text-center text-white px-5 pt-8">
                    <h3 className="text-2xl font-bold">{item.title}</h3>
                    <h4 className="text-lg font-semibold mt-1">
                      {item.subtitle}
                    </h4>
                    <p className="mt-3 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => scrollIngredients("left")}
              aria-label="Previous ingredients"
              className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-[#ead8ad] text-[#b87425] shadow-md flex items-center justify-center hover:bg-[#b87425] hover:text-white active:scale-95 transition-all duration-300"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => scrollIngredients("right")}
              aria-label="Next ingredients"
              className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-[#ead8ad] text-[#b87425] shadow-md flex items-center justify-center hover:bg-[#b87425] hover:text-white active:scale-95 transition-all duration-300"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>
      {/* =====================================================
            PRODUCT IN FOCUS REMOVED
            Oils section removed
            Ghee section removed
        ===================================================== */}
      {/* =====================================================
            QUALITY SECTION
        ===================================================== */}
      <section className="bg-[#dff5fa] py-20">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-center font-serif font-bold text-3xl lg:text-4xl text-[#3193a5] mb-12">
            Only Perfect Makes The Cut
          </h2>
          <div className="relative">
            <button
              type="button"
              onClick={() => scrollQuality("left")}
              aria-label="Previous quality card"
              className="absolute left-[-22px] top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-[#d9cbb7] shadow-md flex items-center justify-center text-[#c56f16] hover:bg-[#fff7e8] transition"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => scrollQuality("right")}
              aria-label="Next quality card"
              className="absolute right-[-22px] top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-[#d9cbb7] shadow-md flex items-center justify-center text-[#c56f16] hover:bg-[#fff7e8] transition"
            >
              <ChevronRight size={22} />
            </button>
            <div
              ref={qualityScrollRef}
              className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {QUALITY_ITEMS.map((item, index) => (
                <div
                  key={index}
                  className="flex-none w-[85%] sm:w-[47%] lg:w-[31%] snap-start bg-[#fff9e9] min-h-[390px] rounded-xl p-7 text-center flex flex-col items-center justify-center shadow-sm"
                >
                  <div className="text-6xl mb-8">{item.icon}</div>
                  <h3 className="text-xl lg:text-2xl font-bold text-[#176c58]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    {item.text}
                  </p>
                  <CheckCircle2 className="mt-7 text-[#176c58]" size={30} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* =====================================================
            RAW MATERIAL — POSTERS & VIDEOS
        ===================================================== */}
      <section className="relative overflow-hidden bg-[#f8f4ec] py-20 lg:py-24">
        <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#e7c56d]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-[#075e4d]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#dfd2bc] bg-[#efe8dc] px-4 py-2 text-[10px] sm:text-[11px] font-bold tracking-[0.12em] text-[#493c2e]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c85b3d]" />
              FARM TO TABLE
            </span>
            <h2 className="mt-5 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#201b16]">
              Raw Material — Posters & Videos
            </h2>
            <p className="mt-4 text-sm sm:text-base lg:text-lg leading-7 text-[#6c5746]">
              Take a transparent behind-the-scenes look at our ethical sourcing,
              traditional processing and careful quality practices.
            </p>
          </div>
          <div className="relative mt-12">
            {rawMaterialItems.length > 0 && <button
              type="button"
              onClick={() => scrollRawMaterial("left")}
              aria-label="Previous raw material card"
              className="absolute left-[-22px] top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-[#d9cbb7] shadow-md flex items-center justify-center text-[#c56f16] hover:bg-[#fff7e8] transition"
            >
              <ChevronLeft size={22} />
            </button>}
            {rawMaterialItems.length > 0 && <button
              type="button"
              onClick={() => scrollRawMaterial("right")}
              aria-label="Next raw material card"
              className="absolute right-[-22px] top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-[#d9cbb7] shadow-md flex items-center justify-center text-[#c56f16] hover:bg-[#fff7e8] transition"
            >
              <ChevronRight size={22} />
            </button>}
            <div
              ref={rawMaterialScrollRef}
              className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {rawMaterialItems.length === 0 && (
                <p className="w-full py-14 text-center text-[#766453]">Videos will be available soon.</p>
              )}
              {rawMaterialItems.map((item) => (
                <article
                  key={item.key}
                  className="group flex-none w-[85%] sm:w-[47%] lg:w-[31%] snap-start overflow-hidden rounded-[22px] border border-[#e6dccd] bg-white shadow-[0_8px_24px_rgba(74,54,35,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_35px_rgba(74,54,35,0.14)]"
                >
                  <div className="relative h-[215px] overflow-hidden bg-[#ece5d9]">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-black/10" />
                    <span className="absolute top-4 left-4 rounded-md bg-[#292622]/90 px-3 py-1.5 text-[9px] font-bold tracking-wide text-white">
                      {item.badge}
                    </span>
                    <span className="absolute top-4 right-4 rounded-md bg-[#292622]/75 px-2.5 py-1.5 text-[9px] font-bold tracking-wide text-white">
                      {item.duration}
                    </span>
                    <button
                      type="button"
                      aria-label={item.videoId ? `Play ${item.title}` : `Preview unavailable for ${item.title}`}
                      onClick={() => item.videoId && setPlayingVideoId(item.videoId)}
                      disabled={!item.videoId}
                      className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#c95738] text-white shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#b8492e]"
                    >
                      <Play size={22} fill="currentColor" className="ml-1" />
                    </button>
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] font-semibold tracking-[0.08em] text-[#c95738]">
                      {item.eyebrow}
                    </p>
                    <h3 className="mt-2 min-h-[52px] font-serif text-[18px] font-bold leading-6 text-[#211c17]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[12px] leading-5 text-[#766453] line-clamp-2">
                      {item.description}
                    </p>
                    <button
                      type="button"
                      onClick={() => item.videoId && setPlayingVideoId(item.videoId)}
                      disabled={!item.videoId}
                      className="mt-5 inline-flex items-center gap-2 text-[12px] font-bold text-[#211c17] transition-colors hover:text-[#c95738]"
                    >
                      {item.videoId ? "Watch Video" : "Preview Coming Soon"}{" "}
                      <span className="text-base leading-none transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* =====================================================
            CUSTOMER REVIEWS
        ===================================================== */}
      <section className="bg-[#fbfdfb] pt-7 pb-10 overflow-hidden">
        <div className="border-t border-gray-300 mx-2 mb-5" />
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center font-serif text-3xl lg:text-4xl font-bold text-[#173b4d] mb-10">
            What Do Our Customers Say
          </h2>
          {reviewsLoading && (
            <p className="text-center text-gray-500 mb-5">Loading customer reviews...</p>
          )}
          {!reviewsLoading && reviewsError && (
            <p className="text-center text-gray-500 mb-5">Customer reviews are temporarily unavailable.</p>
          )}
          {!reviewsLoading && !reviewsError && reviews.length === 0 && (
            <p className="text-center text-gray-500 mb-5">Customer reviews will be available soon.</p>
          )}
          <div
            ref={reviewScrollRef}
            className="flex gap-5 overflow-x-auto scroll-smooth pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {reviews.map((review, index) => (
              <div
                key={review.id ?? index}
                className="min-w-[290px] sm:min-w-[330px] lg:min-w-[350px] min-h-[205px] bg-white border border-[#dfe7e3] rounded-2xl px-6 py-6 shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)]"
              >
                <p className="text-[12px] sm:text-[13px] text-gray-600 leading-relaxed">
                  {review.comment}
                </p>
                <div className="flex items-center gap-4 mt-7">
                  <div className="w-[58px] h-[58px] rounded-full overflow-hidden shrink-0 border-2 border-[#d9e5df] bg-[#edf5e8] shadow-sm">
                    <img
                      src={review.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.customerName || "Customer")}&size=200&background=edf5e8&color=075e4d&bold=true`}
                      alt={review.customerName || "Customer"}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.customerName || "Customer")}&size=200&background=edf5e8&color=075e4d&bold=true`;
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-[14px] text-[#173b4d]">
                      {review.customerName}
                    </h3>
                    <div className="flex gap-[3px] mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={13}
                          className={star <= Math.max(0, Math.min(5, Number(review.rating) || 0)) ? "fill-[#f4aa00] text-[#f4aa00]" : "fill-none text-gray-300"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {reviews.length > 0 && <div className="flex justify-center items-center gap-4 mt-2">
            <button
              type="button"
              onClick={() => scrollReviews("left")}
              aria-label="Previous customer reviews"
              className="w-10 h-10 rounded-full border-2 border-[#177564] text-[#177564] flex items-center justify-center hover:bg-[#177564] hover:text-white active:scale-95 transition-all duration-200"
            >
              <ChevronLeft size={17} />
            </button>
            <div className="flex items-center gap-[6px]">
              {reviews.map((_, index) => (
                <span
                  key={index}
                  className={`w-2 h-2 rounded-full ${index === 2 ? "bg-[#287b6c]" : "bg-gray-300"}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => scrollReviews("right")}
              aria-label="Next customer reviews"
              className="w-10 h-10 rounded-full border-2 border-[#177564] text-[#177564] flex items-center justify-center hover:bg-[#177564] hover:text-white active:scale-95 transition-all duration-200"
            >
              <ChevronRight size={17} />
            </button>
          </div>}
        </div>
      </section>
      {playingVideoId && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPlayingVideoId(null);
          }}
        >
          <div role="dialog" aria-modal="true" aria-label="YouTube video player" className="relative w-full max-w-4xl">
            <button
              type="button"
              onClick={() => setPlayingVideoId(null)}
              aria-label="Close video"
              className="absolute -top-12 right-0 rounded-full bg-white p-2 text-gray-900"
            >
              <X size={22} />
            </button>
            <div className="aspect-video overflow-hidden rounded-xl bg-black">
              <iframe
                key={playingVideoId}
                src={`https://www.youtube-nocookie.com/embed/${playingVideoId}?autoplay=1&rel=0`}
                title="ShreeKrishna Organics YouTube Video"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
