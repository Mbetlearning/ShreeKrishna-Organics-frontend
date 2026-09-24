import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { ToastProvider } from "./context/ToastContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

/* CATEGORY PAGES */
import WoodPressedOils from "./pages/WoodPressedOils";
import A2Ghee from "./pages/A2Ghee";
import Jaggery from "./pages/Jaggery";
import HealthSupplements from "./pages/HealthSupplements";
import HotDeals from "./pages/HotDeals";
import HealthyCombos from "./pages/HealthyCombos";

/* BLOG PAGES */
import Blogs from "./pages/Blogs";
import MedicinalRecipes from "./pages/MedicinalRecipes";
import HealthyRecipes from "./pages/HealthyRecipes";

/* ADMIN PANEL */
import AdminLayout from "./admin/components/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminProducts from "./admin/pages/AdminProducts";
import AddProduct from "./admin/pages/AddProduct";
import EditProduct from "./admin/pages/EditProduct";
import AdminOrders from "./admin/pages/AdminOrders";
import AdminCustomers from "./admin/pages/AdminCustomers";
import AdminBlogs from "./admin/pages/AdminBlogs";
import AdminMedia from "./admin/pages/AdminMedia";
import AdminReviews from "./admin/pages/AdminReviews";
import AdminSettings from "./admin/pages/AdminSettings";
import AdminHotDeals from "./admin/pages/AdminHotDeals";
import AdminComboOffers from "./admin/pages/AdminComboOffers";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function WebsiteLayout() {
  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-[#B5563C] selection:text-[#FAF6EF]">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />

          <Route path="/wood-pressed-oils" element={<WoodPressedOils />} />
          <Route path="/a2-ghee" element={<A2Ghee />} />
          <Route path="/jaggery" element={<Jaggery />} />
          <Route path="/health-supplements" element={<HealthSupplements />} />
          <Route path="/hot-deals" element={<HotDeals />} />
          <Route path="/healthy-combos" element={<HealthyCombos />} />

          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/medicinal-recipes" element={<MedicinalRecipes />} />
          <Route path="/blogs/healthy-recipes" element={<HealthyRecipes />} />

          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={<Orders />} />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />

        <Route path="products" element={<AdminProducts />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/edit/:id" element={<EditProduct />} />

        <Route path="hot-deals" element={<AdminHotDeals />} />
        <Route path="combo-offers" element={<AdminComboOffers />} />

        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="blogs" element={<AdminBlogs />} />
        <Route path="media" element={<AdminMedia />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="/*" element={<WebsiteLayout />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <AppRoutes />
          </Router>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
