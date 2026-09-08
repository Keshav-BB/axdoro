import React, { useState } from 'react';
import {
  Heart,
  Sparkles,
  Star,
  Truck,
  Ruler,
  Check,
  ArrowLeft,
  Clock,
  MessageCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { TShirtSize, ColorOption } from '../../types';
import { formatINR } from '../../utils/currency';
import { getWhatsAppSupportUrl } from '../../utils/whatsapp';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProduct,
    setCurrentView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsAITryOnOpen,
    setIsSizeGuideOpen,
    setIsCartOpen,
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<TShirtSize>('L');
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('600040');
  const [pincodeChecked, setPincodeChecked] = useState(true);

  if (!selectedProduct) {
    return (
      <div className="py-20 text-center text-zinc-500">
        <p>No product selected.</p>
        <button
          onClick={() => setCurrentView('shop')}
          className="mt-4 px-5 py-2.5 bg-zinc-950 text-white font-bold rounded-full text-xs"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const activeColor = selectedColor || selectedProduct.colors[0];

  const selectedSizeStock =
    selectedProduct.sizes.find((s) => s.size === selectedSize)?.stock || 0;

  const discountPercent = Math.round(
    ((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100
  );

  const handleAddToCart = () => {
    addToCart(selectedProduct, selectedSize, activeColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, selectedSize, activeColor, quantity);
    setIsCartOpen(true);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6 font-mono">
        <button
          onClick={() => setCurrentView('home')}
          className="hover:text-zinc-950 transition-colors"
        >
          Home
        </button>
        <span>/</span>
        <button
          onClick={() => setCurrentView('shop')}
          className="hover:text-zinc-950 transition-colors"
        >
          Shop
        </button>
        <span>/</span>
        <span className="text-zinc-600">{selectedProduct.categoryLabel}</span>
        <span>/</span>
        <span className="text-amber-800 font-semibold truncate max-w-xs">{selectedProduct.name}</span>
      </div>

      <button
        onClick={() => setCurrentView('shop')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-950 mb-6 transition-colors bg-white px-3.5 py-1.5 rounded-full border border-zinc-200 shadow-xs"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Drops</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        {/* Left Visual Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Visual Display */}
          <div className="relative aspect-[4/5] bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-md group">
            <img
              src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
              alt={selectedProduct.name}
              className="w-full h-full object-cover object-center"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <span className="bg-white/95 backdrop-blur-md text-zinc-950 border border-zinc-200 text-xs font-mono font-bold px-3 py-1 rounded-full shadow-xs">
                {selectedProduct.gsm} GSM Luxury Heavyweight
              </span>
              {discountPercent > 0 && (
                <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Interactive Feature Buttons */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <button
                onClick={() => toggleWishlist(selectedProduct.id)}
                className="p-2.5 rounded-full bg-white/95 backdrop-blur-md text-zinc-700 hover:text-zinc-950 hover:bg-white transition-colors shadow-md"
                title="Wishlist"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isInWishlist(selectedProduct.id) ? 'fill-red-500 text-red-500' : 'text-zinc-600'
                  }`}
                />
              </button>
            </div>

            {/* AI Try-On Floating Callout Banner */}
            <div className="absolute bottom-4 inset-x-4 bg-white/95 backdrop-blur-md border border-purple-200 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                    AI "See The Fit" Drape Simulator
                    <span className="bg-purple-100 text-purple-700 text-[9px] font-mono px-1.5 py-0.5 rounded font-bold">
                      NEW
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Preview how the 240 GSM drop shoulder silhouette drapes on your height & frame.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAITryOnOpen(true)}
                className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-2 px-4 rounded-xl whitespace-nowrap transition-colors shadow-xs"
              >
                Try On
              </button>
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
            {selectedProduct.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  activeImageIndex === idx
                    ? 'border-zinc-950 ring-2 ring-zinc-950/10'
                    : 'border-zinc-200 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Info & Checkout Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header Title & Ratings */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white text-zinc-800 border border-zinc-200 text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase font-bold shadow-xs">
                {selectedProduct.categoryLabel}
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
                Tamil Nadu Stocked
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
              {selectedProduct.name}
            </h1>

            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1 text-amber-600 text-sm font-bold">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{selectedProduct.rating}</span>
              </div>
              <span className="text-zinc-300">•</span>
              <span className="text-xs text-zinc-500">
                {selectedProduct.reviewCount} Verified Buyer Reviews
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black font-mono text-zinc-950">
                {formatINR(selectedProduct.price)}
              </span>
              <span className="text-sm text-zinc-400 line-through font-mono">
                {formatINR(selectedProduct.originalPrice)}
              </span>
              <span className="text-xs font-bold text-emerald-700 font-mono">
                Save {formatINR(selectedProduct.originalPrice - selectedProduct.price)}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              Price inclusive of all taxes. Free express shipping in Tamil Nadu via Shiprocket.
            </p>
          </div>

          {/* Color Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-600 font-mono uppercase text-[11px]">
                Color: <strong className="text-zinc-950">{activeColor.name}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              {selectedProduct.colors.map((color) => (
                <button
                  key={color.code}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                    activeColor.code === color.code
                      ? 'border-zinc-950 scale-110 shadow-md shadow-zinc-950/20'
                      : 'border-zinc-300 hover:border-zinc-500'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {activeColor.code === color.code && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        color.hex === '#f3f0e6' || color.hex === '#ffffff'
                          ? 'bg-black'
                          : 'bg-white'
                      }`}
                    ></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-zinc-600 font-mono uppercase text-[11px]">Size (XS-XXL):</span>
                <span className="text-zinc-950 font-bold font-mono">{selectedSize}</span>
              </div>

              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-amber-800 hover:text-amber-900 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Oversized Size Guide</span>
              </button>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as TShirtSize[]).map((sz) => {
                const stock = selectedProduct.sizes.find((s) => s.size === sz)?.stock || 0;
                const isAvailable = stock > 0;
                return (
                  <button
                    key={sz}
                    disabled={!isAvailable}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-3 rounded-xl text-xs font-mono font-bold border transition-all flex flex-col items-center justify-center gap-0.5 ${
                      selectedSize === sz
                        ? 'bg-zinc-950 text-white border-zinc-950 shadow-md shadow-zinc-950/10'
                        : isAvailable
                        ? 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-400'
                        : 'bg-zinc-50 text-zinc-300 border-zinc-100 cursor-not-allowed line-through'
                    }`}
                  >
                    <span>{sz}</span>
                    <span className="text-[9px] font-normal">
                      {isAvailable ? `${stock} left` : 'Sold out'}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedSizeStock > 0 && selectedSizeStock <= 8 && (
              <p className="text-[11px] text-amber-700 font-mono flex items-center gap-1 mt-1 font-semibold">
                <Clock className="w-3 h-3" />
                Only {selectedSizeStock} left in size {selectedSize} — selling fast!
              </p>
            )}
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Controls */}
              <div className="flex items-center bg-white border border-zinc-200 rounded-xl p-1 shadow-xs">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center text-zinc-600 hover:text-zinc-950 rounded-lg hover:bg-zinc-100 text-base"
                >
                  -
                </button>
                <span className="w-10 text-center text-sm font-mono font-bold text-zinc-950">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(selectedSizeStock, q + 1))}
                  className="w-9 h-9 flex items-center justify-center text-zinc-600 hover:text-zinc-950 rounded-lg hover:bg-zinc-100 text-base"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-900 font-bold py-3.5 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-xs"
              >
                Add to Bag
              </button>
            </div>

            {/* Buy Now Immediate Checkout Button */}
            <button
              onClick={handleBuyNow}
              className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-black py-4 px-6 rounded-xl text-sm transition-all shadow-xl shadow-zinc-950/15 font-mono uppercase tracking-wider"
            >
              Buy Now with Razorpay
            </button>
          </div>

          {/* Tamil Nadu Express Delivery Checker */}
          <div className="p-4 rounded-2xl bg-white border border-zinc-200 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-900 font-bold flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-600" />
                Tamil Nadu Delivery Estimate
              </span>
              <span className="text-[11px] text-emerald-700 font-mono font-bold">FREE SHIPPING</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={pincode}
                maxLength={6}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter 6-digit Pincode"
                className="bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 px-3 py-2 rounded-lg font-mono w-36 focus:outline-none focus:border-zinc-950"
              />
              <button
                onClick={() => setPincodeChecked(true)}
                className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg"
              >
                Check
              </button>
            </div>

            {pincodeChecked && (
              <p className="text-[11px] text-zinc-600 leading-tight">
                Delivery to <strong className="text-zinc-900">{pincode}</strong> via{' '}
                <strong className="text-amber-800">Shiprocket Air/Surface</strong> within{' '}
                <strong className="text-zinc-950">24-48 hours</strong> in Tamil Nadu.
              </p>
            )}
          </div>

          {/* Highlights & Fabric Specs */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-mono uppercase text-zinc-500 font-bold tracking-wider">
              Garment Engineering & Fabric
            </h4>
            <div className="grid grid-cols-1 gap-2 text-xs">
              {selectedProduct.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 text-zinc-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp Direct Stylist Assistance */}
          <div className="pt-2">
            <a
              href={getWhatsAppSupportUrl(`Hi AXDORO, I have a query about ${selectedProduct.name} (Size: ${selectedSize})`)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 py-3 px-4 rounded-xl text-xs font-semibold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask a Stylist on WhatsApp about sizing & fit</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
