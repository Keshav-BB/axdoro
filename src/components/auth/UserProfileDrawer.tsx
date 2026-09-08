import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  ShoppingBag, 
  MapPin, 
  Ruler, 
  LogOut, 
  Plus, 
  Trash2, 
  FileText, 
  Truck, 
  ShieldCheck, 
  Sparkles,
  Crown
} from 'lucide-react';
import { formatINR } from '../../utils/currency';
import { TShirtSize } from '../../types';

export const UserProfileDrawer: React.FC = () => {
  const { 
    currentUser, 
    isProfileDrawerOpen, 
    setIsProfileDrawerOpen, 
    logout, 
    orders, 
    setSelectedOrder, 
    setIsInvoiceOpen, 
    setCurrentView,
    addSavedAddress,
    deleteSavedAddress,
    updateUserProfile,
    showToast 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'fit'>('orders');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  
  // New Address Form State
  const [addrLabel, setAddrLabel] = useState<'Home' | 'Office' | 'Atelier'>('Home');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('Chennai');
  const [addrPincode, setAddrPincode] = useState('600040');

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsProfileDrawerOpen(false);
    };
    if (isProfileDrawerOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isProfileDrawerOpen, setIsProfileDrawerOpen]);

  if (!isProfileDrawerOpen || !currentUser) return null;

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrStreet || !addrCity || !addrPincode) {
      showToast('Please fill in all address fields', 'error');
      return;
    }
    addSavedAddress({
      label: addrLabel,
      street: addrStreet,
      city: addrCity,
      state: 'Tamil Nadu',
      pincode: addrPincode,
      isDefault: currentUser.addresses.length === 0,
    });
    setAddrStreet('');
    setIsAddingAddress(false);
  };

  const userOrders = orders.filter(
    (o) =>
      o.phone === currentUser.phone ||
      o.email.toLowerCase() === currentUser.email.toLowerCase() ||
      o.customerName.toLowerCase() === currentUser.name.toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-[#faf9f6] text-zinc-900 h-full shadow-2xl border-l border-zinc-200 flex flex-col overflow-hidden animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-zinc-200 bg-white/90 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-700">
              AXDORO Membership Passport
            </span>
            <button
              onClick={() => setIsProfileDrawerOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-950 text-amber-400 flex items-center justify-center font-mono text-xl font-bold shadow-md shrink-0">
              {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-950 font-serif truncate">
                  {currentUser.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shrink-0">
                  <Crown className="w-3 h-3 text-amber-700" />
                  {currentUser.tier}
                </span>
              </div>
              <div className="text-xs text-zinc-500 font-mono mt-0.5 truncate">
                +91 {currentUser.phone} • {currentUser.email}
              </div>
              <div className="flex items-center gap-3 mt-2 text-[11px] font-mono">
                <span className="text-emerald-700 font-bold">
                  ★ {currentUser.loyaltyPoints} Rewards Points
                </span>
                <span className="text-zinc-400">•</span>
                <span className="text-zinc-600">
                  Fit: <strong>Size {currentUser.preferredSize}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-200 bg-white text-xs font-semibold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 text-center border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeTab === 'orders'
                ? 'border-zinc-950 text-zinc-950 font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Orders ({userOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex-1 py-3 text-center border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeTab === 'addresses'
                ? 'border-zinc-950 text-zinc-950 font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Saved Addresses ({currentUser.addresses.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('fit')}
            className={`flex-1 py-3 text-center border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeTab === 'fit'
                ? 'border-zinc-950 text-zinc-950 font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Fit & Size Profile</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {/* 1. ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4 animate-fadeIn">
              {userOrders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-zinc-200 p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-zinc-900 font-serif">No Orders Found</div>
                  <p className="text-[11px] text-zinc-500">
                    Your completed orders and live Shiprocket tracking will appear right here.
                  </p>
                  <button
                    onClick={() => {
                      setIsProfileDrawerOpen(false);
                      setCurrentView('shop');
                    }}
                    className="px-4 py-2 bg-zinc-950 text-white rounded-xl text-xs font-bold hover:bg-zinc-800"
                  >
                    Explore 240 GSM Catalog
                  </button>
                </div>
              ) : (
                userOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                      <div>
                        <div className="font-bold text-xs text-zinc-900 font-mono">
                          Order #{ord.id}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono">
                          {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {ord.items.map((i) => (
                        <div key={i.id} className="flex items-center justify-between text-xs">
                          <span className="text-zinc-800 font-medium">
                            {i.quantity}x {i.product.name} ({i.selectedSize})
                          </span>
                          <span className="font-mono text-zinc-900">
                            {formatINR(i.product.price * i.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs font-mono">
                      <div className="text-zinc-500">
                        Total: <strong className="text-zinc-950">{formatINR(ord.total)}</strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(ord);
                            setIsInvoiceOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg border border-zinc-200 text-[11px] font-bold hover:bg-zinc-50 text-zinc-700 flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3 text-zinc-400" /> Invoice
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(ord);
                            setIsProfileDrawerOpen(false);
                            setCurrentView('tracking');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-zinc-950 text-white text-[11px] font-bold hover:bg-zinc-800 flex items-center gap-1"
                        >
                          <Truck className="w-3 h-3" /> Track
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 2. SAVED ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-serif text-zinc-900">
                  Shipping Destinations
                </span>
                {!isAddingAddress && (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Address
                  </button>
                )}
              </div>

              {/* Add Address Form */}
              {isAddingAddress && (
                <form onSubmit={handleCreateAddress} className="p-4 bg-white rounded-2xl border border-zinc-300 shadow-sm space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                    <span className="text-xs font-bold uppercase font-mono text-zinc-900">
                      New Delivery Address
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="text-zinc-400 hover:text-zinc-700 text-xs"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {(['Home', 'Office', 'Atelier'] as const).map((lbl) => (
                      <button
                        type="button"
                        key={lbl}
                        onClick={() => setAddrLabel(lbl)}
                        className={`py-1 rounded-lg text-xs font-mono font-medium ${
                          addrLabel === lbl
                            ? 'bg-zinc-900 text-white'
                            : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono text-zinc-500 mb-1">
                      Street Address & Door No.
                    </label>
                    <input
                      type="text"
                      required
                      value={addrStreet}
                      onChange={(e) => setAddrStreet(e.target.value)}
                      placeholder="e.g. 18, Race Course Road"
                      className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-xl focus:outline-none focus:border-zinc-950"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-zinc-500 mb-1">
                        City (Tamil Nadu)
                      </label>
                      <input
                        type="text"
                        required
                        value={addrCity}
                        onChange={(e) => setAddrCity(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-xl focus:outline-none focus:border-zinc-950 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-zinc-500 mb-1">
                        Pincode
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={addrPincode}
                        onChange={(e) => setAddrPincode(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-xl focus:outline-none focus:border-zinc-950 font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-zinc-950 text-white rounded-xl text-xs font-bold hover:bg-zinc-800"
                  >
                    Save Address
                  </button>
                </form>
              )}

              {/* Address List */}
              <div className="space-y-3">
                {currentUser.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 bg-white rounded-2xl border border-zinc-200 shadow-xs flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-100 text-zinc-800">
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] text-emerald-700 font-mono font-bold">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-800 font-medium pt-0.5 leading-relaxed">
                        {addr.street}
                      </p>
                      <p className="text-xs text-zinc-500 font-mono">
                        {addr.city}, {addr.state} – {addr.pincode}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteSavedAddress(addr.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-600 rounded transition-colors"
                      title="Delete Address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. FIT & SIZE PROFILE TAB */}
          {activeTab === 'fit' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-white rounded-2xl border border-zinc-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                  <span className="text-xs font-bold uppercase font-mono text-zinc-900">
                    Preferred Oversized Fit
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-700">
                    Size {currentUser.preferredSize}
                  </span>
                </div>

                <div className="grid grid-cols-6 gap-1.5">
                  {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as TShirtSize[]).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => updateUserProfile({ preferredSize: sz })}
                      className={`py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                        currentUser.preferredSize === sz
                          ? 'bg-zinc-950 text-white shadow-xs'
                          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Selecting Size <strong>{currentUser.preferredSize}</strong> automatically pre-selects this size on product detail pages and verifies instant warehouse stock in Tiruppur.
                </p>
              </div>

              {/* Garment Care Cheat Sheet */}
              <div className="p-4 bg-zinc-100 rounded-2xl border border-zinc-200 text-xs space-y-2">
                <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  240 GSM Preservation Protocol
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-zinc-600">
                  <li>Cold domestic machine wash (≤ 30°C) with like colors.</li>
                  <li>Do not iron directly over high-density puff graphics.</li>
                  <li>Flat air dry in shade to preserve cotton compact drape.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer: Logout Action */}
        <div className="p-4 border-t border-zinc-200 bg-white/90 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-zinc-500 font-mono text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Member since {currentUser.joinedDate}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-red-600 hover:text-red-700 font-bold px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
