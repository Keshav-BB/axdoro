import React, { useState } from 'react';
import { ShieldCheck, CreditCard, Smartphone, Building2, CheckCircle2, X, Lock, ArrowRight } from 'lucide-react';
import { formatINR } from '../../utils/currency';

interface RazorpayModalProps {
  isOpen: boolean;
  amount: number;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  onSuccess: (paymentDetails: { paymentId: string; method: string }) => void;
  onClose: () => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  amount,
  orderId,
  customerName,
  customerPhone,
  customerEmail,
  onSuccess,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('888');

  if (!isOpen) return null;

  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const randomPayId = `pay_razor_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
      const methodLabel =
        activeTab === 'upi'
          ? `Razorpay UPI (${upiApp.toUpperCase()})`
          : activeTab === 'card'
          ? 'Razorpay Card (Visa ending 4444)'
          : 'Razorpay NetBanking (HDFC)';
      onSuccess({ paymentId: randomPayId, method: methodLabel });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-white text-zinc-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-zinc-200 flex flex-col font-sans">
        {/* Razorpay Blue Header */}
        <div className="bg-[#0c2340] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-lg text-white tracking-tighter">
              R
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base leading-tight">Razorpay Secure</h3>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs text-blue-200">Paying AXDORO Apparel Co.</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-blue-300 font-mono">Amount to Pay</div>
            <div className="text-xl font-black font-mono text-white">{formatINR(amount)}</div>
          </div>
        </div>

        {/* Customer & Order Reference Bar */}
        <div className="bg-zinc-50 border-b border-zinc-200 px-4 py-2.5 flex items-center justify-between text-xs text-zinc-600 font-mono">
          <span>Ref: {orderId || 'NEW-ORDER'}</span>
          <span>{customerPhone || '9840123456'}</span>
        </div>

        {/* Modal Body: Payment Methods */}
        <div className="p-5 space-y-4">
          {/* Method Tabs */}
          <div className="grid grid-cols-3 gap-2 border-b border-zinc-200 pb-3">
            <button
              onClick={() => setActiveTab('upi')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'upi'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>UPI / QR</span>
            </button>

            <button
              onClick={() => setActiveTab('card')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'card'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Cards</span>
            </button>

            <button
              onClick={() => setActiveTab('netbanking')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'netbanking'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>NetBanking</span>
            </button>
          </div>

          {/* Active Tab View */}
          {activeTab === 'upi' && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-zinc-700">Select UPI Application:</div>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'gpay', name: 'Google Pay', badge: 'Instant' },
                  { id: 'phonepe', name: 'PhonePe', badge: 'Popular' },
                  { id: 'paytm', name: 'Paytm UPI', badge: 'Fast' },
                  { id: 'qr', name: 'Scan Any UPI QR', badge: 'Dynamic' },
                ].map((app) => (
                  <button
                    key={app.id}
                    onClick={() => setUpiApp(app.id as any)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      upiApp === app.id
                        ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-zinc-900">{app.name}</div>
                      <div className="text-[10px] text-zinc-500">{app.badge}</div>
                    </div>
                    {upiApp === app.id && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </button>
                ))}
              </div>

              {upiApp === 'qr' && (
                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-center flex-col gap-1 text-center">
                  <div className="w-24 h-24 bg-white border border-zinc-300 rounded p-1 flex items-center justify-center">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=upi://pay?pa=axdoro@razorpay&pn=AXDORO"
                      alt="UPI QR Code"
                      className="w-full h-full"
                    />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Scan using GPay, PhonePe, or Paytm
                  </span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'card' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-700">
                <span>Card Details:</span>
                <span className="text-[11px] text-blue-600 font-mono">Test Visa Auto-filled</span>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="Card Number"
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-xs font-mono focus:border-blue-600 focus:outline-none"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="border border-zinc-300 rounded-lg px-3 py-2 text-xs font-mono focus:border-blue-600 focus:outline-none"
                  />
                  <input
                    type="password"
                    value={cvv}
                    maxLength={4}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="CVV"
                    className="border border-zinc-300 rounded-lg px-3 py-2 text-xs font-mono focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'netbanking' && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-zinc-700">Popular Banks:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Tamilnad Mercantile'].map((bank) => (
                  <button
                    key={bank}
                    className="p-2.5 border border-zinc-200 rounded-lg hover:border-blue-600 text-left font-medium text-zinc-800 transition-colors"
                  >
                    {bank}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Button & Disclaimer */}
        <div className="p-5 bg-zinc-50 border-t border-zinc-200 space-y-3">
          <button
            onClick={handlePayNow}
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 font-mono"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Authorizing with Bank...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Pay {formatINR(amount)} Securely</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-[11px] text-zinc-500">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3" /> 256-bit SSL Encryption
            </span>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="text-zinc-500 hover:text-zinc-800 underline"
            >
              Cancel Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
