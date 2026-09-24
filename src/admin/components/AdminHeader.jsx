import React from "react";
import { Bell, ExternalLink, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminHeader({ onMenuClick }) {
  const navigate = useNavigate();

  return (
    <header className="h-[72px] bg-white border-b border-[#E8E3D8] px-5 md:px-8 flex items-center justify-between sticky top-0 z-30">

      <div className="flex items-center gap-3">

        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 rounded-xl bg-[#F7F5EF] text-[#075e4d] flex items-center justify-center"
        >
          <Menu size={20} />
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

        <button
          type="button"
          className="relative w-10 h-10 rounded-full bg-[#F7F5EF] text-[#075e4d] flex items-center justify-center"
        >
          <Bell size={18} />

          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#B5563C]" />
        </button>

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
  );
}