import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Leaf,
  Award,
  CheckCircle2,
  Star,
  Layers,
  ChevronLeft,
  ChevronRight,
  Play,
  X
} from 'lucide-react';
import { productService } from '../services/productService';
import { testimonials, brandStats } from '../data/testimonials';
import ProductCard from '../components/ProductCard';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

// Hero Slideshow Data (4-5 Slides, ~10s per slide)
const HERO_SLIDES = [
  {
    id: 1,
    badge: "100% Traditional Vaagai Wood-Pressed",
    title: "Pure Oils.",
    titleAccent: "Honest Origins.",
    description: "Slow-crushed in authentic Vaagai wooden pestles under 40°C. Zero chemical refining, zero hexane solvents, and zero adulteration — just pure traditional wellness for your family.",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=80",
    featureTitle: "Vaagai Wooden Mortar Press",
    featureDesc: "Slow cold extraction below 40°C",
    ctaText: "Shop Pure Oils",
    ctaLink: "/shop?category=wood-pressed"
  },
  {
    id: 2,
    badge: "Handcrafted Palmyra Sweetener",
    title: "Organic Jaggery.",
    titleAccent: "Unrefined Nutrition.",
    description: "Natural Karupatti palm jaggery and Kolhapur sugarcane shakkar. Boiled in traditional brass vats without chemical bleaches or synthetic sulfur.",
    image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=1200&q=80",
    featureTitle: "Wild Palmyra Tapped",
    featureDesc: "100% Sulfur-free & mineral rich",
    ctaText: "Explore Jaggery",
    ctaLink: "/shop?category=jaggery"
  },
  {
    id: 3,
    badge: "Ancient Vedic Bilona Sanskar",
    title: "Vedic A2 Ghee.",
    titleAccent: "Golden Purity.",
    description: "Hand-churned from the whole curd of free-grazing indigenous Gir cows using two-way wooden bilonas. Fragrant, granular, and easily digestible.",
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=1200&q=80",
    featureTitle: "Gir Cow Curd Churned",
    featureDesc: "Traditional 5-step sanskar bilona",
    ctaText: "Discover A2 Ghee",
    ctaLink: "/shop?category=supplements"
  },
  {
    id: 4,
    badge: "Fair-Trade Agriculture",
    title: "Direct Sourcing.",
    titleAccent: "350+ Farmer Families.",
    description: "We bypass mandi middlemen to source native non-GMO seed varieties directly from organic grower collectives in Rajasthan, Gujarat, and Tamil Nadu.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80",
    featureTitle: "Fair Trade Certified",
    featureDesc: "Native non-GMO heirloom crops",
    ctaText: "Read Our Story",
    ctaLink: "/about"
  },
  {
    id: 5,
    badge: "100% Lab Tested Transparency",
    title: "Zero Solvents.",
    titleAccent: "Lab Verified.",
    description: "Every single batch is independently tested by NABL-accredited labs for iodine values, zero heavy metals, and complete freedom from adulteration.",
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=1200&q=80",
    featureTitle: "QR Verified Batches",
    featureDesc: "100% FSSAI & NABL compliant",
    ctaText: "View Products",
    ctaLink: "/shop"
  }
];

// 4 Wireframe Category Items
const CATEGORIES = [
  {
    id: "oils",
    name: "Oils",
    description: "Wood & Cold-Pressed",
    icon: "🪵",
    path: "/shop?category=wood-pressed",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "jaggery",
    name: "Jaggery",
    description: "Palm & Sugarcane",
    icon: "",
    path: "/shop?category=jaggery",
    image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "supplements",
    name: "Health Supplements",
    description: "A2 Ghee & Forest Honey",
    icon: "🌿",
    path: "/shop?category=supplements",
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "other",
    name: "Other Products",
    description: "Combos & Castor Oil",
    icon: "🌾",
    path: "/shop?category=other",
    image: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=400&q=80"
  }
];

