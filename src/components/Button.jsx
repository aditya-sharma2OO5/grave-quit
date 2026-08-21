import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick, 
  type = 'button',
  disabled = false,
  ...props 
}) => {
  let baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-[16px]";

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs tracking-wide",
    md: "px-5 py-2.5 text-sm tracking-wide",
    lg: "px-7 py-3 text-base tracking-wide font-semibold",
  };

  const variants = {
    // Primary: Solid #F5F5F0 fill with #0A0A0A text
    primary: "bg-[#F5F5F0] text-[#0A0A0A] hover:bg-[#FFFFFF] hover:shadow-[0_0_20px_rgba(245,245,240,0.2)] active:scale-[0.98]",
    // Secondary: #1A1A1A fill with 1px #2A2A2A border and #F5F5F0 text
    secondary: "bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] hover:bg-[#222222] hover:border-[#454843] active:scale-[0.98]",
    // Outline / Ghost
    ghost: "bg-transparent text-[#8A8A8A] hover:text-[#F5F5F0] hover:bg-[#1A1A1A]",
    // Destructive (Settings page ONLY): Red/warning outline
    destructive: "bg-[#1A1A1A] border border-[#93000A] text-[#FFB4AB] hover:bg-[#93000A]/20 hover:border-[#FFB4AB] active:scale-[0.98]",
    // Sage Accent
    accent: "bg-[#354F3E] text-[#B0CEB8] border border-[#A8C5B0]/30 hover:bg-[#A8C5B0] hover:text-[#0A0A0A] active:scale-[0.98]"
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
