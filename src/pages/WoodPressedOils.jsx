import React, { useEffect, useState } from "react";
import { ChevronRight, Leaf } from "lucide-react";
import { productService } from "../services/productService";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function WoodPressedOils() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await productService.getAllProducts({
          category: "wood-pressed-oils",
          sortBy: "featured",
        });
        if (active) setProducts(data || []);
      } catch (err) {
        console.error("Unable to load wood-pressed oils:", err);
        if (active) {
          setProducts([]);
          setError("Unable to load oil products right now.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    loadProducts();
    return () => { active = false; };
  }, []);

  return (
    <div className="bg-[#fffdf8] min-h-screen">
<section className="relative w-full overflow-hidden bg-[#fff9e8]">

        <div

          className="

            relative

            w-full

            min-h-[420px]

            sm:min-h-[460px]

            md:min-h-[500px]

            lg:min-h-[540px]

            bg-no-repeat

            bg-cover

            bg-[position:68%_center]

            sm:bg-[position:62%_center]

            md:bg-center

          "

          style={{

            backgroundImage: "url('/images/wood2.png')",

          }}

        >

          <div className="absolute inset-0 bg-gradient-to-r from-[#fff9e8]/95 via-[#fff9e8]/78 to-transparent md:via-[#fff9e8]/58" />

          <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 min-h-[420px] sm:min-h-[460px] md:min-h-[500px] lg:min-h-[540px] flex items-center">

            <div className="w-full max-w-[620px] py-10 sm:py-12">

              <div className="inline-flex items-center gap-2 rounded-full bg-[#eaf1bd]/90 px-4 py-2 text-[#12614e] text-[11px] sm:text-xs font-bold tracking-[0.12em]">

                <Leaf className="w-4 h-4" />

                100% PURE &amp; TRADITIONAL

              </div>

              <h1 className="mt-5 font-serif font-bold leading-[0.95] text-[#075f50] text-[42px] sm:text-[56px] md:text-[68px] lg:text-[78px]">

                Wood-Pressed

                <span className="block text-[#a96c12]">Oils</span>

              </h1>

              <h2 className="mt-4 font-serif text-[#075f50] text-2xl sm:text-3xl md:text-4xl font-semibold">

                Purity You Can Taste

              </h2>

              <p className="mt-4 max-w-[560px] text-[#39443f] text-sm sm:text-base md:text-lg leading-6 sm:leading-7">

                Traditionally extracted at low temperature to preserve natural

                nutrition, aroma and authentic taste.

              </p>

              <a

                href="/shop?category=wood-pressed-oils"

                className="mt-7 inline-flex items-center justify-center rounded-2xl bg-[#075f50] px-7 sm:px-9 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white shadow-lg transition hover:bg-[#064b40]"

              >

                SHOP NOW

                <ChevronRight className="ml-2 w-5 h-5" />

              </a>

            </div>

          </div>

        </div>

      </section>

      {/* ===================================================

          CATEGORY SECTIONS

      =================================================== */}

      <main id="oil-products" className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#096653]">ShreeKrishna Organics Collection</p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-[#173b32]">All Wood-Pressed Oils</h2>
          <p className="mt-2 text-sm text-stone-500">Explore all our available wood-pressed oil products.</p>
        </div>
        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner /></div>
        ) : error ? (
          <p className="rounded-xl bg-red-50 border border-red-200 p-5 text-red-700">{error}</p>
        ) : products.length > 0 ? (
          <>
            <p className="mb-5 text-sm text-stone-600">Showing {products.length} oil products</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6 items-stretch">
              {products.map((product) => (
                <div key={product.id} className="min-w-0 h-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-[#eadfbd] bg-white px-5 py-16 text-center text-stone-500">
            No wood-pressed oil products are available right now.
          </div>
        )}
      </main>
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
