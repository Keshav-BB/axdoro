import React from 'react';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Package,
  Zap,
  Award,
  Flame,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';

export const HomePage: React.FC = () => {
  const {
    products,
    setCurrentView,
    setSelectedCategory,
    setSelectedProduct,
    setIsAITryOnOpen,
    setIsBulkOrderOpen,
  } = useStore();

  const featuredProducts = products.slice(0, 3);

  const handleLaunchAI = () => {
    setSelectedProduct(products[0]);
    setIsAITryOnOpen(true);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section - Luxury Editorial Look */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-[#faf8f5] to-[#f4f2eb] border-b border-zinc-200/80">
        {/* Subtle Ambient Texture & Glow */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-amber-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200/15 rounded-full blur-3xl"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 pt-12 pb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-amber-300 text-amber-900 px-4 py-1.5 rounded-full text-xs font-mono font-bold shadow-xs animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            <span>AUTUMN / WINTER 2026 // 240 GSM ARCHITECTURAL COLLECTION</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-zinc-950 tracking-tight uppercase font-mono leading-[1.05]">
            Heavyweight Drape. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-600 to-zinc-900">
              Uncompromising Luxury.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed font-sans">
            Engineered with dense, breathable <strong>240 GSM 100% Combed Cotton</strong>. Crisp drop-shoulder
            contours, zero chest clinging, and a resilient 1.25" non-sag ribbed collar crafted in Tamil Nadu.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setCurrentView('shop');
              }}
              className="w-full sm:w-auto bg-zinc-950 hover:bg-zinc-800 text-white font-black px-8 py-4 rounded-full text-xs sm:text-sm transition-all shadow-xl shadow-zinc-950/15 font-mono uppercase tracking-wider flex items-center justify-center gap-2 hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Explore All 200 Drops</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>

            <button
              onClick={handleLaunchAI}
              className="w-full sm:w-auto bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-900 font-bold px-7 py-4 rounded-full text-xs sm:text-sm shadow-xs transition-all font-mono flex items-center justify-center gap-2 hover:-translate-y-0.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>AI Fit & Size Studio</span>
            </button>
          </div>

          {/* Luxury Micro Specs Bar */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center max-w-3xl mx-auto border-t border-zinc-200/80">
            <div className="bg-white/80 p-3 rounded-2xl border border-zinc-200/60 shadow-xs">
              <div className="text-xl font-black text-zinc-950 font-mono">240 GSM</div>
              <div className="text-[11px] text-zinc-500 uppercase font-mono mt-0.5">Heavy French Terry</div>
            </div>
            <div className="bg-white/80 p-3 rounded-2xl border border-zinc-200/60 shadow-xs">
              <div className="text-xl font-black text-zinc-950 font-mono">XS – XXL</div>
              <div className="text-[11px] text-zinc-500 uppercase font-mono mt-0.5">6 Precision Sizes</div>
            </div>
            <div className="bg-white/80 p-3 rounded-2xl border border-zinc-200/60 shadow-xs">
              <div className="text-xl font-black text-emerald-700 font-mono">FREE TN</div>
              <div className="text-[11px] text-zinc-500 uppercase font-mono mt-0.5">Shiprocket Express</div>
            </div>
            <div className="bg-white/80 p-3 rounded-2xl border border-zinc-200/60 shadow-xs">
              <div className="text-xl font-black text-amber-700 font-mono">100%</div>
              <div className="text-[11px] text-zinc-500 uppercase font-mono mt-0.5">Bio-Washed Combed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Drops Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-zinc-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-700 font-bold mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span>CURRENT LAUNCH DROPS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
              Curated 240 GSM Luxury Heavyweights
            </h2>
          </div>

          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentView('shop');
            }}
            className="text-xs font-mono font-semibold text-zinc-600 hover:text-zinc-950 flex items-center gap-1.5 transition-colors self-start sm:self-auto bg-zinc-100 px-4 py-2 rounded-full hover:bg-zinc-200"
          >
            <span>View Full 35-Variant Matrix</span>
            <ArrowRight className="w-4 h-4 text-amber-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 240 GSM Technical Textile Breakdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#f7f6f2] to-[#eeebe2] border border-zinc-200 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-white border border-amber-300 text-amber-900 px-3.5 py-1 rounded-full text-xs font-mono font-bold shadow-xs">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>TECHNICAL TEXTILE ENGINEERING</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight leading-tight">
                Why 240 GSM Elevates Everyday Streetwear
              </h2>

              <p className="text-sm text-zinc-700 leading-relaxed">
                Standard fast-fashion tees range between 150–180 GSM, leading to limp necklines, clinging
                silhouettes, and visible shrinkage after a few washes. AXDORO's 240 GSM heavyweight
                structure acts like structured tailoring for daily wear.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1.5">
                  <div className="text-zinc-950 font-bold text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Structured Drop Shoulder
                  </div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed">
                    Maintains an architectural boxy drape that hangs cleanly off your chest and shoulders.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1.5">
                  <div className="text-zinc-950 font-bold text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    Anti-Sag 1.25" Collar Rib
                  </div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed">
                    Woven with a concealed Lycra core to prevent loose neckline ripples wash after wash.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1.5">
                  <div className="text-zinc-950 font-bold text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    100% Bio-Washed Combed
                  </div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed">
                    Silky smooth handfeel with zero scratchiness despite the dense textile weight.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1.5">
                  <div className="text-zinc-950 font-bold text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    Pre-Shrunk Compact Yarn
                  </div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed">
                    Treated at high steam temperature in Tiruppur mills so size stays identical wash after wash.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-zinc-300 shadow-xl bg-white">
                <img
                  src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
                  alt="Fabric Detail"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-zinc-200 rounded-xl p-4 text-xs shadow-lg">
                  <div className="text-amber-700 font-mono font-bold uppercase text-[10px]">
                    Macro Combed Cotton Detail
                  </div>
                  <div className="text-zinc-950 font-bold mt-0.5">
                    Heavy French Terry Weave • Zero Synthetic Blend
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B2B / Custom Orders Luxury Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-zinc-950 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-2 max-w-xl relative z-10">
            <span className="text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
              B2B & Custom Merchandise Desk
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Need 240 GSM T-Shirts with Custom Puff or Screen Prints?
            </h3>
            <p className="text-xs text-zinc-300">
              Direct factory order facility from 25 to 1000+ pieces for tech teams, university events,
              and clothing brands. Free fabric swatches sent within Tamil Nadu.
            </p>
          </div>

          <button
            onClick={() => setIsBulkOrderOpen(true)}
            className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black px-6 py-3.5 rounded-full text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-colors flex items-center gap-2 shadow-lg shadow-amber-400/20 shrink-0 relative z-10 hover:-translate-y-0.5"
          >
            <Package className="w-4 h-4" />
            <span>Request Bulk Quote</span>
          </button>
        </div>
      </section>
    </div>
  );
};
