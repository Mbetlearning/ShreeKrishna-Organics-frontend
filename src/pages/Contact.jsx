import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';

const FAQS = [
  {
    q: "How are ShreeKrishna Organics products different from supermarket oils?",
    a: "Many commercial oils are mechanically extracted in high-speed steel screw presses where friction heats seeds past 65°C and solvent hexanes are used. At ShreeKrishna Organics, we use authentic Vaagai wood mortars (Marachekku/Kolhu) rotating under 14 RPM to keep temperatures below 40°C."
  },
  {
    q: "What is the shelf life of unrefined wood-pressed oils and organic jaggery?",
    a: "Because our oils and jaggery are 100% pure without synthetic preservatives or chemical refining, they are best consumed within 9 to 12 months from the date of packing. Store in a cool pantry away from direct sunlight."
  },
  {
    q: "Do you ship across all pincodes in India?",
    a: "Yes! We ship across 24,000+ pincodes across India via Delhivery and BlueDart Express. Orders over ₹999 qualify for Free Express Delivery."
  },
  {
    q: "How can I get lab test reports for my batch?",
    a: "Every bottle and pack features a batch QR code. You can also email our customer care team at care@shreekrishnaorganics.com with your order ID for certified NABL-accredited purity analysis."
  }
];

export default function Contact() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [isSent, setIsSent] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSent(true);
    addToast('Thank you! Your message has been sent to ShreeKrishna Organics customer care.');
    setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
    setTimeout(() => setIsSent(false), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-[#FAF6EF] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#ECE4D8] text-[#2B241D] mb-2 border border-[#E8DFD3]">
            <MessageSquare className="w-3.5 h-3.5 text-[#B5563C]" />
            We're Here to Help
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2B241D]">
            Get in Touch with ShreeKrishna Organics
          </h1>
          <p className="mt-2 text-sm text-stone-600 font-sans">
            Have questions regarding our wood-pressing methods, Vedic ghee, bulk orders, or your delivery? Reach out to our dedicated support team.
          </p>
        </div>

        {/* 2-Column Contact Info & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mb-20 items-start">

          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD3] shadow-subtle space-y-6">
              <h3 className="font-serif font-bold text-xl text-[#2B241D] pb-3 border-b border-[#E8DFD3]">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#FAF6EF] text-[#2B241D] flex items-center justify-center border border-[#E8DFD3] shrink-0">
                    <Phone className="w-5 h-5 text-[#B5563C]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Phone Support</h4>
                    <p className="text-sm font-semibold text-stone-900 mt-0.5">+91 98765 43210</p>
                    <p className="text-xs text-stone-500">Mon – Sat, 9:00 AM – 7:00 PM IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#FAF6EF] text-[#2B241D] flex items-center justify-center border border-[#E8DFD3] shrink-0">
                    <Mail className="w-5 h-5 text-[#B5563C]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Email Inquiries</h4>
                    <p className="text-sm font-semibold text-stone-900 mt-0.5">care@shreekrishnaorganics.com</p>
                    <p className="text-xs text-stone-500">Quick response within 12 business hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#FAF6EF] text-[#2B241D] flex items-center justify-center border border-[#E8DFD3] shrink-0">
                    <MapPin className="w-5 h-5 text-[#B5563C]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Headquarters</h4>
                    <p className="text-sm font-semibold text-stone-900 mt-0.5">ShreeKrishna Organics Pvt Ltd</p>
                    <p className="text-xs text-stone-500">Karad,Maharshtra-415110</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#FAF6EF] text-[#2B241D] flex items-center justify-center border border-[#E8DFD3] shrink-0">
                    <Clock className="w-5 h-5 text-[#B5563C]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Artisan Production Unit</h4>
                    <p className="text-sm font-semibold text-stone-900 mt-0.5">Vaagai Extraction & Bilona Mill</p>
                    <p className="text-xs text-stone-500">Perundurai Agricultural Cluster, Erode, Tamil Nadu — 638052</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Floating Chat helper */}
              <div className="pt-4 border-t border-[#E8DFD3]">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" /> Chat on WhatsApp with an Organic Specialist
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DFD3] shadow-subtle">
              <h3 className="font-serif font-bold text-2xl text-[#2B241D] mb-2">
                Send Us a Message
              </h3>
              <p className="text-xs text-stone-500 mb-6">
                Fill out the form below and our team will get back to you promptly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      name="name"
                      placeholder="e.g. Ramesh Iyer"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-[#FAF6EF] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#B5563C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      name="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-[#FAF6EF] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#B5563C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-[#FAF6EF] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#B5563C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-[#FAF6EF] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#B5563C] cursor-pointer"
                    >
                      <option value="General Inquiry">General Product Inquiry</option>
                      <option value="Order Tracking">Order Tracking / Delivery</option>
                      <option value="Bulk Purchase">Bulk / Corporate Gifting</option>
                      <option value="Farmer Collaboration">Farmer Partnership</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    name="message"
                    rows={4}
                    placeholder="Tell us what you'd like to know..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-[#FAF6EF] border border-[#E8DFD3] rounded-xl p-3.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#B5563C]"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  icon={Send}
                  iconPosition="right"
                  className="w-full font-bold shadow-md"
                >
                  Send Inquiry
                </Button>
              </form>
            </div>
          </div>

        </div>

        {/* FAQs Accordion */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8DFD3] shadow-subtle max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#ECE4D8] text-[#2B241D] mb-2 border border-[#E8DFD3]">
              <MessageSquare className="w-3.5 h-3.5 text-[#B5563C]" />
              Got Questions?
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#2B241D]">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Everything you need to know about our extraction, shelf life, and courier shipping.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-[#E8DFD3] rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? -1 : idx)}
                    className="w-full p-4 sm:p-5 text-left bg-[#FAF6EF]/40 hover:bg-[#FAF6EF] flex items-center justify-between gap-4 font-bold text-stone-900 text-sm sm:text-base cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="text-stone-500 shrink-0">
                      {isOpen ? <ChevronUp className="w-5 h-5 text-[#B5563C]" /> : <ChevronDown className="w-5 h-5" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="p-4 sm:p-5 bg-white text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-[#E8DFD3] animate-in fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
