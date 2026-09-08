import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, TShirtSize, ColorOption, OrderStatus, User, UserAddress } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from '../data/initialProducts';

export type ActiveView =
  | 'home'
  | 'shop'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'tracking'
  | 'admin';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  currentView: ActiveView;
  setCurrentView: (view: ActiveView) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;

  // Cart operations
  addToCart: (product: Product, size: TShirtSize, color: ColorOption, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  updateCartItemSize: (cartItemId: string, newSize: TShirtSize) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  // Wishlist operations
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Order & Admin operations
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'trackingNumber'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateProduct: (product: Product) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;

  // Modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAITryOnOpen: boolean;
  setIsAITryOnOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  isInvoiceOpen: boolean;
  setIsInvoiceOpen: (open: boolean) => void;
  isBulkOrderOpen: boolean;
  setIsBulkOrderOpen: (open: boolean) => void;
  isRazorpayModalOpen: boolean;
  setIsRazorpayModalOpen: (open: boolean) => void;
  isPolicyModalOpen: boolean;
  setIsPolicyModalOpen: (open: boolean) => void;
  activePolicyTab: string;
  setActivePolicyTab: (tab: string) => void;
  recentlyViewed: Product[];
  addToRecentlyViewed: (product: Product) => void;

  // User Auth & Profile
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isProfileDrawerOpen: boolean;
  setIsProfileDrawerOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  login: (user: User) => void;
  logout: () => void;
  updateUserProfile: (updated: Partial<User>) => void;
  addSavedAddress: (address: Omit<UserAddress, 'id'>) => void;
  deleteSavedAddress: (addressId: string) => void;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;

  // Admin Authentication
  isAdminAuthenticated: boolean;
  adminLogin: (email: string, password: string, pin?: string) => boolean;
  adminLogout: () => void;
}

export const DEMO_USER_CREDENTIALS = {
  name: 'Karthik Subramanian',
  phone: '9840123456',
  email: 'karthik.sub@gmail.com',
  password: 'axdoro2026',
  otp: '123456',
  tier: 'Obsidian VIP (450 Pts)',
};

export const DEMO_ADMIN_CREDENTIALS = {
  name: 'Vikramaditya Seth',
  role: 'Operations & Inventory Director',
  email: 'admin@axdoro.com',
  password: 'axdoroAdmin2026!',
  pin: '9922',
  avatar: 'VS',
};

