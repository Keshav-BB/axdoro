import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  ArrowLeft,
  Lock,
  Building,
  CheckCircle2,
  RotateCw,
  CloudSun,
  Sparkles,
  Camera,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/currency';
import { calculateGST } from '../../utils/gst';
import { RazorpayModal } from './RazorpayModal';
import { Checkout3DSpinFitModal } from './Checkout3DSpinFitModal';
import { getDistrictWeather } from '../../data/weatherData';

const TN_DISTRICTS = [
  'Chennai',
  'Coimbatore',
  'Tiruppur',
  'Madurai',
  'Salem',
  'Tiruchirappalli (Trichy)',
  'Erode',
  'Vellore',
  'Thoothukudi',
  'Tirunelveli',
  'Kanchipuram',
  'Chengalpattu',
  'Dindigul',
  'Thanjavur',
  'Cuddalore',
];

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotal, createOrder, setCurrentView, currentUser, setIsAuthModalOpen } = useStore();

  const [customerName, setCustomerName] = useState(currentUser ? currentUser.name : 'Karthik Subramanian');
  const [email, setEmail] = useState(currentUser ? currentUser.email : 'karthik.sub@gmail.com');
  const [phone, setPhone] = useState(currentUser ? currentUser.phone : '9840123456');
  
  const defaultAddr = currentUser?.addresses.find((a) => a.isDefault) || currentUser?.addresses[0];
  const [address, setAddress] = useState(defaultAddr ? defaultAddr.street : '42, 2nd Main Road, Anna Nagar West');
  const [city, setCity] = useState(defaultAddr ? defaultAddr.city : 'Chennai');
  const [state] = useState('Tamil Nadu');
  const [pincode, setPincode] = useState(defaultAddr ? defaultAddr.pincode : '600040');
  const [gstin, setGstin] = useState('');
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [is3DSpinFitOpen, setIs3DSpinFitOpen] = useState(() => {
    return new URLSearchParams(window.location.search).get('fitCheck') === 'true';
  });
  const [isFitVerified, setIsFitVerified] = useState(false);
  const weather = getDistrictWeather(city);

  // Sync with currentUser when user logs in or switches account
  React.useEffect(() => {
    if (currentUser) {
      setCustomerName(currentUser.name);
      setEmail(currentUser.email);
      setPhone(currentUser.phone);
      if (currentUser.addresses.length > 0) {
        const addr = currentUser.addresses.find((a) => a.isDefault) || currentUser.addresses[0];
        setAddress(addr.street);
        setCity(addr.city);
        setPincode(addr.pincode);
      }
    }
  }, [currentUser]);

  const gstBreakdown = calculateGST(cartSubtotal, state);
  const shippingFee = 0; // Free in Tamil Nadu
  const totalAmount = cartSubtotal;

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center text-zinc-500">
        <h2 className="text-xl font-bold text-zinc-900 mb-2">Your Bag is Empty</h2>
        <p className="text-xs text-zinc-500 mb-6">Add 240 GSM drops to your cart before proceeding.</p>
        <button
          onClick={() => setCurrentView('shop')}
          className="px-5 py-2.5 bg-zinc-950 text-white font-bold rounded-full text-xs font-mono"
        >
          Browse All Collections
        </button>
      </div>
    );
  }

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRazorpayOpen(true);
  };

  const handlePaymentSuccess = ({ method }: { paymentId: string; method: string }) => {
    setIsRazorpayOpen(false);
    createOrder({
      customerName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      items: [...cart],
      subtotal: cartSubtotal,
      shippingFee,
      discount: 0,
      gstAmount: gstBreakdown.totalGst,
      total: totalAmount,
      paymentMethod: method as any,
      paymentStatus: 'Paid',
      status: 'Ordered',
      courier: 'Shiprocket Surface Priority',
      estimatedDelivery: 'Within 24-48 Hours (Tamil Nadu Express)',
      gstin: gstin.trim() || undefined,
    });
    setCurrentView('order-success');
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={() => setCurrentView('shop')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-950 mb-6 transition-colors bg-white px-3.5 py-1.5 rounded-full border border-zinc-200 shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Continue Shopping</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Member Login Prompt Banner */}
          {!currentUser ? (
            <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="text-xs">
                <span className="font-bold text-zinc-950 font-serif">Already an AXDORO Circle Member?</span>
                <p className="text-zinc-600 text-[11px] mt-0.5">
                  Sign in with <strong>Mobile, WhatsApp, or Email OTP</strong> to access saved addresses and 1-tap checkout.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider shrink-0 shadow-xs transition-colors"
              >
                Sign In Now →
              </button>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="text-xs">
                <span className="font-bold text-emerald-950 font-serif flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Signed in as {currentUser.name} ({currentUser.tier})
                </span>
                <p className="text-emerald-800 text-[11px] mt-0.5 font-mono">
                  +91 {currentUser.phone} • {currentUser.loyaltyPoints} Rewards Points Available
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleStartPayment} className="space-y-6">
            {/* Step 1: Customer Contact */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <h3 className="text-sm font-bold text-zinc-950 font-mono uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xs font-mono">
                    1
                  </span>
                  Customer Information
                </h3>
                <span className="text-[11px] text-zinc-500 font-mono">WhatsApp Updates</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-600 uppercase mb-1.5 font-semibold">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 focus:border-zinc-950 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none transition-colors"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-600 uppercase mb-1.5 font-semibold">
                    WhatsApp Phone Number *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-zinc-300 bg-zinc-100 text-xs font-mono text-zinc-600">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 focus:border-zinc-950 focus:bg-white rounded-r-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none font-mono transition-colors"
                      placeholder="9876543210"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-zinc-600 uppercase mb-1.5 font-semibold">
                    Email Address (For Tax Invoice) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 focus:border-zinc-950 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none transition-colors"
                    placeholder="name@domain.com"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Tamil Nadu Delivery Address */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <h3 className="text-sm font-bold text-zinc-950 font-mono uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xs font-mono">
                    2
                  </span>
                  Shipping & Delivery Address
                </h3>
                <span className="text-[11px] text-emerald-700 font-mono font-bold flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> Free Express TN
                </span>
              </div>

              <div className="space-y-4">
                {currentUser && currentUser.addresses.length > 0 && (
                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
                    <span className="text-[10px] uppercase font-mono font-bold text-zinc-500">
                      1-Tap Delivery Address:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {currentUser.addresses.map((addr) => (
                        <button
                          type="button"
                          key={addr.id}
                          onClick={() => {
                            setAddress(addr.street);
                            setCity(addr.city);
                            setPincode(addr.pincode);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono text-left transition-all ${
                            address === addr.street
                              ? 'bg-zinc-950 text-white font-bold shadow-xs'
                              : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                          }`}
                        >
                          <strong>[{addr.label}]</strong> {addr.street.slice(0, 22)}... ({addr.city})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono text-zinc-600 uppercase mb-1.5 font-semibold">
                    House / Flat No., Street, Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 focus:border-zinc-950 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none transition-colors"
                    placeholder="e.g. 42, 2nd Main Road, Anna Nagar West"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-600 uppercase mb-1.5 font-semibold">
                      District / City *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 focus:border-zinc-950 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none cursor-pointer font-medium"
                    >
                      {TN_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-600 uppercase mb-1.5 font-semibold">
                      State
                    </label>
                    <input
                      type="text"
                      disabled
                      value={state}
                      className="w-full bg-zinc-100 border border-zinc-200 text-xs text-zinc-500 rounded-xl px-3.5 py-2.5 font-mono cursor-not-allowed font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-600 uppercase mb-1.5 font-semibold">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 focus:border-zinc-950 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none font-mono"
                      placeholder="600040"
                    />
                  </div>
                </div>

                {/* Optional GSTIN for Business Buyers */}
                <div className="pt-2 border-t border-zinc-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono text-zinc-600 uppercase flex items-center gap-1.5 font-semibold">
                      <Building className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Company GSTIN (Optional - for B2B input tax credit)</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    maxLength={15}
                    className="w-full bg-zinc-50 border border-zinc-300 focus:border-zinc-950 focus:bg-white rounded-xl px-3.5 py-2 text-xs text-zinc-900 focus:outline-none font-mono uppercase"
                    placeholder="33AAAAA0000A1Z5"
                  />
                </div>
              </div>
            </div>

            {/* Courier Selection (Shiprocket) */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-950">
                  <Truck className="w-4 h-4 text-amber-600" />
                  <span>Fulfillment via Shiprocket Express</span>
                </div>
                <span className="text-xs font-mono text-emerald-700 font-bold">FREE DELIVERY</span>
              </div>
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-zinc-800">
                <div>
                  <div className="font-bold text-zinc-950">
                    Tamil Nadu Priority Courier (BlueDart / Delhivery)
                  </div>
                  <div className="text-[11px] text-zinc-600 mt-0.5">
                    Estimated Delivery: 24 to 48 Hours with live SMS & WhatsApp tracking
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              </div>
            </div>

            {/* 3D 360° Spin Fit & Weather Suitability Check Card */}
            <div className={`p-5 rounded-2xl border transition-all shadow-xs space-y-3 ${
              isFitVerified 
                ? 'bg-emerald-50/40 border-emerald-300' 
                : 'bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-white border-amber-400/40'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-zinc-950 text-amber-400 flex items-center justify-center font-bold text-xs">
                      3D
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold font-mono uppercase tracking-wide text-zinc-950">
                      360° Spin Fit & Climate Suitability
                    </h3>
                    {isFitVerified ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                        ✓ Verified Match
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-900 font-bold border border-amber-400/30 animate-pulse">
                        Recommended Check
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-600 max-w-md leading-relaxed">
                    Rotate your 3D avatar in 360° orbit wearing this drop. Verified for <strong>{city}</strong> ({weather.tempC}°C, {weather.condition}).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIs3DSpinFitOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm hover:scale-[1.02] cursor-pointer shrink-0"
                >
                  <RotateCw className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                  <span>{isFitVerified ? 'Review 360° Fit' : 'Launch 3D 360° Spin'}</span>
                </button>
              </div>

              {/* Mini Climate & Spec Bar */}
              <div className="pt-3 border-t border-zinc-200/70 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono text-zinc-600">
                <div className="flex items-center gap-1.5">
                  <CloudSun className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{city}: <strong>{weather.tempC}°C ({weather.suitabilityScore}%)</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Anti-Cling: <strong>100% Breathable</strong></span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 col-span-1">
                  <Camera className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span>4-Angle Body Scan Ready</span>
                </div>
              </div>
            </div>

            {/* Submit & Launch Razorpay */}
            <button
              type="submit"
              className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-black py-4 px-6 rounded-2xl text-sm transition-all shadow-xl shadow-zinc-950/15 font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Proceed to Pay {formatINR(totalAmount)} with Razorpay</span>
            </button>
          </form>
        </div>

        {/* Right Summary Sidebar (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 sm:p-6 space-y-5 sticky top-28 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-950 font-mono uppercase tracking-wider pb-3 border-b border-zinc-100">
              Order Summary ({cart.length} Drops)
            </h3>

            {/* Items Mini List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-14 object-cover rounded-lg bg-zinc-100 border border-zinc-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-zinc-900 truncate">
                      {item.product.name}
                    </h4>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      Size: {item.selectedSize} | Qty: {item.quantity} | {item.product.gsm} GSM
                    </div>
                  </div>
                  <div className="text-xs font-mono font-bold text-zinc-950">
                    {formatINR(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Cost & Tax Breakdown */}
            <div className="pt-4 border-t border-zinc-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-zinc-600">
                <span>Items Subtotal</span>
                <span className="font-mono text-zinc-900 font-medium">{formatINR(cartSubtotal)}</span>
              </div>

              <div className="flex items-center justify-between text-zinc-600">
                <span>Taxable Value</span>
                <span className="font-mono text-zinc-900">
                  {formatINR(gstBreakdown.taxableAmount)}
                </span>
              </div>

              {/* GST Breakdown */}
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1 text-[11px] font-mono">
                <div className="flex items-center justify-between text-zinc-600">
                  <span>Intra-State CGST (2.5%)</span>
                  <span className="text-zinc-900">{formatINR(gstBreakdown.cgstAmount)}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-600">
                  <span>Intra-State SGST (2.5%)</span>
                  <span className="text-zinc-900">{formatINR(gstBreakdown.sgstAmount)}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-500 text-[10px]">
                  <span>HSN: 61091000 (Cotton Knitted)</span>
                  <span className="text-emerald-700 font-bold">Taxes Included</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-zinc-600">
                <span>Shiprocket Express (Tamil Nadu)</span>
                <span className="font-mono text-emerald-700 font-bold">FREE</span>
              </div>

              <div className="pt-3 border-t border-zinc-200 flex items-center justify-between text-base font-black text-zinc-950">
                <span>Grand Total</span>
                <span className="font-mono text-xl text-zinc-950">{formatINR(totalAmount)}</span>
              </div>
            </div>

            {/* Guarantee Badge */}
            <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center gap-3 text-xs text-zinc-600">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <strong className="text-zinc-900">AXDORO Quality Guaranteed</strong>
                <p className="text-[11px] text-zinc-500">240 GSM genuine combed cotton with 7-day size exchange.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Gateway Modal */}
      <RazorpayModal
        isOpen={isRazorpayOpen}
        amount={totalAmount}
        orderId={`AXD-ORD-${Math.floor(1000 + Math.random() * 9000)}`}
        customerName={customerName}
        customerPhone={phone}
        customerEmail={email}
        onSuccess={handlePaymentSuccess}
        onClose={() => setIsRazorpayOpen(false)}
      />

      {/* 3D 360° Fit & Weather Suitability Check Modal */}
      <Checkout3DSpinFitModal
        isOpen={is3DSpinFitOpen}
        onClose={() => setIs3DSpinFitOpen(false)}
        onConfirmAndPay={() => {
          setIs3DSpinFitOpen(false);
          setIsFitVerified(true);
          setIsRazorpayOpen(true);
        }}
        selectedCity={city}
      />
    </div>
  );
};
