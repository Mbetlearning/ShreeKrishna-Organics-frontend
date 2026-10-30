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
      addToast('Thank you for subscribing to ShreeKrishna Organics newsletter!');
      setEmail('');
    }
  };

  return (
    <>
      <footer
        className="relative overflow-hidden bg-[#006653] text-white border-t border-white/10"
        style={{
          backgroundImage: 'url("/images/footer-bg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Soft overlay for readability while keeping the farm artwork visible */}
        <div className="absolute inset-0 bg-[#006653]/45 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#004f42]/70 to-transparent pointer-events-none" />

        <div className="relative z-10">
          {/* Trust highlights */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-9">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Award, title: "100% Wood-Pressed", text: "Slow crushed in traditional wooden presses" },
                { icon: ShieldCheck, title: "Zero Chemical Solvents", text: "No hexane, bleaching or deodorizing" },
                { icon: MapPin, title: "Single-Origin Seeds", text: "Sourced directly from trusted farmers" },
                { icon: Heart, title: "Lab Tested Batches", text: "Quality and purity checked batch-wise" },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="group flex items-start gap-3 rounded-2xl bg-[#F4E6BC]/95 border border-[#E4C875]/70 p-4 shadow-[0_5px_18px_rgba(80,55,15,0.10)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#F8EDCF] hover:border-[#D9B95F] hover:shadow-[0_10px_25px_rgba(80,55,15,0.16)]"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#075E4D] border border-[#CDAA45] text-[#F1D36E] flex items-center justify-center shrink-0 shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#173B32]">{item.title}</h4>
                      <p className="text-[11px] sm:text-xs text-[#52635B] mt-1 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          </div>

          {/* Main footer */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-11">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-9 lg:gap-8">

              
{/* ================= BRAND SECTION ================= */}
<div className="lg:col-span-4 min-w-0">

  {/* Brand Logo */}
  <div className="mb-7 flex flex-col items-start">

    <div className="inline-flex max-w-full flex-col items-center">

      {/* SHREEKRISHNA */}
      <span
        className="block text-[38px] sm:text-[46px] lg:text-[50px] font-black italic text-white"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 900,
          letterSpacing: "-2.5px",
          lineHeight: 1.15,
          textShadow: "0 3px 12px rgba(0,0,0,0.15)",
        }}
      >
        shreekrishna
      </span>

      {/* ORGANICS */}
      <span
        className="mt-2 text-[14px] sm:text-[16px] lg:text-[18px] font-extrabold uppercase text-[#E7C56D]"
        style={{
          letterSpacing: "6px",
          lineHeight: 1.5,
        }}
      >
        ORGANICS
      </span>

    </div>

    {/* Brand Tagline */}
    <div className="mt-5 flex max-w-full items-center gap-2 sm:gap-3">

      <div className="h-[2px] w-5 sm:w-8 shrink-0 bg-[#E7C56D]" />

      <span
        className="text-center text-[11px] sm:text-[13px] lg:text-[14px] font-bold uppercase text-[#E7C56D]"
        style={{
          letterSpacing: "1.5px",
          lineHeight: 1.5,
        }}
      >
        Pure Tradition, Naturally
      </span>

      <div className="h-[2px] w-5 sm:w-8 shrink-0 bg-[#E7C56D]" />

    </div>
  </div>

  {/* Brand Description */}
  <p className="max-w-md text-[13px] sm:text-sm text-emerald-50/85 leading-7">
    Reviving India's traditional cold &amp; wood-pressing
    heritage. We bring pure, thoughtfully made edible oils,
    organic jaggery and Vedic A2 ghee to conscious kitchens.
  </p>

  {/* Contact Information */}
  <div className="mt-7 space-y-5">

    {/* Address */}
    <div className="group flex items-start gap-3">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E7C56D]/20 bg-white/10 transition-colors group-hover:bg-white/15">
        <MapPin className="h-4 w-4 text-[#E7C56D]" />
      </div>

      <div className="text-xs sm:text-[13px] leading-6 text-emerald-50/85">
        <p className="font-semibold text-white">
          Shreekrishna Organics 
        </p>
        <p>Karad, Maharashtra - 415110</p>
      </div>

    </div>

    {/* Phone */}
    <div className="group flex items-start gap-3">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E7C56D]/20 bg-white/10 transition-colors group-hover:bg-white/15">
        <Phone className="h-4 w-4 text-[#E7C56D]" />
      </div>

      <div className="text-xs sm:text-[13px] leading-6">

        <a
          href="tel:+919011087310"
          className="font-medium text-white transition-colors hover:text-[#E7C56D]"
        >
          +91 9011087310
        </a>

        <p className="text-emerald-100/60">
          Mon–Sat, 9am–7pm
        </p>

      </div>
    </div>

    {/* Email */}
    <div className="group flex items-start gap-3">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E7C56D]/20 bg-white/10 transition-colors group-hover:bg-white/15">
        <Mail className="h-4 w-4 text-[#E7C56D]" />
      </div>

      <a
        href="mailto:care@shreekrishnaorganics.com"
        className="min-w-0 break-all pt-2 text-xs sm:text-[13px] text-emerald-50/85 transition-colors hover:text-[#E7C56D]"
      >
        shreekrishnaorganics.com
      </a>

    </div>
  </div>
