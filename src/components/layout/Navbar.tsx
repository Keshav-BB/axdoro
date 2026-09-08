import React, { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  Truck,
  Package,
  Menu,
  X,
  User as UserIcon,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/currency';

export const Navbar: React.FC = () => {
  const {
    cartCount,
    cartSubtotal,
    wishlist,
    currentView,
    setCurrentView,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    setIsBulkOrderOpen,
    currentUser,
    setIsAuthModalOpen,
    setIsProfileDrawerOpen,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const handleNavClick = (view: 'home' | 'shop' | 'tracking' | 'admin', category?: string) => {
    setCurrentView(view);
    if (category) {
      setSelectedCategory(category);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile Menu Trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center text-white font-black tracking-tighter text-xl shadow-md shadow-zinc-950/10">
              AX
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-wider text-zinc-950 uppercase font-mono">
                AXDORO
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-amber-600 font-bold -mt-1">
                240 GSM Heavy Apparel
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-all ${
                currentView === 'home'
                  ? 'text-zinc-950 bg-zinc-100'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('shop', 'all')}
              className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-all ${
                currentView === 'shop'
                  ? 'text-zinc-950 bg-zinc-100'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
              }`}
            >
              Shop All
            </button>

            <button
              onClick={() => handleNavClick('shop', 't-shirts')}
              className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 rounded-full transition-all flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              T-Shirts
            </button>

            <button
              onClick={() => handleNavClick('shop', 'shirts')}
              className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 rounded-full transition-all"
            >
              Shirts
            </button>

            <button
              onClick={() => handleNavClick('shop', 'pants')}
              className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 rounded-full transition-all"
            >
              Pants & Trousers
            </button>

            <button
              onClick={() => handleNavClick('shop', 'hoodies')}
              className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 rounded-full transition-all"
            >
              Hoodies
            </button>

            <button
              onClick={() => handleNavClick('tracking')}
              className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-all flex items-center gap-1.5 ${
                currentView === 'tracking'
                  ? 'text-amber-700 bg-amber-50 border border-amber-200'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
              }`}
            >
              <Truck className="w-4 h-4 text-amber-600" />
              Track Order
            </button>

            <button
              onClick={() => setIsBulkOrderOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-full transition-all flex items-center gap-1.5"
            >
              <Package className="w-4 h-4" />
              Bulk / Custom
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Toggle / Input */}
            <div className="relative">
              {showSearchInput ? (
                <div className="flex items-center bg-zinc-100 border border-zinc-300 rounded-full px-3 py-1.5 w-48 sm:w-64 transition-all shadow-inner">
                  <Search className="w-4 h-4 text-zinc-500 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search 240 GSM drops..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (currentView !== 'shop') setCurrentView('shop');
                    }}
                    className="bg-transparent text-xs text-zinc-900 placeholder-zinc-500 focus:outline-none w-full"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setShowSearchInput(false);
                      setSearchQuery('');
                    }}
                    className="text-zinc-400 hover:text-zinc-700 ml-1 text-xs"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSearchInput(true)}
                  className="p-2.5 rounded-full text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={() => handleNavClick('shop')}
              className="p-2.5 rounded-full text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors relative"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 bg-zinc-950 hover:bg-zinc-800 text-white px-4 py-2 rounded-full transition-all shadow-md shadow-zinc-950/10 group"
              aria-label="Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-amber-400 group-hover:scale-105 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-amber-400 text-zinc-950 text-[10px] font-black rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-semibold font-mono text-zinc-100">
                {cartSubtotal > 0 ? formatINR(cartSubtotal) : 'Bag'}
              </span>
            </button>

            {/* Customer Account Trigger */}
            {currentUser ? (
              <button
                onClick={() => setIsProfileDrawerOpen(true)}
                className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border border-zinc-300 bg-white hover:bg-zinc-50 text-xs font-semibold transition-all shadow-xs group"
                title="Account Passport"
              >
                <div className="w-6 h-6 rounded-full bg-zinc-950 text-amber-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                  {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="hidden md:inline font-mono font-bold text-zinc-900 truncate max-w-[80px]">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-zinc-300 bg-white text-zinc-800 hover:text-zinc-950 hover:bg-zinc-100 text-xs font-semibold font-mono transition-all shadow-xs"
                title="Sign In / Join AXDORO"
              >
                <UserIcon className="w-4 h-4 text-zinc-600" />
                <span className="hidden md:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-zinc-200 px-4 pt-3 pb-6 space-y-2 animate-fadeIn shadow-lg">
          {currentUser ? (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsProfileDrawerOpen(true);
              }}
              className="w-full text-left p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold flex items-center justify-between mb-2"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-950 text-amber-400 text-xs font-bold flex items-center justify-center">
                  {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-serif">{currentUser.name}</div>
                  <div className="text-[10px] text-amber-700 font-mono">{currentUser.tier} • {currentUser.loyaltyPoints} Pts</div>
                </div>
              </div>
              <span className="text-xs text-zinc-500 font-mono">Passport →</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsAuthModalOpen(true);
              }}
              className="w-full text-center py-2.5 rounded-xl bg-zinc-950 text-white font-bold text-xs font-mono uppercase tracking-wider shadow-md mb-2"
            >
              Sign In / Join AXDORO
            </button>
          )}
          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-800 hover:bg-zinc-100"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('shop', 'all')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-800 hover:bg-zinc-100"
          >
            Shop All Collections
          </button>
          <button
            onClick={() => handleNavClick('shop', 't-shirts')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-amber-700 hover:bg-amber-50 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            T-Shirts (240 GSM)
          </button>
          <button
            onClick={() => handleNavClick('shop', 'shirts')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-800 hover:bg-zinc-100"
          >
            Shirts & Overshirts
          </button>
          <button
            onClick={() => handleNavClick('shop', 'pants')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-800 hover:bg-zinc-100"
          >
            Pants & Trousers
          </button>
          <button
            onClick={() => handleNavClick('shop', 'hoodies')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-800 hover:bg-zinc-100"
          >
            Hoodies (400 GSM)
          </button>
          <button
            onClick={() => handleNavClick('shop', 'shorts')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-800 hover:bg-zinc-100"
          >
            Half Pants & Shorts
          </button>
          <button
            onClick={() => handleNavClick('tracking')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-800 hover:bg-zinc-100 flex items-center gap-2"
          >
            <Truck className="w-4 h-4 text-amber-600" />
            Track Order (Shiprocket)
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsBulkOrderOpen(true);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-emerald-700 hover:bg-emerald-50 flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            Bulk & Custom Orders
          </button>
        </div>
      )}
    </header>
  );
};
