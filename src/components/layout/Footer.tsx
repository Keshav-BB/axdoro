import React from 'react';
import {
  MessageCircle,
  Truck,
  Shield,
  RotateCcw,
  Sparkles,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getWhatsAppSupportUrl } from '../../utils/whatsapp';

export const Footer: React.FC = () => {
  const { 
    setCurrentView, 
    setIsSizeGuideOpen, 
    setIsBulkOrderOpen,
    setIsPolicyModalOpen,
    setActivePolicyTab
  } = useStore();

  return (
    <footer className="bg-zinc-950 text-zinc-300 text-sm border-t border-zinc-800">
      {/* Brand Value Props Banner */}
      <div className="border-b border-zinc-800/80 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">240 GSM Heavyweight</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Zero polyester blends. 100% combed ring-spun cotton that holds structured drape.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Free Shipping in TN</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Fast Shiprocket surface & air fulfillment across Chennai, Coimbatore & all districts.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center text-blue-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">7-Day Size Exchange</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Didn’t get the exact oversized drape you wanted? Hassle-free size replacement.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center text-purple-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Razorpay Secure</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Instant UPI (GPay, PhonePe, Paytm) & card checkout with official GST tax invoice.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Intro */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white text-zinc-950 font-black flex items-center justify-center text-base">
                AX
              </div>
              <span className="text-xl font-black tracking-wider text-white font-mono">
                AXDORO
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              AXDORO is an independent apparel label engineered around heavyweight 240 GSM combed
              cotton textiles. Designed and manufactured in Tamil Nadu, our pieces blend architectural
              streetwear silhouettes with daily durability.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={getWhatsAppSupportUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold px-4 py-2.5 rounded-full transition-colors shadow-lg shadow-emerald-500/20"
              >
                <MessageCircle className="w-4 h-4" />
                Chat with Stylist on WhatsApp
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono">
              Shop Drops
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentView('shop')}
                  className="hover:text-white transition-colors"
                >
                  All 240 GSM Tees
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('shop')}
                  className="hover:text-white transition-colors"
                >
                  Oversized Silhouette
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('shop')}
                  className="hover:text-white transition-colors"
                >
                  Half-Sleeve Boxy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('shop')}
                  className="hover:text-white transition-colors"
                >
                  Acid & Mineral Wash
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="hover:text-amber-400 text-zinc-300 transition-colors"
                >
                  Oversized Size Guide (XS-XXL)
                </button>
              </li>
            </ul>
          </div>

          {/* Order & Services */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono">
              Customer Care
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentView('tracking')}
                  className="hover:text-white transition-colors"
                >
                  Shiprocket Live Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsBulkOrderOpen(true)}
                  className="hover:text-emerald-400 text-zinc-300 transition-colors"
                >
                  Bulk & Custom Merchandise
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePolicyTab('shipping');
                    setIsPolicyModalOpen(true);
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Shipping & Delivery (Free TN Express)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePolicyTab('returns');
                    setIsPolicyModalOpen(true);
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  7-Day Return & Size Exchange
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePolicyTab('privacy');
                    setIsPolicyModalOpen(true);
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Privacy Policy (DPDP 2023)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePolicyTab('terms');
                    setIsPolicyModalOpen(true);
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Terms & Conditions of Sale
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePolicyTab('compliance');
                    setIsPolicyModalOpen(true);
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  GST & Corporate Compliance
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePolicyTab('support');
                    setIsPolicyModalOpen(true);
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Help Desk & Garment Care FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Tax Info */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono">
              Manufacturing & Tax
            </h5>
            <div className="space-y-2 text-xs text-zinc-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-zinc-500 mt-0.5 shrink-0" />
                <span>Textile Industrial Hub, Tiruppur & Chennai, Tamil Nadu, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span>care@axdoro.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-500 font-mono">
                <div>GSTIN: 33AAAAA0000A1Z5</div>
                <div>HSN Code: 6109 (Cotton Knitted T-Shirts)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex flex-wrap items-center gap-2">
            <span>© 2026 AXDORO Apparel Co. All rights reserved. Launching Oct 2026.</span>
            <span className="text-zinc-700">•</span>
            <button
              onClick={() => {
                setCurrentView('admin');
                window.location.hash = 'admin';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-zinc-600 hover:text-amber-400 transition-colors cursor-pointer text-[11px] font-mono underline decoration-zinc-800 hover:decoration-amber-400 underline-offset-2"
              title="Authorized internal staff access"
            >
              Staff Portal
            </button>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Payments powered by Razorpay</span>
            <span>•</span>
            <span>Logistics by Shiprocket</span>
            <span>•</span>
            <span>Tamil Nadu Intra-State GST Applicable</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
