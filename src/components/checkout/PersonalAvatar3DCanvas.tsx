import React, { useRef, useEffect, useState, useMemo } from 'react';
import { RotateCw, Sparkles, Layers, Eye, Scan } from 'lucide-react';
import { CalculatedBiometrics } from '../../utils/bodyBiometrics';
import { Product, TShirtSize } from '../../types';

interface PersonalAvatar3DCanvasProps {
  biometrics: CalculatedBiometrics;
  userPhotoUrl?: string;
  garmentProduct?: Product;
  selectedSize: TShirtSize;
  rotationAngle: number; // 0 to 360
  onAngleChange: (angle: number) => void;
  isScanning?: boolean;
}

export const PersonalAvatar3DCanvas: React.FC<PersonalAvatar3DCanvasProps> = ({
  biometrics,
  userPhotoUrl,
  garmentProduct,
  selectedSize,
  rotationAngle,
  onAngleChange,
  isScanning = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [showTensionHeatmap, setShowTensionHeatmap] = useState(false);
  const [renderMode, setRenderMode] = useState<'shaded' | 'wireframe'>('shaded');

  const rad = useMemo(() => (rotationAngle * Math.PI) / 180, [rotationAngle]);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  // Mouse & Touch Orbit Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    if (Math.abs(deltaX) > 2) {
      const newAngle = (rotationAngle - deltaX * 0.7 + 360) % 360;
      onAngleChange(Math.round(newAngle));
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startX;
    if (Math.abs(deltaX) > 2) {
      const newAngle = (rotationAngle - deltaX * 0.7 + 360) % 360;
      onAngleChange(Math.round(newAngle));
      setStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Morph scaling factors derived from user's height and weight
  const { widthFactor, heightFactor, shoulderSpanRatio, waistTaperRatio } = biometrics.avatarMorph;
  const easeCm = biometrics.sizeEvaluation.easeCm;

  // Base canvas coordinate landmarks (centered around X: 200, Y: 240)
  const centerX = 200;
  const headY = 90;
  const shoulderY = 145;
  const chestY = 200;
  const waistY = 270;
  const hemY = Math.round(330 + (heightFactor - 1) * 35);
  const hipY = Math.round(350 + (heightFactor - 1) * 45);

  // Widths with 3D projection (cos determines front/back perspective, sin determines side profile depth)
  const baseShoulderW = 75 * shoulderSpanRatio;
  const baseChestW = 60 * widthFactor;
  const baseWaistW = 50 * widthFactor * waistTaperRatio;
  const baseDepth = 28 * widthFactor; // profile depth

  // Garment boxy ease additions
  const garmentEaseW = Math.max(8, Math.min(30, 10 + easeCm * 0.8));
  const garmentShoulderW = baseShoulderW + Math.max(6, biometrics.sizeEvaluation.shoulderDropInches * 7);
  const garmentChestW = baseChestW + garmentEaseW;
  const garmentWaistW = baseWaistW + garmentEaseW * 0.9;
  const garmentHemW = garmentWaistW + 4;

  // Project 3D coordinates: X = centerX + radius * cos, Z = radius * sin
  // Apparent width in 2D projection = |cos| * width + |sin| * depth
  const apparentShoulderW = Math.abs(cos) * baseShoulderW + Math.abs(sin) * (baseDepth * 0.8);
  const apparentChestW = Math.abs(cos) * baseChestW + Math.abs(sin) * baseDepth;
  const apparentWaistW = Math.abs(cos) * baseWaistW + Math.abs(sin) * baseDepth;

  const apparentGarmentShoulderW = Math.abs(cos) * garmentShoulderW + Math.abs(sin) * (baseDepth * 1.2);
  const apparentGarmentChestW = Math.abs(cos) * garmentChestW + Math.abs(sin) * (baseDepth * 1.35);
  const apparentGarmentWaistW = Math.abs(cos) * garmentWaistW + Math.abs(sin) * (baseDepth * 1.3);
  const apparentGarmentHemW = Math.abs(cos) * garmentHemW + Math.abs(sin) * (baseDepth * 1.35);

  // Depth-based lighting / shading
  const isFacingFront = cos >= 0;
  const isSideProfile = Math.abs(cos) < 0.35;
  const faceOpacity = Math.max(0.1, (cos + 1) / 2); // fades when looking at back

  // Colors
  const garmentColor = garmentProduct?.colors?.[0]?.hex || '#18181b';
  const isDarkGarment = true;

  // Tension heatmap color: green for optimal ease (>5cm), amber for fitted (2-5cm), red for tight (<2cm)
  const tensionColor = easeCm >= 6 ? '#10b981' : easeCm >= 2 ? '#f59e0b' : '#ef4444';

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* 3D Model Control Toolbar */}
      <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-zinc-200 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-zinc-900">
            3D BIOMETRIC AVATAR: <span className="text-amber-600">{rotationAngle}°</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowTensionHeatmap(!showTensionHeatmap)}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
              showTensionHeatmap
                ? 'bg-amber-400 text-zinc-950 shadow-xs'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Tension Map</span>
          </button>

          <button
            type="button"
            onClick={() => setRenderMode(renderMode === 'shaded' ? 'wireframe' : 'shaded')}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
              renderMode === 'wireframe'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>{renderMode === 'shaded' ? 'Mesh' : 'Shaded'}</span>
          </button>
        </div>
      </div>

      {/* SVG 3D Canvas Viewport */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full aspect-[4/5] max-w-[380px] bg-gradient-to-b from-[#f5f4ef] via-[#ebe8df] to-[#dfdbd0] rounded-3xl border border-zinc-300 shadow-inner overflow-hidden cursor-grab active:cursor-grabbing flex items-center justify-center"
      >
        {/* Biometric Scanning Radar Animation */}
        {isScanning && (
          <div className="absolute inset-0 z-40 bg-zinc-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white pointer-events-none animate-fadeIn">
            <div className="w-20 h-20 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mb-3 flex items-center justify-center">
              <Scan className="w-8 h-8 text-amber-400 animate-pulse" />
            </div>
            <div className="text-xs font-mono font-bold tracking-wider text-amber-300 uppercase">
              Extracting Skeletal Geometry...
            </div>
            <div className="text-[10px] font-mono text-zinc-300 mt-1">
              Calibrating {biometrics.heightCm}cm • {biometrics.weightKg}kg • {biometrics.chestInches}" Chest
            </div>
          </div>
        )}

        {/* 3D Anatomical & Cloth Drape Projection (SVG) */}
        <svg
          viewBox="0 0 400 480"
          className="w-full h-full drop-shadow-2xl overflow-visible"
          style={{ transform: 'translateZ(0)' }}
        >
          <defs>
            {/* Gradients for Shaded 3D Body & Cloth */}
            <radialGradient id="bodySkinGrad" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#d8b48f" />
              <stop offset="70%" stopColor="#b58d63" />
              <stop offset="100%" stopColor="#8d6641" />
            </radialGradient>

            <linearGradient id="clothLightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1f1f23" />
              <stop offset="35%" stopColor="#2e2e36" />
              <stop offset="70%" stopColor="#1a1a1e" />
              <stop offset="100%" stopColor="#0f0f12" />
            </linearGradient>

            <linearGradient id="wireframeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.4" />
            </linearGradient>

            {/* Circular Clip for Customer Photo */}
            <clipPath id="userHeadClip">
              <circle cx={centerX} cy={headY} r={32} />
            </clipPath>
          </defs>

          {/* BACKGROUND 3D GRID FLOOR */}
          <g opacity="0.35">
            <ellipse cx={centerX} cy={440} rx={130} ry={25} fill="none" stroke="#a1a1aa" strokeWidth="1" strokeDasharray="3 3" />
            <ellipse cx={centerX} cy={440} rx={90} ry={16} fill="none" stroke="#a1a1aa" strokeWidth="1" />
            <ellipse cx={centerX} cy={440} rx={45} ry={8} fill="none" stroke="#f59e0b" strokeWidth="1" />
            <ellipse cx={centerX} cy={440} rx={100} ry={20} fill="#000" opacity="0.12" filter="blur(8px)" />
          </g>

          {/* LOWER BODY: Legs & Pants (Proportionate to Height) */}
          <g>
            {/* Left Leg */}
            <path
              d={`M ${centerX - 24} ${hipY} L ${centerX - 30} 430 L ${centerX - 10} 430 L ${centerX - 4} ${hipY} Z`}
              fill={renderMode === 'wireframe' ? 'none' : '#27272a'}
              stroke={renderMode === 'wireframe' ? '#f59e0b' : '#18181b'}
              strokeWidth={renderMode === 'wireframe' ? 1.5 : 1}
              opacity="0.9"
            />
            {/* Right Leg */}
            <path
              d={`M ${centerX + 4} ${hipY} L ${centerX + 10} 430 L ${centerX + 30} 430 L ${centerX + 24} ${hipY} Z`}
              fill={renderMode === 'wireframe' ? 'none' : '#27272a'}
              stroke={renderMode === 'wireframe' ? '#f59e0b' : '#18181b'}
              strokeWidth={renderMode === 'wireframe' ? 1.5 : 1}
              opacity="0.9"
            />
            {/* Sneakers */}
            <ellipse cx={centerX - 20} cy={432} rx={16} ry={6} fill="#ffffff" stroke="#e4e4e7" strokeWidth="1" />
            <ellipse cx={centerX + 20} cy={432} rx={16} ry={6} fill="#ffffff" stroke="#e4e4e7" strokeWidth="1" />
          </g>

          {/* INNER BIOMETRIC SKELETON (Always shows underneath cloth drape) */}
          <g opacity={renderMode === 'wireframe' || showTensionHeatmap ? 0.9 : 0.25}>
            {/* Spine line */}
            <line x1={centerX} y1={headY + 30} x2={centerX} y2={waistY + 30} stroke="#f59e0b" strokeWidth="2" strokeDasharray="2 2" />
            {/* Clavicle / Shoulder bar */}
            <line x1={centerX - apparentShoulderW} y1={shoulderY} x2={centerX + apparentShoulderW} y2={shoulderY} stroke="#f59e0b" strokeWidth="2" />
            {/* Chest contour circle */}
            <ellipse cx={centerX} cy={chestY} rx={apparentChestW} ry={baseDepth * 0.4} fill="none" stroke="#f59e0b" strokeWidth="1.5" />
            {/* Waist contour circle */}
            <ellipse cx={centerX} cy={waistY} rx={apparentWaistW} ry={baseDepth * 0.35} fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          </g>

          {/* DRAPED GARMENT BODY (The cloth fit on top of body) */}
          {renderMode === 'shaded' ? (
            <g>
              {/* Outer Garment Silhouette with architectural boxy drop */}
              <path
                d={`
                  M ${centerX - 24} ${shoulderY - 14}
                  Q ${centerX} ${shoulderY - (isFacingFront ? 4 : 14)} ${centerX + 24} ${shoulderY - 14}
                  L ${centerX + apparentGarmentShoulderW} ${shoulderY + 12}
                  L ${centerX + apparentGarmentShoulderW + 18 * Math.abs(cos)} ${shoulderY + 68}
                  L ${centerX + apparentGarmentChestW + 8} ${chestY + 18}
                  L ${centerX + apparentGarmentHemW} ${hemY}
                  Q ${centerX} ${hemY + (isFacingFront ? 6 : -4)} ${centerX - apparentGarmentHemW} ${hemY}
                  L ${centerX - apparentGarmentChestW - 8} ${chestY + 18}
                  L ${centerX - apparentGarmentShoulderW - 18 * Math.abs(cos)} ${shoulderY + 68}
                  L ${centerX - apparentGarmentShoulderW} ${shoulderY + 12}
                  Z
                `}
                fill="url(#clothLightGrad)"
                stroke={showTensionHeatmap ? tensionColor : '#3f3f46'}
                strokeWidth={showTensionHeatmap ? 3 : 1.5}
                filter="drop-shadow(0 12px 16px rgba(0,0,0,0.35))"
              />

              {/* Natural 240 GSM Fabric Drape Folds */}
              <g stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1.5" fill="none">
                {/* Armhole drop seam */}
                <path d={`M ${centerX - apparentGarmentShoulderW} ${shoulderY + 12} Q ${centerX - apparentGarmentChestW * 0.7} ${chestY} ${centerX - apparentGarmentChestW - 4} ${chestY + 16}`} />
                <path d={`M ${centerX + apparentGarmentShoulderW} ${shoulderY + 12} Q ${centerX + apparentGarmentChestW * 0.7} ${chestY} ${centerX + apparentGarmentChestW + 4} ${chestY + 16}`} />
                {/* Vertical drape lines */}
                <path d={`M ${centerX - apparentGarmentChestW * 0.4} ${chestY + 10} Q ${centerX - apparentGarmentWaistW * 0.35} ${waistY} ${centerX - apparentGarmentHemW * 0.45} ${hemY - 4}`} />
                <path d={`M ${centerX + apparentGarmentChestW * 0.4} ${chestY + 10} Q ${centerX + apparentGarmentWaistW * 0.35} ${waistY} ${centerX + apparentGarmentHemW * 0.45} ${hemY - 4}`} />
              </g>

              {/* Collar Ribbing (1.25" Structured Non-Sag Collar) */}
              <ellipse
                cx={centerX}
                cy={shoulderY - 14 + (isFacingFront ? 8 : 0)}
                rx={24}
                ry={isFacingFront ? 8 : 4}
                fill={isFacingFront ? '#18181b' : '#27272a'}
                stroke="#f59e0b"
                strokeWidth="1.5"
              />

              {/* Front Brand Graphic / Puff Print when facing front */}
              {isFacingFront && (
                <g opacity={Math.max(0, cos * 1.2)} transform={`translate(${centerX - 35}, ${chestY - 30})`}>
                  <rect x="0" y="0" width="70" height="42" rx="6" fill="#000000" opacity="0.4" />
                  <text x="35" y="18" fill="#f59e0b" fontSize="10" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="2">
                    AXDORO
                  </text>
                  <text x="35" y="32" fill="#d4d4d8" fontSize="6.5" fontFamily="monospace" textAnchor="middle">
                    240 GSM • HEAVYWEIGHT
                  </text>
                </g>
              )}
            </g>
          ) : (
            /* WIREFRAME MESH MODE */
            <g stroke="url(#wireframeGrad)" strokeWidth="1.5" fill="none">
              {/* Torso horizontal rings */}
              <ellipse cx={centerX} cy={shoulderY} rx={apparentGarmentShoulderW} ry={14} />
              <ellipse cx={centerX} cy={chestY} rx={apparentGarmentChestW} ry={16} />
              <ellipse cx={centerX} cy={waistY} rx={apparentGarmentHemW * 0.9} ry={15} />
              <ellipse cx={centerX} cy={hemY} rx={apparentGarmentHemW} ry={14} />
              {/* Longitudinal contour lines */}
              <path d={`M ${centerX - apparentGarmentShoulderW} ${shoulderY} L ${centerX - apparentGarmentChestW} ${chestY} L ${centerX - apparentGarmentHemW} ${hemY}`} />
              <path d={`M ${centerX + apparentGarmentShoulderW} ${shoulderY} L ${centerX + apparentGarmentChestW} ${chestY} L ${centerX + apparentGarmentHemW} ${hemY}`} />
              <path d={`M ${centerX} ${shoulderY - 10} L ${centerX} ${hemY}`} strokeDasharray="3 3" />
            </g>
          )}

          {/* ARMS & HANDS */}
          <g>
            {/* Left Arm Forearm */}
            <path
              d={`M ${centerX - apparentGarmentShoulderW - 14 * Math.abs(cos)} ${shoulderY + 68} L ${centerX - apparentGarmentShoulderW - 22} 290 L ${centerX - apparentGarmentShoulderW - 10} 292 L ${centerX - apparentGarmentChestW - 4} ${chestY + 20} Z`}
              fill="url(#bodySkinGrad)"
              stroke="#8d6641"
              strokeWidth="0.8"
            />
            {/* Right Arm Forearm */}
            <path
              d={`M ${centerX + apparentGarmentShoulderW + 14 * Math.abs(cos)} ${shoulderY + 68} L ${centerX + apparentGarmentShoulderW + 22} 290 L ${centerX + apparentGarmentShoulderW + 10} 292 L ${centerX + apparentGarmentChestW + 4} ${chestY + 20} Z`}
              fill="url(#bodySkinGrad)"
              stroke="#8d6641"
              strokeWidth="0.8"
            />
          </g>

          {/* HEAD & USER PHOTO EMBEDDING */}
          <g>
            {/* Neck */}
            <path
              d={`M ${centerX - 14} ${headY + 20} L ${centerX - 16} ${shoulderY - 10} L ${centerX + 16} ${shoulderY - 10} L ${centerX + 14} ${headY + 20} Z`}
              fill="url(#bodySkinGrad)"
            />

            {/* Back of Hair / Head when rotated away */}
            {!isFacingFront && (
              <circle cx={centerX} cy={headY} r={32} fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
            )}

            {/* Uploaded User Photo Mapped to 3D Head */}
            {userPhotoUrl && (
              <g opacity={faceOpacity}>
                <image
                  href={userPhotoUrl}
                  x={centerX - 32}
                  y={headY - 32}
                  width="64"
                  height="64"
                  clipPath="url(#userHeadClip)"
                  preserveAspectRatio="xMidYMid slice"
                />
              </g>
            )}

            {/* If no photo uploaded, show stylized 3D avatar head */}
            {!userPhotoUrl && (
              <circle
                cx={centerX}
                cy={headY}
                r={32}
                fill="url(#bodySkinGrad)"
                stroke="#a16207"
                strokeWidth="1.5"
                opacity={faceOpacity}
              />
            )}

            {/* Biometric Halo Ring over Head */}
            <circle
              cx={centerX}
              cy={headY}
              r={34}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="4 3"
              className="animate-spin-slow"
              style={{ transformOrigin: `${centerX}px ${headY}px` }}
            />

            {/* Front Face Indicator (eyes/nose hint if facing front) */}
            {isFacingFront && (
              <g opacity={cos * 0.4} stroke="#451a03" strokeWidth="1.5" fill="none">
                <path d={`M ${centerX - 10} ${headY - 2} Q ${centerX - 6} ${headY - 6} ${centerX - 2} ${headY - 2}`} />
                <path d={`M ${centerX + 2} ${headY - 2} Q ${centerX + 6} ${headY - 6} ${centerX + 10} ${headY - 2}`} />
                <circle cx={centerX} cy={headY + 6} r="1" fill="#451a03" />
              </g>
            )}
          </g>

          {/* TENSION HEATMAP OVERLAYS */}
          {showTensionHeatmap && (
            <g>
              {/* Chest Tension Ring */}
              <ellipse
                cx={centerX}
                cy={chestY}
                rx={apparentGarmentChestW + 6}
                ry={18}
                fill="none"
                stroke={tensionColor}
                strokeWidth="3"
                strokeDasharray="6 4"
                className="animate-pulse"
              />
              {/* Shoulder Drop Bracket */}
              <line
                x1={centerX - apparentShoulderW}
                y1={shoulderY}
                x2={centerX - apparentGarmentShoulderW}
                y2={shoulderY + 12}
                stroke="#10b981"
                strokeWidth="3"
              />
            </g>
          )}
        </svg>

        {/* FLOATING ANATOMICAL FIT HOTSPOTS */}
        {/* Hotspot 1: Shoulder Fall */}
        <div className="absolute top-28 left-4 px-2.5 py-1 rounded-xl bg-zinc-950/85 backdrop-blur-md text-white text-[10px] font-mono border border-amber-400/40 shadow-lg flex items-center gap-1.5 pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>
            Drop: <strong>{biometrics.sizeEvaluation.shoulderDropInches}" Boxy</strong>
          </span>
        </div>

        {/* Hotspot 2: Chest Breathing Ease */}
        <div className="absolute top-44 right-4 px-2.5 py-1 rounded-xl bg-zinc-950/85 backdrop-blur-md text-white text-[10px] font-mono border border-amber-400/40 shadow-lg flex items-center gap-1.5 pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>
            Ease: <strong>+{easeCm} cm</strong>
          </span>
        </div>

        {/* Hotspot 3: Hemline Position */}
        <div className="absolute bottom-12 left-4 px-2.5 py-1 rounded-xl bg-zinc-950/85 backdrop-blur-md text-white text-[10px] font-mono border border-amber-400/40 shadow-lg flex items-center gap-1.5 pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>{biometrics.sizeEvaluation.hemlineDescription}</span>
        </div>

        {/* Orbit Interaction Hint */}
        <div className="absolute bottom-2 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[9px] font-mono text-zinc-300 flex items-center gap-1 pointer-events-none">
          <RotateCw className="w-2.5 h-2.5 text-amber-400 animate-spin-slow" />
          <span>Drag to Rotate 360°</span>
        </div>
      </div>

      {/* 360 Rotation Scrub Slider & Angle Buttons */}
      <div className="w-full max-w-[380px] pt-3 space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-zinc-400">
          <span>0° FRONT</span>
          <input
            type="range"
            min={0}
            max={360}
            value={rotationAngle}
            onChange={(e) => onAngleChange(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-zinc-200 rounded-lg appearance-none"
          />
          <span>360°</span>
        </div>

        {/* Snap Buttons */}
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { label: '0° Front', angle: 0 },
            { label: '90° Profile', angle: 90 },
            { label: '180° Back', angle: 180 },
            { label: '270° Side', angle: 270 },
          ].map((btn) => (
            <button
              key={btn.angle}
              type="button"
              onClick={() => onAngleChange(btn.angle)}
              className={`py-1 rounded-lg text-[10px] font-mono transition-all border cursor-pointer ${
                Math.abs(rotationAngle - btn.angle) < 15
                  ? 'bg-zinc-950 text-white font-bold border-zinc-950 shadow-xs'
                  : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border-zinc-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