// Raw Material Media Items
const MEDIA_ITEMS = [
  {
    id: 1,
    title: "Mustard Harvesting in Rajasthan",
    subtitle: "Organic Farm Field Tour",
    type: "Video Tour",
    duration: "2:45 min",
    thumbnail: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80",
    description: "Witness our farmer partners harvesting first-grade non-GMO yellow mustard seeds in the arid plains of Rajasthan, sun-dried without chemical sulfur fumigation."
  },
  {
    id: 2,
    title: "Vaagai Wood Mortar Churning",
    subtitle: "Low RPM Cold Extraction",
    type: "Process Video",
    duration: "3:10 min",
    thumbnail: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
    description: "See authentic Albizia lebbeck (Vaagai) wood pestles slowly rotating under 14 RPM to extract unrefined golden oil below 40°C."
  },
  {
    id: 3,
    title: "Traditional Palm Jaggery Boiling",
    subtitle: "Artisan Karupatti Craft",
    type: "Artisan Story",
    duration: "4:05 min",
    thumbnail: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=600&q=80",
    description: "Step inside our Tuticorin palmyra grove where master tappers simmer fresh palm neera in iron cauldrons to form mineral-dense solid jaggery blocks."
  },
  {
    id: 4,
    title: "Sun Resting & Cloth Filtration",
    subtitle: "Zero Chemical Refining",
    type: "Quality Check",
    duration: "1:55 min",
    thumbnail: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=600&q=80",
    description: "How our pure oils naturally rest for 48 hours for sedimentation before passing through a single cotton cloth filter without synthetic bleaching clays."
  }
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Auto-rotating Slideshow (~10 seconds per slide)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  // Load 5 Featured Products for the 5-column wireframe grid
  useEffect(() => {
    async function loadFeatured() {
      try {
        const data = await productService.getFeaturedProducts();
        // Take top 5 items for the 5-in-a-row wireframe row
        setFeaturedProducts(data.slice(0, 5));
      } catch (err) {
        console.error("Error loading featured products", err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF6EF]">

      {/* =========================================================================
          1. HERO SECTION (POSTER IMAGE SLIDESHOW: 4-5 Slides, 10s per slide)
      ========================================================================== */}
      <section
        className="relative overflow-hidden bg-[#2B241D] text-[#FAF6EF] py-16 lg:py-24 transition-colors duration-700"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FAF6EF_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

            {/* Left Column: Editorial Headline, Badges & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left animate-in fade-in duration-500 key={currentSlide}">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#FAF6EF] text-xs font-semibold tracking-wider uppercase backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-[#B5563C] animate-ping" />
                <span>{slide.badge}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-[#FAF6EF] leading-[1.15]">
                {slide.title} <br className="hidden sm:inline" />
                <span className="italic font-normal text-[#C68A2E]">{slide.titleAccent}</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-300 font-sans max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {slide.description}
              </p>

              {/* Key Quick Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-1 text-xs text-stone-200">
                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-[#B5563C]" />
                  <span>100% Raw & Unrefined</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-[#B5563C]" />
                  <span>Vaagai Wood Churned</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-[#B5563C]" />
                  <span>NABL Lab Tested</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button
                  to={slide.ctaLink}
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto font-semibold shadow-lg shadow-[#B5563C]/30"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  {slide.ctaText}
                </Button>

                <Button
                  to="/about"
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white"
                >
                  Our Extraction Story
                </Button>
              </div>

              {/* Social Proof snippet */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-center lg:justify-start gap-4">
                <div className="flex -space-x-2">
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#2B241D] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Customer" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#2B241D] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Customer" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#2B241D] object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" alt="Customer" />
                </div>
                <div className="text-left text-xs">
                  <div className="flex text-[#C68A2E]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C68A2E]" />
                    ))}
                  </div>
                  <span className="text-stone-300 font-medium">Loved by 25,000+ Indian households</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Slideshow Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">

                {/* Decorative Slide Frame */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 bg-[#1F1813] group">
                  <img
                    key={slide.id}
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-[420px] object-cover object-center transition-all duration-700 ease-out transform group-hover:scale-105"
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F1813]/90 via-[#1F1813]/20 to-transparent" />

                  {/* Prev / Next Slide Arrow Controls */}
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-[#B5563C] text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-80 hover:opacity-100 cursor-pointer"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-[#B5563C] text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-80 hover:opacity-100 cursor-pointer"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Floating Highlight Card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/30 text-stone-900 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#B5563C] block">
                          Heritage Spotlight
                        </span>
                        <h4 className="font-serif font-bold text-sm text-[#2B241D]">{slide.featureTitle}</h4>
                        <p className="text-[11px] text-stone-600 mt-0.5">{slide.featureDesc}</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-[#2B241D] text-[#FAF6EF] flex items-center justify-center font-bold text-sm">
                        🌿
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slideshow Dot Indicators (4-5 dots per wireframe) */}
                <div className="flex items-center justify-center gap-2.5 mt-5">
                  {HERO_SLIDES.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === idx
                          ? 'w-8 bg-[#B5563C]'
                          : 'w-2.5 bg-white/30 hover:bg-white/60'
                        }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          2. CATEGORY STRIP (4 Circular Categories per Wireframe)
      ========================================================================== */}
      <section className="py-14 bg-white border-b border-[#E8DFD3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest text-[#B5563C] font-bold block mb-1">
              Explore Departments
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2B241D]">
              Shop by Heritage Category
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={cat.path}
                className="group flex flex-col items-center text-center p-4 rounded-3xl hover:bg-[#FAF6EF] transition-all duration-300"
              >
                {/* Circular Icon / Avatar matching Wireframe */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-[#FAF6EF] border-2 border-[#E8DFD3] group-hover:border-[#B5563C] shadow-subtle group-hover:shadow-card group-hover:scale-105 transition-all duration-300 flex items-center justify-center mb-3">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-[#2B241D]/20 group-hover:bg-transparent transition-colors" />
                  <span className="absolute text-2xl drop-shadow-md">
                    {cat.icon}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base sm:text-lg text-[#2B241D] group-hover:text-[#B5563C] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-500 font-sans mt-0.5">
                  {cat.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. FEATURED PRODUCTS (5 Items in a Row per Wireframe)
      ========================================================================== */}
      <section className="py-20 bg-[#FAF6EF] border-b border-[#E8DFD3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#ECE4D8] text-[#2B241D] mb-2 border border-[#E8DFD3]">
                <Sparkles className="w-3.5 h-3.5 text-[#B5563C]" />
                Fresh Batches
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2B241D]">
                Featured Products
              </h2>
              <p className="mt-2 text-sm text-stone-600 font-sans max-w-lg">
                Handcrafted pure oils, organic jaggery, and Vedic A2 ghee. Unrefined, honest, and chemical-free.
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <Button to="/shop" variant="secondary" icon={ArrowRight} iconPosition="right" size="md">
                View All Products
              </Button>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* =========================================================================
          4. WHY CHOOSE SHRIKRISHNA ORGANICS? (4-Item Benefits/USP Row per Wireframe)
      ========================================================================== */}
      <section className="py-20 bg-white border-b border-[#E8DFD3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Quality Standard"
            title="Why Choose Shrikrishna Organics?"
            subtitle="We adhere to rigorous ancient traditions that never compromise on honesty, nutrition, or purity."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Benefit 1 */}
            <div className="bg-[#FAF6EF] p-8 rounded-3xl border border-[#E8DFD3] text-center flex flex-col items-center shadow-subtle hover:border-[#B5563C]/50 hover:shadow-card transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-white text-[#B5563C] flex items-center justify-center mb-5 border border-[#E8DFD3] shadow-xs">
                <Layers className="w-8 h-8 text-[#B5563C]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2B241D]">100% Vaagai Wood Press</h3>
              <p className="text-xs text-stone-600 mt-2.5 leading-relaxed">
                Slow crushed in authentic Albizia lebbeck wood mortars at under 14 RPM, keeping extraction strictly below 40°C.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-[#FAF6EF] p-8 rounded-3xl border border-[#E8DFD3] text-center flex flex-col items-center shadow-subtle hover:border-[#B5563C]/50 hover:shadow-card transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-white text-[#B5563C] flex items-center justify-center mb-5 border border-[#E8DFD3] shadow-xs">
                <Leaf className="w-8 h-8 text-[#B5563C]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2B241D]">Single-Origin Seeds</h3>
              <p className="text-xs text-stone-600 mt-2.5 leading-relaxed">
                Directly sourced from 350+ certified organic farming families across Rajasthan, Gujarat, Maharashtra, and Kerala.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-[#FAF6EF] p-8 rounded-3xl border border-[#E8DFD3] text-center flex flex-col items-center shadow-subtle hover:border-[#B5563C]/50 hover:shadow-card transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-white text-[#B5563C] flex items-center justify-center mb-5 border border-[#E8DFD3] shadow-xs">
                <ShieldCheck className="w-8 h-8 text-[#B5563C]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2B241D]">Zero Chemical Solvents</h3>
              <p className="text-xs text-stone-600 mt-2.5 leading-relaxed">
                Zero hexane extraction, no synthetic bleaching clays, and no deodorizing. Single-cloth filtered for authentic nutrition.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-[#FAF6EF] p-8 rounded-3xl border border-[#E8DFD3] text-center flex flex-col items-center shadow-subtle hover:border-[#B5563C]/50 hover:shadow-card transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-white text-[#B5563C] flex items-center justify-center mb-5 border border-[#E8DFD3] shadow-xs">
                <Award className="w-8 h-8 text-[#B5563C]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2B241D]">NABL Lab-Tested Batches</h3>
              <p className="text-xs text-stone-600 mt-2.5 leading-relaxed">
                Every batch is independently tested for iodine values and purity. Verifiable batch reports available on every bottle QR code.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          5. RAW MATERIAL — POSTERS & VIDEOS (4-Item Media Row per Wireframe)
      ========================================================================== */}
      <section className="py-20 bg-[#FAF6EF] border-b border-[#E8DFD3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Farm to Table"
            title="Raw Material — Posters & Videos"
            subtitle="Take a transparent behind-the-scenes look at our ethical harvest, artisanal wood pressing, and natural filtration."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MEDIA_ITEMS.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedMedia(item)}
                className="group bg-white rounded-3xl overflow-hidden border border-[#E8DFD3] shadow-subtle hover:shadow-card transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Media Image / Video Thumbnail */}
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-900">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />

                  {/* Dark gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {/* Top Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-[#2B241D]/90 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg backdrop-blur-xs border border-white/20">
                      {item.type}
                    </span>
                  </div>

                  {/* Duration pill */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 bg-black/60 text-stone-200 text-[10px] font-mono rounded-md">
                      {item.duration}
                    </span>
                  </div>

                  {/* Play / View Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#B5563C] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-[11px] font-semibold text-[#B5563C] uppercase tracking-wider">
                    {item.subtitle}
                  </span>
                  <h4 className="font-serif font-bold text-base text-[#2B241D] mt-1 group-hover:text-[#B5563C] transition-colors">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-auto pt-4 flex items-center gap-1 text-xs font-bold text-[#2B241D] group-hover:text-[#B5563C] transition-colors">
                    <span>Watch Preview</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. PRODUCTS IN FOCUS (Spotlight Section: 1 Large + 2 Stacked Tiles)
      ========================================================================== */}
      <section className="py-20 bg-white border-b border-[#E8DFD3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Curated Spotlight"
            title="Products in Focus"
            subtitle="Our most celebrated traditional kitchen staples, bundled and formulated for conscious modern households."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

            {/* 1 Large Tile (Left Col - 7 Cols) */}
            <div className="lg:col-span-7 bg-[#FAF6EF] rounded-3xl p-8 sm:p-10 border border-[#E8DFD3] shadow-card flex flex-col justify-between relative overflow-hidden group">
              {/* Background gradient blob */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#B5563C]/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-[#B5563C] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-xs">
                    ⭐ Best Value Pantry Pack
                  </span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg">
                    Save 18% Off
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2B241D] leading-tight">
                  Shrikrishna Heritage Trio Oil Combo
                </h3>

                <p className="mt-3 text-sm text-stone-600 leading-relaxed max-w-xl">
                  Upgrade your daily kitchen with our 3-in-1 pantry collection: <strong>1L Yellow Mustard Oil</strong> (for tadkas & curries), <strong>1L Raw Cold-Pressed Coconut Oil</strong> (for South Indian specialties), and <strong>1L Wood-Pressed Groundnut Oil</strong> (for high-heat frying & gravies).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
                  <div className="bg-white p-3 rounded-2xl border border-[#E8DFD3] text-center">
                    <span className="text-xs font-bold text-[#2B241D] block">1L Yellow Mustard</span>
                    <span className="text-[11px] text-stone-500">Rajasthan Ghani</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-[#E8DFD3] text-center">
                    <span className="text-xs font-bold text-[#2B241D] block">1L Virgin Coconut</span>
                    <span className="text-[11px] text-stone-500">Kerala Cold Expeller</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-[#E8DFD3] text-center">
                    <span className="text-xs font-bold text-[#2B241D] block">1L Native Groundnut</span>
                    <span className="text-[11px] text-stone-500">Saurashtra Kolhu</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#E8DFD3] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-sans text-[#2B241D]">₹1,149</span>
                    <span className="text-sm text-stone-400 line-through">₹1,400</span>
                  </div>
                  <span className="text-xs text-stone-500">Free Express Delivery Included</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button
                    to="/product/shrikrishna-heritage-trio-oil-combo"
                    variant="primary"
                    size="md"
                    className="w-full sm:w-auto font-bold"
                  >
                    View Details
                  </Button>
                  <Button
                    to="/shop"
                    variant="secondary"
                    size="md"
                    className="w-full sm:w-auto"
                  >
                    All Combos
                  </Button>
                </div>
              </div>
            </div>

            {/* 2 Stacked Smaller Tiles (Right Col - 5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">

              {/* Stacked Tile 1: Palm Jaggery Karupatti */}
              <div className="bg-[#FAF6EF] rounded-3xl p-6 border border-[#E8DFD3] shadow-subtle hover:shadow-card transition-all flex flex-col justify-between flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#B5563C] block mb-1">
                      Pure Mineral Sweetener
                    </span>
                    <h4 className="font-serif font-bold text-lg text-[#2B241D]">
                      Organic Palm Jaggery (Karupatti)
                    </h4>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                      Handcrafted from fresh wild palmyra palm sap. High natural iron & magnesium without sulfur.
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-[#E8DFD3]">
                    <img
                      src="https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=200&q=80"
                      alt="Palm Jaggery"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8DFD3]/80 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold font-sans text-[#2B241D]">₹260</span>
                    <span className="text-xs text-stone-400 line-through ml-1.5">₹310</span>
                  </div>
                  <Link
                    to="/product/organic-palm-jaggery-karupatti"
                    className="text-xs font-bold text-[#B5563C] hover:text-[#9E442B] flex items-center gap-1"
                  >
                    <span>Shop Jaggery</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Stacked Tile 2: Vedic A2 Ghee */}
              <div className="bg-[#FAF6EF] rounded-3xl p-6 border border-[#E8DFD3] shadow-subtle hover:shadow-card transition-all flex flex-col justify-between flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#B5563C] block mb-1">
                      Ancient Bilona Sanskar
                    </span>
                    <h4 className="font-serif font-bold text-lg text-[#2B241D]">
                      Vedic A2 Cultured Gir Cow Ghee
                    </h4>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                      Hand-churned from curd of grass-fed Gir cows using wooden bilonas. Granular texture and divine aroma.
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-[#E8DFD3]">
                    <img
                      src="https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=200&q=80"
                      alt="Vedic A2 Ghee"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8DFD3]/80 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold font-sans text-[#2B241D]">₹980</span>
                    <span className="text-xs text-stone-400 line-through ml-1.5">₹1,150</span>
                  </div>
                  <Link
                    to="/product/vedic-a2-bilona-cow-ghee"
                    className="text-xs font-bold text-[#B5563C] hover:text-[#9E442B] flex items-center gap-1"
                  >
                    <span>Shop A2 Ghee</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          7. CUSTOMER REVIEWS (3-Card Testimonial Row per Wireframe)
      ========================================================================== */}
      <section className="py-20 bg-[#FAF6EF] border-b border-[#E8DFD3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Verified Customers"
            title="Customer Reviews"
            subtitle="Real experiences from home chefs, clinical nutritionists, and families cooking with Shrikrishna Organics."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white p-7 rounded-3xl border border-[#E8DFD3] flex flex-col justify-between shadow-subtle hover:shadow-card transition-all"
              >
                <div>
                  {/* 5 Star Rating */}
                  <div className="flex text-[#C68A2E] mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C68A2E]" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 font-sans italic leading-relaxed mb-6">
                    "{t.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E8DFD3] flex items-center gap-3.5">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border border-[#E8DFD3]"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-[#2B241D]">{t.name}</h5>
                    <p className="text-[11px] text-stone-500">{t.role}</p>
                    <span className="text-[10px] text-[#B5563C] font-semibold block mt-0.5">
                      ✓ Verified Buyer • {t.product}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {brandStats.map((stat, idx) => (
              <div key={idx} className="bg-white border border-[#E8DFD3] rounded-2xl p-6 shadow-subtle">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#B5563C] block mb-1">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm text-stone-600 font-medium font-sans">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          8. FINAL CALL TO ACTION BANNER
      ========================================================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#2B241D] rounded-3xl p-8 sm:p-12 lg:p-16 text-center text-[#FAF6EF] shadow-2xl relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#B5563C]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C68A2E]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-2xl mx-auto space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#C68A2E] font-bold">
                Experience The Organic Difference
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
                Bring pure tradition into your family kitchen.
              </h2>
              <p className="text-sm sm:text-base text-stone-300">
                Switch to authentic wood-pressed oils, pure palm jaggery, and Vedic A2 ghee. Free delivery on orders over ₹999. Use promo code <strong className="text-[#FAF6EF] bg-[#B5563C] px-2 py-0.5 rounded font-mono font-bold">SHRIKRISHNA10</strong> for 10% off your first order.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  to="/shop"
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                  className="w-full sm:w-auto font-semibold shadow-lg shadow-[#B5563C]/30"
                >
                  Explore All Products
                </Button>
                <Button
                  to="/contact"
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto bg-transparent text-white border-white/30 hover:bg-white/10"
                >
                  Have Questions? Talk to Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Media Lightbox Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FAF6EF] rounded-3xl max-w-2xl w-full border border-[#E8DFD3] shadow-2xl overflow-hidden relative text-[#2B241D]">
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-black/40 text-white hover:bg-black transition-colors cursor-pointer"
              aria-label="Close media preview"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-video bg-black">
              <img
                src={selectedMedia.thumbnail}
                alt={selectedMedia.title}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#B5563C] text-white flex items-center justify-center shadow-2xl mb-3 animate-pulse">
                  <Play className="w-7 h-7 fill-white ml-1" />
                </div>
                <span className="text-xs font-mono bg-black/60 px-3 py-1 rounded-full">{selectedMedia.type} • {selectedMedia.duration}</span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B5563C]">
                {selectedMedia.subtitle}
              </span>
              <h3 className="font-serif font-bold text-2xl text-[#2B241D]">
                {selectedMedia.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {selectedMedia.description}
              </p>

              <div className="pt-4 flex justify-between items-center border-t border-[#E8DFD3]">
                <span className="text-xs text-stone-500">Shrikrishna Organics Heritage Video Archive</span>
                <Button
                  to="/about"
                  onClick={() => setSelectedMedia(null)}
                  variant="primary"
                  size="sm"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Our Process
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
