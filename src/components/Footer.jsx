import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Heart, Phone, Mail, MapPin, ArrowRight, CheckCircle2, HelpCircle, X, Truck, FileText } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const { addToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      addToast('Thank you for subscribing to Shrikrishna Organics newsletter!');
      setEmail('');
    }
  };

  return (
    <>
      <footer className="bg-[#1F1813] text-[#FAF6EF] pt-16 pb-12 border-t border-[#2B241D]">

        {/* Top Trust Banner / 4 Pillars */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#2B241D] text-[#B5563C] flex items-center justify-center shrink-0 border border-[#B5563C]/30">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold font-serif text-stone-100">100% Wood-Pressed</h4>
                <p className="text-xs text-stone-400 mt-1">Slow crushed in Vaagai wood at &lt; 40°C</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#2B241D] text-[#B5563C] flex items-center justify-center shrink-0 border border-[#B5563C]/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold font-serif text-stone-100">Zero Chemical Solvents</h4>
                <p className="text-xs text-stone-400 mt-1">No hexane, bleaching, or deodorizing</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#2B241D] text-[#B5563C] flex items-center justify-center shrink-0 border border-[#B5563C]/30">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold font-serif text-stone-100">Single-Origin Seeds</h4>
                <p className="text-xs text-stone-400 mt-1">Direct from 350+ certified organic farmers</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#2B241D] text-[#B5563C] flex items-center justify-center shrink-0 border border-[#B5563C]/30">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold font-serif text-stone-100">Lab Tested Batches</h4>
                <p className="text-xs text-stone-400 mt-1">100% NABL & FSSAI compliant purity</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Links (Aligned to Wireframe: Business Address, Services, Policies, Support) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">

            {/* Col 1: Brand & Full Business Address (Wireframe Col 1) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF6EF] text-[#2B241D] flex items-center justify-center font-serif font-bold text-lg">
                  SK
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-xl tracking-wider text-stone-100">
                    SHRIKRISHNA ORGANICS
                  </span>
                  <span className="text-[10px] tracking-[0.2em] text-[#B5563C] font-semibold uppercase">
                    Pure Tradition, Naturally
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
                Reviving India's traditional cold & wood-pressing (*Ghani / Marachekku*) heritage. We deliver unrefined edible oils, organic palm jaggery, and Vedic A2 ghee to conscious kitchens.
              </p>

              {/* Business Address & Contact Info per wireframe */}
              <div className="pt-2 space-y-2.5 text-xs text-stone-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#B5563C] shrink-0 mt-0.5" />
                  <span>
                    <strong>Shrikrishna Organics Pvt Ltd</strong><br />
                    Karad<br />
                    Karad,Maharashtra-415110
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#B5563C] shrink-0" />
                  <span>Care: +91 98765 43210 (Mon – Sat, 9am – 7pm)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#B5563C] shrink-0" />
                  <span>care@shrikrishnaorganics.com</span>
                </div>
              </div>
            </div>

            {/* Col 2: Services (Wireframe Col 2) */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#C68A2E]">
                SERVICES
              </h4>
              <ul className="space-y-2.5 text-xs text-stone-300">
                <li>
                  <Link to="/shop" className="hover:text-white transition-colors flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#B5563C]" /> Home Delivery
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    Bulk Orders & Gifting
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className="hover:text-white transition-colors">
                    Track Order Status
                  </Link>
                </li>
                <li>
                  <Link to="/about#extraction" className="hover:text-white transition-colors">
                    Custom Wood-Pressing
                  </Link>
                </li>
                <li>
                  <Link to="/about#farmers" className="hover:text-white transition-colors">
                    Farmer Collective Program
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Policies (Wireframe Col 3) */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#C68A2E]">
                POLICIES
              </h4>
              <ul className="space-y-2.5 text-xs text-stone-300">
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    Returns & Refunds
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    Terms of Use
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    Shipping & Delivery Terms
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    Lab Certification Standards
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Support & Help Button (Wireframe Col 4) */}
            <div className="lg:col-span-4 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#C68A2E]">
                SUPPORT
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Have a question about our cold-pressing techniques, batch reports, or order shipping? We're here to help.
              </p>

              {/* Dedicated HELP Button per wireframe */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setHelpModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#B5563C] hover:bg-[#9E442B] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>HELP & SUPPORT</span>
                </button>
              </div>

              {/* Newsletter subscription */}
              <div className="pt-4 border-t border-white/10">
                <span className="text-xs font-semibold text-stone-300 block mb-2">Join our Heritage Newsletter</span>
                {subscribed ? (
                  <div className="flex items-center gap-2 p-2.5 bg-[#2B241D] border border-[#B5563C]/40 rounded-xl text-xs text-[#FAF6EF]">
                    <CheckCircle2 className="w-4 h-4 text-[#C68A2E]" />
                    <span>Thank you for joining our community!</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex items-center bg-[#2B241D] rounded-xl border border-white/10 p-1.5 focus-within:border-[#B5563C]">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent px-2.5 py-1 text-xs text-white placeholder-stone-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-[#B5563C] hover:bg-[#9E442B] text-white px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 cursor-pointer transition-colors"
                    >
                      Join
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© 2026 Shrikrishna Organics Pvt Ltd. Pure Tradition, Naturally.</p>
          <div className="flex items-center gap-3 text-[11px]">
            <span>FSSAI Lic. No: 10020042000123</span>
            <span>•</span>
            <span>100% Certified Organic</span>
            <span>•</span>
            <span>Made in Bharat</span>
          </div>
        </div>
      </footer>

      {/* Interactive Quick Help & Support Modal */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FAF6EF] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#E8DFD3] shadow-2xl relative text-[#2B241D]">
            <button
              onClick={() => setHelpModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors"
              aria-label="Close help modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#B5563C] text-white flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-[#2B241D]">Shrikrishna Help Desk</h3>
                <p className="text-xs text-stone-500">Fast assistance for all your queries</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-stone-700 py-2">
              <div className="p-3.5 bg-white rounded-2xl border border-[#E8DFD3]">
                <h4 className="font-bold text-sm text-[#2B241D] flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#B5563C]" /> Instant Phone & WhatsApp
                </h4>
                <p className="mt-1 text-stone-600">Call <strong>+91 98765 43210</strong> (Mon–Sat, 9am–7pm) for live assistance from our oil specialists.</p>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-[#E8DFD3]">
                <h4 className="font-bold text-sm text-[#2B241D] flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#B5563C]" /> Track an Existing Shipment
                </h4>
                <p className="mt-1 text-stone-600">Visit our <Link to="/orders" onClick={() => setHelpModalOpen(false)} className="text-[#B5563C] underline font-semibold">Orders page</Link> to check live Delhivery / BlueDart tracking status.</p>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-[#E8DFD3]">
                <h4 className="font-bold text-sm text-[#2B241D] flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#B5563C]" /> Email Customer Care
                </h4>
                <p className="mt-1 text-stone-600">Write to <strong>care@shrikrishnaorganics.com</strong> for bulk orders or test reports. Replies within 12h.</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Link
                to="/contact"
                onClick={() => setHelpModalOpen(false)}
                className="px-5 py-2.5 bg-[#2B241D] hover:bg-[#B5563C] text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <span>Visit Contact Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
