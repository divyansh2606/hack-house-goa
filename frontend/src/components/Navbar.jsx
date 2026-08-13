import React from 'react';
import { HiArrowLeft } from 'react-icons/hi2';

function Navbar({ onHome, showBack, onBack }) {
  return (
    <nav className="w-full py-4 px-4 md:px-8 flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors mr-2"
          >
            <HiArrowLeft className="w-5 h-5" />
          </button>
        )}
        <button onClick={onHome} className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center font-black text-sm">
            HH
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-sm">HH GOA</span>
            <span className="text-brand-accent font-mono text-xs ml-1">2026</span>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-white/40 hidden sm:block font-mono">#FrameInGoa</span>
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
      </div>
    </nav>
  );
}

export default Navbar;