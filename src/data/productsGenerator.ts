import { Product, TShirtSize, ColorOption, ProductCategory } from '../types';

const CATEGORY_IMAGES: Record<string, string[]> = {
  't-shirts': [
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=80',
  ],
  'shirts': [
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?auto=format&fit=crop&w=1000&q=80',
  ],
  'pants': [
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1000&q=80',
  ],
  'trousers': [
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1000&q=80',
  ],
  'track-pants': [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1538329972958-465d6d2144ed?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1000&q=80',
  ],
  'shorts': [
    'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1000&q=80',
  ],
  'collared-tshirts': [
    'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=80',
  ],
  'full-sleeve': [
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1618354691229-88d47f285158?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
  ],
  'hoodies': [
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1513789181297-6f2ec112c0bc?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
  ],
};

const COLORS_POOL: ColorOption[] = [
  { name: 'Vintage Acid Black', hex: '#18181b', code: 'blk' },
  { name: 'Bone Off-White', hex: '#f4f3ec', code: 'wht' },
  { name: 'Washed Slate Grey', hex: '#64748b', code: 'gry' },
  { name: 'Terracotta Rust', hex: '#9a3412', code: 'rst' },
  { name: 'Forest Sage Olive', hex: '#3f4233', code: 'olv' },
  { name: 'Cyber Cobalt Blue', hex: '#1e3a8a', code: 'cblt' },
  { name: 'Onyx Charcoal', hex: '#27272a', code: 'chrc' },
  { name: 'Desert Sand Clay', hex: '#d7c4aa', code: 'sand' },
];

const PREFIXES = [
  'Metropolis', 'Neo-Tokyo', 'Chrono', 'Vanguard', 'Monolith', 'Apex', 'Phantom', 'Eclipse',
  'Aura', 'Velocity', 'Krypton', 'Sub-Zero', 'Obsidian', 'Hyperion', 'Nomad', 'Atlas',
  'Titan', 'Zenith', 'Echo', 'Vertex', 'Syndicate', 'Specter', 'Vortex', 'Pulse', 'Cipher'
];

interface CategoryMeta {
  id: ProductCategory;
  label: string;
  gsm: number;
  fabric: string;
  priceRange: [number, number];
  styles: string[];
  highlights: string[];
}

