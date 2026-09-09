import React from 'react';

export default function LoadingSpinner({ text = "Loading organic products..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-[#E8DFD3]"></div>
        <div className="absolute inset-0 rounded-full border-4 border-[#B5563C] border-t-transparent animate-spin"></div>
      </div>
      {text && <p className="mt-4 text-sm font-medium text-stone-600 font-sans tracking-wide">{text}</p>}
    </div>
  );
}
