import { TShirtSize, ProductCategory } from '../types';

export type BodyBuild = 'athletic' | 'slim' | 'regular' | 'muscular' | 'curvy';
export type Gender = 'male' | 'female' | 'unisex';

export interface CalculatedBiometrics {
  heightCm: number;
  heightFtIn: string;
  weightKg: number;
  weightLbs: number;
  bmi: number;
  bmiCategory: string;
  chestInches: number;
  chestCm: number;
  shoulderBreadthCm: number;
  waistInches: number;
  torsoHeightCm: number;
  recommendedSize: TShirtSize;
  sizeEvaluation: {
    selectedSize: TShirtSize;
    isOptimal: boolean;
    fitType: 'Snug' | 'Tailored Classic' | 'Relaxed Boxy' | 'Signature Oversized' | 'Exaggerated Boxy';
    easeCm: number;
    shoulderDropInches: number;
    hemlineDescription: string;
    breathabilityScore: number;
    fitVerdict: string;
  };
  avatarMorph: {
    widthFactor: number;
    heightFactor: number;
    shoulderSpanRatio: number;
    chestDepthFactor: number;
    waistTaperRatio: number;
  };
}

export function cmToFtIn(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}" (${cm} cm)`;
}

export function calculateBiometrics(
  heightCm: number,
  weightKg: number,
  gender: Gender = 'male',
  build: BodyBuild = 'athletic',
  selectedSize: TShirtSize = 'L',
  category: ProductCategory = 't-shirts'
): CalculatedBiometrics {
  // Height in meters & BMI
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  let bmiCategory = 'Balanced Standard';
  if (bmi < 18.5) bmiCategory = 'Lean / Slender';
  else if (bmi < 24.9) bmiCategory = 'Optimal Athletic';
  else if (bmi < 29.9) bmiCategory = 'Broad / Muscular';
  else bmiCategory = 'Heavyweight Solid';

  // Base chest estimation from height, weight, gender, and build
  let baseChestCm: number;
  if (gender === 'female') {
    baseChestCm = 74 + (weightKg - 50) * 0.75 + (heightCm - 160) * 0.2;
    if (build === 'curvy') baseChestCm += 4.5;
    else if (build === 'slim') baseChestCm -= 3.5;
  } else {
    baseChestCm = 88 + (weightKg - 70) * 0.85 + (heightCm - 175) * 0.25;
    if (build === 'muscular') baseChestCm += 5.5;
    else if (build === 'athletic') baseChestCm += 2.5;
    else if (build === 'slim') baseChestCm -= 4.0;
  }
  baseChestCm = Math.max(76, Math.min(135, baseChestCm));
  const chestInches = Number((baseChestCm / 2.54).toFixed(1));

  // Shoulder breadth (biacromial distance)
  let shoulderBreadthCm = 38 + (heightCm - 165) * 0.12 + (weightKg - 65) * 0.14;
  if (build === 'muscular' || build === 'athletic') shoulderBreadthCm += 2.5;
  if (gender === 'female') shoulderBreadthCm -= 3.0;
  shoulderBreadthCm = Number(Math.max(34, Math.min(56, shoulderBreadthCm)).toFixed(1));

  // Waist estimation
  let waistInches = 26 + (weightKg - 55) * 0.28 + (bmi > 25 ? (bmi - 25) * 0.6 : 0);
  if (build === 'athletic' || build === 'muscular') waistInches -= 2.0;
  waistInches = Number(Math.max(24, Math.min(48, waistInches)).toFixed(1));

  // Torso height
  const torsoHeightCm = Number((heightCm * 0.44).toFixed(1));

  // Garment Sizing Specifications for AXDORO (Boxy Heavyweight Drop-Shoulder)
  const SIZE_CHEST_MAP: Record<TShirtSize, number> = {
    XS: 38.0,
    S: 40.0,
    M: 42.5,
    L: 45.0,
    XL: 48.0,
    XXL: 51.0,
  };

  const SIZE_SHOULDER_MAP: Record<TShirtSize, number> = {
    XS: 47.0,
    S: 49.5,
    M: 52.0,
    L: 55.0,
    XL: 58.0,
    XXL: 61.0,
  };

  // Determine Recommended Size based on chest + desired streetwear boxy ease
  let recommendedSize: TShirtSize = 'L';
  if (chestInches <= 36.5) recommendedSize = 'XS';
  else if (chestInches <= 39.0) recommendedSize = 'S';
  else if (chestInches <= 41.5) recommendedSize = 'M';
  else if (chestInches <= 44.5) recommendedSize = 'L';
  else if (chestInches <= 48.0) recommendedSize = 'XL';
  else recommendedSize = 'XXL';

  // Evaluate the currently selected size against user biometrics
  const garmentChestInches = SIZE_CHEST_MAP[selectedSize];
  const garmentChestCm = garmentChestInches * 2.54;
  const easeCm = Number((garmentChestCm - baseChestCm).toFixed(1));

  const garmentShoulderCm = SIZE_SHOULDER_MAP[selectedSize];
  const shoulderDropCm = (garmentShoulderCm - shoulderBreadthCm) / 2;
  const shoulderDropInches = Number((shoulderDropCm / 2.54).toFixed(1));

  let fitType: CalculatedBiometrics['sizeEvaluation']['fitType'] = 'Signature Oversized';
  let fitVerdict = '';
  let isOptimal = false;

  if (easeCm < 2.0) {
    fitType = 'Snug';
    fitVerdict = 'Tighter fit around chest and armholes. Restricts natural 240 GSM convective airflow.';
  } else if (easeCm < 6.0) {
    fitType = 'Tailored Classic';
    fitVerdict = 'Smart, structured profile with clean silhouette and 1.5" gentle shoulder drop.';
    isOptimal = selectedSize === recommendedSize;
  } else if (easeCm < 12.0) {
    fitType = 'Relaxed Boxy';
    fitVerdict = 'Signature AXDORO Streetwear fit. 2.4" authentic drop-shoulder with zero body cling in humid climate.';
    isOptimal = true;
  } else if (easeCm < 18.0) {
    fitType = 'Signature Oversized';
    fitVerdict = 'Dramatic urban drape with relaxed arm opening and architectural vertical line.';
    isOptimal = selectedSize === recommendedSize;
  } else {
    fitType = 'Exaggerated Boxy';
    fitVerdict = 'Extra-wide runway silhouette. Very generous chest room with 3.5"+ drop shoulder.';
  }

  // Hemline description based on height
  let hemlineDescription = 'Lands 2.5" below waistband';
  if (heightCm > 185) {
    hemlineDescription = 'Lands 1.5" below waistband (balanced tall proportion)';
  } else if (heightCm < 165) {
    hemlineDescription = 'Lands 3.5" below waistband (extended relaxed length)';
  }

  // Breathability comfort score (0-100) based on humidity ventilation ease
  let breathabilityScore = Math.min(99, Math.max(70, Math.round(82 + (easeCm > 0 ? Math.min(16, easeCm * 1.2) : easeCm * 2.5))));

  // Avatar Morphing Scale Factors for 3D Mesh
  const widthFactor = Number((baseChestCm / 100).toFixed(2));
  const heightFactor = Number((heightCm / 175).toFixed(2));
  const shoulderSpanRatio = Number((shoulderBreadthCm / 45).toFixed(2));
  const chestDepthFactor = Number((bmi / 23).toFixed(2));
  const waistTaperRatio = Number((waistInches / chestInches).toFixed(2));

  return {
    heightCm,
    heightFtIn: cmToFtIn(heightCm),
    weightKg,
    weightLbs: Math.round(weightKg * 2.20462),
    bmi,
    bmiCategory,
    chestInches,
    chestCm: Math.round(baseChestCm),
    shoulderBreadthCm,
    waistInches,
    torsoHeightCm,
    recommendedSize,
    sizeEvaluation: {
      selectedSize,
      isOptimal,
      fitType,
      easeCm,
      shoulderDropInches,
      hemlineDescription,
      breathabilityScore,
      fitVerdict,
    },
    avatarMorph: {
      widthFactor,
      heightFactor,
      shoulderSpanRatio,
      chestDepthFactor,
      waistTaperRatio,
    },
  };
}
