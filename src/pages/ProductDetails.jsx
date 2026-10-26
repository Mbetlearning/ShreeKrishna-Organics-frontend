import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Zap, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { getProductReviews, getReviewSummary } from '../services/reviewApi';
import ProductReviews from '../components/ProductReviews';
import ProductIngredientsSlider from '../components/ProductIngredientsSlider';
import { saveBuyNowIntent } from '../services/buyNowIntent';

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [galleryPaused, setGalleryPaused] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      setProduct(null);
      setActiveImageIndex(0);
      setRelatedProducts([]);
      window.scrollTo(0, 0);
      try {
        const item = await productService.getProductBySlug(slug);
        if (cancelled) return;
        setProduct(item);
        setProductImages([]);
        try {
          const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1').replace(/\/+$/, '');
          const response = await fetch(`${apiBase}/products/${encodeURIComponent(item.id)}/images`);
          if (response.ok) {
            const imageData = await response.json();
            if (!cancelled && Array.isArray(imageData)) setProductImages(imageData);
          }
        } catch (imageError) {
          console.warn('Variant images could not load; using product primary image.', imageError);
        }
        setSelectedSize(item.sizes?.find(s => s.isDefault) ?? item.sizes?.[0] ?? null);
        setQuantity(1);
        try {
          const related = await productService.getRelatedProducts(item.id, 4);
          if (!cancelled) setRelatedProducts(related);
        } catch (relatedError) {
          console.error('Related products could not load', relatedError);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unable to load product.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [slug]);

  const variantImage = productImages.find(
    (image) => image.variantId != null && String(image.variantId) === String(selectedSize?.variantId)
  );
  const primaryImage = productImages.find((image) => image.variantId == null && image.primary);
  const heroImageUrl = variantImage?.imageUrl || primaryImage?.imageUrl || product?.image || '';
  const galleryImages = productImages
    .filter((image) => image?.imageUrl && image.variantId == null && !image.primary)
    .slice(0, 4);
  const slides = [
    ...(heroImageUrl ? [{ key: 'main', imageUrl: heroImageUrl, label: `${product?.name || 'Product'} - ${selectedSize?.size || 'Main image'}` }] : []),
    ...galleryImages.map((image, index) => ({
      key: `gallery-${image.id ?? index}`,
      imageUrl: image.imageUrl,
      label: `${product?.name || 'Product'} gallery image ${index + 1}`,
    })),
  ];

  useEffect(() => {
    if (galleryPaused || slides.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % slides.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [galleryPaused, slides.length, selectedSize?.variantId, product?.id]);

  useEffect(() => {
    setActiveImageIndex((current) => current < slides.length ? current : 0);
  }, [slides.length]);

  if (loading) return <LoadingSpinner text="Fetching product details..." />;
  if (!product) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-[#FAF6EF]">
      <h2 className="text-2xl font-serif font-bold text-stone-800">{error ? 'Unable to Load Product' : 'Product Not Found'}</h2>
      <p className="text-sm text-stone-500 mt-2">{error || 'This product does not exist or is unavailable.'}</p>
      <Button to="/shop" variant="primary" className="mt-6">Return to Shop</Button>
    </div>
  );

  const currentPrice = selectedSize?.price ?? product.price;
  const currentMrp = selectedSize?.mrp ?? product.originalPrice;
  const discount = currentPrice != null && currentMrp != null && currentMrp > currentPrice && currentMrp > 0
    ? Math.round(((currentMrp - currentPrice) / currentMrp) * 100) : 0;
  const canPurchase = Boolean(selectedSize?.variantId && currentPrice != null);

  const requireCustomerLogin = (action) => {
    if (isAuthenticated) return true;
    navigate('/login', {
      state: {
        from: `/product/${slug}`,
        action,
      },
    });
    return false;
  };

  const handleAddToCart = async () => {
    if (!canPurchase) return;
    // Existing CartContext is local/demo until Cart API integration.
    const success = await addToCart(product, selectedSize, quantity);
    if (success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    }
  };
  const handleBuyNow = () => {
    if (!canPurchase) return;
    try {
      saveBuyNowIntent(product, selectedSize, quantity);
      navigate('/checkout?mode=buy-now');
    } catch (error) {
      console.error('Unable to initiate Buy Now checkout:', error);
    }
  };

  return (
    <div className="bg-[#FAF6EF] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6 font-medium">
          <Link to="/" className="hover:text-[#B5563C]">Home</Link><ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-[#B5563C]">Shop</Link><ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-800 font-semibold truncate">{product.name}</span>
        </nav>
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DFD3] shadow-subtle mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            <div className="lg:col-span-6 space-y-4">
              <div
                className="relative aspect-square overflow-hidden rounded-2xl border border-[#E8DFD3] bg-[#FAF6EF]"
                onMouseEnter={() => setGalleryPaused(true)}
                onMouseLeave={() => setGalleryPaused(false)}
                onFocusCapture={() => setGalleryPaused(true)}
                onBlurCapture={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) setGalleryPaused(false);
                }}
                aria-label="Product images slideshow"
              >
                {slides.length ? slides.map((slide, index) => (
                  <img
                    key={slide.key}
                    src={slide.imageUrl}
                    alt={slide.label}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-in-out ${
                      index === activeImageIndex ? 'opacity-100' : 'pointer-events-none opacity-0'
                    }`}
                    aria-hidden={index !== activeImageIndex}
                  />
                )) : (
                  <div className="flex h-full w-full items-center justify-center text-stone-400">Image not available</div>
                )}
                {discount > 0 && (
                  <span className="absolute right-4 top-4 z-10 rounded-lg bg-[#B5563C] px-2.5 py-1 text-xs font-bold text-white">
                    {discount}% OFF
                  </span>
                )}
                {slides.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous product image"
                      onClick={() => setActiveImageIndex((current) => (current - 1 + slides.length) % slides.length)}
                      className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/85 p-2 text-stone-800 shadow transition hover:bg-white"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      aria-label="Next product image"
                      onClick={() => setActiveImageIndex((current) => (current + 1) % slides.length)}
                      className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/85 p-2 text-stone-800 shadow transition hover:bg-white"
                    >
                      <ChevronRight size={20} />
                    </button>

                  </>
                )}
              </div>
              {slides.length > 1 && (
                <div className="flex items-center justify-center gap-2 pt-2" aria-label="Product image navigation">
                  {slides.map((slide, index) => (
                    <button
                      key={slide.key}
                      type="button"
                      aria-label={`Show product image ${index + 1}`}
                      aria-current={index === activeImageIndex ? 'true' : undefined}
                      onClick={() => setActiveImageIndex(index)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        index === activeImageIndex
                          ? 'w-7 bg-[#075e4d]'
                          : 'w-2.5 bg-stone-300 hover:bg-[#075e4d]/60'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="lg:col-span-6 flex flex-col space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#B5563C] mb-2">{product.categoryName}</p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#2B241D]">{product.name}</h1>
                {product.tagline && <p className="mt-2 text-sm text-stone-600 leading-relaxed">{product.tagline}</p>}
                <div className="mt-5 p-4 rounded-2xl bg-[#FAF6EF] border border-[#E8DFD3]">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#2B241D]">{currentPrice != null ? `₹${currentPrice}` : 'Price unavailable'}</span>
                    {currentMrp != null && currentPrice != null && currentMrp > currentPrice && <span className="text-sm text-stone-400 line-through">MRP: ₹{currentMrp}</span>}
                    {discount > 0 && <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">Save ₹{currentMrp - currentPrice} ({discount}% OFF)</span>}
                  </div>
                </div>
                {product.sizes?.length > 0 && (
                  <div className="mt-6">
                    <div className="flex justify-between mb-2 text-xs font-bold text-stone-700 uppercase">Available Sizes <span className="normal-case font-medium">Selected: {selectedSize?.size}</span></div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {product.sizes.map(s => (
                        <button key={s.variantId} type="button" onClick={() => { setSelectedSize(s); setActiveImageIndex(0); }}
                          className={`p-3 rounded-xl border text-left transition-all ${selectedSize?.variantId === s.variantId ? 'border-[#B5563C] bg-[#B5563C]/5 ring-2 ring-[#B5563C]' : 'border-[#E8DFD3] bg-white hover:border-[#B5563C]/40'}`}>
                          <span className="text-xs font-bold text-stone-900 block">{s.size}</span>
                          <span className="text-sm font-semibold text-[#2B241D] mt-1 block">₹{s.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-6 pt-6 border-t border-[#E8DFD3] flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <div className="flex items-center justify-between bg-[#FAF6EF] border border-[#E8DFD3] rounded-xl p-1 w-full sm:w-36">
                    <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-lg bg-white border border-stone-200 font-bold" aria-label="Decrease quantity">-</button>
                    <span className="text-sm font-bold text-stone-800">{quantity}</span>
                    <button type="button" onClick={() => setQuantity(q => q + 1)} className="w-8 h-8 rounded-lg bg-white border border-stone-200 font-bold" aria-label="Increase quantity">+</button>
                  </div>
                  <button type="button" disabled={!canPurchase} onClick={handleAddToCart}
                    className={`flex-1 py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 ${!canPurchase ? 'bg-stone-200 text-stone-500 cursor-not-allowed' : isAdded ? 'bg-[#2B241D] text-white' : 'bg-[#B5563C] hover:bg-[#9E442B] text-white'}`}>
                    {isAdded ? <><Check className="w-4 h-4" /> Added to Cart</> : <><ShoppingBag className="w-4 h-4" /> Add to Cart{currentPrice != null ? ` (₹${currentPrice * quantity})` : ''}</>}
                  </button>
                  <button type="button" disabled={!canPurchase} onClick={handleBuyNow}
                    className={`py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 ${canPurchase ? 'bg-[#2B241D] hover:bg-[#1F1813] text-white' : 'bg-stone-200 text-stone-500 cursor-not-allowed'}`}>
                    <Zap className="w-4 h-4" /> Buy Now
                  </button>
                </div>
                {!canPurchase && <p className="mt-3 text-xs text-stone-500">No purchasable variant is currently available.</p>}
              </div>
            </div>
          </div>
        </div>
        {product.description && (
          <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DFD3] shadow-subtle mb-12" aria-labelledby="product-description-heading">
            <h2 id="product-description-heading" className="font-serif font-bold text-xl sm:text-2xl text-[#2B241D] mb-4">
              Product Description
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">{product.description}</p>
          </section>
        )}
        <ProductIngredientsSlider />
        <ProductReviews key={product.id} productId={product.id} />
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-serif font-bold text-[#2B241D] mb-6">You May Also Like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(rel => <ProductCard key={rel.id} product={rel} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
