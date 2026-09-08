import { Product, TShirtSize, ColorOption } from '../types';

const IMAGES_POOL = [
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1000&q=80',
];

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

const STYLES = [
  'Acid-Wash Heavyweight', 'Core Boxy Drop-Shoulder', '3D Puff Typography', 'Mineral Pigment Washed',
  'Architectural Relaxed', 'Japanese Minimalist', 'High-Density Screen Print', 'Heavy French Terry',
  'Cyber Punk Graphic', 'Raw Edge Streetwear', 'Brutalist Line Art', 'Essential Oversized',
  'Tactile Rubberized Hem', 'Micro Coordinate Drop', 'Vintage Enzyme Wash', 'Twin-Stitch Tailored'
];

export const generate200Products = (): Product[] => {
  const products: Product[] = [];
  const categories: Array<{ id: Product['category']; label: string }> = [
    { id: 'oversized', label: 'Oversized Streetwear' },
    { id: 'half-sleeve', label: 'Half-Sleeve Minimal' },
    { id: 'acid-wash', label: 'Acid & Mineral Wash' },
    { id: 'graphic', label: 'Cyber & Typography Drops' },
    { id: 'minimalist', label: 'Core Minimalist' },
  ];

  let idCounter = 1;

  for (let i = 0; i < 200; i++) {
    const prefix = PREFIXES[i % PREFIXES.length];
    const style = STYLES[(i * 3 + Math.floor(i / PREFIXES.length)) % STYLES.length];
    const catObj = categories[i % categories.length];
    const name = `${prefix} ${style}`;
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${idCounter}`;
    
    // Realistic pricing: 799, 899, 949, 999, 1049, 1099, 1199, 1299
    const priceTiers = [799, 849, 899, 949, 999, 1049, 1099, 1199, 1249, 1299];
    const price = priceTiers[i % priceTiers.length];
    const originalPrice = Math.round((price * 1.45) / 50) * 50 - 1; // 45% markup strikethrough

    // Image rotation
    const img1 = IMAGES_POOL[i % IMAGES_POOL.length];
    const img2 = IMAGES_POOL[(i + 1) % IMAGES_POOL.length];
    const img3 = IMAGES_POOL[(i + 2) % IMAGES_POOL.length];

    // Color choices
    const c1 = COLORS_POOL[i % COLORS_POOL.length];
    const c2 = COLORS_POOL[(i + 2) % COLORS_POOL.length];
    const c3 = COLORS_POOL[(i + 4) % COLORS_POOL.length];

    // Realistic size stock
    const baseStock = 5 + (i % 18);
    const sizes = [
      { size: 'XS' as TShirtSize, stock: Math.max(2, baseStock - 3) },
      { size: 'S' as TShirtSize, stock: baseStock + 4 },
      { size: 'M' as TShirtSize, stock: baseStock + 8 },
      { size: 'L' as TShirtSize, stock: baseStock + 6 },
      { size: 'XL' as TShirtSize, stock: Math.max(3, baseStock + 2) },
      { size: 'XXL' as TShirtSize, stock: Math.max(1, baseStock - 2) },
    ];

    const rating = Math.round((4.6 + (i % 5) * 0.08) * 10) / 10;
    const reviewCount = 20 + ((i * 17) % 350);

    products.push({
      id: `axd-${String(idCounter).padStart(3, '0')}`,
      name,
      slug,
      category: catObj.id,
      categoryLabel: catObj.label,
      price,
      originalPrice,
      gsm: 240,
      fabric: '240 GSM 100% Super-Combed Heavyweight Cotton (Bio-Washed)',
      description: `The ${name} is engineered for architectural drape with our dense 240 GSM combed cotton weave, reinforced 1.25" non-sag ribbed collar, and double-needle hem construction. Knit and pre-shrunk in Tamil Nadu mills.`,
      highlights: [
        '240 GSM Heavyweight French Terry / Cotton weave',
        'Drop-shoulder silhouette with generous armhole room',
        '1.25" Lycra-reinforced collar that prevents sagging',
        'Bio-washed and enzyme treated for smooth handfeel',
        'Pre-shrunk to retain dimensional stability after washing',
      ],
      images: [img1, img2, img3],
      spinImages: [img1, img2, img3, img1, img2, img1],
      sizes,
      colors: [c1, c2, c3],
      rating: Math.min(5.0, rating),
      reviewCount,
      isFeatured: i < 12 || i % 15 === 0,
      isNewDrop: i % 4 === 0,
      tags: ['240 GSM', catObj.label, 'Tamil Nadu Made', 'Heavyweight', 'Streetwear'],
    });

    idCounter++;
  }

  return products;
};
