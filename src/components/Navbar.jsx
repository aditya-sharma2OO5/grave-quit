import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PlusCircle, User, Feather } from 'lucide-react';
import { useGravequit } from '../context/GravequitContext';

export const Navbar = () => {
  const location = useLocation();
  const { setIsAddItemModalOpen, user } = useGravequit();
  const isAdmin = user?.role === 'admin';

  const navLinks = [
    { path: '/items', label: 'My Items' },
    { path: '/dashboard', label: 'Dashboard' },
    ...(isAdmin ? [
      { path: '/advisor', label: 'Advisor' },
      { path: '/internal-metrics', label: 'Judge Metrics' }
    ] : []),
    { path: '/share', label: 'Share Card' },
    { path: '/about', label: 'Story' },
    { path: '/privacy', label: 'Privacy' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#2A2A2A] px-4 md:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo + MANDATORY Subtitle */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center group-hover:border-[#A8C5B0] transition-colors">
            <Feather className="w-4 h-4 text-[#A8C5B0]" />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight font-headline text-[#F5F5F0]">
              Gravequit
            </span>
            {/* MANDATORY SUBTITLE: ALWAYS "Quiet Closure" */}
            <span className="block text-[10px] text-[#8A8A8A] font-medium tracking-wider uppercase -mt-1">
              Quiet Closure
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-all ${
                  isActive
                    ? 'text-[#F5F5F0] bg-[#1A1A1A] border border-[#2A2A2A] text-[#A8C5B0]'
                    : 'text-[#8A8A8A] hover:text-[#F5F5F0] hover:bg-[#1A1A1A]/50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddItemModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#0A0A0A] bg-[#F5F5F0] rounded-full hover:bg-white transition-all active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>

          <Link
            to="/settings"
            className={`p-2 rounded-full border transition-all ${
              location.pathname === '/settings'
                ? 'border-[#A8C5B0] text-[#A8C5B0] bg-[#1A1A1A]'
                : 'border-[#2A2A2A] text-[#8A8A8A] hover:text-[#F5F5F0] hover:border-[#454843] bg-[#1A1A1A]'
            }`}
            title="Account & Settings"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Mobile nav subbar */}
      <div className="md:hidden flex items-center justify-around mt-2 pt-2 border-t border-[#2A2A2A]/50 overflow-x-auto text-xs py-1">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`px-2 py-1 whitespace-nowrap ${
              location.pathname === link.path ? 'text-[#A8C5B0] font-semibold' : 'text-[#8A8A8A]'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
};
