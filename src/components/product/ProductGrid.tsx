import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowUpDown, 
  X, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  RotateCcw, 
  Filter,
  Check,
  Eye,
  ShoppingBag,
  Grid3X3,
  Grid2X2
} from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useStore } from '../../context/StoreContext';
import { TShirtSize, Product } from '../../types';

export const ProductGrid: React.FC = () => {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    recentlyViewed,
    setSelectedProduct,
    setCurrentView
  } = useStore();

  // Multi-facet Filter States
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'>('featured');
  const [priceMax, setPriceMax] = useState<number>(1499);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState<boolean>(false);
  const [gridCols, setGridCols] = useState<'3' | '4'>('3');

  // Pagination States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(24);

  const categories = [
    { id: 'all', label: 'All 200 Garments' },
    { id: 'oversized', label: 'Oversized Boxy' },
    { id: 'half-sleeve', label: 'Half-Sleeve Street' },
    { id: 'acid-wash', label: 'Acid & Mineral Wash' },
    { id: 'graphic', label: 'Cyber & 3D Puff Drops' },
  ];

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSizeFilter, searchQuery, priceMax, inStockOnly, sortBy, itemsPerPage]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory =
          selectedCategory === 'all' || product.category === selectedCategory;

        const matchesSize =
          selectedSizeFilter === 'all' ||
          product.sizes.some(
            (s) => s.size === selectedSizeFilter && (!inStockOnly || s.stock > 0)
          );

        const matchesPrice = product.price <= priceMax;

        const matchesInStock =
          !inStockOnly || product.sizes.some((s) => s.stock > 0);

        const matchesSearch =
          searchQuery === '' ||
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.fabric.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesCategory && matchesSize && matchesPrice && matchesInStock && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return parseInt(b.id.replace(/\D/g, '')) - parseInt(a.id.replace(/\D/g, ''));
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, selectedSizeFilter, searchQuery, sortBy, priceMax, inStockOnly]);

  // Paginated Slices
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentSlice = filteredProducts.slice(startIndex, endIndex);

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSelectedSizeFilter('all');
    setPriceMax(1499);
    setInStockOnly(false);
    setSortBy('featured');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const hasActiveFilters = 
    selectedCategory !== 'all' || 
    selectedSizeFilter !== 'all' || 
    priceMax < 1499 || 
    inStockOnly || 
    searchQuery !== '';

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Category Navigation Pills */}
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const count = cat.id === 'all' 
              ? products.length 
              : products.filter(p => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-zinc-950 text-white font-bold shadow-md shadow-zinc-950/10'
                    : 'bg-white text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 border border-zinc-200'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedCategory === cat.id ? 'bg-zinc-800 text-amber-300' : 'bg-zinc-100 text-zinc-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Layout Toggle (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 bg-white border border-zinc-200 rounded-lg p-1">
          <button
            onClick={() => setGridCols('3')}
            className={`p-1.5 rounded ${gridCols === '3' ? 'bg-zinc-950 text-white' : 'text-zinc-500 hover:text-zinc-900'}`}
            title="3 Columns"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setGridCols('4')}
            className={`p-1.5 rounded ${gridCols === '4' ? 'bg-zinc-950 text-white' : 'text-zinc-500 hover:text-zinc-900'}`}
            title="4 Columns"
          >
            <Grid2X2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Toolbar & Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-b border-zinc-200/80">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-zinc-200 text-xs font-bold text-zinc-800 hover:bg-zinc-50 shadow-xs transition-all"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-600" />
            <span>Filter Catalog</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            )}
          </button>

          <div className="text-xs text-zinc-500 font-mono">
            Showing <strong className="text-zinc-900">{totalItems > 0 ? startIndex + 1 : 0}–{endIndex}</strong> of <strong className="text-zinc-900">{totalItems}</strong> 240 GSM garments
          </div>
        </div>

        {/* Sorting & Items-per-page Dropdowns */}
        <div className="flex items-center flex-wrap gap-2.5 text-xs">
          {/* Per Page selector */}
          <div className="flex items-center gap-1.5 bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-700 shadow-xs">
            <span className="text-zinc-400 font-mono text-[10px] uppercase">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="bg-transparent text-zinc-900 focus:outline-none font-mono cursor-pointer font-semibold"
            >
              <option value={12}>12 / page</option>
              <option value={24}>24 / page</option>
              <option value={48}>48 / page</option>
            </select>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-700 shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-zinc-900 focus:outline-none cursor-pointer font-semibold"
            >
              <option value="featured">Featured Drops</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
              <option value="newest">Latest Release First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expandable Multi-Facet Filter Drawer */}
      {isFilterSidebarOpen && (
        <div className="p-5 my-4 bg-white rounded-2xl border border-zinc-200 shadow-sm animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                Multi-Facet Filters
              </h3>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-xs text-amber-700 hover:text-amber-800 font-semibold underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-4 text-xs">
            {/* Size Filter */}
            <div>
              <label className="block text-[11px] font-semibold uppercase text-zinc-500 mb-2">
                Garment Size
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['all', 'XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSizeFilter(sz)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                      selectedSizeFilter === sz
                        ? 'bg-zinc-900 text-white font-bold shadow-xs'
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    {sz === 'all' ? 'All' : sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] font-semibold uppercase text-zinc-500">
                  Max Price
                </label>
                <span className="font-mono font-bold text-zinc-900">₹{priceMax}</span>
              </div>
              <input
                type="range"
                min={799}
                max={1499}
                step={50}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-zinc-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-mono mt-1">
                <span>₹799</span>
                <span>₹1,149</span>
                <span>₹1,499</span>
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-[11px] font-semibold uppercase text-zinc-500 mb-2">
                Stock Availability
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-700 hover:text-zinc-950">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-0 accent-zinc-900"
                />
                <span>Show In-Stock Only</span>
              </label>
              <p className="text-[10px] text-zinc-400 mt-1">
                Filters out depleted sizes & pre-orders
              </p>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="block text-[11px] font-semibold uppercase text-zinc-500 mb-2">
                Popular Presets
              </label>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => {
                    setSelectedCategory('acid-wash');
                    setPriceMax(1499);
                  }}
                  className="text-left text-[11px] text-zinc-600 hover:text-zinc-950 hover:underline"
                >
                  • Vintage Mineral Washed Drops
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory('graphic');
                    setSortBy('rating');
                  }}
                  className="text-left text-[11px] text-zinc-600 hover:text-zinc-950 hover:underline"
                >
                  • 3D High-Density Puff Prints
                </button>
                <button
                  onClick={() => {
                    setPriceMax(999);
                  }}
                  className="text-left text-[11px] text-zinc-600 hover:text-zinc-950 hover:underline"
                >
                  • Value Drops Under ₹999
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex items-center flex-wrap gap-2 pt-4 pb-2 text-xs text-zinc-500">
          <span className="font-semibold text-zinc-700">Applied:</span>
          {selectedCategory !== 'all' && (
            <span className="bg-white border border-zinc-200 text-zinc-800 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
              Collection: <strong className="capitalize">{selectedCategory}</strong>
              <X
                className="w-3 h-3 cursor-pointer hover:text-red-500"
                onClick={() => setSelectedCategory('all')}
              />
            </span>
          )}
          {selectedSizeFilter !== 'all' && (
            <span className="bg-white border border-zinc-200 text-zinc-800 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
              Size: <strong>{selectedSizeFilter}</strong>
              <X
                className="w-3 h-3 cursor-pointer hover:text-red-500"
                onClick={() => setSelectedSizeFilter('all')}
              />
            </span>
          )}
          {priceMax < 1499 && (
            <span className="bg-white border border-zinc-200 text-zinc-800 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
              Max: <strong>₹{priceMax}</strong>
              <X
                className="w-3 h-3 cursor-pointer hover:text-red-500"
                onClick={() => setPriceMax(1499)}
              />
            </span>
          )}
          {inStockOnly && (
            <span className="bg-white border border-zinc-200 text-zinc-800 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
              In-Stock Only
              <X
                className="w-3 h-3 cursor-pointer hover:text-red-500"
                onClick={() => setInStockOnly(false)}
              />
            </span>
          )}
          {searchQuery && (
            <span className="bg-white border border-zinc-200 text-zinc-800 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
              Query: <strong>"{searchQuery}"</strong>
              <X
                className="w-3 h-3 cursor-pointer hover:text-red-500"
                onClick={() => setSearchQuery('')}
              />
            </span>
          )}
          <button
            onClick={resetAllFilters}
            className="text-xs text-amber-700 hover:text-amber-800 font-semibold underline ml-1"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Products Grid Display */}
      <div className="mt-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-zinc-200 rounded-3xl shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-base text-zinc-900 font-bold font-serif">
              No 240 GSM drops match your filter
            </h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              Try adjusting your price ceiling or resetting your size filter to explore our other heavyweight garments.
            </p>
            <button
              onClick={resetAllFilters}
              className="mt-5 px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-full text-xs font-semibold shadow-md transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols === '4' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6 sm:gap-8`}>
            {currentSlice.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-200">
          <div className="text-xs text-zinc-500 font-mono">
            Page <strong className="text-zinc-900">{currentPage}</strong> of <strong className="text-zinc-900">{totalPages}</strong> ({totalItems} items total)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Render Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                // Show first, last, and within 2 of current page
                return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
              })
              .map((page, index, array) => {
                const prev = array[index - 1];
                const showEllipsis = prev && page - prev > 1;

                return (
                  <React.Fragment key={page}>
                    {showEllipsis && (
                      <span className="px-2 text-zinc-400 font-mono text-xs">...</span>
                    )}
                    <button
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className={`w-9 h-9 rounded-xl text-xs font-mono font-bold transition-all ${
                        currentPage === page
                          ? 'bg-zinc-950 text-white shadow-md'
                          : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Recently Viewed Products Section */}
      {recentlyViewed && recentlyViewed.length > 0 && (
        <div className="mt-16 pt-10 border-t border-zinc-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-amber-700 font-bold">
                Your Browsing History
              </div>
              <h3 className="text-lg font-serif font-bold text-zinc-900 mt-0.5">
                Recently Viewed 240 GSM Silhouettes
              </h3>
            </div>
            <span className="text-xs text-zinc-400 font-mono">
              {recentlyViewed.length} saved
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recentlyViewed.slice(0, 4).map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedProduct(p);
                  setCurrentView('product-detail');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group cursor-pointer bg-white rounded-2xl border border-zinc-200 p-3 shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-100 mb-2.5">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-zinc-950/80 backdrop-blur-xs text-[10px] font-mono text-amber-300 rounded font-semibold">
                    240 GSM
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="text-xs font-bold text-zinc-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                    {p.name}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-100">
                    <span className="font-mono font-bold text-xs text-zinc-900">₹{p.price}</span>
                    <span className="text-[10px] text-zinc-400 font-mono capitalize">{p.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
