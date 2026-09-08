import { Product, TShirtSize, ProductCategory } from '../types';
import { calculateBiometrics, CalculatedBiometrics } from '../utils/bodyBiometrics';

export interface ChatActionButton {
  label: string;
  actionType: 'navigate' | 'open3DStudio' | 'whatsapp' | 'filterCategory' | 'sizeGuide';
  payload?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  actionButtons?: ChatActionButton[];
  suggestedProducts?: Product[];
}

export const QUICK_PROMPTS = [
  'Find my size (Height & Weight) 📏',
  'Why 240 GSM for Tamil Nadu? 🧵',
  'Recommend best streetwear drops 🔥',
  'Tamil Nadu delivery & free shipping 🚚',
  'Try 3D Avatar Fit Studio 🕶️',
  '7-Day Size Exchange policy 🔄',
];

interface IntentMatchResult {
  text: string;
  actionButtons?: ChatActionButton[];
  categoryFilter?: ProductCategory;
}

export function parseBiometricInputs(input: string): { heightCm?: number; weightKg?: number } {
  let heightCm: number | undefined;
  let weightKg: number | undefined;

  // Height in cm (e.g., 178cm, 185 cm)
  const cmMatch = input.match(/(\d{3})\s*(?:cm|cms|centimeters)/i);
  if (cmMatch) {
    heightCm = parseInt(cmMatch[1], 10);
  } else {
    // Height in feet & inches (e.g. 5'11, 6ft, 5 feet 10 inches, 5'10")
    const ftInMatch = input.match(/(\d)\s*(?:ft|feet|'|’)\s*(?:and\s*)?(\d{1,2})?\s*(?:in|inches|"|”)?/i);
    if (ftInMatch) {
      const ft = parseInt(ftInMatch[1], 10);
      const inches = ftInMatch[2] ? parseInt(ftInMatch[2], 10) : 0;
      if (ft >= 4 && ft <= 7) {
        heightCm = Math.round((ft * 12 + inches) * 2.54);
      }
    }
  }

  // Weight in kg (e.g. 76kg, 80 kgs, 72 kilo)
  const kgMatch = input.match(/(\d{2,3})\s*(?:kg|kgs|kilos|kilograms)/i);
  if (kgMatch) {
    weightKg = parseInt(kgMatch[1], 10);
  } else {
    // Weight in lbs
    const lbsMatch = input.match(/(\d{2,3})\s*(?:lbs|pounds)/i);
    if (lbsMatch) {
      weightKg = Math.round(parseInt(lbsMatch[1], 10) * 0.453592);
    }
  }

  // If two numbers like "178 76" or "180 and 85"
  if (!heightCm || !weightKg) {
    const rawNums = input.match(/\b(\d{2,3})\b/g);
    if (rawNums && rawNums.length >= 2) {
      const num1 = parseInt(rawNums[0], 10);
      const num2 = parseInt(rawNums[1], 10);
      if (num1 >= 140 && num1 <= 215 && num2 >= 40 && num2 <= 140) {
        heightCm = num1;
        weightKg = num2;
      } else if (num2 >= 140 && num2 <= 215 && num1 >= 40 && num1 <= 140) {
        heightCm = num2;
        weightKg = num1;
      }
    }
  }

  return { heightCm, weightKg };
}

export function processUserQuery(
  userInput: string,
  catalog: Product[]
): {
  reply: string;
  actionButtons?: ChatActionButton[];
  suggestedProducts?: Product[];
} {
  const query = userInput.toLowerCase().trim();

  // 1. Check for Biometrics (Height & Weight calculation)
  const { heightCm, weightKg } = parseBiometricInputs(userInput);
  if (heightCm && weightKg) {
    const bio = calculateBiometrics(heightCm, weightKg, 'male', 'athletic', 'L', 't-shirts');
    const recommended = bio.recommendedSize;
    const ease = bio.sizeEvaluation.easeCm;
    const drop = bio.sizeEvaluation.shoulderDropInches;

    const matchedProducts = catalog
      .filter((p) => p.category === 't-shirts' || p.category === 'hoodies')
      .slice(0, 2);

    return {
      reply: `📏 **Biometrics Analyzed for ${heightCm} cm & ${weightKg} kg (BMI: ${bio.bmi} • ${bio.bmiCategory}):**\n\n• **Calculated Chest:** ${bio.chestInches}" (${bio.chestCm} cm)\n• **Recommended Size:** **Size ${recommended}** (${bio.sizeEvaluation.fitType})\n• **Shoulder Fall:** ${drop}" signature streetwear drop\n• **Chest Room:** +${ease} cm ease (100% Zero-Cling convective airflow)\n\nWould you like to test your personal 3D avatar rotating in 360° or shop drops in Size ${recommended}?`,
      actionButtons: [
        { label: '🕶️ Launch 3D Avatar Fit Studio', actionType: 'open3DStudio' },
        { label: `🛍️ Browse Size ${recommended} Drops`, actionType: 'navigate', payload: 'shop' },
        { label: '💬 Confirm with Stylist on WhatsApp', actionType: 'whatsapp' },
      ],
      suggestedProducts: matchedProducts,
    };
  }

  // 2. Fabric & 240 GSM Science
  if (
    query.includes('gsm') ||
    query.includes('fabric') ||
    query.includes('material') ||
    query.includes('cotton') ||
    query.includes('cling') ||
    query.includes('collar') ||
    query.includes('sag') ||
    query.includes('quality') ||
    query.includes('sweat')
  ) {
    return {
      reply: `🧵 **The Science of AXDORO 240 GSM Combed Cotton:**\n\nUnlike commercial 160–180 GSM t-shirts that cling to your chest in 80%+ humidity, our 240 GSM architectural combed cotton offers:\n\n1. **Anti-Cling Natural Convection**: A dense yet breathable weave that creates a micro-chimney effect, floating off your torso to evaporate moisture without dark sweat patches.\n2. **1.25" Non-Sag Ribbed Collar**: Engineered with Lycra reinforcement so the neckline never waves or bacon-curls after repeated wash cycles.\n3. **Tiruppur Artisan Craftsmanship**: Pre-shrunk, bio-washed combed cotton grown and tailored in the textile corridor of Tamil Nadu.`,
      actionButtons: [
        { label: '🛍️ Explore 240 GSM Heavyweight Drops', actionType: 'navigate', payload: 'shop' },
        { label: '🕶️ View 3D Drape Tension', actionType: 'open3DStudio' },
      ],
    };
  }

  // 3. Hoodies (400 GSM)
  if (query.includes('hoodie') || query.includes('hoodies') || query.includes('winter') || query.includes('fleece')) {
    const hoodies = catalog.filter((p) => p.category === 'hoodies').slice(0, 3);
    return {
      reply: `🧥 **AXDORO 400 GSM French Terry Hoodies:**\n\nOur hoodies feature double-layer self-fabric hoods engineered to stand upright without drawstrings, dropped boxy shoulders, and ultra-plush looped French Terry that keeps you warm in hill stations or AC lounges.`,
      actionButtons: [
        { label: '🔥 View All 400 GSM Hoodies', actionType: 'filterCategory', payload: 'hoodies' },
        { label: '🕶️ 3D Avatar Hoodie Fitting', actionType: 'open3DStudio' },
      ],
      suggestedProducts: hoodies,
    };
  }

  // 4. Shirts & Overshirts
  if (query.includes('shirt') || query.includes('overshirt') || query.includes('cuban') || query.includes('linen')) {
    const shirts = catalog.filter((p) => p.category === 'shirts').slice(0, 3);
    return {
      reply: `👔 **Architectural Shirts & Boxy Overshirts (200 GSM):**\n\nTailored with structured Cuban and resort collars, clean matte snap buttons, and relaxed drape designed to be worn open over a 240 GSM white tee or buttoned solo.`,
      actionButtons: [
        { label: '👔 View Shirts & Overshirts', actionType: 'filterCategory', payload: 'shirts' },
      ],
      suggestedProducts: shirts,
    };
  }

  // 5. Pants, Trousers & Cargos
  if (
    query.includes('pant') ||
    query.includes('pants') ||
    query.includes('trouser') ||
    query.includes('trousers') ||
    query.includes('cargo') ||
    query.includes('bottom') ||
    query.includes('jogger')
  ) {
    const pants = catalog.filter((p) => p.category === 'pants' || p.category === 'trousers').slice(0, 3);
    return {
      reply: `👖 **Heavyweight Bottomwear (280–360 GSM):**\n\nFrom deep-pocket tactical cargos to tailored wide-leg pleat trousers and loopback French Terry joggers, all constructed with reinforced crotches and ergonomic knee articulation.`,
      actionButtons: [
        { label: '👖 Shop Cargos & Pants', actionType: 'filterCategory', payload: 'pants' },
        { label: '✨ Shop Tailored Trousers', actionType: 'filterCategory', payload: 'trousers' },
      ],
      suggestedProducts: pants,
    };
  }

  // 6. Delivery, Shipping & Tamil Nadu Express
  if (
    query.includes('delivery') ||
    query.includes('shipping') ||
    query.includes('courier') ||
    query.includes('shiprocket') ||
    query.includes('tamil nadu') ||
    query.includes('chennai') ||
    query.includes('track') ||
    query.includes('when') ||
    query.includes('free')
  ) {
    return {
      reply: `🚚 **Shipping & Fast Fulfillment via Shiprocket Express:**\n\n• **Tamil Nadu Express Delivery**: 24 to 48 Hours across Chennai, Coimbatore, Madurai, Tiruppur, Salem, Trichy, etc.\n• **Pan-India Delivery**: 3 to 4 business days via BlueDart & Delhivery Air.\n• **Shipping Charges**: **100% FREE** delivery across Tamil Nadu!\n• **Live Tracking**: Instant WhatsApp & SMS live tracking links with real-time GPS updates upon dispatch.`,
      actionButtons: [
        { label: '📦 Track Existing Order', actionType: 'navigate', payload: 'tracking' },
        { label: '🛍️ Continue Shopping', actionType: 'navigate', payload: 'shop' },
      ],
    };
  }

  // 7. Returns, Exchange & Size Guarantee
  if (
    query.includes('return') ||
    query.includes('exchange') ||
    query.includes('replace') ||
    query.includes('policy') ||
    query.includes('guarantee') ||
    query.includes('damaged')
  ) {
    return {
      reply: `🔄 **Zero-Risk 7-Day Doorstep Size Exchange Guarantee:**\n\nWe want your 240 GSM drape to be absolute perfection. If the size or fit isn't 100% ideal:\n\n• Doorstep size exchange within 7 days of delivery.\n• Our courier agent drops off the new size and picks up the previous one in a single visit.\n• No questions asked, zero return shipping deduction.`,
      actionButtons: [
        { label: '📏 Size Guide Modal', actionType: 'sizeGuide' },
        { label: '💬 Initiate Exchange on WhatsApp', actionType: 'whatsapp' },
      ],
    };
  }

  // 8. 3D Avatar Fit Studio
  if (
    query.includes('3d') ||
    query.includes('avatar') ||
    query.includes('virtual') ||
    query.includes('camera') ||
    query.includes('photo') ||
    query.includes('try on') ||
    query.includes('tryon')
  ) {
    return {
      reply: `🕶️ **AXDORO Biometric 3D Avatar & Virtual Fit Studio:**\n\nYou can calibrate an interactive 3D model of yourself based on your height, weight, and uploaded photo. It calculates your chest breadth, plots a 360° orbital drape of the garment, and shows live anatomical tension hotspots (shoulder drop and chest breathing ease).`,
      actionButtons: [
        { label: '🚀 Launch 3D Avatar Fit Studio', actionType: 'open3DStudio' },
        { label: '🛍️ Add Drops to Bag', actionType: 'navigate', payload: 'shop' },
      ],
    };
  }

  // 9. Recommendations / Best Drops
  if (
    query.includes('recommend') ||
    query.includes('best') ||
    query.includes('popular') ||
    query.includes('drop') ||
    query.includes('collection') ||
    query.includes('trending')
  ) {
    const featured = catalog.slice(0, 3);
    return {
      reply: `🔥 **Top Curated AXDORO Drops for You:**\n\nHere are three of our most sought-after silhouettes crafted with 240 GSM combed cotton and high-density 3D puff detailing:`,
      actionButtons: [
        { label: '⚡ View All 200+ Drops', actionType: 'navigate', payload: 'shop' },
        { label: '🕶️ Fit Studio on These Drops', actionType: 'open3DStudio' },
      ],
      suggestedProducts: featured,
    };
  }

  // 10. Greetings & Friendly Assistant Intro
  if (
    query === 'hi' ||
    query === 'hello' ||
    query === 'hey' ||
    query === 'vanakkam' ||
    query.startsWith('hi ') ||
    query.startsWith('hello ') ||
    query === 'help'
  ) {
    return {
      reply: `Vanakkam! 👋 I am your **AXDORO AI Concierge & Stylist**.\n\nI can calculate your exact size from your **height & weight**, explain our **240 GSM anti-cling fabric**, recommend streetwear drops, or check Tamil Nadu delivery speeds.\n\nHow can I elevate your wardrobe today?`,
      actionButtons: [
        { label: '📏 Calculate My Size', actionType: 'open3DStudio' },
        { label: '🧵 Why 240 GSM?', actionType: 'navigate', payload: 'shop' },
        { label: '🔥 Top Streetwear Drops', actionType: 'navigate', payload: 'shop' },
      ],
    };
  }

  // Fallback: Smart guidance
  const generalProducts = catalog.slice(0, 2);
  return {
    reply: `I can help you find your exact fit, explore our **240 GSM combed cotton silhouettes**, or answer delivery and sizing questions.\n\nTry telling me your **height & weight** (e.g. *"I'm 178cm and 76kg"*), or choose a quick topic below:`,
    actionButtons: [
      { label: '📏 Find My Size (Height/Weight)', actionType: 'open3DStudio' },
      { label: '🧵 240 GSM Fabric Science', actionType: 'navigate', payload: 'shop' },
      { label: '💬 Talk to Human Stylist', actionType: 'whatsapp' },
    ],
    suggestedProducts: generalProducts,
  };
}
