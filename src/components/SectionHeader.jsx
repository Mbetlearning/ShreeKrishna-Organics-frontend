import React from 'react';

export default function SectionHeader({
  badge,
  title,
  subtitle,
  align = 'center',
  className = ''
}) {
  const alignClass = align === 'left' ? 'text-left items-start' : 'text-center items-center';

  return (
    <div className={`flex flex-col ${alignClass} mb-12 max-w-2xl mx-auto px-4 ${className}`}>
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#ECE4D8] text-[#2B241D] mb-3 border border-[#E8DFD3]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B5563C]" />
          {badge}
        </span>
      )}
      {title && (
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2B241D] tracking-tight leading-snug">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="mt-3 text-base md:text-lg text-stone-600 font-sans leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
