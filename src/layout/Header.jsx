import React from "react";
import { ChevronDown } from "lucide-react";
import homebotLogo from "../assets/homebot.svg";

export default function Header({ onToggleSidebar, onLogoClick, isMobile, showMenuButton }) {
  return (
    <header className="h-16 bg-cyan-600 border-b border-cyan-700 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        {showMenuButton && (
          <button className="text-white sm:hidden" onClick={onToggleSidebar}>
            <ChevronDown size={20} />
          </button>
        )}
        {/* Logo */}
        <img
          src={homebotLogo}
          alt="homebot logo"
          className="h-10 w-10 cursor-pointer"
          onClick={onLogoClick}
        />
        <h1
          className="text-xl font-semibold text-white cursor-pointer"
          title="Go home"
          onClick={onLogoClick}
        >
          homebot
        </h1>
      </div>
      <button
        className="text-sm text-gray-300 opacity-50 cursor-not-allowed transition-colors"
        title="Settings coming soon"
      >
        Settings
      </button>
    </header>
  );
}
