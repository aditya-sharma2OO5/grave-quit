import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-[#2A2A2A] bg-[#0A0A0A] py-8 px-4 md:px-8 mt-auto text-xs text-[#8A8A8A]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left exact requirement */}
        <div>
          <span>© 2026 Graveyard AI. Precision in Letting Go.</span>
        </div>

        {/* Right exact requirement */}
        <div className="flex items-center space-x-4">
          <Link to="/privacy" className="hover:text-[#F5F5F0] transition-colors">
            Privacy Policy
          </Link>
          <span>·</span>
          <Link to="/privacy" className="hover:text-[#F5F5F0] transition-colors">
            Terms of Service
          </Link>
          <span>·</span>
          <Link to="/about" className="hover:text-[#F5F5F0] transition-colors">
            Ethics
          </Link>
        </div>
      </div>
    </footer>
  );
};
