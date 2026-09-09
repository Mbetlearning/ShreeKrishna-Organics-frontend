import React from 'react';
import ProductCard from './ProductCard';
import { PackageSearch } from 'lucide-react';
import Button from './Button';

export default function ProductGrid({
  products = [],
  loading = false,
  onResetFilters,
  gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
}) {
  if (loading) {
    return (
      <div className={`grid ${gridCols} gap-6`}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-[#E8E1D5] animate-pulse">
            <div className="aspect-square bg-stone-200 rounded-xl mb-4" />
            <div className="h-4 bg-stone-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-stone-200 rounded w-1/2 mb-4" />
            <div className="h-8 bg-stone-200 rounded mt-auto" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-[#E8E1D5] my-6">
        <div className="w-16 h-16 rounded-full bg-[#FAF7F2] flex items-center justify-center mx-auto text-stone-400 mb-4">
          <PackageSearch className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-serif font-bold text-stone-800 mb-1">No oils match your selection</h3>
        <p className="text-sm text-stone-500 max-w-md mx-auto mb-6">
          Try clearing your search terms or choosing a different category filter.
        </p>
        {onResetFilters && (
          <Button onClick={onResetFilters} variant="secondary" size="sm">
            Reset Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols} gap-6`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
