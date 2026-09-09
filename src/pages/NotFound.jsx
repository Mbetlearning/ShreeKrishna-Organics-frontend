import React from 'react';
import { Compass, Home, ShoppingBag } from 'lucide-react';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <div className="bg-[#FAF6EF] min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-white border border-[#E8DFD3] flex items-center justify-center text-[#2B241D] mb-6 shadow-subtle">
        <Compass className="w-10 h-10 text-[#B5563C]" />
      </div>
      
      <span className="text-xs uppercase tracking-widest font-bold text-[#B5563C] mb-2">
        Error 404
      </span>
      
      <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2B241D] max-w-md">
        Page Not Found
      </h1>
      
      <p className="mt-3 text-sm text-stone-500 max-w-md font-sans">
        The page you are looking for might have been moved, removed, or is temporarily unavailable.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
        <Button to="/" variant="primary" icon={Home} iconPosition="left">
          Back to Homepage
        </Button>
        <Button to="/shop" variant="secondary" icon={ShoppingBag} iconPosition="left">
          Browse Products
        </Button>
      </div>
    </div>
  );
}
