import React, { useState } from 'react';
import { X, Package, MessageCircle, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getWhatsAppBulkEnquiryUrl } from '../../utils/whatsapp';

export const BulkOrderModal: React.FC = () => {
  const { isBulkOrderOpen, setIsBulkOrderOpen, showToast } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [companyOrCollege, setCompanyOrCollege] = useState('');
  const [quantity, setQuantity] = useState(50);
  const [fitType, setFitType] = useState<'240 GSM Oversized' | '240 GSM Regular Half-Sleeve'>(
    '240 GSM Oversized'
  );
  const [printType, setPrintType] = useState<
    'High-Density Screen Print' | 'Puff Print' | 'DTF Print' | 'Embroidery'
  >('High-Density Screen Print');
  const [notes, setNotes] = useState('');

  if (!isBulkOrderOpen) return null;

  const handleSubmitWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      showToast('Please enter your name and contact number', 'error');
      return;
    }

    const url = getWhatsAppBulkEnquiryUrl({
      name,
      phone,
      companyOrCollege,
      quantity,
      fitType,
      printType,
      notes,
    });

    showToast('Redirecting to WhatsApp with your enquiry specs...', 'success');
    window.open(url, '_blank');
    setIsBulkOrderOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl my-8 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold text-base">Bulk & Custom 240 GSM Apparel</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                  B2B DIRECT
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Direct manufacturing in Tiruppur for brands, tech startups, and colleges.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBulkOrderOpen(false)}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitWhatsApp} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Arjun Dev"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                WhatsApp Phone *
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                Company / Brand / College Name
              </label>
              <input
                type="text"
                value={companyOrCollege}
                onChange={(e) => setCompanyOrCollege(e.target.value)}
                placeholder="e.g. IIT Madras Tech Fest / SaaS Startup"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            {/* Quantity Slider */}
            <div className="sm:col-span-2 space-y-1.5 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-zinc-400 uppercase">Estimated Quantity:</span>
                <span className="font-mono text-amber-400 font-bold text-sm">{quantity} Pieces</span>
              </div>
              <input
                type="range"
                min={25}
                max={1000}
                step={25}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>MOQ: 25 pcs</span>
                <span>Wholesale Slab: 100+</span>
                <span>Bulk: 500+</span>
                <span>1000+</span>
              </div>
            </div>

            {/* Fit Silhouette */}
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                Fit Silhouette
              </label>
              <select
                value={fitType}
                onChange={(e) => setFitType(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="240 GSM Oversized">240 GSM Oversized Drop-Shoulder</option>
                <option value="240 GSM Regular Half-Sleeve">240 GSM Regular Boxy Half-Sleeve</option>
              </select>
            </div>

            {/* Printing Style */}
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                Print Technique
              </label>
              <select
                value={printType}
                onChange={(e) => setPrintType(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="High-Density Screen Print">High-Density Screen Print</option>
                <option value="Puff Print">3D Tactile Puff Print</option>
                <option value="DTF Print">Direct-To-Film (DTF) Multi-color</option>
                <option value="Embroidery">Precision Japanese Embroidery</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                Design Description & Placement Notes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Front chest logo + oversized back typography graphic..."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black py-3.5 px-4 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 font-mono uppercase tracking-wider"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send Enquiry to WhatsApp B2B Desk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
