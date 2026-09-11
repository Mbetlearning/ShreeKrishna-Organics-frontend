import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { productService } from '../services/productService';
import { categories } from '../data/testimonials';
import ProductGrid from '../components/ProductGrid';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync category & search from URL params if changed externally
  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    const q = searchParams.get('search') || '';
    setSelectedCategory(cat);
    setSearchQuery(q);
  }, [searchParams]);

  // Fetch filtered & sorted products
  useEffect(() => {
    async function fetchCatalog() {
      setLoading(true);
      try {
        const data = await productService.getAllProducts({
          category: selectedCategory,
          search: searchQuery,
          sortBy: sortBy
        });
        setProducts(data);
      } catch (err) {
        console.error("Error fetching product catalog", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCatalog();
  }, [selectedCategory, searchQuery, sortBy]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setSearchParams(prev => {
      const updated = new URLSearchParams(prev);
      if (catId === 'all') {
        updated.delete('category');
      } else {
        updated.set('category', catId);
      }
      return updated;
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams(prev => {
      const updated = new URLSearchParams(prev);
      if (!searchQuery.trim()) {
        updated.delete('search');
      } else {
        updated.set('search', searchQuery.trim());
      }
      return updated;
    });
  };

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('featured');
    setSearchParams({});
  };

  const hasActiveFilters = selectedCategory !== 'all' || searchQuery.trim() !== '' || sortBy !== 'featured';

  return (
    <div className="bg-[#FAF6EF] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#ECE4D8] text-[#2B241D] mb-2 border border-[#E8DFD3]">
            <Sparkles className="w-3.5 h-3.5 text-[#B5563C]" />
            100% Certified Organic & Unrefined
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2B241D]">
            ShreeKrishna Organics Collection
          </h1>
          <p className="mt-2 text-sm text-stone-600 font-sans">
            Handcrafted wood-pressed cooking oils, natural palm & sugarcane jaggery, and Vedic A2 Gir cow ghee.
          </p>
        </div>

        {/* Filter & Controls Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#E8DFD3] shadow-subtle mb-10">
          
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
              <div className="flex items-center bg-[#FAF6EF] rounded-2xl border border-[#E8DFD3] px-3.5 py-2.5 focus-within:border-[#B5563C] transition-colors">
                <Search className="w-4 h-4 text-stone-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by seed, oil, jaggery or ghee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent ml-2.5 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchParams(prev => {
                        const updated = new URLSearchParams(prev);
                        updated.delete('search');
                        return updated;
                      });
                    }}
                    className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </form>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3 self-end lg:self-auto">
              <span className="text-xs font-semibold text-stone-500 hidden sm:inline">Sort By:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-[#FAF6EF] border border-[#E8DFD3] text-stone-800 text-xs sm:text-sm rounded-2xl px-4 py-2.5 pr-8 font-medium focus:outline-none focus:border-[#B5563C] cursor-pointer"
                >
                  <option value="featured">Featured & Bestsellers</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Alphabetical (A - Z)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-stone-500">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

          </div>

          {/* Category Filter Pills */}
          <div className="mt-4 pt-4 border-t border-[#E8DFD3] flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#2B241D] text-white shadow-xs'
                      : 'bg-[#FAF6EF] text-stone-600 hover:bg-[#ECE4D8] border border-[#E8DFD3]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-xs text-[#B5563C] hover:text-[#9E442B] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Clear All Filters
              </button>
            )}
          </div>

        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-stone-500 font-medium">
            Showing <strong className="text-stone-800">{products.length}</strong> {products.length === 1 ? 'item' : 'items'}
            {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
          </p>
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={products}
          loading={loading}
          onResetFilters={resetAllFilters}
          gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        />

        {/* Informational Banner */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-[#E8DFD3] shadow-subtle grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF6EF] text-[#2B241D] flex items-center justify-center font-bold text-lg border border-[#E8DFD3] shrink-0">
              🧴
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900 font-serif">Food Grade Packaging</h4>
              <p className="text-xs text-stone-500 mt-1">Shipped in UV-protected glass bottles, food cans, and airtight pouches.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF6EF] text-[#2B241D] flex items-center justify-center font-bold text-lg border border-[#E8DFD3] shrink-0">
              🌿
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900 font-serif">Zero High Temperatures</h4>
              <p className="text-xs text-stone-500 mt-1">Crushed below 40°C in wooden mortars to maintain natural active enzymes.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF6EF] text-[#2B241D] flex items-center justify-center font-bold text-lg border border-[#E8DFD3] shrink-0">
              🚚
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900 font-serif">Express Free Delivery</h4>
              <p className="text-xs text-stone-500 mt-1">Free standard delivery across India on orders exceeding ₹999.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
