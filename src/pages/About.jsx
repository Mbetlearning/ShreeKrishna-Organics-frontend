import React from 'react';
import { 
  Compass, 
  ArrowRight
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';

export default function About() {
  return (
    <div className="bg-[#FAF6EF] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#ECE4D8] text-[#2B241D] mb-3 border border-[#E8DFD3]">
            <Compass className="w-3.5 h-3.5 text-[#B5563C]" />
            Our Heritage & Philosophy
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#2B241D] leading-tight">
            Reviving the lost art of honest, traditional wood-pressing.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-stone-600 font-sans leading-relaxed">
            Before industrial chemical refineries existed, every Indian village relied on the wooden *Ghani* or *Marachekku*. ShreeKrishna Organics is bringing that uncompromised purity back to modern family kitchens.
          </p>
        </div>

        {/* Story Section 1: The Problem & The Origin */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8DFD3] shadow-subtle mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B5563C]">
                Why ShreeKrishna Organics Exists
              </span>
              <h2 className="text-3xl font-serif font-bold text-[#2B241D]">
                What happened to our cooking oils?
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Over the last three decades, mass-market edible oils shifted from gentle mechanical pressing to chemical solvent extraction. Seeds are heated to over 200°C, drenched in petroleum-derived hexane solvents to extract every last drop, and subsequently treated with caustic soda, bleaching clays, and synthetic anti-foaming agents.
              </p>
              <p className="text-sm text-stone-600 leading-relaxed">
                While this produces cheap, clear oil with infinite shelf life, it strips away natural tocopherols (Vitamin E), live plant sterols, and the rich culinary aromas that defined traditional Indian gastronomy.
              </p>
              <p className="text-sm text-stone-800 font-semibold italic border-l-4 border-[#B5563C] pl-4 py-1">
                "ShreeKrishna Organics was founded on a simple conviction: what goes into your family's daily cooking should be real, unrefined, and honest."
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-[#FAF6EF]">
                <img
                  src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80"
                  alt="Traditional Indian seeds and ingredients"
                  className="w-full h-96 object-cover"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Story Section 2: Comparison Table (Wood-Pressed vs Industrial Refined) */}
        <div id="extraction" className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8DFD3] shadow-subtle mb-16">
          <SectionHeader
            badge="The Clear Difference"
            title="Traditional Wood-Pressed vs. Industrial Refined"
            subtitle="Understand what makes authentic cold-pressing fundamentally healthier, safer, and richer in nutrients."
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-[#2B241D]">
                  <th className="py-4 px-4 font-serif font-bold text-stone-900 text-base">Key Parameter</th>
                  <th className="py-4 px-4 font-serif font-bold text-[#B5563C] text-base bg-[#FAF6EF] rounded-t-xl">
                    🌿 ShreeKrishna Wood-Pressed
                  </th>
                  <th className="py-4 px-4 font-serif font-bold text-stone-500 text-base">
                    ⚙️ Mass Refined Oil
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFD3]">
                <tr>
                  <td className="py-4 px-4 font-semibold text-stone-800">Extraction Temperature</td>
                  <td className="py-4 px-4 font-medium text-stone-900 bg-[#FAF6EF]/60">
                    &lt; 40°C (True room temperature cold press)
                  </td>
                  <td className="py-4 px-4 text-stone-500">200°C – 240°C (High thermal degradation)</td>
                </tr>

                <tr>
                  <td className="py-4 px-4 font-semibold text-stone-800">Solvents & Chemicals</td>
                  <td className="py-4 px-4 font-medium text-stone-900 bg-[#FAF6EF]/60">
                    Zero chemicals. 100% mechanical expelling.
                  </td>
                  <td className="py-4 px-4 text-stone-500">Hexane chemical solvents used for maximum yield</td>
                </tr>

                <tr>
                  <td className="py-4 px-4 font-semibold text-stone-800">Bleaching & Deodorizing</td>
                  <td className="py-4 px-4 font-medium text-stone-900 bg-[#FAF6EF]/60">
                    Single-cloth filtered & natural sun resting.
                  </td>
                  <td className="py-4 px-4 text-stone-500">Treated with acid wash & bleaching earths</td>
                </tr>

                <tr>
                  <td className="py-4 px-4 font-semibold text-stone-800">Nutrients & Vitamin E</td>
                  <td className="py-4 px-4 font-medium text-stone-900 bg-[#FAF6EF]/60">
                    100% Retained natural sterols & fatty acids.
                  </td>
                  <td className="py-4 px-4 text-stone-500">Destroyed by heat; synthetic vitamins added back</td>
                </tr>

                <tr>
                  <td className="py-4 px-4 font-semibold text-stone-800">Aroma & Taste</td>
                  <td className="py-4 px-4 font-medium text-stone-900 bg-[#FAF6EF]/60">
                    Deep, authentic nutty aroma and rich color.
                  </td>
                  <td className="py-4 px-4 text-stone-500">Odorless, tasteless, and artificially bleached</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Story Section 3: Sourcing & Farmers */}
        <div id="farmers" className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8DFD3] shadow-subtle mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-[#FAF6EF]">
                <img
                  src="https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=800&q=80"
                  alt="Indian farmers harvesting natural seeds"
                  className="w-full h-96 object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B5563C]">
                Ethical Sourcing
              </span>
              <h2 className="text-3xl font-serif font-bold text-[#2B241D]">
                Partnering directly with 350+ farming families
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Great organic products begin in fertile soil. We bypass layers of mandi middlemen to source native non-GMO crop varieties directly from certified Farmer Producer Organizations (FPOs).
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-[#FAF6EF] rounded-xl border border-[#E8DFD3]">
                  <h4 className="font-bold text-xs text-[#2B241D]">Rajasthan</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">Native yellow mustard seeds sun-ripened in arid soils.</p>
                </div>
                <div className="p-3.5 bg-[#FAF6EF] rounded-xl border border-[#E8DFD3]">
                  <h4 className="font-bold text-xs text-[#2B241D]">Pollachi, Kerala</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">Sulfur-free sun dried whole coconut copras.</p>
                </div>
                <div className="p-3.5 bg-[#FAF6EF] rounded-xl border border-[#E8DFD3]">
                  <h4 className="font-bold text-xs text-[#2B241D]">Saurashtra, Gujarat</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">Sweet, high-oil content native whole groundnuts.</p>
                </div>
                <div className="p-3.5 bg-[#FAF6EF] rounded-xl border border-[#E8DFD3]">
                  <h4 className="font-bold text-xs text-[#2B241D]">Erode & Tuticorin</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">Black sesame seeds and wild palmyra palm sap.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-[#2B241D] text-white rounded-3xl p-10 sm:p-14 shadow-xl">
          <h2 className="text-3xl font-serif font-bold mb-3">
            Taste the authenticity in your next meal.
          </h2>
          <p className="text-sm text-stone-300 max-w-lg mx-auto mb-8">
            Try our single-bottle selections or explore our bestseller ShreeKrishna Heritage Trio combo pack.
          </p>
          <Button to="/shop" variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
            Explore All Products
          </Button>
        </div>

      </div>
    </div>
  );
}
