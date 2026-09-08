import React, { useState } from 'react';
import { Heart, Sparkles, Star, Plus } from 'lucide-react';
import { Product, TShirtSize } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/currency';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setSelectedProduct,
    setCurrentView,
    setIsAITryOnOpen,
  } = useStore();

  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<TShirtSize>('L');

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleOpenDetail = () => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize, product.colors[0], 1);
  };

  const handleOpenAI = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setIsAITryOnOpen(true);
  };

  return (
    <div
      className="group bg-white border border-zinc-200/90 hover:border-zinc-400 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col cursor-pointer shadow-xs hover:shadow-xl hover:-translate-y-1"
      onClick={handleOpenDetail}
    >
      {/* Product Image Stage */}
      <div
        className="relative aspect-[4/5] bg-zinc-100 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="bg-white/95 backdrop-blur-md text-zinc-950 border border-zinc-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shadow-xs">
            {product.gsm} GSM
          </span>
          {discountPercent > 0 && (
            <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-zinc-700 hover:text-zinc-950 hover:bg-white transition-colors z-10 shadow-xs"
          aria-label="Wishlist"
        >
          <Heart
            className={`w-4 h-4 ${
              isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-zinc-600'
            }`}
          />
        </button>

        {/* Floating Quick Feature Tools (Slide-up on hover) */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-1.5 opacity-95 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handleOpenAI}
            className="w-full bg-white/95 hover:bg-white border border-zinc-200 text-zinc-900 text-xs font-semibold py-2 px-3 rounded-xl backdrop-blur-md flex items-center justify-center gap-1.5 shadow-md transition-all font-mono"
            title="AI Virtual Drape Fit"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>AI Virtual Fit</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
            <span className="font-mono uppercase text-[11px] font-semibold tracking-wider text-zinc-500">
              {product.categoryLabel}
            </span>
            <div className="flex items-center gap-1 text-amber-600 text-[11px] font-bold">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{product.rating}</span>
              <span className="text-zinc-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-zinc-900 group-hover:text-amber-800 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-base sm:text-lg font-black font-mono text-zinc-950">
              {formatINR(product.price)}
            </span>
            <span className="text-xs text-zinc-400 line-through font-mono">
              {formatINR(product.originalPrice)}
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 font-mono">
              Free TN Delivery
            </span>
          </div>
        </div>

        {/* Interactive Size Pills & Color Swatches */}
        <div className="space-y-2 pt-3 border-t border-zinc-100">
          {/* Sizes */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-500 text-[10px] font-mono uppercase">Size:</span>
            <div className="flex items-center gap-1">
              {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as TShirtSize[]).map((size) => {
                const stockItem = product.sizes.find((s) => s.size === size);
                const hasStock = stockItem && stockItem.stock > 0;
                return (
                  <button
                    key={size}
                    disabled={!hasStock}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (hasStock) setSelectedSize(size);
                    }}
                    className={`w-6 h-6 rounded text-[10px] font-mono font-bold flex items-center justify-center transition-all ${
                      selectedSize === size
                        ? 'bg-zinc-950 text-white shadow-xs'
                        : hasStock
                        ? 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                        : 'bg-zinc-50 text-zinc-300 line-through cursor-not-allowed'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Add Action Button */}
          <button
            onClick={handleQuickAdd}
            className="w-full mt-1 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold py-2.5 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 font-mono shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add to Bag • Size {selectedSize}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
