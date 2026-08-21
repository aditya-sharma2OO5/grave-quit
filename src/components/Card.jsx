import React from 'react';

export const Card = ({ 
  children, 
  className = '', 
  header, 
  headerAccent = false,
  footer,
  onClick,
  hoverable = false
}) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-[#1A1A1A] border border-[#2A2A2A] rounded-[14px] p-6 transition-all duration-200 ${
        hoverable ? 'hover:border-[#454843] hover:bg-[#20201F] cursor-pointer' : ''
      } ${className}`}
    >
      {header && (
        <div className="mb-4 pb-3 border-b border-[#2A2A2A] flex items-center justify-between">
          <h3 className={`text-base font-semibold font-headline ${headerAccent ? 'text-[#A8C5B0]' : 'text-[#F5F5F0]'}`}>
            {header}
          </h3>
        </div>
      )}
      <div>{children}</div>
      {footer && (
        <div className="mt-5 pt-4 border-t border-[#2A2A2A] text-xs text-[#8A8A8A] flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  );
};
