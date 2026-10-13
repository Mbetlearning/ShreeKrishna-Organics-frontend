import React, { useEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { ShoppingCart, Check, Zap } from 'lucide-react';

import { useCart } from '../context/CartContext';

import { apiRequest } from '../services/api';



// Share the combo request between all product cards (avoid one request per card).

let activeComboVariantIdsPromise;

function getActiveComboVariantIds() {

  if (!activeComboVariantIdsPromise) {

    activeComboVariantIdsPromise = apiRequest('/combos', { auth: false })

      .then((data) => {

        const combos = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];

        return new Set(combos

          .filter((combo) => combo.active === true)

          .flatMap((combo) => Array.isArray(combo.items) ? combo.items : [])

          .map((item) => String(item.productVariantId))

          .filter((id) => id !== 'null' && id !== 'undefined'));

      })

      .catch((error) => {

        activeComboVariantIdsPromise = null; // Allow retry on next mount.

        throw error;

      });

  }

  return activeComboVariantIdsPromise;

}





export default function ProductCard({ product }) {

  const { addToCart } = useCart();

  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState(null);

  const [isAdded, setIsAdded] = useState(false);

  const [comboVariantIds, setComboVariantIds] = useState(() => new Set());



  useEffect(() => {

    let mounted = true;

    getActiveComboVariantIds()

      .then((ids) => { if (mounted) setComboVariantIds(ids); })

      .catch((error) => console.error('Unable to load active combo offers:', error));

    return () => { mounted = false; };

  }, []);



  useEffect(() => {

    setSelectedSize(product.sizes?.find((s) => s.isDefault) ?? product.sizes?.[0] ?? null);

  }, [product]);



  const regularPrice = selectedSize?.regularPrice ?? product.price;

  const currentPrice = selectedSize?.price ?? product.price;

  const currentMrp = selectedSize?.mrp ?? product.originalPrice;

  const isHotDeal = selectedSize?.offerActive === true && regularPrice != null && currentPrice != null && Number(currentPrice) < Number(regularPrice);

  const regularDiscount = regularPrice != null && currentMrp != null && Number(currentMrp) > Number(regularPrice) && Number(currentMrp) > 0

    ? Math.round(((Number(currentMrp) - Number(regularPrice)) / Number(currentMrp)) * 100) : 0;

  const extraDiscountAmount = isHotDeal ? Number(regularPrice) - Number(currentPrice) : 0;

  const formatPrice = (value) => `₹${Number(value).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

  const canPurchase = Boolean(selectedSize?.variantId && currentPrice != null);

  const isInActiveCombo = product.sizes?.some((size) =>

    size.variantId != null && comboVariantIds.has(String(size.variantId))

  ) ?? false;



  const handleAddToCart = (e) => {

    e.preventDefault();

    e.stopPropagation();

    if (!canPurchase) return;

    addToCart(product, selectedSize, 1);

    setIsAdded(true);

    setTimeout(() => setIsAdded(false), 1500);

  };



  const handleBuyNow = (e) => {

    e.preventDefault();

    e.stopPropagation();

    if (!canPurchase) return;

    addToCart(product, selectedSize, 1);

    navigate('/checkout');

  };



  return (

    <div className="group relative flex flex-col w-full h-full min-w-0 bg-white rounded-2xl overflow-hidden border border-[#E8DFD3] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">

      <Link to={`/product/${product.slug}`} className="relative block w-full h-[190px] sm:h-[210px] overflow-hidden bg-[#FAF6EF]">

        {product.image ? (

          <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />

        ) : (

          <div className="w-full h-full flex items-center justify-center text-stone-400 text-sm">Image not available</div>

        )}

        {regularDiscount > 0 && (

          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold bg-[#B5563C] text-white rounded-md">{regularDiscount}% OFF</span>

        )}

        {isHotDeal && (

          <>

            <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] sm:text-xs font-bold bg-[#006B52] text-white rounded-md shadow-md">Extra {formatPrice(extraDiscountAmount)} OFF</span>

            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 px-4 py-2 text-xs font-extrabold tracking-wider text-white shadow-lg motion-safe:animate-pulse">🔥 HOT DEAL</span>

          </>

        )}

      </Link>



      <div className="p-4 sm:p-5 flex flex-col flex-grow">

        <div className="mb-1.5 text-[11px] font-semibold text-[#6E6259] uppercase tracking-wider">{product.categoryName}</div>

        <Link to={`/product/${product.slug}`} className="group-hover:text-[#B5563C] transition-colors">

          <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 line-clamp-1">{product.name}</h3>

        </Link>

        {product.tagline && <p className="mt-1 text-xs text-stone-500 line-clamp-2 leading-relaxed">{product.tagline}</p>}

        {product.sizes?.length > 0 && (

          <div className="mt-3.5 pt-3 border-t border-[#E8DFD3]/80">

            <span className="text-[11px] font-semibold text-stone-500 block mb-1.5">Select Size:</span>

            <div className="flex flex-wrap gap-1.5">

              {product.sizes.map((s) => (

                <button key={s.variantId} type="button" onClick={() => setSelectedSize(s)}

                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${selectedSize?.variantId === s.variantId ? 'bg-[#2B241D] text-white' : 'bg-[#FAF6EF] text-stone-700 hover:bg-[#ECE4D8] border border-[#E8DFD3]'}`}>

                  {s.size}

                </button>

              ))}

            </div>

          </div>

        )}



        <div className="mt-auto pt-4 border-t border-[#E8DFD3]/60">

          {isHotDeal && (

            <div className="relative mb-2 isolate overflow-hidden rounded-lg border border-emerald-200/80 bg-gradient-to-r from-slate-200 via-emerald-100 to-red-100 px-2.5 py-2 shadow-sm motion-safe:animate-pulse">

              <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-1000 group-hover:translate-x-[350%]" />

              <span className="relative z-10 block text-center text-[10px] sm:text-[11px] font-extrabold leading-snug tracking-wide text-emerald-900">

                <span className="text-slate-600">✦ Limited Time </span><span className="text-emerald-700">Hot Deal</span><span className="text-red-600"> {formatPrice(extraDiscountAmount)} OFF</span>

              </span>

            </div>

          )}

          {isInActiveCombo && !isHotDeal && (

            <Link

              to="/healthy-combos"

              className="mb-2 flex items-center justify-center gap-1 rounded-lg border border-sky-200 bg-gradient-to-r from-sky-100 via-slate-200 to-blue-100 px-2 py-2 text-center shadow-sm transition-shadow hover:shadow-md motion-safe:animate-pulse"

              aria-label="Buy with Combo, Save Extra — view healthy combos"

            >

              <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-700">✦ Buy with Combo</span>

              <span className="text-[10px] sm:text-[11px] font-extrabold text-emerald-700">· Save Extra</span>

              <span className="text-xs text-rose-500">♥</span>

            </Link>

          )}

          {!isHotDeal && !isInActiveCombo && (

            <div className="mb-2 flex min-h-[34px] items-center justify-center gap-1.5 rounded-xl border border-emerald-100 bg-gradient-to-r from-green-50 via-slate-100 to-emerald-50 px-2 py-2 text-center shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-md">

              <span className="text-xs motion-safe:animate-pulse" aria-hidden="true">✨</span>

              <span className="text-[10px] sm:text-[11px] font-extrabold tracking-wide text-emerald-800">Pure &amp; Natural</span>

            </div>

          )}

          <div className="flex flex-col items-start gap-2">

            <div className="flex min-w-0 flex-wrap items-baseline gap-1.5">

              <span className="text-lg sm:text-xl font-bold text-[#2B241D]">{currentPrice != null ? formatPrice(currentPrice) : 'Price unavailable'}</span>

              {isHotDeal ? (

                <>

                  <span className="inline-flex items-center rounded-md bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-100 px-2 py-1 text-xs font-extrabold text-amber-950 line-through shadow-[0_0_10px_rgba(245,158,11,0.35)] motion-safe:animate-pulse transition-all duration-500 hover:scale-110 hover:shadow-[0_0_18px_rgba(245,158,11,0.65)]">{formatPrice(regularPrice)}</span>

                  {currentMrp != null && Number(currentMrp) > Number(regularPrice) && (

                    <span className="inline-flex items-center rounded-md bg-gradient-to-r from-yellow-100 via-yellow-300 to-amber-200 px-2 py-1 text-[11px] font-extrabold text-amber-950 shadow-[0_0_10px_rgba(245,158,11,0.35)] motion-safe:animate-pulse transition-all duration-500 hover:scale-110 hover:shadow-[0_0_18px_rgba(245,158,11,0.65)]">MRP {formatPrice(currentMrp)}</span>

                  )}

                </>

              ) : (

                currentMrp != null && currentPrice != null && Number(currentMrp) > Number(currentPrice) && (

                  <span className="text-xs text-stone-400 line-through">{formatPrice(currentMrp)}</span>

                )

              )}

            </div>

            <div className="flex w-full flex-wrap items-center gap-2">

              <button type="button" disabled={!canPurchase} onClick={handleAddToCart}

                className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-semibold transition-colors ${!canPurchase ? 'bg-stone-200 text-stone-500 cursor-not-allowed' : isAdded ? 'bg-[#2B241D] text-white' : 'bg-[#08765B] text-white hover:bg-[#08765B]'}`}>

                {isAdded ? <><Check className="w-3.5 h-3.5" />Added</> : <><ShoppingCart size={17} strokeWidth={2.5} className="shrink-0" />Add to Cart</>}

              </button>

              <button type="button" disabled={!canPurchase} onClick={handleBuyNow}

                className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-semibold transition-colors ${!canPurchase ? 'bg-stone-200 text-stone-500 cursor-not-allowed' : 'bg-[#B5563C] text-white hover:bg-[#B5563C]'}`}>

                <Zap className="w-3.5 h-3.5" />Buy Now

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}
