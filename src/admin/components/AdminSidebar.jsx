import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  Users,
  LogOut,
  Store,
  FileText,
  Images,
  Star,
  Settings,
  Flame,
  PackagePlus,
} from "lucide-react";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const links = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Add Product", path: "/admin/products/add", icon: PlusCircle },
    { name: "Hot Deals", path: "/admin/hot-deals", icon: Flame },
    { name: "Combo Offers", path: "/admin/combo-offers", icon: PackagePlus },
    { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
    { name: "Customers", path: "/admin/customers", icon: Users },
    { name: "Blogs", path: "/admin/blogs", icon: FileText },
    { name: "Media", path: "/admin/media", icon: Images },
    { name: "Reviews", path: "/admin/reviews", icon: Star },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("shreekrishna_admin");
    navigate("/admin/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-[#075e4d] text-white flex flex-col">
      <div className="px-6 py-7 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#F3DF9B] text-[#075e4d] flex items-center justify-center">
            <Store size={22} />
          </div>

          <div>
            <h1 className="font-serif font-bold text-lg">ShreeKrishna</h1>
            <p className="text-[10px] tracking-[0.2em] text-white/60">
              ADMIN PANEL
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {links.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                isActive
                  ? "bg-[#F3DF9B] text-[#075e4d]"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/80 hover:bg-red-500/20 hover:text-white transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
