import React, { useState } from 'react';
import { Truck, Sparkles, MessageCircle, X } from 'lucide-react';
import { getWhatsAppSupportUrl } from '../../utils/whatsapp';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-zinc-950 text-zinc-100 text-xs py-2.5 px-4 relative overflow-hidden border-b border-zinc-900 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="bg-amber-400 text-zinc-950 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3" /> 240 GSM Luxury Heavyweight
          </span>
          <span className="hidden sm:inline text-zinc-300 font-medium text-[11px]">
            Engineered drop-shoulder luxury apparel crafted in Tamil Nadu
          </span>
        </div>

        <div className="flex items-center gap-5 text-[11px]">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            <span>
              <strong className="text-white">Free Express Shipping</strong> across Tamil Nadu
            </span>
          </div>

          <a
            href={getWhatsAppSupportUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">WhatsApp Order Assist</span>
          </a>

          <button
            onClick={() => setIsVisible(false)}
            className="text-zinc-400 hover:text-white transition-colors ml-1"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
