import React, { useState } from 'react';
import { Sparkles, Upload, CheckCircle2, User, X, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { Product, TShirtSize } from '../../types';
import { useStore } from '../../context/StoreContext';

interface AITryOnModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

interface ModelProfile {
  id: string;
  name: string;
  height: string;
  build: string;
  recommendedSize: TShirtSize;
  image: string;
  silhouette: string;
}

const SAMPLE_MODELS: ModelProfile[] = [
  {
    id: 'model-1',
    name: 'Athletic Broad',
    height: "5'11\" (180 cm)",
    build: 'Athletic / 78 kg',
    recommendedSize: 'L',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    silhouette: 'Gives structured chest drape with 3" shoulder drop.',
  },
  {
    id: 'model-2',
    name: 'Lean Minimalist',
    height: "5'8\" (173 cm)",
    build: 'Slim / 64 kg',
    recommendedSize: 'M',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    silhouette: 'Relaxed airy drape, sleeves fall nicely to elbow.',
  },
  {
    id: 'model-3',
    name: 'Tall Streetwear',
    height: "6'2\" (188 cm)",
    build: 'Tall / 84 kg',
    recommendedSize: 'XL',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    silhouette: 'Optimal hip-line coverage and expansive arm movement.',
  },
  {
    id: 'model-4',
    name: 'Relaxed Plus',
    height: "5'10\" (178 cm)",
    build: 'Broad / 95 kg',
    recommendedSize: 'XXL',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    silhouette: '240 GSM density conceals midsection lines seamlessly.',
  },
];

export const AITryOnModal: React.FC<AITryOnModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart, showToast } = useStore();
  const [selectedModel, setSelectedModel] = useState<ModelProfile>(SAMPLE_MODELS[0]);
  const [selectedSize, setSelectedSize] = useState<TShirtSize>(SAMPLE_MODELS[0].recommendedSize);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSuccess, setGeneratedSuccess] = useState(true);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulateAI = () => {
    setIsGenerating(true);
    setGeneratedSuccess(false);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedSuccess(true);
      showToast('AI Drape simulation rendered successfully!', 'success');
    }, 1400);
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomPhotoUrl(url);
      handleSimulateAI();
    }
  };

  const handleAddFittedToCart = () => {
    addToCart(product, selectedSize, product.colors[0], 1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold text-lg">AI "See The Fit" Simulator</h3>
                <span className="bg-purple-500/20 text-purple-300 text-[10px] font-mono px-2 py-0.5 rounded border border-purple-500/30 font-semibold">
                  BETA V1.0
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Visualizing <span className="text-white font-semibold">{product.name}</span> on your body frame
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-y-auto">
          {/* Left Controls (5 cols) */}
          <div className="lg:col-span-5 p-5 border-r border-zinc-800 space-y-5 bg-zinc-900/60">
            {/* Step 1: Body Model Selection */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-2.5 flex items-center justify-between">
                <span>1. Choose Body Profile</span>
                <label className="text-amber-400 hover:text-amber-300 text-[11px] cursor-pointer flex items-center gap-1 font-sans">
                  <Upload className="w-3 h-3" />
                  <span>Upload Mine</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleCustomUpload} />
                </label>
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                {SAMPLE_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model);
                      setSelectedSize(model.recommendedSize);
                      setCustomPhotoUrl(null);
                      handleSimulateAI();
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                      selectedModel.id === model.id && !customPhotoUrl
                        ? 'border-purple-500 bg-purple-500/10 shadow-sm'
                        : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                    }`}
                  >
                    <img
                      src={model.image}
                      alt={model.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{model.name}</div>
                      <div className="text-[10px] text-zinc-400">{model.height}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Size Fit Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  2. Select Size (XS - XXL)
                </label>
                <span className="text-xs text-purple-400 font-mono">
                  Recommended: <strong className="text-white">{selectedModel.recommendedSize}</strong>
                </span>
              </div>

              <div className="grid grid-cols-6 gap-1.5">
                {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as TShirtSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      handleSimulateAI();
                    }}
                    className={`py-2 rounded-lg text-xs font-mono font-bold border transition-all ${
                      selectedSize === size
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                        : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Diagnostics Box */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                AI Drape & Fabric Analysis
              </div>
              <ul className="text-[11px] text-zinc-400 space-y-1.5 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>240 GSM Fabric Density:</strong> Holds boxy silhouette without clinging to torso.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Drop Shoulder Seam:</strong> Hangs 2.8" lower than standard shoulder bone.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Collar Stability:</strong> 1.25" rib band maintains structured neckline.
                  </span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleAddFittedToCart}
              className="w-full bg-white hover:bg-zinc-200 text-zinc-950 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/10"
            >
              <span>Add Size {selectedSize} to Cart</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Render Viewport (7 cols) */}
          <div className="lg:col-span-7 bg-zinc-950 flex flex-col items-center justify-center p-6 relative min-h-[420px]">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center gap-3 text-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin"></div>
                  <Sparkles className="w-6 h-6 text-purple-400 absolute inset-0 m-auto animate-pulse" />
                </div>
                <div className="space-y-1">
                  <p className="text-white font-semibold text-sm">Simulating 240 GSM Fabric Physics...</p>
                  <p className="text-xs text-zinc-500">Mapping drop-shoulder mesh and torso contours</p>
                </div>
              </div>
            ) : generatedSuccess ? (
              <div className="relative w-full max-w-sm flex flex-col items-center">
                {/* Visual Composite Render */}
                <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900 group w-full">
                  <img
                    src={customPhotoUrl || selectedModel.image}
                    alt="Model"
                    className="w-full h-96 object-cover object-top opacity-30 group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Overlaid T-Shirt Render */}
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-80 h-80 object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] filter contrast-105 transition-all duration-300 transform scale-100 hover:scale-105"
                    />
                  </div>

                  {/* Badges on Viewport */}
                  <div className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md border border-zinc-700/60 rounded-lg px-2.5 py-1 text-[10px] font-mono text-zinc-300">
                    Size: <strong className="text-purple-400">{selectedSize} Oversized</strong>
                  </div>

                  <div className="absolute top-3 right-3 bg-purple-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow">
                    <Sparkles className="w-3 h-3" /> AI Fit: 98% Match
                  </div>

                  <div className="absolute bottom-3 inset-x-3 bg-zinc-950/90 backdrop-blur-md border border-zinc-800 rounded-xl p-2.5 text-center text-xs text-zinc-300">
                    <span className="text-amber-400 font-semibold">{selectedModel.name}: </span>
                    {selectedModel.silhouette}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={handleSimulateAI}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" /> Re-render Fit Angle
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