const CATEGORIES_SPEC: CategoryMeta[] = [
  {
    id: 't-shirts',
    label: 'T-Shirts (240 GSM)',
    gsm: 240,
    fabric: '240 GSM 100% Super-Combed Heavyweight Cotton (Bio-Washed)',
    priceRange: [799, 1099],
    styles: [
      'Acid-Wash Drop-Shoulder Tee',
      'Boxy Architectural Heavy Tee',
      '3D High-Density Typography Tee',
      'Mineral Enzyme Washed Tee',
      'Essential Minimalist Tee'
    ],
    highlights: [
      '240 GSM Heavyweight French Terry / Cotton weave',
      'Drop-shoulder silhouette with generous armhole room',
      '1.25" Lycra-reinforced collar that prevents sagging',
      'Bio-washed and enzyme treated for smooth handfeel',
      'Pre-shrunk in Tamil Nadu mills to retain shape'
    ]
  },
  {
    id: 'shirts',
    label: 'Overshirts & Relaxed Shirts',
    gsm: 200,
    fabric: '200 GSM Textured Oxford & Linen-Cotton Structured Weave',
    priceRange: [1199, 1599],
    styles: [
      'Cuban Collar Resort Shirt',
      'Architectural Heavyweight Overshirt',
      'Minimalist Button-Up Boxy Shirt',
      'Textured Camp Collar Utility Shirt',
      'Raw Hem Relaxed Oxford Shirt'
    ],
    highlights: [
      '200 GSM dense breathable linen-cotton weave',
      'Relaxed boxy cut designed for layering over heavyweight tees',
      'Custom engraved matte horn buttons',
      'Twin chest utility pockets with reinforced bartack stitching',
      'Crisp lapel and non-crease pre-washed finish'
    ]
  },
  {
    id: 'pants',
    label: 'Cargo & Utility Pants',
    gsm: 320,
    fabric: '320 GSM High-Density Tactical Cotton Twill',
    priceRange: [1399, 1899],
    styles: [
      'Multi-Pocket Tactical Cargo Pant',
      'Relaxed Fit Utility Workwear Pant',
      'Wide-Leg Skate Chino',
      'Architectural Darted Cargo Pant',
      'Heavy Twill Street Pant'
    ],
    highlights: [
      '320 GSM heavy-duty combed cotton twill',
      'Articulated knee darts for unrestricted movement',
      '6 ergonomic cargo pockets with concealed snap closures',
      'Reinforced seat and crotch gusset for durability',
      'Adjustable toggle cuffs for straight or tapered fit'
    ]
  },
  {
    id: 'trousers',
    label: 'Tailored Pleated Trousers',
    gsm: 280,
    fabric: '280 GSM Structured Pleated Suiting Blend with 2% Elastane',
    priceRange: [1499, 1999],
    styles: [
      'Double-Pleat Wide-Leg Trouser',
      'Aesthetic Relaxed Drape Trouser',
      'Minimalist Tailored Street Trouser',
      'High-Waist Architectural Trouser',
      'Cropped Straight-Leg Trouser'
    ],
    highlights: [
      '280 GSM tailored drape with crisp front double pleats',
      'Hidden elasticated comfort waistband insert',
      'Deep trouser pockets with interior coin pocket',
      'Wide-leg fluid silhouette engineered for chunky sneakers',
      'Wrinkle-resistant luxury suiting finish'
    ]
  },
  {
    id: 'track-pants',
    label: 'Track Pants & Joggers',
    gsm: 360,
    fabric: '360 GSM Heavy Loopback French Terry Cotton',
    priceRange: [1199, 1599],
    styles: [
      'Heavy Loopback Cuffed Jogger',
      'Relaxed Straight-Leg Track Pant',
      'Raw Seam Streetwear Sweatpant',
      'Heavy Terry Lounge Track Pant',
      'Minimalist Tonal Drawcord Jogger'
    ],
    highlights: [
      '360 GSM ultra-heavy loopback French Terry',
      'Thick ribbed elastic waistband with chunky cotton drawstrings',
      'Concealed zippered side pockets to secure phone & wallet',
      'Non-sag ribbed ankle cuffs that stay flush',
      'Zero synthetic polyester blend - 100% breathable cotton'
    ]
  },
  {
    id: 'shorts',
    label: 'Half Pants & Shorts',
    gsm: 260,
    fabric: '260 GSM Bio-Washed Combed Cotton French Terry',
    priceRange: [699, 999],
    styles: [
      'French Terry Drop Shorts',
      'Relaxed Utility Cargo Shorts',
      'Minimalist Everyday Street Shorts',
      'Raw Edge French Terry Lounge Shorts',
      'Athletic Heavy Cotton Shorts'
    ],
    highlights: [
      '260 GSM substantial heavyweight French Terry',
      '7-inch above-knee modern streetwear inseam',
      'Deep slash side pockets with rear welt pocket',
      'Reinforced drawcord channel with metal eyelets',
      'High breathability for peak Tamil Nadu summer comfort'
    ]
  },
  {
    id: 'collared-tshirts',
    label: 'Collared Polos',
    gsm: 250,
    fabric: '250 GSM Luxury Compact Cotton Pique & Ribbed Knit',
    priceRange: [999, 1399],
    styles: [
      'Heavyweight Knit Ribbed Polo',
      'Minimalist Johnny Collar Polo',
      'Structured Pique Drop Polo',
      'Relaxed Fit Street Rugby Polo',
      'Vintage Enzyme Washed Polo'
    ],
    highlights: [
      '250 GSM luxury double-knit cotton pique',
      'Architectural non-curl flat-knit collar and arm cuffs',
      'Buttonless Johnny collar or concealed 2-button placket',
      'Side seam split hems for clean un-tucked drape',
      'Pre-shrunk fabric ensures collar never folds or curls'
    ]
  },
  {
    id: 'full-sleeve',
    label: 'Full-Sleeve T-Shirts',
    gsm: 240,
    fabric: '240 GSM Waffle & Heavy Super-Combed Cotton Knit',
    priceRange: [899, 1299],
    styles: [
      'Drop-Shoulder Long-Sleeve Crewneck',
      'Thermal Waffle Heavyweight Long-Sleeve',
      'Twin-Stitch Architectural Full-Sleeve',
      'Minimalist Cuff Long-Sleeve Tee',
      'Acid-Wash Full-Sleeve Streetwear Tee'
    ],
    highlights: [
      '240 GSM heavy combed cotton / waffle knit',
      'Generously cut drop-shoulder sleeves with relaxed forearm fall',
      'Snug non-stretch ribbed wrist cuffs that stay in place',
      '1.25" non-sag neckline rib matching short-sleeve construction',
      'Optimal layering piece under overshirts or over tank tops'
    ]
  },
  {
    id: 'hoodies',
    label: 'Hoodies (400 GSM)',
    gsm: 400,
    fabric: '400 GSM Ultra-Dense Architectural French Terry Fleece',
    priceRange: [1699, 2499],
    styles: [
      '400 GSM Boxy Heavyweight Hoodie',
      'Double-Layer Hooded Pullover',
      'Minimalist Dropped-Shoulder Hoodie',
      'Cyber 3D Puff Graphic Hoodie',
      'Vintage Mineral Washed Heavy Hoodie'
    ],
    highlights: [
      '400 GSM ultra-heavy French Terry fleece that holds its shape',
      'Double-layer self-fabric hood that stands upright without collapsing',
      'Seamless kangaroo pocket with bartack reinforced corners',
      'Wide 2.5" thick ribbed hem and cuffs',
      'No drawstrings for a clean, architectural runway aesthetic'
    ]
  }
];

