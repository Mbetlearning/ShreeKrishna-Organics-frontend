import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(null);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    setSelectedSize(product.sizes?.find(s => s.isDefault) ?? product.sizes?.[0] ?? null);
  }, [product]);

  const currentPrice = selectedSize?.price ?? product.price;
  const currentMrp = selectedSize?.mrp ?? product.originalPrice;
  const discount = currentPrice != null && currentMrp != null && currentMrp > currentPrice && currentMrp > 0
    ? Math.round(((currentMrp - currentPrice) / currentMrp) * 100) : 0;
  const canPurchase = Boolean(selectedSize?.variantId && currentPrice != null);

  
const [adding, setAdding] = useState(false);

const handleAddToCart = async (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (!canPurchase || adding) return;

  setAdding(true);

  try {
    const success = await addToCart(product, selectedSize, 1);

    if (success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    }
  } finally {
    setAdding(false);
  }
};


  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E8DFD3] shadow-subtle hover:shadow-card transition-all duration-300 hover:-translate-y-1">
      <Link to={`/product/${product.slug}`} className="relative block aspect-[4/3] sm:aspect-square overflow-hidden bg-[#FAF6EF]">
        {product.image ? (
          <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-400 text-sm">Image not available</div>
        )}
        {discount > 0 && <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold bg-[#B5563C] text-white rounded-md">{discount}% OFF</span>}
      </Link>
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <div className="mb-1.5 text-[11px] font-semibold text-[#6E6259] uppercase tracking-wider">{product.categoryName}</div>
        <Link to={`/product/${product.slug}`} className="group-hover:text-[#B5563C] transition-colors">
          <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 line-clamp-1">{product.name}</h3>
        </Link>
        {product.tagline && <p className="mt-1 text-xs text-stone-500 line-clamp-2 leading-relaxed">{product.tagline}</p>}
        {product.sizes?.length > 1 && (
          <div className="mt-3.5 pt-3 border-t border-[#E8DFD3]/80">
            <span className="text-[11px] font-semibold text-stone-500 block mb-1.5">Select Size:</span>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map(s => (
                <button key={s.variantId} type="button" onClick={() => setSelectedSize(s)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${selectedSize?.variantId === s.variantId ? 'bg-[#2B241D] text-white' : 'bg-[#FAF6EF] text-stone-700 hover:bg-[#ECE4D8] border border-[#E8DFD3]'}`}>
                  {s.size}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="mt-auto pt-4 flex items-center justify-between gap-2 border-t border-[#E8DFD3]/60">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-bold text-[#2B241D]">{currentPrice != null ? `₹${currentPrice}` : 'Price unavailable'}</span>
              {currentMrp != null && currentPrice != null && currentMrp > currentPrice && <span className="text-xs text-stone-400 line-through">₹{currentMrp}</span>}
            </div>
          </div>
          <button type="button" disabled={!canPurchase} onClick={handleAddToCart}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${!canPurchase ? 'bg-stone-200 text-stone-500 cursor-not-allowed' : isAdded ? 'bg-[#2B241D] text-white' : 'bg-[#B5563C] text-white hover:bg-[#9E442B]'}`}>
            {isAdded ? <><Check className="w-3.5 h-3.5" /> Added</> : <><ShoppingBag className="w-3.5 h-3.5" /> Add</>}
          </button>
        </div>
      </div>
    </div>
  );
}