</div>
{/* ================= END BRAND SECTION ================= */}


              {/* Services */}
              <div className="lg:col-span-2">
                <h4 className="font-bold uppercase tracking-[0.12em] text-[#E7C56D] text-sm mb-5">
                  SERVICES
                </h4>
                <ul className="space-y-3 text-sm text-emerald-50/85">
                  <li><Link to="/shop" className="hover:text-[#FFE49A] transition-colors">Shop</Link></li>
                  <li><Link to="/orders" className="hover:text-[#FFE49A] transition-colors">Track Your Order</Link></li>
                  <li><Link to="/about" className="hover:text-[#FFE49A] transition-colors">Our Story</Link></li>
                  <li><Link to="/about#farmers" className="hover:text-[#FFE49A] transition-colors">Our Farmers</Link></li>
                  <li><Link to="/contact" className="hover:text-[#FFE49A] transition-colors">Bulk Orders & Gifting</Link></li>
                  <li><Link to="/contact" className="hover:text-[#FFE49A] transition-colors">Contact Us</Link></li>
                </ul>
              </div>

              {/* Policies */}
              <div className="lg:col-span-2">
                <h4 className="font-bold uppercase tracking-[0.12em] text-[#E7C56D] text-sm mb-5">
                  POLICIES
                </h4>
                <ul className="space-y-3 text-sm text-emerald-50/85">
                  <li><Link to="/contact" className="hover:text-[#FFE49A] transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/contact" className="hover:text-[#FFE49A] transition-colors">Shipping Policy</Link></li>
                  <li><Link to="/contact" className="hover:text-[#FFE49A] transition-colors">Returns & Refunds</Link></li>
                  <li><Link to="/contact" className="hover:text-[#FFE49A] transition-colors">Terms of Use</Link></li>
                  <li><Link to="/about" className="hover:text-[#FFE49A] transition-colors">Quality Standards</Link></li>
                </ul>
              </div>

              {/* Help + Newsletter */}
              <div className="lg:col-span-4">
                <div className="rounded-3xl border border-white/15 bg-[#00584a]/60 backdrop-blur-[3px] p-5 sm:p-6 shadow-xl">
                  <h4 className="font-bold uppercase tracking-[0.12em] text-[#E7C56D] text-sm">
                    NEED HELP?
                  </h4>
                  <p className="text-xs text-emerald-50/80 leading-5 mt-2">
                    Questions about products, batch quality or your order? Our support team is here to help.
                  </p>

                  <button
                    type="button"
                    onClick={() => setHelpModalOpen(true)}
                    className="mt-4 w-full rounded-full bg-[#E7C56D] hover:bg-[#F3D985] text-[#075e4d] px-6 py-3 font-bold text-sm transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <HelpCircle className="w-4 h-4" />
                    Contact & Support
                  </button>

                  
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/15 bg-[#004b3f]/35">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col lg:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs text-emerald-50/75">
              <p className="text-center lg:text-left">
                © 2026 Shreekrishna Organics Pure Tradition, Naturally.
              </p>
              <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1">
                <span>FSSAI Lic. No: 21519193000515</span>
                <span className="text-[#E7C56D]">•</span>
                <span>100% Natural And Cold Presse</span>
                <span className="text-[#E7C56D]">•</span>
                <span>Made in Bharat</span>
              </div>
            </div>
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
                <h3 className="font-serif font-bold text-xl text-[#2B241D]">ShreeKrishna Help Desk</h3>
                <p className="text-xs text-stone-500">Fast assistance for all your queries</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-stone-700 py-2">
              <div className="p-3.5 bg-white rounded-2xl border border-[#E8DFD3]">
                <h4 className="font-bold text-sm text-[#2B241D] flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#B5563C]" /> Instant Phone & WhatsApp
                </h4>
                <p className="mt-1 text-stone-600">Call <strong>+91 9011087310</strong> (Mon–Sat, 9am–7pm) for live assistance from our oil specialists.</p>
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
                <p className="mt-1 text-stone-600">Write to <strong>shreekrishnaorganics.com</strong> for bulk orders or test reports. Replies within 12h.</p>
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
