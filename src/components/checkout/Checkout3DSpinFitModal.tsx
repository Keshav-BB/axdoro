import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  Zap,
  Maximize2,
  Scale,
  Ruler,
  Scan
} from 'lucide-react';
import { CartItem, TShirtSize } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/currency';
import { getDistrictWeather, TN_WEATHER_DATA } from '../../data/weatherData';
import {
  calculateBiometrics,
  CalculatedBiometrics,
  BodyBuild,
  Gender,
  cmToFtIn,
} from '../../utils/bodyBiometrics';
import { PersonalAvatar3DCanvas } from './PersonalAvatar3DCanvas';

interface Checkout3DSpinFitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmAndPay: (biometrics?: CalculatedBiometrics) => void;
  selectedCity: string;
}

interface SampleProfile {
  id: string;
  name: string;
  gender: Gender;
  build: BodyBuild;
  heightCm: number;
  weightKg: number;
  photoUrl: string;
}

const SAMPLE_PROFILES: SampleProfile[] = [
  {
    id: 'karthik',
    name: 'Karthik S.',
    gender: 'male',
    build: 'athletic',
    heightCm: 180,
    weightKg: 78,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'vignesh',
    name: 'Vignesh M.',
    gender: 'male',
    build: 'muscular',
    heightCm: 188,
    weightKg: 86,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'ananya',
    name: 'Ananya R.',
    gender: 'female',
    build: 'athletic',
    heightCm: 170,
    weightKg: 62,
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'priya',
    name: 'Priya K.',
    gender: 'female',
    build: 'curvy',
    heightCm: 164,
    weightKg: 68,
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
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

  // Biometric Body Parameters
  const [heightCm, setHeightCm] = useState(178);
  const [weightKg, setWeightKg] = useState(76);
  const [gender, setGender] = useState<Gender>('male');
  const [build, setBuild] = useState<BodyBuild>('athletic');
  const [userPhotoUrl, setUserPhotoUrl] = useState<string>(SAMPLE_PROFILES[0].photoUrl);
  const [activeProfileId, setActiveProfileId] = useState<string>('karthik');

  // Interactive 3D Orbit State
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [currentDistrict, setCurrentDistrict] = useState(selectedCity || 'Chennai');
  const [viewPerspective, setViewPerspective] = useState<'avatar-3d' | 'garment-360'>('avatar-3d');

  const autoSpinTimerRef = useRef<number | null>(null);

  // Sync city when prop changes
  useEffect(() => {
    if (selectedCity) setCurrentDistrict(selectedCity);
  }, [selectedCity]);

  // ESC key listener & body scroll lock
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

  // Auto-spin timer
  useEffect(() => {
    if (isAutoSpinning) {
      autoSpinTimerRef.current = window.setInterval(() => {
        setRotationAngle((prev) => (prev + 3) % 360);
      }, 40);
    } else {
      if (autoSpinTimerRef.current) clearInterval(autoSpinTimerRef.current);
    }
    return () => {
      if (autoSpinTimerRef.current) clearInterval(autoSpinTimerRef.current);
    };
  }, [isAutoSpinning]);

  // Calculate live biometrics whenever user height, weight, gender, build, or cart size changes
  const biometrics = useMemo(() => {
    const currentSize = activeItem?.selectedSize || 'L';
    const currentCategory = activeItem?.product?.category || 't-shirts';
    return calculateBiometrics(heightCm, weightKg, gender, build, currentSize, currentCategory);
  }, [heightCm, weightKg, gender, build, activeItem?.selectedSize, activeItem?.product?.category]);

  if (!isOpen || !activeItem) return null;

  const weather = getDistrictWeather(currentDistrict);
  const activeProduct = activeItem.product;

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsScanning(true);
      const url = URL.createObjectURL(file);
      setUserPhotoUrl(url);
      setActiveProfileId('custom');
      setTimeout(() => {
        setIsScanning(false);
        showToast('Photo analyzed: 3D Body Mesh & Facial Posture Calibrated!', 'success');
      }, 1200);
    }
  };

  // Select Sample Profile
  const handleSelectSample = (sample: SampleProfile) => {
    setActiveProfileId(sample.id);
    setGender(sample.gender);
    setBuild(sample.build);
    setHeightCm(sample.heightCm);
    setWeightKg(sample.weightKg);
    setUserPhotoUrl(sample.photoUrl);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      showToast(`Loaded ${sample.name} body biometrics (${sample.heightCm}cm / ${sample.weightKg}kg)`, 'info');
    }, 450);
  };

  // Change size right from 360 fit check
  const handleSizeChange = (newSize: TShirtSize) => {
    updateCartItemSize(activeItem.id, newSize);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className="bg-[#faf9f6] border border-zinc-200 rounded-3xl w-full max-w-6xl overflow-hidden shadow-2xl flex flex-col max-h-[96vh] animate-scaleUp text-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP MODAL HEADER */}
        <div className="px-6 py-4 border-b border-zinc-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-950 text-amber-400 flex items-center justify-center font-serif text-lg font-bold shadow-md">
              3D
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-900 border border-amber-400/30 uppercase tracking-widest">
                  Biometric 3D Fitting Studio
                </span>
                <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
                  • Height / Weight / Photo Calibration
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-zinc-950 tracking-tight">
                Calculate & Inspect Your Personal 3D Fit
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

        {/* GARMENT SELECTOR (IF MULTIPLE ITEMS IN BAG) */}
        {cart.length > 1 && (
          <div className="bg-zinc-100 px-6 py-2 border-b border-zinc-200 flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider shrink-0">
              Fitting Item ({activeCartIndex + 1}/{cart.length}):
            </span>
            {cart.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveCartIndex(idx)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
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

        {/* WORKSPACE: 3-COLUMN LAYOUT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* COLUMN 1: BIOMETRIC INPUTS & PHOTO UPLOAD (3.5 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-900 uppercase">
                    <Scale className="w-4 h-4 text-amber-600" />
                    <span>1. Body Biometrics</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    BMI {biometrics.bmi} • {biometrics.bmiCategory}
                  </span>
                </div>

                {/* Quick Sample Profiles for Instant Demo */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold">
                    Quick Sample Profiles:
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {SAMPLE_PROFILES.map((sample) => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => handleSelectSample(sample)}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2 ${
                          activeProfileId === sample.id
                            ? 'bg-amber-400/10 border-amber-400 text-zinc-950 font-bold'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                        }`}
                      >
                        <img
                          src={sample.photoUrl}
                          alt={sample.name}
                          className="w-7 h-7 rounded-full object-cover border border-zinc-300 shrink-0"
                        />
                        <div className="text-[10px] font-mono truncate">
                          <div className="font-bold truncate">{sample.name}</div>
                          <div className="text-zinc-400">{sample.heightCm}cm • {sample.weightKg}kg</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload User Photo */}
                <div className="p-3 bg-zinc-50 border border-dashed border-zinc-300 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-zinc-800 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-amber-600" />
                      <span>Upload Your Photo</span>
                    </span>
                    <label className="cursor-pointer text-[10px] font-mono font-bold text-amber-700 hover:text-amber-900 bg-white border border-amber-400/40 px-2.5 py-1 rounded-lg shadow-2xs hover:bg-amber-50 transition-all flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Browse / Camera</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={userPhotoUrl}
                      alt="Uploaded avatar"
                      className="w-12 h-12 rounded-xl object-cover border border-zinc-200 shadow-xs"
                    />
                    <div className="text-[10px] font-mono text-zinc-500">
                      Photo is mapped onto your 3D avatar head in real time with 360° facial contour tracking.
                    </div>
                  </div>
                </div>

                {/* HEIGHT SLIDER */}
                <div className="space-y-1.5 pt-2 border-t border-zinc-100">
                  <div className="flex justify-between text-xs font-mono font-semibold">
                    <span className="text-zinc-500 flex items-center gap-1">
                      <Ruler className="w-3.5 h-3.5 text-zinc-400" /> Height:
                    </span>
                    <span className="text-zinc-950 font-bold">
                      {cmToFtIn(heightCm)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={145}
                    max={210}
                    value={heightCm}
                    onChange={(e) => {
                      setHeightCm(Number(e.target.value));
                      setActiveProfileId('custom');
                    }}
                    className="w-full accent-amber-500 cursor-pointer h-1.5 bg-zinc-200 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                    <span>145 cm (4'9")</span>
                    <span>175 cm (5'9")</span>
                    <span>210 cm (6'11")</span>
                  </div>
                </div>

                {/* WEIGHT SLIDER */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono font-semibold">
                    <span className="text-zinc-500 flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-zinc-400" /> Weight:
                    </span>
                    <span className="text-zinc-950 font-bold">
                      {weightKg} kg ({Math.round(weightKg * 2.20462)} lbs)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={42}
                    max={130}
                    value={weightKg}
                    onChange={(e) => {
                      setWeightKg(Number(e.target.value));
                      setActiveProfileId('custom');
                    }}
                    className="w-full accent-amber-500 cursor-pointer h-1.5 bg-zinc-200 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                    <span>42 kg</span>
                    <span>75 kg</span>
                    <span>130 kg</span>
                  </div>
                </div>

                {/* GENDER & BUILD SELECTORS */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100">
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold block mb-1">
                      Gender:
                    </label>
                    <div className="flex bg-zinc-100 p-0.5 rounded-lg">
                      {(['male', 'female'] as Gender[]).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGender(g)}
                          className={`flex-1 py-1 rounded-md text-[10px] font-mono font-bold capitalize transition-all cursor-pointer ${
                            gender === g ? 'bg-white text-zinc-950 shadow-2xs' : 'text-zinc-500'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold block mb-1">
                      Build:
                    </label>
                    <select
                      value={build}
                      onChange={(e) => setBuild(e.target.value as BodyBuild)}
                      className="w-full text-[11px] font-mono font-bold bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 text-zinc-900 focus:outline-none cursor-pointer"
                    >
                      <option value="athletic">Athletic</option>
                      <option value="slim">Slim / Lean</option>
                      <option value="muscular">Muscular</option>
                      <option value="regular">Regular</option>
                      <option value="curvy">Curvy / Plus</option>
                    </select>
                  </div>
                </div>

                {/* Calculated Anatomical Vitals */}
                <div className="p-3 bg-amber-500/5 border border-amber-400/30 rounded-2xl space-y-1.5 text-[11px] font-mono">
                  <div className="flex justify-between text-zinc-600">
                    <span>Calculated Chest:</span>
                    <strong className="text-zinc-950">{biometrics.chestInches}" ({biometrics.chestCm} cm)</strong>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Shoulder Breadth:</span>
                    <strong className="text-zinc-950">{biometrics.shoulderBreadthCm} cm</strong>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Estimated Waist:</span>
                    <strong className="text-zinc-950">{biometrics.waistInches}"</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: 3D AVATAR & FIT SIMULATION CANVAS (4.5 Cols) */}
            <div className="lg:col-span-4 space-y-3">
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-zinc-200 shadow-sm relative flex flex-col items-center">
                {/* 360 Header Bar with Perspective Switch */}
                <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-zinc-100 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-zinc-800 font-bold">
                    <RotateCw className="w-4 h-4 text-amber-600 animate-spin-slow" />
                    <span>ORBIT: {rotationAngle}°</span>
                  </div>

                  <div className="flex items-center gap-2">
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
                      <span>{isAutoSpinning ? 'Pause' : 'Auto Orbit'}</span>
                    </button>
                  </div>
                </div>

                {/* THE 3D AVATAR CANVAS */}
                <PersonalAvatar3DCanvas
                  biometrics={biometrics}
                  userPhotoUrl={userPhotoUrl}
                  garmentProduct={activeProduct}
                  selectedSize={activeItem.selectedSize}
                  rotationAngle={rotationAngle}
                  onAngleChange={setRotationAngle}
                  isScanning={isScanning}
                />
              </div>
            </div>

            {/* COLUMN 3: FIT VERDICT, SIZE SELECTOR & CLIMATE MATRIX (3.5 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* FIT ANALYSIS CARD */}
              <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h3 className="font-serif font-bold text-sm text-zinc-950">
                      Garment Fit Verdict
                    </h3>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    biometrics.sizeEvaluation.isOptimal
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}>
                    {biometrics.sizeEvaluation.fitType}
                  </span>
                </div>

                {/* Recommended vs Selected Size Callout */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent border border-amber-400/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-amber-900 font-bold tracking-wider">
                      Biometric Recommendation:
                    </span>
                    <span className="text-xs font-mono font-black bg-zinc-950 text-amber-400 px-2 py-0.5 rounded-md">
                      SIZE {biometrics.recommendedSize}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-700 leading-relaxed">
                    {biometrics.sizeEvaluation.fitVerdict}
                  </p>
                </div>

                {/* IN-MODAL SIZE SELECTOR */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-zinc-900 uppercase">
                      Test Different Sizes:
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      Currently: <strong className="text-zinc-900">{activeItem.selectedSize}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-6 gap-1">
                    {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as TShirtSize[]).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeChange(size)}
                        className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                          activeItem.selectedSize === size
                            ? 'bg-zinc-950 text-white border-zinc-950 shadow-md scale-105'
                            : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4-POINT FIT BREAKDOWN */}
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 flex justify-between items-center">
                    <span className="text-zinc-500">Shoulder Fall:</span>
                    <span className="font-bold text-zinc-950">
                      {biometrics.sizeEvaluation.shoulderDropInches}" Drop-Shoulder
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 flex justify-between items-center">
                    <span className="text-zinc-500">Chest Breathing Ease:</span>
                    <span className="font-bold text-emerald-700">
                      +{biometrics.sizeEvaluation.easeCm} cm (Zero Cling)
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 flex justify-between items-center">
                    <span className="text-zinc-500">Length Hang:</span>
                    <span className="font-bold text-zinc-950">
                      {biometrics.sizeEvaluation.hemlineDescription}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 flex justify-between items-center">
                    <span className="text-zinc-500">Fabric Weight:</span>
                    <span className="font-bold text-zinc-950">
                      {activeProduct.gsm || 240} GSM Heavy Combed
                    </span>
                  </div>
                </div>

                {/* CLIMATE COMFORT SCORE FOR TAMIL NADU */}
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-mono text-emerald-800 font-bold uppercase">
                      Tropical Comfort Score ({currentDistrict})
                    </div>
                    <div className="text-[11px] text-zinc-600">
                      {weather.tempC}°C • {weather.condition}
                    </div>
                  </div>
                  <div className="text-xl font-mono font-black text-emerald-700">
                    {biometrics.sizeEvaluation.breathabilityScore}%
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM STICKY CONFIRMATION FOOTER */}
        <div className="px-6 py-4 border-t border-zinc-200 bg-white/95 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-zinc-950">
                Personal 3D Fit Calculated for {heightCm}cm / {weightKg}kg
              </div>
              <div className="text-[11px] text-zinc-500">
                Size {activeItem.selectedSize} ({biometrics.sizeEvaluation.fitType}) • Free 7-Day Exchange Guaranteed
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
                onConfirmAndPay(biometrics);
              }}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Confirm 3D Fit & Proceed to Pay</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
