import React from "react";
import {
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  Bell,
  ExternalLink,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {

  const navigate = useNavigate();

  const isAdmin =
    localStorage.getItem("shreekrishna_admin") === "true";

  if (!isAdmin) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex">

      {/* SIDEBAR */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 min-w-0">

        {/* HEADER */}
        <header className="h-[72px] bg-white border-b border-[#E8E3D8] px-5 md:px-8 flex items-center justify-between sticky top-0 z-30">

          <div>
            <p className="text-xs text-gray-400">
              Welcome back
            </p>

            <h2 className="font-bold text-[#243A34]">
              Administrator
            </h2>
          </div>

          <div className="flex items-center gap-2">

            {/* NOTIFICATION */}
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-[#F7F5EF] flex items-center justify-center text-[#075e4d]"
            >
              <Bell size={18} />
            </button>

            {/* WEBSITE */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-[#075e4d] text-[#075e4d] text-xs font-semibold hover:bg-[#075e4d] hover:text-white transition"
            >
              View Website

              <ExternalLink size={14} />
            </button>

          </div>

        </header>

        {/* PAGE */}
        <main className="p-5 md:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}