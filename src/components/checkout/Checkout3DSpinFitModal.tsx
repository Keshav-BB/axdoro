import React, { useState, useRef, useEffect } from 'react';
import {
  RotateCw,
  Play,
  Pause,
  CloudSun,
  Thermometer,
  Droplets,
  Wind,
  ShieldCheck,
  Sparkles,
  Camera,
  Upload,
  CheckCircle2,
  X,
  ArrowRight,
  User,
  Sliders,
  Check,
  MapPin,
  HelpCircle,
  Zap
} from 'lucide-react';
import { CartItem, TShirtSize } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/currency';
import { getDistrictWeather, DistrictWeather, TN_WEATHER_DATA } from '../../data/weatherData';

interface Checkout3DSpinFitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmAndPay: () => void;
  selectedCity: string;
}

interface PhotoSlot {
  label: string;
  angle: string;
  previewUrl: string;
}

interface BodyPreset {
  id: string;
  name: string;
  height: string;
  weight: string;
  chest: string;
  recommendedSize: TShirtSize;
  photos: PhotoSlot[];
}

const BODY_PRESETS: BodyPreset[] = [
  {
    id: 'karthik',
    name: 'Karthik S. (Athletic)',
    height: "5'11\" (180 cm)",
    weight: '78 kg',
    chest: '41.5"',
    recommendedSize: 'L',
    photos: [
      {
        label: 'Front View',
        angle: '0° Front',
        previewUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      },
      {
        label: 'Side Profile',
        angle: '90° Side',
        previewUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      },
      {
        label: '45° Angle',
        angle: '45° Semi',
        previewUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80',
      },
      {
        label: 'Back Slope',
        angle: '180° Back',
        previewUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
  {
    id: 'vignesh',
    name: 'Vignesh M. (Tall Broad)',
    height: "6'2\" (188 cm)",
    weight: '86 kg',
    chest: '44"',
    recommendedSize: 'XL',
    photos: [
      {
        label: 'Front View',
        angle: '0° Front',
        previewUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      },
      {
        label: 'Side Profile',
        angle: '90° Side',
        previewUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
      },
      {
        label: '45° Angle',
        angle: '45° Semi',
        previewUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
      },
      {
        label: 'Back Slope',
        angle: '180° Back',
        previewUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
  {
    id: 'ananya',
    name: 'Ananya R. (Relaxed Street)',
    height: "5'7\" (170 cm)",
    weight: '62 kg',
    chest: '36.5"',
    recommendedSize: 'M',
    photos: [
      {
        label: 'Front View',
        angle: '0° Front',
        previewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      },
      {
        label: 'Side Profile',
        angle: '90° Side',
        previewUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      },
      {
        label: '45° Angle',
        angle: '45° Semi',
        previewUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
      },
      {
        label: 'Back Slope',
        angle: '180° Back',
        previewUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
];

export const Checkout3DSpinFitModal: React.FC<Checkout3DSpinFitModalProps> = ({
  isOpen,
  onClose,
  onConfirmAndPay,
  selectedCity,
}) => {
  const { cart, updateCartItemSize, showToast } = useStore();

  const [activeCartIndex, setActiveCartIndex] = useState(0);
  const activeItem: CartItem | undefined = cart[activeCartIndex] || cart[0];

  const [selectedPreset, setSelectedPreset] = useState<BodyPreset>(BODY_PRESETS[0]);
  const [currentDistrict, setCurrentDistrict] = useState(selectedCity || 'Chennai');
  const [customPhotos, setCustomPhotos] = useState<string[]>([]);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [viewPerspective, setViewPerspective] = useState<'garment' | 'avatar'>('garment');
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const startXRef = useRef<number>(0);
  const autoSpinTimerRef = useRef<number | null>(null);

  // Sync city when prop changes
  useEffect(() => {
    if (selectedCity) {
      setCurrentDistrict(selectedCity);
    }
  }, [selectedCity]);

  // Spin images: 8 frames for smooth 360° orbit
  const activeProduct = activeItem?.product;
  const rawSpinFrames = activeProduct?.spinImages && activeProduct.spinImages.length >= 4
    ? activeProduct.spinImages
    : activeProduct?.images || [];
  
  // Extend to 8 frames around 360
  const spinFrames = [
    rawSpinFrames[0] || 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    rawSpinFrames[1] || rawSpinFrames[0],
    rawSpinFrames[2] || rawSpinFrames[1] || rawSpinFrames[0],
    rawSpinFrames[3] || rawSpinFrames[0],
    rawSpinFrames[1] || rawSpinFrames[0],
    rawSpinFrames[2] || rawSpinFrames[0],
    rawSpinFrames[0],
    rawSpinFrames[1] || rawSpinFrames[0],
  ];
  const totalFrames = spinFrames.length;

  // Auto-spin timer
  useEffect(() => {
    if (isAutoSpinning) {
      autoSpinTimerRef.current = window.setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % totalFrames);
      }, 750);
    } else {
      if (autoSpinTimerRef.current) clearInterval(autoSpinTimerRef.current);
    }
    return () => {
      if (autoSpinTimerRef.current) clearInterval(autoSpinTimerRef.current);
    };
  }, [isAutoSpinning, totalFrames]);

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !activeItem) return null;

  const weather = getDistrictWeather(currentDistrict);
  const currentAngle = Math.round((currentFrame / totalFrames) * 360);

  // Mouse Drag to Orbit
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    setIsAutoSpinning(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diffX = e.clientX - startXRef.current;
    if (Math.abs(diffX) > 20) {
      if (diffX > 0) {
        setCurrentFrame((prev) => (prev - 1 + totalFrames) % totalFrames);
      } else {
        setCurrentFrame((prev) => (prev + 1) % totalFrames);
      }
      startXRef.current = e.clientX;
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch Drag to Orbit
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX;
    setIsAutoSpinning(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diffX = e.touches[0].clientX - startXRef.current;
    if (Math.abs(diffX) > 18) {
      if (diffX > 0) {
        setCurrentFrame((prev) => (prev - 1 + totalFrames) % totalFrames);
      } else {
        setCurrentFrame((prev) => (prev + 1) % totalFrames);
      }
      startXRef.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Upload custom photo handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsScanning(true);
      const newUrls = Array.from(files).map((f) => URL.createObjectURL(f));
      setTimeout(() => {
        setCustomPhotos((prev) => [...newUrls, ...prev].slice(0, 4));
        setIsScanning(false);
        showToast('Processed multi-angle photos: Biometrics calibrated!', 'success');
      }, 1100);
    }
  };

  // Change size right from 360 fit check
  const handleSizeChange = (newSize: TShirtSize) => {
    updateCartItemSize(activeItem.id, newSize);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-[#faf9f6] border border-zinc-200 rounded-3xl w-full max-w-6xl overflow-hidden shadow-2xl flex flex-col max-h-[94vh] animate-scaleUp text-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-950 text-amber-400 flex items-center justify-center font-serif text-lg font-bold shadow-md">
              AX
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-900 border border-amber-400/30 uppercase tracking-widest">
                  AI Fit & Climate Engine
                </span>
                <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">• 240 GSM Architectural Drape</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-zinc-950 tracking-tight">
                3D 360° Personal Avatar & Climate Suitability
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Garment Selector Tabs (if multiple items in bag) */}
        {cart.length > 1 && (
          <div className="bg-zinc-100 px-6 py-2 border-b border-zinc-200 flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider shrink-0">
              Checking Item ({activeCartIndex + 1}/{cart.length}):
            </span>
            {cart.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveCartIndex(idx)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 shrink-0 ${
                  activeCartIndex === idx
                    ? 'bg-zinc-950 text-white font-bold shadow-xs'
                    : 'bg-white text-zinc-700 hover:bg-zinc-200 border border-zinc-200'
                }`}
              >
                <span>{item.product.name.slice(0, 18)}...</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-amber-400/20 text-amber-400 font-semibold">
                  {item.selectedSize}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Modal Scrollable Workspace */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* COLUMN 1: Multi-Photo Scan & Customer Profile (3 Cols) */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-900 uppercase">
                    <Camera className="w-4 h-4 text-amber-600" />
                    <span>Multi-Photo Scan</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 font-mono px-2 py-0.5 rounded-full font-bold">
                    4 Angles
                  </span>
                </div>

                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Our AI scans 4 perspective angles to construct your personalized 3D avatar & predict garment fall.
                </p>

                {/* Preset Profiles Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold">
                    Quick Sample Profiles:
                  </label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {BODY_PRESETS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedPreset(p);
                          setCustomPhotos([]);
                          showToast(`Loaded ${p.name} multi-photo profile`, 'info');
                        }}
                        className={`text-left px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center justify-between border ${
                          selectedPreset.id === p.id && customPhotos.length === 0
                            ? 'bg-amber-400/10 border-amber-400 text-zinc-950 font-bold'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                        }`}
                      >
                        <div>
                          <div>{p.name}</div>
                          <div className="text-[10px] text-zinc-400">{p.height} • {p.weight}</div>
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-800">
                          {p.recommendedSize}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4 Angle Photo Slots Display */}
                <div className="space-y-1.5 pt-2 border-t border-zinc-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase">Angle Photos</span>
                    <label className="cursor-pointer text-[10px] font-mono text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Upload Yours</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {selectedPreset.photos.map((photo, i) => (
                      <div
                        key={i}
                        className="relative rounded-xl overflow-hidden border border-zinc-200 aspect-3/4 bg-zinc-100 group"
                      >
                        <img
                          src={customPhotos[i] || photo.previewUrl}
                          alt={photo.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-1.5">
                          <span className="text-[9px] font-mono text-white font-bold">{photo.angle}</span>
                          <span className="text-[8px] text-zinc-300">{photo.label}</span>
                        </div>
                        <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] shadow-xs">
                          ✓
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scanned Biometric Indicators */}
                <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between text-zinc-500">
                    <span>Chest Breadth:</span>
                    <span className="text-zinc-900 font-bold">{selectedPreset.chest}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Shoulder Fall:</span>
                    <span className="text-zinc-900 font-bold">2.5" Drop</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Collar Stature:</span>
                    <span className="text-zinc-900 font-bold">Flush / Non-Sag</span>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: 3D 360° Interactive Drag Orbit Viewer (5 Cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-zinc-200 shadow-sm relative flex flex-col items-center">
                
                {/* 360 Header Bar */}
                <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-zinc-100 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-zinc-800 font-bold">
                    <RotateCw className="w-4 h-4 text-amber-600 animate-spin-slow" />
                    <span>360° ROTATION: {currentAngle}°</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View mode toggle */}
                    <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setViewPerspective('garment')}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold transition-all ${
                          viewPerspective === 'garment'
                            ? 'bg-white text-zinc-950 shadow-xs'
                            : 'text-zinc-500 hover:text-zinc-950'
                        }`}
                      >
                        Garment
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewPerspective('avatar')}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold transition-all ${
                          viewPerspective === 'avatar'
                            ? 'bg-white text-zinc-950 shadow-xs'
                            : 'text-zinc-500 hover:text-zinc-950'
                        }`}
                      >
                        Avatar
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAutoSpinning(!isAutoSpinning)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-all ${
                        isAutoSpinning
                          ? 'bg-amber-400 text-zinc-950 shadow-xs'
                          : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                      }`}
                    >
                      {isAutoSpinning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      <span>{isAutoSpinning ? 'Pause' : 'Orbit'}</span>
                    </button>
                  </div>
                </div>

                {/* 360 Interactive Canvas Container */}
                <div
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className="relative w-full aspect-square max-w-[420px] rounded-2xl overflow-hidden bg-gradient-to-b from-zinc-50 to-zinc-100 border border-zinc-200/80 cursor-grab active:cursor-grabbing select-none flex items-center justify-center shadow-inner"
                >
                  <img
                    src={
                      viewPerspective === 'avatar'
                        ? selectedPreset.photos[
                            currentFrame < 2 ? 0 : currentFrame < 4 ? 1 : currentFrame < 6 ? 2 : 3
                          ]?.previewUrl || spinFrames[currentFrame]
                        : spinFrames[currentFrame]
                    }
                    alt={`360 angle view ${currentAngle} degrees`}
                    className="w-full h-full object-contain p-4 drop-shadow-xl transition-all duration-75 pointer-events-none"
                  />

                  {/* Drape Anatomical Hotspots */}
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md text-white text-[10px] font-mono border border-amber-400/40 shadow-lg flex items-center gap-1 pointer-events-none">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></div>
                    <span>
                      {activeProduct?.category === 'hoodies'
                        ? 'Double-Layer Upright Hood'
                        : activeProduct?.category === 'shirts'
                        ? 'Crisp Structured Collar'
                        : activeProduct?.category === 'pants' || activeProduct?.category === 'trousers'
                        ? 'Pleated Contour Waist'
                        : activeProduct?.category === 'shorts'
                        ? 'Elastic Drawcord Waist'
                        : '1.25" Non-Sag Collar'}
                    </span>
                  </div>

                  <div className="absolute top-28 left-6 px-2.5 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md text-white text-[10px] font-mono border border-amber-400/40 shadow-lg flex items-center gap-1 pointer-events-none">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                    <span>
                      {activeProduct?.category === 'pants' || activeProduct?.category === 'track-pants'
                        ? 'Ergonomic Articulated Knee'
                        : activeProduct?.category === 'shorts'
                        ? '7-Inch Above-Knee Inseam'
                        : activeProduct?.category === 'trousers'
                        ? 'Tailored Wide-Leg Cut'
                        : 'Drop-Shoulder Silhouette'}
                    </span>
                  </div>

                  <div className="absolute bottom-16 right-6 px-2.5 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md text-white text-[10px] font-mono border border-amber-400/40 shadow-lg flex items-center gap-1 pointer-events-none">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                    <span>{`${activeProduct?.gsm || 240} GSM Heavy Fall`}</span>
                  </div>

                  {/* Drag Prompt overlay */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono flex items-center gap-1.5 pointer-events-none">
                    <RotateCw className="w-3 h-3 text-amber-400 animate-spin-slow" />
                    <span>Drag horizontally or use slider below</span>
                  </div>
                </div>

                {/* Scrub Slider */}
                <div className="w-full pt-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-zinc-400 font-bold">0° FRONT</span>
                    <input
                      type="range"
                      min={0}
                      max={totalFrames - 1}
                      value={currentFrame}
                      onChange={(e) => {
                        setIsAutoSpinning(false);
                        setCurrentFrame(Number(e.target.value));
                      }}
                      className="w-full accent-amber-500 cursor-pointer h-1.5 bg-zinc-200 rounded-lg appearance-none"
                    />
                    <span className="text-[10px] font-mono text-zinc-400 font-bold">360°</span>
                  </div>

                  {/* Quick Angle Snap Buttons */}
                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    {[
                      { label: '0° Front', frame: 0 },
                      { label: '90° Side', frame: Math.floor(totalFrames * 0.25) },
                      { label: '180° Back', frame: Math.floor(totalFrames * 0.5) },
                      { label: '270° Left', frame: Math.floor(totalFrames * 0.75) },
                    ].map((btn) => (
                      <button
                        key={btn.label}
                        type="button"
                        onClick={() => {
                          setIsAutoSpinning(false);
                          setCurrentFrame(btn.frame);
                        }}
                        className={`py-1 rounded-lg text-[10px] font-mono transition-all border ${
                          currentFrame === btn.frame
                            ? 'bg-zinc-950 text-white font-bold border-zinc-950'
                            : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border-zinc-200'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 3: Weather Suitability & Climate Comfort Matrix (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Climate Card */}
              <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <CloudSun className="w-5 h-5 text-amber-500" />
                    <div>
                      <h3 className="font-serif font-bold text-sm text-zinc-950">
                        Climate Suitability
                      </h3>
                      <div className="text-[10px] font-mono text-zinc-400">
                        Tamil Nadu Regional Index
                      </div>
                    </div>
                  </div>

                  {/* District Switcher */}
                  <select
                    value={currentDistrict}
                    onChange={(e) => setCurrentDistrict(e.target.value)}
                    className="text-xs font-mono font-bold bg-zinc-50 border border-zinc-300 rounded-lg px-2.5 py-1 text-zinc-900 focus:outline-none cursor-pointer"
                  >
                    {Object.keys(TN_WEATHER_DATA).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Weather Vitals */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                    <Thermometer className="w-3.5 h-3.5 text-amber-600 mx-auto mb-0.5" />
                    <div className="text-sm font-bold font-mono text-zinc-900">{weather.tempC}°C</div>
                    <div className="text-[9px] font-mono text-zinc-400 uppercase">Ambient</div>
                  </div>

                  <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                    <Droplets className="w-3.5 h-3.5 text-blue-500 mx-auto mb-0.5" />
                    <div className="text-sm font-bold font-mono text-zinc-900">{weather.humidity}%</div>
                    <div className="text-[9px] font-mono text-zinc-400 uppercase">Humidity</div>
                  </div>

                  <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                    <Wind className="w-3.5 h-3.5 text-teal-600 mx-auto mb-0.5" />
                    <div className="text-sm font-bold font-mono text-zinc-900">{weather.windSpeedKmH} km/h</div>
                    <div className="text-[9px] font-mono text-zinc-400 uppercase">Breeze</div>
                  </div>
                </div>

                {/* Suitability Score Callout */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-300/40 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-mono text-emerald-800 font-bold uppercase tracking-wider">
                      240 GSM Fabric Comfort Score
                    </div>
                    <div className="text-xs text-zinc-700">
                      {weather.condition}
                    </div>
                  </div>
                  <div className="text-xl font-mono font-black text-emerald-700">
                    {weather.suitabilityScore}%
                  </div>
                </div>

                {/* Scientific Comfort Rationale */}
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-zinc-800 space-y-1">
                    <div className="font-bold font-mono text-[11px] text-amber-950 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Why 240 GSM suits {weather.district}:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-zinc-700">
                      {weather.thermalAdvice}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-700 text-[11px] leading-relaxed">
                    <strong>Zero-Cling Guarantee:</strong> {weather.drapeAdvantage}
                  </div>
                </div>

                {/* Technical Specs List */}
                <div className="space-y-1.5 pt-2 border-t border-zinc-100 text-[10px] font-mono text-zinc-500">
                  <div className="flex justify-between">
                    <span>Air Permeability:</span>
                    <span className="text-zinc-800 font-bold">{weather.airPermeability}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Solar Shielding:</span>
                    <span className="text-zinc-800 font-bold">{weather.uvProtection}</span>
                  </div>
                </div>
              </div>

              {/* In-Modal Size Adjuster */}
              <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-900 uppercase">
                    Select Fitted Size
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    Recommended: {selectedPreset.recommendedSize}
                  </span>
                </div>

                <div className="grid grid-cols-6 gap-1">
                  {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as TShirtSize[]).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeChange(size)}
                      className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                        activeItem.selectedSize === size
                          ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs scale-105'
                          : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <p className="text-[10px] text-zinc-400 font-mono">
                  Currently ordering size <strong className="text-zinc-900">{activeItem.selectedSize}</strong>. Changing size updates your checkout cart automatically.
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* Modal Bottom Sticky Confirmation Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 bg-white/95 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-zinc-950">
                Fit & Climate Verified for {currentDistrict}
              </div>
              <div className="text-[11px] text-zinc-500">
                Size {activeItem.selectedSize} • Zero Body Cling • Free 7-Day Exchange Guaranteed
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-zinc-300 text-xs font-mono text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              Close Studio
            </button>

            <button
              type="button"
              onClick={() => {
                onConfirmAndPay();
              }}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Confirm Fit & Proceed to Pay</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