export const generate200Products = (): Product[] => {
  const products: Product[] = [];
  let idCounter = 1;

  for (let i = 0; i < 200; i++) {
    const spec = CATEGORIES_SPEC[i % CATEGORIES_SPEC.length];
    const prefix = PREFIXES[i % PREFIXES.length];
    const style = spec.styles[(Math.floor(i / CATEGORIES_SPEC.length) + i) % spec.styles.length];
    const name = `${prefix} ${style}`;
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${idCounter}`;

    // Price within category range
    const [pMin, pMax] = spec.priceRange;
    const step = 50;
    const stepsCount = Math.floor((pMax - pMin) / step) + 1;
    const price = pMin + ((i * 3) % stepsCount) * step;
    const originalPrice = Math.round((price * 1.4) / 50) * 50 - 1;

    // Get images dedicated to this specific category
    const catIndex = Math.floor(i / CATEGORIES_SPEC.length);
    const imgPool = CATEGORY_IMAGES[spec.id] || CATEGORY_IMAGES['t-shirts'];
    const img1 = imgPool[catIndex % imgPool.length];
    const img2 = imgPool[(catIndex + 1) % imgPool.length];
    const img3 = imgPool[(catIndex + 2) % imgPool.length];
    const img4 = imgPool[(catIndex + 3) % imgPool.length];

    // Spin images from category pool (multi-perspective)
    const spinImages = [img1, img2, img3, img4, img2, img1];

    // Color options
    const c1 = COLORS_POOL[i % COLORS_POOL.length];
    const c2 = COLORS_POOL[(i + 2) % COLORS_POOL.length];
    const c3 = COLORS_POOL[(i + 4) % COLORS_POOL.length];

    // Size stock
    const baseStock = 5 + (i % 16);
    const sizes = [
      { size: 'XS' as TShirtSize, stock: Math.max(2, baseStock - 3) },
      { size: 'S' as TShirtSize, stock: baseStock + 4 },
      { size: 'M' as TShirtSize, stock: baseStock + 8 },
      { size: 'L' as TShirtSize, stock: baseStock + 6 },
      { size: 'XL' as TShirtSize, stock: Math.max(3, baseStock + 2) },
      { size: 'XXL' as TShirtSize, stock: Math.max(1, baseStock - 2) },
    ];

    const rating = Math.round((4.6 + (i % 5) * 0.08) * 10) / 10;
    const reviewCount = 20 + ((i * 19) % 320);

    products.push({
      id: `axd-${String(idCounter).padStart(3, '0')}`,
      name,
      slug,
      category: spec.id,
      categoryLabel: spec.label,
      price,
      originalPrice,
      gsm: spec.gsm,
      fabric: spec.fabric,
      description: `The ${name} is engineered for architectural silhouette and enduring comfort. Constructed with our ${spec.fabric}, reinforced seams, and pre-shrunk dimensional stabilization in Tamil Nadu facilities.`,
      highlights: spec.highlights,
      images: [img1, img2, img3],
      spinImages,
      sizes,
      colors: [c1, c2, c3],
      rating: Math.min(5.0, rating),
      reviewCount,
      isFeatured: i < 15 || i % 12 === 0,
      isNewDrop: i % 5 === 0,
      tags: [`${spec.gsm} GSM`, spec.label, 'Tamil Nadu Made', 'Heavyweight', 'Streetwear'],
    });

    idCounter++;
  }

  return products;
};
