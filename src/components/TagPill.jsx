import React from 'react';
import { VALID_REASON_TAGS } from '../data/mockData';

export const TagPill = ({ 
  tag, 
  selected = false, 
  onClick, 
  selectable = false,
  size = 'md'
}) => {
  // Enforce valid tag safety check
  const displayTag = VALID_REASON_TAGS.includes(tag) ? tag : 'Other';

  const sizes = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3.5 py-1.5 text-xs font-medium",
    lg: "px-4 py-2 text-sm font-medium"
  };

  const activeStyles = selected
    ? "bg-[#354F3E] text-[#B0CEB8] border border-[#A8C5B0] shadow-[0_0_12px_rgba(168,197,176,0.15)]"
    : "bg-[#1A1A1A] text-[#8A8A8A] border border-[#2A2A2A] hover:border-[#454843] hover:text-[#F5F5F0]";

  return (
    <button
      type="button"
      onClick={selectable ? () => onClick && onClick(displayTag) : undefined}
      disabled={!selectable}
      className={`inline-flex items-center justify-center rounded-full transition-all duration-150 ${sizes[size]} ${activeStyles} ${
        selectable ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-2 bg-[#A8C5B0]/60 inline-block"></span>
      {displayTag}
    </button>
  );
};
