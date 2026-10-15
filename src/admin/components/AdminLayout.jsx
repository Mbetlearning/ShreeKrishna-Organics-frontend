
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import {
  Bell,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Authentication and ADMIN role verification
  // are handled by ProtectedRoute in App.jsx.

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex">

      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block shrink-0">
        <AdminSidebar />
      </div>

      {/* MOBILE SIDEBAR */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">

          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          />

          <div className="relative h-full max-w-[85vw] bg-white shadow-xl overflow-y-auto">

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="absolute right-3 top-3 z-10 p-2 bg-gray-100 rounded-lg"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>

            <div onClick={() => setSidebarOpen(false)}>
              <AdminSidebar />
            </div>

          </div>
        </div>
      )}

      {/* RIGHT CONTENT */}
      <div className="flex-1 min-w-0">

        {/* HEADER */}
        <header className="h-[72px] bg-white border-b border-[#E8E3D8] px-5 md:px-8 flex items-center justify-between sticky top-0 z-30">

          <div className="flex items-center gap-3">

            {/* MOBILE MENU */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-[#F7F5EF] text-[#075e4d]"
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="text-xs text-gray-400">
                Welcome back
              </p>

              <h2 className="font-bold text-[#243A34]">
                Administrator
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">

            {/* NOTIFICATION */}
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-[#F7F5EF] flex items-center justify-center text-[#075e4d]"
              aria-label="Notifications"
            >
              <Bell size={18} />
            </button>

            {/* VIEW WEBSITE */}
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

        {/* PAGE CONTENT */}
        <main className="p-5 md:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
