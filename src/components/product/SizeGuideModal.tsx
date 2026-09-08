import React, { useState } from 'react';
import { X, Ruler, Check, Info } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SizeRow {
  size: string;
  chest: number; // inches
  length: number;
  shoulder: number;
  sleeve: number;
}

const SIZE_DATA_INCHES: SizeRow[] = [
  { size: 'XS', chest: 40, length: 27.5, shoulder: 20.5, sleeve: 9.0 },
  { size: 'S', chest: 42, length: 28.5, shoulder: 21.5, sleeve: 9.5 },
  { size: 'M', chest: 44, length: 29.5, shoulder: 22.5, sleeve: 10.0 },
  { size: 'L', chest: 46, length: 30.5, shoulder: 23.5, sleeve: 10.5 },
  { size: 'XL', chest: 48, length: 31.5, shoulder: 24.5, sleeve: 11.0 },
  { size: 'XXL', chest: 50, length: 32.5, shoulder: 25.5, sleeve: 11.5 },
];

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  if (!isOpen) return null;

  const convert = (val: number) => {
    return unit === 'cm' ? (val * 2.54).toFixed(1) : val.toString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">240 GSM Oversized Fit Guide</h3>
              <p className="text-xs text-zinc-400">Accurate garment measurements for sizes XS to XXL</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Unit Toggle & Note */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Info className="w-4 h-4 text-amber-400" />
              <span>Garment laid flat. Oversized by design.</span>
            </div>

            <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-1 text-xs">
              <button
                onClick={() => setUnit('in')}
                className={`px-3 py-1 rounded font-medium transition-colors ${
                  unit === 'in' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Inches
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 rounded font-medium transition-colors ${
                  unit === 'cm' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Centimeters
              </button>
            </div>
          </div>

          {/* Sizing Table */}
          <div className="border border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-300 font-mono border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Chest ({unit})</th>
                  <th className="py-3 px-4">Length ({unit})</th>
                  <th className="py-3 px-4">Shoulder ({unit})</th>
                  <th className="py-3 px-4">Sleeve ({unit})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 font-mono text-zinc-300">
                {SIZE_DATA_INCHES.map((row) => (
                  <tr key={row.size} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400/80"></span>
                      {row.size}
                    </td>
                    <td className="py-3 px-4">{convert(row.chest)}</td>
                    <td className="py-3 px-4">{convert(row.length)}</td>
                    <td className="py-3 px-4">{convert(row.shoulder)}</td>
                    <td className="py-3 px-4">{convert(row.sleeve)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Fit Recommendations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1">
              <h4 className="font-semibold text-white flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                For True Oversized Look
              </h4>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Order your regular t-shirt size. Our pattern is already scaled +2 sizes in chest and shoulder width for the authentic heavyweight drape.
              </p>
            </div>

            <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1">
              <h4 className="font-semibold text-white flex items-center gap-1.5">
                <Check className="w-4 h-4 text-amber-400" />
                For Regular / Boxy Fit
              </h4>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                If you prefer a closer chest fit with moderate shoulder drop, size down by one (e.g. if you normally wear L, choose M).
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