export const DEMO_USER: User = {
  id: 'usr_849201',
  name: 'Karthik Subramanian',
  phone: '9840123456',
  email: 'karthik.sub@gmail.com',
  avatar: 'KS',
  loyaltyPoints: 450,
  tier: 'Obsidian VIP',
  preferredSize: 'L',
  addresses: [
    {
      id: 'addr_1',
      label: 'Home',
      street: '42, 2nd Main Road, Anna Nagar West',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600040',
      isDefault: true,
    },
    {
      id: 'addr_2',
      label: 'Office',
      street: 'Block B, DLF Cybercity, Manapakkam',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600089',
      isDefault: false,
    },
  ],
  joinedDate: 'January 2026',
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State with LocalStorage fallbacks (ensure 200-product catalog is loaded)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('axdoro_products_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.length >= 150 &&
          parsed.some((p: Product) => p.category === 'hoodies') &&
          !parsed[0]?.images?.[0]?.includes('1521572267360')
        ) {
          return parsed;
        }
      } catch (e) {}
    }
    // Clear stale legacy caches
    try {
      localStorage.removeItem('axdoro_products_v4');
      localStorage.removeItem('axdoro_products_v3');
      localStorage.removeItem('axdoro_products_v2');
      localStorage.removeItem('axdoro_products');
    } catch (e) {}
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('axdoro_cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          parsed[0]?.product?.images?.[0] &&
          !parsed[0].product.images[0].includes('1521572267360')
        ) {
          return parsed;
        }
      } catch (e) {}
    }
    return [
      {
        id: `${INITIAL_PRODUCTS[0].id}-L-blk`,
        product: INITIAL_PRODUCTS[0],
        selectedSize: 'L',
        selectedColor: INITIAL_PRODUCTS[0].colors[0],
        quantity: 1,
      },
    ];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('axdoro_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('axdoro_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    const saved = localStorage.getItem('axdoro_recently_viewed');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS.slice(0, 4);
  });

  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, 8);
      localStorage.setItem('axdoro_recently_viewed', JSON.stringify(updated));
      return updated;
    });
  };

  const getInitialView = (): ActiveView => {
    const hash = window.location.hash.replace('#', '');
    if (['home', 'shop', 'product-detail', 'cart', 'checkout', 'order-success', 'tracking', 'admin'].includes(hash)) {
      return hash as ActiveView;
    }
    return 'home';
  };

  const [currentView, setCurrentViewState] = useState<ActiveView>(getInitialView);
  const setCurrentView = (view: ActiveView) => {
    setCurrentViewState(view);
    window.location.hash = view;
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'shop', 'product-detail', 'cart', 'checkout', 'order-success', 'tracking', 'admin'].includes(hash)) {
        setCurrentViewState(hash as ActiveView);
      } else if (!hash) {
        setCurrentViewState('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(INITIAL_PRODUCTS[0]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(INITIAL_ORDERS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal states (check URL params for initial state)
  const urlParams = new URLSearchParams(window.location.search);
  const [isCartOpen, setIsCartOpen] = useState(urlParams.get('cart') === 'true');
  const [isAITryOnOpen, setIsAITryOnOpen] = useState(urlParams.get('ai') === 'true');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(urlParams.get('sizeGuide') === 'true');
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(urlParams.get('invoice') === 'true');
  const [isBulkOrderOpen, setIsBulkOrderOpen] = useState(urlParams.get('bulk') === 'true');
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(
    urlParams.get('policy') !== null && urlParams.get('policy') !== 'false'
  );
  const [activePolicyTab, setActivePolicyTab] = useState(
    urlParams.get('policy') && urlParams.get('policy') !== 'true' ? urlParams.get('policy')! : 'shipping'
  );

  // User Auth & Profile State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('axdoro_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    if (urlParams.get('demoUser') === 'true') {
      return DEMO_USER;
    }
    return null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(urlParams.get('login') === 'true');
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(urlParams.get('profile') === 'true');
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>(
    urlParams.get('signup') === 'true' ? 'signup' : 'login'
  );

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('axdoro_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('axdoro_user');
    }
  }, [currentUser]);

  const login = (user: User) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${user.name}!`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    setIsProfileDrawerOpen(false);
    showToast('Signed out of your AXDORO account', 'info');
  };

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return (
      localStorage.getItem('axdoro_admin_auth') === 'true' ||
      urlParams.get('adminAuth') === 'true' ||
      urlParams.get('demoAdmin') === 'true'
    );
  });

  const adminLogin = (email: string, password: string, pin?: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const isEmailValid = cleanEmail === 'admin@axdoro.com' || cleanEmail.endsWith('@axdoro.com');
    const isPasswordValid = password === 'axdoroAdmin2026!' || password === 'axdoro123' || password.length >= 6;
    const isPinValid = !pin || pin === '9922' || pin === '1234' || pin.length === 4;

    if (isEmailValid && isPasswordValid && isPinValid) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('axdoro_admin_auth', 'true');
      showToast('Admin authorized. Welcome back, Vikramaditya.', 'success');
      return true;
    } else {
      showToast('Invalid credentials. Check test credentials and retry.', 'error');
      return false;
    }
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('axdoro_admin_auth');
    showToast('Admin session terminated securely.', 'info');
  };

  const updateUserProfile = (updated: Partial<User>) => {
    if (!currentUser) return;
    const newUser = { ...currentUser, ...updated };
    setCurrentUser(newUser);
    showToast('Account profile updated successfully');
  };

  const addSavedAddress = (address: Omit<UserAddress, 'id'>) => {
    if (!currentUser) return;
    const newAddr: UserAddress = {
      ...address,
      id: `addr_${Date.now()}`,
    };
    const updated = {
      ...currentUser,
      addresses: [...currentUser.addresses, newAddr],
    };
    setCurrentUser(updated);
    showToast(`Saved new address "${address.label}"`);
  };

  const deleteSavedAddress = (addressId: string) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      addresses: currentUser.addresses.filter((a) => a.id !== addressId),
    };
    setCurrentUser(updated);
    showToast('Address removed', 'info');
  };

  // Toast notifications
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('axdoro_products_v5', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('axdoro_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('axdoro_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('axdoro_orders', JSON.stringify(orders));
  }, [orders]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const addToCart = (
    product: Product,
    size: TShirtSize,
    color: ColorOption,
    quantity: number = 1
  ) => {
    const itemId = `${product.id}-${size}-${color.code}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          selectedSize: size,
          selectedColor: color,
          quantity,
        },
      ];
    });
    showToast(`Added "${product.name}" (${size}) to cart`);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const updateCartItemSize = (cartItemId: string, newSize: TShirtSize) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const newId = `${item.product.id}-${newSize}-${item.selectedColor.code}`;
          return {
            ...item,
            id: newId,
            selectedSize: newSize,
          };
        }
        return item;
      })
    );
    showToast(`Garment size adjusted to ${newSize} in bag`, 'success');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'trackingNumber'>): Order => {
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `SR-TN-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `AXD-${orderNum}`,
      trackingNumber: trackingCode,
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrder(newOrder);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
    showToast(`Order #${orderId} status changed to "${status}"`, 'info');
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    showToast(`Product "${updated.name}" updated successfully`);
  };

  const addProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    showToast(`New variant "${newProd.name}" added`);
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product removed from catalog', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        currentView,
        setCurrentView,
        selectedProduct,
        setSelectedProduct,
        selectedOrder,
        setSelectedOrder,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateCartItemSize,
        clearCart,
        cartCount,
        cartSubtotal,
        toggleWishlist,
        isInWishlist,
        createOrder,
        updateOrderStatus,
        updateProduct,
        addProduct,
        deleteProduct,
        isCartOpen,
        setIsCartOpen,
        isAITryOnOpen,
        setIsAITryOnOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        isInvoiceOpen,
        setIsInvoiceOpen,
        isBulkOrderOpen,
        setIsBulkOrderOpen,
        isRazorpayModalOpen,
        setIsRazorpayModalOpen,
        isPolicyModalOpen,
        setIsPolicyModalOpen,
        activePolicyTab,
        setActivePolicyTab,
        recentlyViewed,
        addToRecentlyViewed,
        currentUser,
        setCurrentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isProfileDrawerOpen,
        setIsProfileDrawerOpen,
        authModalMode,
        setAuthModalMode,
        login,
        logout,
        updateUserProfile,
        addSavedAddress,
        deleteSavedAddress,
        toasts,
        showToast,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
