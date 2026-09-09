import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  Check, 
  ChevronRight, 
  Leaf, 
  Award
} from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    async function loadProductData() {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const item = await productService.getProductBySlug(slug);
        setProduct(item);
        setSelectedImage(item.image);
        
        const defaultSize = item.sizes?.find(s => s.isDefault) || item.sizes?.[0] || {
          size: '1 Litre',
          price: item.price,
          mrp: item.originalPrice
        };
        setSelectedSize(defaultSize);
        setQuantity(1);

        const related = await productService.getRelatedProducts(item.id, 4);
        setRelatedProducts(related);
      } catch (err) {
        console.error("Error loading product details", err);
      } finally {
        setLoading(false);
      }
    }

    loadProductData();
  }, [slug]);

  if (loading) {
    return <LoadingSpinner text="Fetching product details..." />;
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-[#FAF6EF]">
        <h2 className="text-2xl font-serif font-bold text-stone-800">Product Not Found</h2>
        <p className="text-sm text-stone-500 mt-2">The item you are looking for does not exist or has been moved.</p>
        <Button to="/shop" variant="primary" className="mt-6">
          Return to Shop
        </Button>
      </div>
    );
  }

  const currentPrice = selectedSize ? selectedSize.price : product.price;
  const currentMrp = selectedSize?.mrp || product.originalPrice || Math.round(currentPrice * 1.18);
  const discount = Math.round(((currentMrp - currentPrice) / currentMrp) * 100);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, quantity);
    navigate('/checkout');
  };

  return (
    <div className="bg-[#FAF6EF] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6 font-medium">
          <Link to="/" className="hover:text-[#B5563C] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-[#B5563C] transition-colors">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-800 font-semibold truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* Main Product Details Card Layout */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DFD3] shadow-subtle mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            
            {/* Left: Product Image Gallery */}
            <div className="lg:col-span-6 space-y-4">
              {/* Main Preview Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF6EF] border border-[#E8DFD3]">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />

                {/* Badge Overlay */}
                {product.badge && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-[#2B241D] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm">
                    {product.badge}
                  </span>
                )}

                {discount > 0 && (
                  <span className="absolute top-4 right-4 px-2.5 py-1 bg-[#B5563C] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm">
                    {discount}% OFF
                  </span>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {product.gallery && product.gallery.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {product.gallery.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        selectedImage === imgUrl
                          ? 'border-[#B5563C] ring-2 ring-[#B5563C]/20 scale-95'
                          : 'border-[#E8DFD3] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Quick Quality Promises under Image */}
              <div className="grid grid-cols-3 gap-2 pt-4 text-center border-t border-[#E8DFD3] text-stone-600">
                <div className="p-2.5 bg-[#FAF6EF] rounded-xl border border-[#E8DFD3]">
                  <Leaf className="w-4 h-4 text-[#B5563C] mx-auto mb-1" />
                  <span className="text-[11px] font-semibold block leading-tight">100% Unrefined</span>
                </div>
                <div className="p-2.5 bg-[#FAF6EF] rounded-xl border border-[#E8DFD3]">
                  <ShieldCheck className="w-4 h-4 text-[#B5563C] mx-auto mb-1" />
                  <span className="text-[11px] font-semibold block leading-tight">Hexane Free</span>
                </div>
                <div className="p-2.5 bg-[#FAF6EF] rounded-xl border border-[#E8DFD3]">
                  <Award className="w-4 h-4 text-[#B5563C] mx-auto mb-1" />
                  <span className="text-[11px] font-semibold block leading-tight">Artisan Craft</span>
                </div>
              </div>
            </div>

            {/* Right: Product Purchase Options & Details */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                {/* Category & Rating */}
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#B5563C]">
                    {product.categoryName}
                  </span>
                  <div className="flex items-center gap-1.5 bg-[#FAF6EF] px-2.5 py-1 rounded-lg border border-[#E8DFD3]">
                    <div className="flex text-[#C68A2E]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#C68A2E]" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-stone-800">{product.rating}</span>
                    <span className="text-[11px] text-stone-400">({product.reviewCount} customer reviews)</span>
                  </div>
                </div>

                {/* Product Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#2B241D] leading-tight">
                  {product.name}
                </h1>

                {/* Tagline */}
                <p className="mt-2 text-sm text-stone-600 font-sans leading-relaxed">
                  {product.tagline}
                </p>

                {/* Price Display */}
                <div className="mt-5 p-4 rounded-2xl bg-[#FAF6EF] border border-[#E8DFD3] flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold font-sans text-[#2B241D]">
                        ₹{currentPrice}
                      </span>
                      {currentMrp > currentPrice && (
                        <span className="text-sm text-stone-400 line-through">
                          MRP: ₹{currentMrp}
                        </span>
                      )}
                      {discount > 0 && (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          Save ₹{currentMrp - currentPrice} ({discount}% OFF)
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-500 block mt-1">
                      Inclusive of all taxes • Free shipping on orders over ₹999
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <Check className="w-3.5 h-3.5" /> In Stock (Fresh Batch)
                    </span>
                  </div>
                </div>

                {/* Available Sizes */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                        Available Sizes:
                      </label>
                      <span className="text-xs text-stone-500 font-medium">Selected: {selectedSize?.size}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {product.sizes.map((s) => (
                        <button
                          key={s.size}
                          type="button"
                          onClick={() => setSelectedSize(s)}
                          className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                            selectedSize?.size === s.size
                              ? 'border-[#B5563C] bg-[#B5563C]/5 ring-2 ring-[#B5563C]'
                              : 'border-[#E8DFD3] bg-white hover:border-[#B5563C]/40'
                          }`}
                        >
                          <span className="text-xs font-bold text-stone-900">{s.size}</span>
                          <span className="text-sm font-semibold text-[#2B241D] mt-1">₹{s.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity & Actions */}
                <div className="mt-6 pt-6 border-t border-[#E8DFD3] flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  
                  {/* Quantity Counter */}
                  <div className="flex items-center justify-between bg-[#FAF6EF] border border-[#E8DFD3] rounded-xl p-1 w-full sm:w-36">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center font-bold text-stone-700 hover:bg-stone-100 cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold text-stone-800">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center font-bold text-stone-700 hover:bg-stone-100 cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Add To Cart */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                      isAdded
                        ? 'bg-[#2B241D] text-white'
                        : 'bg-[#B5563C] hover:bg-[#9E442B] text-white active:scale-98'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" /> Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" /> Add to Cart (₹{currentPrice * quantity})
                      </>
                    )}
                  </button>

                  {/* Buy Now Button */}
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="py-3.5 px-6 rounded-xl font-semibold text-sm bg-[#2B241D] hover:bg-[#1F1813] text-white active:scale-98 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-[#C68A2E]" /> Buy Now
                  </button>
                </div>

                {/* Sourcing & Smoke Point Highlights */}
                <div className="mt-6 p-4 rounded-2xl bg-[#FAF6EF] border border-[#E8DFD3] text-xs text-stone-700 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <strong className="text-[#2B241D] font-semibold">Origin:</strong>
                    <span>{product.seedSource}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <strong className="text-[#2B241D] font-semibold">Extraction:</strong>
                    <span>{product.extractionMethod}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <strong className="text-[#2B241D] font-semibold">Specification:</strong>
                    <span>{product.smokePoint}</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Tabbed Product Details / Specifications */}
          <div className="mt-16 pt-10 border-t border-[#E8DFD3]">
            
            {/* Tabs Header */}
            <div className="flex items-center gap-2 border-b border-[#E8DFD3] overflow-x-auto pb-px">
              {[
                { id: 'description', label: 'Description & Uses' },
                { id: 'nutrition', label: 'Nutritional Values' },
                { id: 'process', label: 'Extraction & Sourcing' },
                { id: 'storage', label: 'Storage & FAQs' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-[#B5563C] text-[#2B241D]'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Description & Culinary Uses */}
            {activeTab === 'description' && (
              <div className="pt-6 space-y-6 animate-in fade-in">
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">About This Product</h3>
                  <p className="text-sm text-stone-600 leading-relaxed max-w-3xl">
                    {product.description}
                  </p>
                </div>

                {product.culinaryUses && (
                  <div>
                    <h4 className="font-serif font-bold text-base text-stone-900 mb-2">Recommended Uses & Applications:</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-stone-600">
                      {product.culinaryUses.map((use, idx) => (
                        <li key={idx} className="flex items-center gap-2 bg-[#FAF6EF] p-2.5 rounded-xl border border-[#E8DFD3]">
                          <span className="w-2 h-2 rounded-full bg-[#B5563C]" />
                          <span>{use}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Nutrition */}
            {activeTab === 'nutrition' && (
              <div className="pt-6 space-y-6 animate-in fade-in">
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">Ingredients & Purity</h3>
                  <p className="text-sm text-stone-600 mb-4">{product.ingredients}</p>
                </div>

                {product.nutritionalInfo && (
                  <div className="max-w-xl">
                    <h4 className="font-serif font-bold text-base text-stone-900 mb-3">Approximate Values (per 100g serving):</h4>
                    <div className="bg-[#FAF6EF] rounded-2xl border border-[#E8DFD3] overflow-hidden">
                      <table className="w-full text-xs sm:text-sm text-left">
                        <tbody>
                          {product.nutritionalInfo.map((info, idx) => (
                            <tr key={idx} className="border-b border-[#E8DFD3] last:border-0">
                              <td className="py-3 px-4 font-semibold text-stone-700">{info.label}</td>
                              <td className="py-3 px-4 font-mono font-medium text-stone-900 text-right">{info.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Extraction & Sourcing */}
            {activeTab === 'process' && (
              <div className="pt-6 space-y-4 max-w-3xl animate-in fade-in text-sm text-stone-600 leading-relaxed">
                <h3 className="font-serif font-bold text-lg text-stone-900">Extraction & Traditional Craft</h3>
                <p>
                  In traditional Indian oil processing, Vaagai wood (Albizia lebbeck) is revered because the fibrous wood absorbs frictional heat during crushing. This guarantees that extraction temperatures never exceed 38°C to 40°C.
                </p>
                <div className="p-4 bg-[#FAF6EF] border border-[#E8DFD3] rounded-2xl text-[#2B241D] text-xs leading-relaxed space-y-1">
                  <strong>Why Unrefined & Cold-Pressed Matters:</strong>
                  <p>Unlike industrial refined products processed at &gt;200°C with chemical solvents, our pure extraction retains 100% natural phytosterols, Vitamin E, and authentic aromas.</p>
                </div>
              </div>
            )}

            {/* Tab 4: Storage & FAQs */}
            {activeTab === 'storage' && (
              <div className="pt-6 space-y-6 max-w-3xl animate-in fade-in">
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">Storage Instructions</h3>
                  <p className="text-sm text-stone-600">{product.storageInstructions}</p>
                </div>

                {product.faqs && product.faqs.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-serif font-bold text-base text-stone-900">Frequently Asked Questions:</h4>
                    {product.faqs.map((faq, idx) => (
                      <div key={idx} className="bg-[#FAF6EF] p-4 rounded-xl border border-[#E8DFD3]">
                        <h5 className="font-bold text-xs sm:text-sm text-stone-900">{faq.q}</h5>
                        <p className="text-xs text-stone-600 mt-1">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

        {/* You May Also Like / Related Items */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-serif font-bold text-[#2B241D] mb-6">
              You May Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
