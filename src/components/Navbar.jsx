import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Search, ChevronDown, Package, LogOut, Phone, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { totalItems, subtotal } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  // Wireframe Header Nav: Home, Products, About Us, Contact
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/shop' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
      {/* 1. Top Daily Updates Ticker / Announcement Bar */}
      <div className="bg-[#1F1813] text-[#FAF6EF] py-2 px-4 text-xs tracking-wide border-b border-[#2B241D]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2 text-stone-300">
            <span className="inline-block w-2 h-2 rounded-full bg-[#B5563C] animate-pulse" />
            <span className="font-medium">100% Traditional Vaagai Wood-Pressed • Certified Organic</span>
          </div>

          <div className="flex-1 text-center sm:flex-none">
            <span>
              🌿 Free Shipping on orders over <strong className="text-[#C68A2E]">₹999</strong> • Use code <span className="bg-[#2B241D] px-1.5 py-0.5 rounded font-mono font-bold text-[#FAF6EF] border border-[#B5563C]/50">SHRIKRISHNA10</span> for 10% Off
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-stone-300">
            <Link to="/contact" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-[#B5563C]" />
              <span>Care: +91 98765 43210</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF6EF]/95 backdrop-blur-md border-b border-[#E8DFD3] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Mobile menu trigger */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-stone-700 hover:text-[#2B241D] hover:bg-[#ECE4D8] transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo Treatment - Shrikrishna Organics */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-[#2B241D] text-[#FAF6EF] flex items-center justify-center font-display font-bold text-lg shadow-xs group-hover:bg-[#B5563C] transition-all duration-300 border border-[#B5563C]/30">
                SK
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl sm:text-2xl tracking-tight text-[#2B241D] leading-none">
                  Shrikrishna
                </span>
                <span className="text-[10px] tracking-[0.25em] text-[#B5563C] font-semibold uppercase mt-0.5">
                  Pure Tradition, Naturally
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (Simplified: Home, Products, About Us, Contact) */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors hover:text-[#B5563C] relative py-1 ${
                      isActive
                        ? 'text-[#2B241D] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#B5563C] after:rounded-full'
                        : 'text-stone-600'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Right Action Icons (Search, Account, Cart) */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* Search Toggle */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 rounded-xl text-stone-700 hover:text-[#2B241D] hover:bg-[#ECE4D8] transition-colors cursor-pointer"
                  aria-label="Search products"
                >
                  <Search className="w-5 h-5" />
                </button>

                {searchOpen && (
                  <form
                    onSubmit={handleSearchSubmit}
                    className="absolute right-0 top-12 w-72 sm:w-80 bg-white p-2.5 rounded-2xl shadow-card border border-[#E8DFD3] z-50 animate-in fade-in zoom-in-95"
                  >
                    <div className="flex items-center gap-2 bg-[#FAF6EF] px-3 py-2 rounded-xl border border-stone-200">
                      <Search className="w-4 h-4 text-stone-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="Search mustard oil, jaggery, ghee..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        className="w-full bg-transparent text-xs text-stone-800 placeholder-stone-400 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="text-xs bg-[#2B241D] hover:bg-[#B5563C] text-white px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
                      >
                        Find
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* User Account Dropdown */}
              <div className="relative">
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-white border border-[#E8DFD3] hover:border-[#B5563C]/50 text-stone-800 transition-all cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#2B241D] text-white text-xs font-bold flex items-center justify-center">
                        {user.name.charAt(0)}
                      </div>
                      <span className="hidden sm:inline text-xs font-semibold text-stone-800 max-w-[100px] truncate">
                        {user.name.split(' ')[0]}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                    </button>

                    {userDropdownOpen && (
                      <div
                        className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-card border border-[#E8DFD3] p-2 z-50 animate-in fade-in"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <div className="px-3 py-2 border-b border-stone-100 mb-1">
                          <p className="text-xs font-bold text-stone-800 truncate">{user.name}</p>
                          <p className="text-[11px] text-stone-400 truncate">{user.email}</p>
                        </div>
                        <Link
                          to="/orders"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-700 hover:bg-[#FAF6EF] hover:text-[#B5563C]"
                        >
                          <Package className="w-4 h-4 text-stone-500" />
                          <span>My Orders & Tracking</span>
                        </Link>
                        <button
                          type="button"
                          onClick={logout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:text-[#2B241D] hover:bg-[#ECE4D8] transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                )}
              </div>

              {/* Cart Button */}
              <Link
                to="/cart"
                className="relative flex items-center gap-2 px-3.5 py-2 bg-[#2B241D] text-[#FAF6EF] rounded-xl hover:bg-[#B5563C] active:scale-95 transition-all shadow-xs group"
                aria-label={`Shopping cart with ${totalItems} items`}
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#B5563C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline text-xs font-bold">
                  {totalItems > 0 ? `₹${subtotal}` : 'Cart'}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-sm bg-[#FAF6EF] h-full shadow-2xl flex flex-col p-6 overflow-y-auto z-10 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between pb-6 border-b border-[#E8DFD3]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#2B241D] text-[#FAF6EF] flex items-center justify-center font-serif font-bold text-sm">
                  SK
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-base text-[#2B241D]">Shrikrishna</span>
                  <span className="text-[9px] tracking-wider text-[#B5563C] font-semibold uppercase">Organics</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-stone-600 hover:bg-stone-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="mt-4">
              <div className="flex items-center gap-2 bg-white px-3 py-2.5 rounded-xl border border-stone-200 shadow-2xs">
                <Search className="w-4 h-4 text-stone-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search oils, jaggery, ghee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs text-stone-800 placeholder-stone-400 focus:outline-none"
                />
              </div>
            </form>

            {/* Navigation links */}
            <div className="flex flex-col gap-2 mt-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#2B241D] text-white font-bold'
                        : 'text-stone-800 hover:bg-[#ECE4D8]'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <NavLink
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-medium text-stone-800 hover:bg-[#ECE4D8]"
              >
                My Orders & Tracking
              </NavLink>
            </div>

            {/* User Account / Auth Section in Drawer */}
            <div className="mt-auto pt-6 border-t border-[#E8DFD3]">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#2B241D] text-white text-sm font-bold flex items-center justify-center">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-800">{user.name}</p>
                      <p className="text-[11px] text-stone-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-4 bg-stone-200/80 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center bg-[#2B241D] text-white text-xs font-semibold rounded-xl"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center bg-white border border-stone-300 text-stone-800 text-xs font-semibold rounded-xl"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
