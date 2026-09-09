import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  
  // Find default size or first available size
  const defaultSize = product.sizes?.find(s => s.isDefault) || product.sizes?.[0] || {
    size: '1 Litre',
    price: product.price,
    mrp: product.originalPrice
  };

  const [selectedSize, setSelectedSize] = useState(defaultSize);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedSize, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const currentPrice = selectedSize.price || product.price;
  const currentMrp = selectedSize.mrp || product.originalPrice || Math.round(currentPrice * 1.18);
  const discount = Math.round(((currentMrp - currentPrice) / currentMrp) * 100);

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E8DFD3] shadow-subtle hover:shadow-card transition-all duration-300 hover:-translate-y-1">
      {/* Product Image & Badges */}
      <Link to={`/product/${product.slug}`} className="relative block aspect-[4/3] sm:aspect-square overflow-hidden bg-[#FAF6EF]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="inline-block px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-[#2B241D] text-[#FAF6EF] rounded-md shadow-xs">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#B5563C] text-white rounded-md">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Extraction Type Pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="text-[10px] font-semibold px-2 py-1 bg-white/95 backdrop-blur-xs text-[#2B241D] rounded-md border border-[#E8DFD3] shadow-xs">
            {product.category === 'wood-pressed' 
              ? '🪵 Vaagai Wood Churned' 
              : product.category === 'jaggery'
              ? '🍯 100% Pure Organic'
              : product.category === 'supplements'
              ? '🌿 Vedic Hand-Churned'
              : '🌱 100% Cold-Pressed'}
          </span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {/* Rating & Category */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[11px] font-semibold text-[#6E6259] uppercase tracking-wider">
            {product.categoryName}
          </span>
          <div className="flex items-center gap-1 bg-[#FAF6EF] px-1.5 py-0.5 rounded border border-[#E8DFD3]">
            <Star className="w-3.5 h-3.5 fill-[#C68A2E] text-[#C68A2E]" />
            <span className="text-xs font-bold text-stone-800">{product.rating}</span>
            <span className="text-[10px] text-stone-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Product Title */}
        <Link to={`/product/${product.slug}`} className="group-hover:text-[#B5563C] transition-colors">
          <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        {/* Short Tagline */}
        <p className="mt-1 text-xs text-stone-500 font-sans line-clamp-2 leading-relaxed">
          {product.tagline || product.shortDescription}
        </p>

        {/* Size Selector Pills */}
        {product.sizes && product.sizes.length > 1 && (
          <div className="mt-3.5 pt-3 border-t border-[#E8DFD3]/80">
            <span className="text-[11px] font-semibold text-stone-500 block mb-1.5">Select Size:</span>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((s) => (
                <button
                  key={s.size}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSize(s);
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    selectedSize.size === s.size
                      ? 'bg-[#2B241D] text-white'
                      : 'bg-[#FAF6EF] text-stone-700 hover:bg-[#ECE4D8] border border-[#E8DFD3]'
                  }`}
                >
                  {s.size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price & Add to Cart */}
        <div className="mt-auto pt-4 flex items-center justify-between gap-2 border-t border-[#E8DFD3]/60">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-bold font-sans text-[#2B241D]">
                ₹{currentPrice}
              </span>
              {currentMrp > currentPrice && (
                <span className="text-xs text-stone-400 line-through">
                  ₹{currentMrp}
                </span>
              )}
            </div>
            <span className="text-[10px] text-stone-400 block">Incl. of all taxes</span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
              isAdded
                ? 'bg-[#2B241D] text-[#FAF6EF]'
                : 'bg-[#B5563C] text-[#FAF6EF] hover:bg-[#9E442B] active:scale-95 shadow-xs'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
