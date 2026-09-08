export type TShirtSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface SizeStock {
  size: TShirtSize;
  stock: number;
}

export interface ColorOption {
  name: string;
  hex: string;
  code: string;
}

export type ProductCategory =
  | 't-shirts'
  | 'shirts'
  | 'pants'
  | 'trousers'
  | 'track-pants'
  | 'shorts'
  | 'collared-tshirts'
  | 'full-sleeve'
  | 'hoodies'
  | 'oversized'
  | 'half-sleeve'
  | 'acid-wash'
  | 'graphic'
  | 'minimalist';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  originalPrice: number;
  gsm: number; // 240 GSM
  fabric: string;
  description: string;
  highlights: string[];
  images: string[];
  spinImages: string[]; // 360 degree frames
  sizes: SizeStock[];
  colors: ColorOption[];
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isNewDrop?: boolean;
  tags: string[];
}

export interface CartItem {
  id: string; // unique item id: product.id + size + color
  product: Product;
  selectedSize: TShirtSize;
  selectedColor: ColorOption;
  quantity: number;
}

export type OrderStatus = 'Ordered' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered';

export interface TrackingEvent {
  status: OrderStatus;
  location: string;
  timestamp: string;
  description: string;
  completed: boolean;
}

export interface Order {
  id: string; // e.g. AXD-9482
  trackingNumber: string; // Shiprocket AWB
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string; // Tamil Nadu
  pincode: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  gstAmount: number;
  total: number;
  paymentMethod: 'Razorpay - UPI' | 'Razorpay - Card' | 'Razorpay - NetBanking';
  paymentStatus: 'Paid' | 'Pending';
  status: OrderStatus;
  courier: string;
  estimatedDelivery: string;
  createdAt: string;
  gstin?: string;
}

export interface BulkOrderEnquiry {
  name: string;
  phone: string;
  email: string;
  companyOrCollege: string;
  quantity: number;
  fitType: '240 GSM Oversized' | '240 GSM Regular Half-Sleeve';
  printType: 'High-Density Screen Print' | 'Puff Print' | 'DTF Print' | 'Embroidery';
  notes: string;
}

export interface UserAddress {
  id: string;
  label: 'Home' | 'Office' | 'Atelier';
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  loyaltyPoints: number;
  tier: 'Bronze' | 'Silver' | 'Obsidian VIP';
  preferredSize: TShirtSize;
  addresses: UserAddress[];
  joinedDate: string;
}

export type AuthMethod =
  | 'phone-password'
  | 'phone-sms-otp'
  | 'phone-whatsapp-otp'
  | 'email-password'
  | 'email-otp';

