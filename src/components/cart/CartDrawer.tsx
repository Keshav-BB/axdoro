import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Truck, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/currency';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartSubtotal,
    cartCount,
    updateQuantity,
    removeFromCart,
    setCurrentView,
  } = useStore();

  if (!isCartOpen) return null;

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-zinc-200 shadow-2xl flex flex-col text-zinc-900">
          {/* Header */}
          <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-zinc-900" />
              <h2 className="text-base font-bold text-zinc-950 font-mono uppercase tracking-wider">
                Your Bag ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-zinc-500 hover:text-zinc-950 rounded-lg hover:bg-zinc-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tamil Nadu Free Delivery Alert */}
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 flex items-center gap-2 text-xs text-emerald-800">
            <Truck className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>
              <strong>Free Express Delivery</strong> across all districts in Tamil Nadu!
            </span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-zinc-100">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-zinc-900">Your bag is empty</h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  Explore our 240 GSM oversized and half-sleeve tees engineered for high-street durability.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentView('shop');
                  }}
                  className="mt-4 px-5 py-2.5 bg-zinc-950 text-white font-bold rounded-full text-xs font-mono"
                >
                  Browse Drops
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-24 rounded-xl object-cover bg-zinc-50 border border-zinc-200 shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-zinc-900 truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-400 hover:text-red-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono mt-1">
                        <span>Size: <strong className="text-zinc-900">{item.selectedSize}</strong></span>
                        <span>•</span>
                        <span>{item.selectedColor.name}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {item.product.gsm} GSM Combed Cotton
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Qty controls */}
                      <div className="flex items-center bg-zinc-100 border border-zinc-200 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:text-zinc-950 rounded text-xs"
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-xs font-mono font-bold text-zinc-950">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:text-zinc-950 rounded text-xs"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-mono font-black text-zinc-950">
                        {formatINR(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 bg-zinc-50 border-t border-zinc-200 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-mono text-zinc-900 font-semibold">{formatINR(cartSubtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-600">
                  <span>Shipping (Tamil Nadu Express)</span>
                  <span className="font-mono text-emerald-700 font-bold">FREE</span>
                </div>
                <div className="flex items-center justify-between text-zinc-600">
                  <span>Estimated GST (5% Inclusive)</span>
                  <span className="font-mono text-zinc-500">Included</span>
                </div>
                <div className="pt-2 border-t border-zinc-200 flex items-center justify-between text-sm font-bold text-zinc-950">
                  <span>Total Amount</span>
                  <span className="font-mono text-lg font-black text-zinc-950">
                    {formatINR(cartSubtotal)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceedCheckout}
                className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-black py-4 px-4 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-zinc-950/15 uppercase tracking-wider font-mono"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-mono">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Razorpay Encrypted • Shiprocket Fast Dispatch</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
