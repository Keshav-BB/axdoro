import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  FileText,
  Truck,
  MessageCircle,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  MapPin,
  Phone,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/currency';
import { getWhatsAppOrderShareUrl } from '../../utils/whatsapp';

export const OrderSuccessPage: React.FC = () => {
  const { selectedOrder, setCurrentView, setIsInvoiceOpen } = useStore();

  useEffect(() => {
    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#ffffff'],
      });
    } catch (e) {
      // ignore
    }
  }, []);

  if (!selectedOrder) {
    return (
      <div className="py-20 text-center text-zinc-400">
        <p>No recent order found.</p>
        <button
          onClick={() => setCurrentView('shop')}
          className="mt-4 px-4 py-2 bg-amber-400 text-zinc-950 font-bold rounded-lg text-xs"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const whatsappUrl = getWhatsAppOrderShareUrl(selectedOrder);

  return (
    <div className="py-12 max-w-3xl mx-auto px-4 sm:px-6 animate-fadeIn">
      {/* Success Badge Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
            Payment Verified via Razorpay
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Order #{selectedOrder.id} Confirmed!
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Thank you, <span className="text-white font-semibold">{selectedOrder.customerName}</span>.
            We are preparing your 240 GSM heavyweight garment for dispatch.
          </p>
        </div>

        {/* Quick Tracking & Delivery Alert */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white font-mono">
                {selectedOrder.courier}
              </div>
              <div className="text-[11px] text-zinc-400 font-mono">
                AWB Tracking: <strong className="text-amber-400">{selectedOrder.trackingNumber}</strong>
              </div>
            </div>
          </div>

          <div className="text-right sm:text-right w-full sm:w-auto">
            <div className="text-[10px] uppercase font-mono text-zinc-500">Estimated Delivery</div>
            <div className="text-xs font-bold text-emerald-400">
              {selectedOrder.estimatedDelivery}
            </div>
          </div>
        </div>

        {/* Key Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* GST Invoice Trigger */}
          <button
            onClick={() => setIsInvoiceOpen(true)}
            className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold py-3 px-4 rounded-xl border border-zinc-700 transition-colors font-mono"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Download GST Invoice</span>
          </button>

          {/* Track Order */}
          <button
            onClick={() => setCurrentView('tracking')}
            className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold py-3 px-4 rounded-xl transition-colors font-mono"
          >
            <Truck className="w-4 h-4" />
            <span>Live Shiprocket Tracking</span>
          </button>

          {/* WhatsApp Share */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-3 px-4 rounded-xl transition-colors font-mono shadow-md shadow-emerald-950/50"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send to WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider pb-3 border-b border-zinc-800">
          Order Items & Shipping Details
        </h3>

        {/* Garments List */}
        <div className="space-y-3 divide-y divide-zinc-800/60">
          {selectedOrder.items.map((item) => (
            <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-14 h-16 object-cover rounded-xl bg-zinc-950 border border-zinc-800 shrink-0"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{item.product.name}</h4>
                  <div className="text-[11px] text-zinc-400 font-mono">
                    Size: <strong className="text-amber-400">{item.selectedSize}</strong> | Color: {item.selectedColor.name} | Qty: {item.quantity}
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {item.product.gsm} GSM Combed Cotton
                  </span>
                </div>
              </div>

              <div className="text-xs font-mono font-bold text-white">
                {formatINR(item.product.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Shipping Address & Cost Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-800 text-xs">
          <div className="space-y-1 text-zinc-400">
            <div className="font-mono uppercase text-zinc-500 text-[10px]">Shipping To:</div>
            <div className="text-white font-semibold">{selectedOrder.customerName}</div>
            <div>{selectedOrder.address}</div>
            <div>
              {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}
            </div>
            <div className="font-mono pt-1 text-zinc-300">Ph: +91 {selectedOrder.phone}</div>
          </div>

          <div className="space-y-1.5 font-mono text-zinc-400">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="text-zinc-200">{formatINR(selectedOrder.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tamil Nadu Shipping:</span>
              <span className="text-emerald-400">FREE</span>
            </div>
            <div className="flex justify-between">
              <span>GST (Included):</span>
              <span className="text-zinc-300">{formatINR(selectedOrder.gstAmount)}</span>
            </div>
            <div className="pt-2 border-t border-zinc-800 flex justify-between font-bold text-sm text-white">
              <span>Total Paid:</span>
              <span className="text-amber-400 font-mono">{formatINR(selectedOrder.total)}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={() => setCurrentView('shop')}
            className="text-xs text-zinc-400 hover:text-white font-mono inline-flex items-center gap-1.5"
          >
            <span>Continue shopping new 240 GSM drops</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
