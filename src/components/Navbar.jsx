import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  UserRound,
  Menu,
  X,
  Search,
  ChevronDown,
  Package,
  LogOut,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { totalItems, subtotal } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [blogDropdownOpen, setBlogDropdownOpen] = useState(false);
  const [mobileBlogOpen, setMobileBlogOpen] = useState(false);

  /* TOP UPDATE STATES */
  const [currentUpdate, setCurrentUpdate] = useState(0);
  const [updateVisible, setUpdateVisible] = useState(true);

  const navigate = useNavigate();

  /* =========================================================
     TOP 4 ROTATING UPDATES
  ========================================================= */

  const topUpdates = [
    "🌿 100% Traditional • Pure • Naturally Made",
    "🚚 Free Shipping on Orders Above ₹999",
    "🎁 Use Code SHREEKRISHNA10 & Get 10% OFF",
    "✨ Pure Desi Ghee & Wood-Pressed Oils Available Now",
  ];

  /* =========================================================
     UPDATE CHANGE EVERY 4 SECONDS
  ========================================================= */

  useEffect(() => {
    const interval = setInterval(() => {
      /*
        First move current update upward
        and fade it out.
      */
      setUpdateVisible(false);

      /*
        After animation finishes,
        show next update.
      */
      const timeout = setTimeout(() => {
        setCurrentUpdate(
          (previous) =>
            (previous + 1) % topUpdates.length
        );

        setUpdateVisible(true);
      }, 500);

      return () => clearTimeout(timeout);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(
        `/shop?search=${encodeURIComponent(
          searchQuery.trim()
        )}`
      );

      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  /* =========================================================
     NAVIGATION LINKS
  ========================================================= */

  const navLinks = [
    {
      name: "All Products",
      path: "/",
    },
    {
      name: "Wood-Pressed Oils",
      path: "/wood-pressed-oils",
    },
    {
      name: "A2 Ghee",
      path: "/a2-ghee",
    },
    {
      name: "Jaggery",
      path: "/jaggery",
    },
    {
      name: "Health Supplements",
      path: "/health-supplements",
    },
    {
      name: "Hot Deals",
      path: "/hot-deals",
    },
    {
      name: "Healthy Combos",
      path: "/healthy-combos",
    },
    {
      name: "Blogs",
      path: "/blogs",
    },
  ];

  return (
    <>

      {/* =====================================================
          1. TOP ROTATING UPDATE BAR
      ===================================================== */}

      <div
        className="
          bg-[#075e4d]
          text-white
          overflow-hidden
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            h-[38px]
            px-4
            flex
            items-center
            justify-center
            relative
            overflow-hidden
          "
        >
          <div
            className={`
              absolute
              left-0
              right-0
              flex
              items-center
              justify-center
              text-center
              px-4
              text-[11px]
              sm:text-[12px]
              md:text-[13px]
              font-semibold
              tracking-wide
              transition-all
              duration-500
              ease-in-out

              ${
                updateVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-7"
              }
            `}
          >
            {topUpdates[currentUpdate]}
          </div>
        </div>
      </div>

      {/* =====================================================
          2. MAIN WHITE NAVBAR
      ===================================================== */}

      <header
        className="
          sticky
          top-0
          z-40
          bg-gradient-to-r
          from-[#FFF8E7]
          via-[#F3DF9B]
          to-[#FFF8E7]
          backdrop-blur-md
          border-b
          border-[#E3C76F]
          shadow-[0_2px_10px_rgba(120,90,20,0.08)]
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            sm:px-6
            lg:px-8
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              h-[74px]
            "
          >

            {/* =================================================
                MOBILE MENU BUTTON
            ================================================= */}

            <div className="lg:hidden">
              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(!mobileMenuOpen)
                }
                className="
                  p-2
                  rounded-full
                  text-[#075e4d]
                  hover:bg-[#edf5e8]
                  transition
                "
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X size={24} />
                ) : (
                  <Menu size={24} />
                )}
              </button>
            </div>

            {/* =================================================
                SHREEKRISHNA LOGO
            ================================================= */}

            <Link
              to="/"
              className="
                flex
                flex-col
                items-center
                justify-center
                group
                leading-none
                select-none
              "
            >
              <div className="flex items-start">

                <span
                  className="
                    font-serif
                    italic
                    font-bold
                    text-[27px]
                    sm:text-[32px]
                    lg:text-[36px]
                    tracking-[-0.055em]
                    text-[#075e4d]
                    group-hover:text-[#0a725c]
                    transition
                  "
                >
                  shreekrishna
                </span>

                <span
                  className="
                    text-[8px]
                    sm:text-[9px]
                    font-bold
                    text-[#075e4d]
                    ml-1
                    mt-1
                  "
                >
                  ®
                </span>

              </div>

              <span
                className="
                  text-[7px]
                  sm:text-[8px]
                  tracking-[0.38em]
                  uppercase
                  text-[#9a7734]
                  font-bold
                  mt-[5px]
                  ml-[4px]
                "
              >
                ORGANICS
              </span>
            </Link>

            {/* =================================================
                DESKTOP NAVIGATION
            ================================================= */}

            <nav
              className="
                hidden
                lg:flex
                items-center
                justify-center
                gap-3
                xl:gap-5
              "
            >
              {navLinks.map((link) => {
                if (link.name === "Blogs") {
                  return (
                    <div
                      key={link.path}
                      className="relative"
                      onMouseEnter={() => setBlogDropdownOpen(true)}
                      onMouseLeave={() => setBlogDropdownOpen(false)}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setBlogDropdownOpen((previous) => !previous)
                        }
                        className="
                          relative
                          py-2
                          whitespace-nowrap
                          text-[11px]
                          xl:text-[13px]
                          font-medium
                          text-[#313d38]
                          hover:text-[#075e4d]
                          transition-colors
                          duration-200
                          flex
                          items-center
                          gap-1
                        "
                      >
                        Blogs

                        <ChevronDown
                          size={14}
                          className={`
                            transition-transform
                            duration-200
                            ${blogDropdownOpen ? "rotate-180" : "rotate-0"}
                          `}
                        />
                      </button>

                      <div
                        className={`
                          absolute
                          left-1/2
                          -translate-x-1/2
                          top-full
                          pt-3
                          z-[100]
                          transition-all
                          duration-200
                          ${
                            blogDropdownOpen
                              ? "opacity-100 visible translate-y-0"
                              : "opacity-0 invisible -translate-y-2 pointer-events-none"
                          }
                        `}
                      >
                        <div
                          className="
                            w-[250px]
                            bg-white
                            rounded-xl
                            border
                            border-[#e1e8e4]
                            shadow-[0_15px_40px_rgba(0,70,55,0.15)]
                            overflow-hidden
                            p-2
                          "
                        >
                          <NavLink
                            to="/blogs/medicinal-recipes"
                            onClick={() => setBlogDropdownOpen(false)}
                            className={({ isActive }) =>
                              `
                                group
                                flex
                                items-center
                                gap-3
                                px-4
                                py-3.5
                                rounded-lg
                                transition-all
                                duration-200
                                ${
                                  isActive
                                    ? "bg-[#edf5e8] text-[#075e4d]"
                                    : "text-[#4d5551] hover:bg-[#f4f8f5] hover:text-[#075e4d]"
                                }
                              `
                            }
                          >
                            <div className="w-9 h-9 rounded-lg bg-[#edf5e8] flex items-center justify-center text-[#075e4d] shrink-0">
                              <span className="text-lg">📋</span>
                            </div>

                            <div>
                              <p className="text-sm font-semibold">
                                Medicinal Recipes
                              </p>
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                Traditional recipes
                              </p>
                            </div>
                          </NavLink>

                          <NavLink
                            to="/blogs/healthy-recipes"
                            onClick={() => setBlogDropdownOpen(false)}
                            className={({ isActive }) =>
                              `
                                group
                                flex
                                items-center
                                gap-3
                                px-4
                                py-3.5
                                rounded-lg
                                transition-all
                                duration-200
                                ${
                                  isActive
                                    ? "bg-[#edf5e8] text-[#075e4d]"
                                    : "text-[#4d5551] hover:bg-[#f4f8f5] hover:text-[#075e4d]"
                                }
                              `
                            }
                          >
                            <div className="w-9 h-9 rounded-lg bg-[#edf5e8] flex items-center justify-center text-[#075e4d] shrink-0">
                              <span className="text-lg">🥗</span>
                            </div>

                            <div>
                              <p className="text-sm font-semibold">
                                Healthy Recipes
                              </p>
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                Simple healthy ideas
                              </p>
                            </div>
                          </NavLink>

                          <NavLink
                            to="/blogs"
                            onClick={() => setBlogDropdownOpen(false)}
                            className={({ isActive }) =>
                              `
                                group
                                flex
                                items-center
                                gap-3
                                px-4
                                py-3.5
                                rounded-lg
                                transition-all
                                duration-200
                                ${
                                  isActive
                                    ? "bg-[#edf5e8] text-[#075e4d]"
                                    : "text-[#4d5551] hover:bg-[#f4f8f5] hover:text-[#075e4d]"
                                }
                              `
                            }
                          >
                            <div className="w-9 h-9 rounded-lg bg-[#edf5e8] flex items-center justify-center text-[#075e4d] shrink-0">
                              <span className="text-lg">📝</span>
                            </div>

                            <div>
                              <p className="text-sm font-semibold">
                                ShreeKrishna Blogs
                              </p>
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                Stories & articles
                              </p>
                            </div>
                          </NavLink>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `
                        relative
                        py-2
                        whitespace-nowrap
                        text-[11px]
                        xl:text-[13px]
                        font-medium
                        transition-colors
                        duration-200
                        ${
                          isActive
                            ? "text-[#075e4d] font-semibold"
                            : "text-[#313d38] hover:text-[#075e4d]"
                        }
                      `
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {link.name === "Hot Deals" ? (
                          <span className="hot-deals-animated">
                            Hot Deals
                          </span>
                        ) : (
                          link.name
                        )}

                        {isActive && (
                          <span
                            className="
                              absolute
                              -bottom-[3px]
                              left-1/2
                              -translate-x-1/2
                              w-5
                              h-[2px]
                              bg-[#075e4d]
                              rounded-full
                            "
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* =================================================
                RIGHT SIDE ICONS
            ================================================= */}

            <div
              className="
                flex
                items-center
                gap-1
                sm:gap-2
              "
            >

              {/* =================================================
                  SEARCH
              ================================================= */}

              <div className="relative">

                <button
                  type="button"
                  onClick={() =>
                    setSearchOpen(!searchOpen)
                  }
                  className="
                    w-10
                    h-10
                    flex
                    items-center
                    justify-center
                    rounded-full
                    text-[#075e4d]
                    hover:bg-[#edf5e8]
                    transition
                  "
                  aria-label="Search"
                >
                  <Search size={25} strokeWidth={1.8} />
                </button>

                {searchOpen && (
                  <form
                    onSubmit={handleSearchSubmit}
                    className="
                      absolute
                      right-0
                      top-12
                      w-[290px]
                      sm:w-[340px]
                      bg-white
                      p-3
                      rounded-xl
                      shadow-xl
                      border
                      border-[#e4ebe7]
                      z-50
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        bg-[#f7faf8]
                        border
                        border-[#dfe8e3]
                        rounded-lg
                        px-3
                        py-2
                      "
                    >
                      <Search
                        size={17}
                        className="text-gray-400"
                      />

                      <input
                        type="text"
                        placeholder="Search oils, ghee, jaggery..."
                        value={searchQuery}
                        onChange={(e) =>
                          setSearchQuery(e.target.value)
                        }
                        autoFocus
                        className="
                          flex-1
                          bg-transparent
                          outline-none
                          text-sm
                          text-gray-700
                        "
                      />

                      <button
                        type="submit"
                        className="
                          bg-[#075e4d]
                          hover:bg-[#064c3f]
                          text-white
                          px-4
                          py-2
                          rounded-lg
                          text-xs
                          font-semibold
                          transition
                        "
                      >
                        Search
                      </button>

                    </div>
                  </form>
                )}

              </div>

              {/* =================================================
                  USER / ACCOUNT
              ================================================= */}

              <div className="relative">

                {isAuthenticated ? (
                  <>

                    <button
                      type="button"
                      onClick={() =>
                        setUserDropdownOpen(
                          !userDropdownOpen
                        )
                      }
                      className="
                        flex
                        items-center
                        gap-1.5
                        h-10
                        px-2
                        rounded-full
                        hover:bg-[#edf5e8]
                        transition
                      "
                    >

                      <div
                        className="
                          w-8
                          h-8
                          rounded-full
                          bg-[#075e4d]
                          text-white
                          flex
                          items-center
                          justify-center
                          text-xs
                          font-bold
                        "
                      >
                        {user?.name
                          ? user.name
                              .charAt(0)
                              .toUpperCase()
                          : "U"}
                      </div>

                      <span
                        className="
                          hidden
                          md:inline
                          text-xs
                          font-semibold
                          text-[#31413b]
                          max-w-[90px]
                          truncate
                        "
                      >
                        {user?.name
                          ? user.name.split(" ")[0]
                          : "Account"}
                      </span>

                      <ChevronDown
                        size={14}
                        className="
                          hidden
                          md:block
                          text-gray-500
                        "
                      />

                    </button>

                    {/* USER DROPDOWN */}

                    {userDropdownOpen && (
                      <div
                        className="
                          absolute
                          right-0
                          top-12
                          w-56
                          bg-white
                          rounded-xl
                          border
                          border-[#e4ebe7]
                          shadow-xl
                          p-2
                          z-50
                        "
                      >

                        <div
                          className="
                            px-3
                            py-3
                            border-b
                          "
                        >
                          <p
                            className="
                              text-sm
                              font-bold
                              text-[#173b31]
                              truncate
                            "
                          >
                            {user?.name}
                          </p>

                          <p
                            className="
                              text-xs
                              text-gray-400
                              truncate
                            "
                          >
                            {user?.email}
                          </p>
                        </div>

                        <Link
                          to="/orders"
                          onClick={() =>
                            setUserDropdownOpen(false)
                          }
                          className="
                            flex
                            items-center
                            gap-3
                            px-3
                            py-3
                            mt-1
                            rounded-lg
                            text-sm
                            text-gray-700
                            hover:bg-[#edf5e8]
                            hover:text-[#075e4d]
                          "
                        >
                          <Package size={17} />

                          My Orders
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="
                            w-full
                            flex
                            items-center
                            gap-3
                            px-3
                            py-3
                            rounded-lg
                            text-sm
                            text-red-600
                            hover:bg-red-50
                          "
                        >
                          <LogOut size={17} />

                          Sign Out
                        </button>

                      </div>
                    )}

                  </>
                ) : (

                  <Link
                    to="/login"
                    className="
                      w-10
                      h-10
                      flex
                      items-center
                      justify-center
                      rounded-full
                      text-[#075e4d]
                      hover:bg-[#edf5e8]
                      transition
                    "
                    aria-label="Sign in"
                  >
                    <UserRound size={24} strokeWidth={1.8} />
                  </Link>

                )}

              </div>

              {/* =================================================
                  CART
              ================================================= */}

              <Link
                to="/cart"
                className="
                  relative
                  flex
                  items-center
                  gap-2
                  h-10
                  px-2
                  sm:px-3
                  rounded-full
                  text-[#075e4d]
                  hover:bg-[#edf5e8]
                  transition
                "
                aria-label={`Shopping cart with ${totalItems} items`}
              >
                <div className="relative">

                  <ShoppingCart size={25} strokeWidth={1.8} />

                  {totalItems > 0 && (
                    <span
                      className="
                        absolute
                        -top-2
                        -right-2
                        w-[17px]
                        h-[17px]
                        rounded-full
                        bg-[#ef7d18]
                        text-white
                        text-[9px]
                        font-bold
                        flex
                        items-center
                        justify-center
                      "
                    >
                      {totalItems}
                    </span>
                  )}

                </div>

                {totalItems > 0 && (
                  <span
                    className="
                      hidden
                      xl:inline
                      text-xs
                      font-semibold
                    "
                  >
                    ₹{subtotal}
                  </span>
                )}

              </Link>

            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          3. DOWNLOAD APP GREEN BAR
      ===================================================== */}

      <section
        className="
          w-full
          bg-[#006653]
          text-white
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            min-h-[64px]
            px-4
            sm:px-6
            lg:px-8
            flex
            items-center
            justify-between
            gap-4
          "
        >

          {/* =================================================
              LEFT APP INFORMATION
          ================================================= */}

          <div
            className="
              flex
              items-center
              gap-3
              min-w-0
            "
          >

            {/* APP ICON */}

            <div
              className="
                w-[44px]
                h-[44px]
                rounded-lg
                bg-[#315f50]
                flex
                items-center
                justify-center
                shrink-0
                border
                border-white/10
                shadow-sm
              "
            >
              <span
                className="
                  font-serif
                  italic
                  font-bold
                  text-[#e6c76a]
                  text-[20px]
                "
              >
                SK
              </span>
            </div>

            {/* APP TEXT */}

            <div className="min-w-0">

              {/* GOLDEN ANIMATED APP HEADING */}

              <div
                className="
                  app-download-golden-text
                  relative
                  inline-block
                  overflow-hidden
                  font-semibold
                  text-[12px]
                  sm:text-[15px]
                  leading-tight
                  whitespace-nowrap
                  max-w-full
                "
              >
                <span className="relative z-10">
                   ShreeKrishna Organics 
                </span>
              </div>

              <p
                className="
                  text-[9px]
                  sm:text-[12px]
                  text-white/90
                  mt-1
                "
              >
                 Connect with Nature, Nourish Your Health. 🌿
              </p>

            </div>

          </div>

          {/* =================================================
              GOLDEN DOWNLOAD BUTTON
          ================================================= */}

          <button
  type="button"
  onClick={() => navigate("/shop")}
  className="
    download-golden-button
    relative
    overflow-hidden
    shrink-0
    bg-[#ffe39a]
    hover:bg-[#ffdc7c]
    text-black
    font-bold
    text-[10px]
    sm:text-[13px]
    px-3
    sm:px-7
    py-2.5
    sm:py-3
    rounded-lg
    border
    border-[#171717]
    shadow-sm
    transition-all
    duration-300
    hover:scale-[1.02]
    cursor-pointer
  "
>
  <span
    className="
      relative
      z-10
      flex
      items-center
      gap-2
      sm:gap-3
      whitespace-nowrap
    "
  >
    Shop Now

    <span
      className="
        text-base
        sm:text-lg
        leading-none
      "
    >
      →
    </span>
  </span>
</button>

        </div>
      </section>

      {/* =====================================================
          4. MOBILE MENU
      ===================================================== */}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">

          {/* BACKDROP */}

          <div
            className="
              absolute
              inset-0
              bg-black/50
              backdrop-blur-[2px]
            "
            onClick={() =>
              setMobileMenuOpen(false)
            }
          />

          {/* MOBILE DRAWER */}

          <div
            className="
              relative
              w-[85%]
              max-w-[350px]
              bg-white
              h-full
              shadow-2xl
              flex
              flex-col
              overflow-y-auto
            "
          >

            {/* MOBILE LOGO */}

            <div
              className="
                flex
                items-center
                justify-between
                px-5
                py-5
                border-b
                border-[#e4ebe7]
              "
            >
              <Link
                to="/"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="
                  flex
                  flex-col
                  items-start
                  leading-none
                "
              >
                <div className="flex items-start">

                  <span
                    className="
                      font-serif
                      italic
                      font-bold
                      text-[27px]
                      tracking-[-0.05em]
                      text-[#075e4d]
                    "
                  >
                    shreekrishna
                  </span>

                  <span
                    className="
                      text-[8px]
                      font-bold
                      text-[#075e4d]
                      ml-1
                      mt-1
                    "
                  >
                    ®
                  </span>

                </div>

                <span
                  className="
                    text-[7px]
                    tracking-[0.35em]
                    uppercase
                    text-[#9a7734]
                    font-bold
                    mt-1
                    ml-1
                  "
                >
                  ORGANICS
                </span>

              </Link>

              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="
                  w-9
                  h-9
                  flex
                  items-center
                  justify-center
                  rounded-full
                  text-[#075e4d]
                  hover:bg-[#edf5e8]
                "
              >
                <X size={22} />
              </button>

            </div>

            {/* =================================================
                MOBILE SEARCH
            ================================================= */}

            <form
              onSubmit={handleSearchSubmit}
              className="p-5 pb-2"
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  bg-[#f6f9f7]
                  border
                  border-[#e0e8e3]
                  rounded-full
                  px-4
                  py-3
                "
              >
                <Search
                  size={17}
                  className="text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  className="
                    flex-1
                    bg-transparent
                    outline-none
                    text-sm
                  "
                />
              </div>
            </form>

            {/* =================================================
                MOBILE NAVIGATION
            ================================================= */}

            <nav className="px-4 py-4">

              {navLinks.map((link) => {
                if (link.name === "Blogs") {
                  return (
                    <div key={link.path} className="mb-1">
                      <button
                        type="button"
                        onClick={() =>
                          setMobileBlogOpen((previous) => !previous)
                        }
                        className="
                          w-full
                          flex
                          items-center
                          justify-between
                          px-4
                          py-3.5
                          rounded-xl
                          text-sm
                          font-medium
                          text-gray-700
                          hover:bg-[#f6f9f7]
                          transition
                        "
                      >
                        <span>Blogs</span>

                        <ChevronDown
                          size={16}
                          className={`
                            text-[#075e4d]
                            transition-transform
                            duration-200
                            ${mobileBlogOpen ? "rotate-180" : "rotate-0"}
                          `}
                        />
                      </button>

                      {mobileBlogOpen && (
                        <div
                          className="
                            mt-1
                            ml-3
                            pl-3
                            border-l-2
                            border-[#dce9e2]
                            space-y-1
                          "
                        >
                          <NavLink
                            to="/blogs/medicinal-recipes"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setMobileBlogOpen(false);
                            }}
                            className={({ isActive }) =>
                              `
                                flex
                                items-center
                                gap-3
                                px-3
                                py-3
                                rounded-xl
                                text-sm
                                transition
                                ${
                                  isActive
                                    ? "bg-[#edf5e8] text-[#075e4d] font-semibold"
                                    : "text-gray-600 hover:bg-[#f6f9f7]"
                                }
                              `
                            }
                          >
                            <span className="text-lg">📋</span>
                            Medicinal Recipes
                          </NavLink>

                          <NavLink
                            to="/blogs/healthy-recipes"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setMobileBlogOpen(false);
                            }}
                            className={({ isActive }) =>
                              `
                                flex
                                items-center
                                gap-3
                                px-3
                                py-3
                                rounded-xl
                                text-sm
                                transition
                                ${
                                  isActive
                                    ? "bg-[#edf5e8] text-[#075e4d] font-semibold"
                                    : "text-gray-600 hover:bg-[#f6f9f7]"
                                }
                              `
                            }
                          >
                            <span className="text-lg">🥗</span>
                            Healthy Recipes
                          </NavLink>

                          <NavLink
                            to="/blogs"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setMobileBlogOpen(false);
                            }}
                            className={({ isActive }) =>
                              `
                                flex
                                items-center
                                gap-3
                                px-3
                                py-3
                                rounded-xl
                                text-sm
                                transition
                                ${
                                  isActive
                                    ? "bg-[#edf5e8] text-[#075e4d] font-semibold"
                                    : "text-gray-600 hover:bg-[#f6f9f7]"
                                }
                              `
                            }
                          >
                            <span className="text-lg">📝</span>
                            ShreeKrishna Blogs
                          </NavLink>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `
                        flex
                        items-center
                        px-4
                        py-3.5
                        mb-1
                        rounded-xl
                        text-sm
                        font-medium
                        transition
                        ${
                          isActive
                            ? "bg-[#edf5e8] text-[#075e4d] font-bold"
                            : "text-gray-700 hover:bg-[#f6f9f7]"
                        }
                      `
                    }
                  >
                    {link.name === "Hot Deals" ? (
                      <span className="hot-deals-animated">
                        Hot Deals
                      </span>
                    ) : (
                      link.name
                    )}
                  </NavLink>
                );
              })}

              <NavLink
                to="/orders"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3.5
                  rounded-xl
                  text-sm
                  text-gray-700
                  hover:bg-[#f6f9f7]
                "
              >
                <Package size={17} />

                My Orders & Tracking
              </NavLink>

            </nav>

            {/* =================================================
                MOBILE ACCOUNT
            ================================================= */}

            <div
              className="
                mt-auto
                border-t
                border-[#e4ebe7]
                p-5
              "
            >

              {isAuthenticated ? (
                <>

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      mb-4
                    "
                  >
                    <div
                      className="
                        w-10
                        h-10
                        rounded-full
                        bg-[#075e4d]
                        text-white
                        flex
                        items-center
                        justify-center
                        font-bold
                      "
                    >
                      {user?.name
                        ? user.name
                            .charAt(0)
                            .toUpperCase()
                        : "U"}
                    </div>

                    <div className="min-w-0">

                      <p
                        className="
                          text-sm
                          font-bold
                          text-[#173b31]
                          truncate
                        "
                      >
                        {user?.name}
                      </p>

                      <p
                        className="
                          text-xs
                          text-gray-400
                          truncate
                        "
                      >
                        {user?.email}
                      </p>

                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="
                      w-full
                      py-3
                      bg-[#075e4d]
                      hover:bg-[#064c3f]
                      text-white
                      rounded-full
                      text-sm
                      font-semibold
                    "
                  >
                    Sign Out
                  </button>

                </>
              ) : (

                <div className="grid grid-cols-2 gap-3">

                  <Link
                    to="/login"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="
                      text-center
                      py-3
                      rounded-full
                      bg-[#075e4d]
                      text-white
                      text-sm
                      font-semibold
                    "
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/register"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="
                      text-center
                      py-3
                      rounded-full
                      border
                      border-[#075e4d]
                      text-[#075e4d]
                      text-sm
                      font-semibold
                    "
                  >
                    Register
                  </Link>

                </div>

              )}

            </div>

          </div>
        </div>
      )}

      {/* =====================================================
          ALL NAVBAR ANIMATIONS
      ===================================================== */}

      <style>{`

        /* ===============================================
           DOWNLOAD NOW BUTTON GOLDEN SHINE
        =============================================== */

        .download-golden-button::before {
          content: "";
          position: absolute;

          top: -60%;
          left: -80%;

          width: 45%;
          height: 220%;

          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.10),
            rgba(255, 255, 255, 0.95),
            rgba(255, 215, 90, 0.85),
            transparent
          );

          transform: rotate(20deg);

          animation:
            goldenButtonMove 2.4s
            ease-in-out infinite;

          pointer-events: none;
        }


        @keyframes goldenButtonMove {

          0% {
            left: -80%;
          }

          55% {
            left: 130%;
          }

          100% {
            left: 130%;
          }

        }


        /* ===============================================
           APP TITLE GOLDEN ANIMATION
        =============================================== */

        .app-download-golden-text {
          color: #ffffff;

          background: linear-gradient(
            110deg,
            #ffffff 0%,
            #ffffff 30%,
            #ffe083 42%,
            #f5c44f 50%,
            #ffeaa7 58%,
            #ffffff 70%,
            #ffffff 100%
          );

          background-size: 250% 100%;

          -webkit-background-clip: text;
          background-clip: text;

          -webkit-text-fill-color: transparent;

          animation:
            appGoldenTextMove 2.4s
            linear infinite;
        }


        @keyframes appGoldenTextMove {

          0% {
            background-position: 150% center;
          }

          100% {
            background-position: -150% center;
          }

        }


        /* ===============================================
           HOT DEALS RED + BLUE ANIMATION
        =============================================== */

        .hot-deals-animated {
          display: inline-block;
          font-weight: 500;

          background: linear-gradient(
            90deg,
            #ff1744 0%,
            #ff3d00 20%,
            #e60023 40%,
            #1565ff 60%,
            #004cff 80%,
            #ff1744 100%
          );

          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;

          animation:
            hotDealsColorMove 2.2s linear infinite,
            hotDealsGlow 1.5s ease-in-out infinite alternate;
        }

        @keyframes hotDealsColorMove {
          0% {
            background-position: 0% center;
          }

          100% {
            background-position: 300% center;
          }
        }

        @keyframes hotDealsGlow {
          0% {
            filter: drop-shadow(0 0 1px rgba(255, 23, 68, 0.25));
          }

          100% {
            filter: drop-shadow(0 0 4px rgba(21, 101, 255, 0.55));
          }
        }

        /* ===============================================
           ACCESSIBILITY
        =============================================== */

        @media (prefers-reduced-motion: reduce) {

          .download-golden-button::before,
          .app-download-golden-text,
          .hot-deals-animated {
            animation: none;
          }

        }

      `}</style>

    </>
  );
}