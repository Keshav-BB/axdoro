import React, { useState, useMemo } from 'react';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Plus,
  Trash2,
  FileText,
  ShieldCheck,
  Search,
  Users,
  Activity,
  Download,
  CheckCircle2,
  Layers,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { DEMO_ADMIN_CREDENTIALS } from '../../data/demoAccounts';
import { Product, OrderStatus } from '../../types';
import { formatINR } from '../../utils/currency';

type AdminTab = 
  | 'overview' 
  | 'products' 
  | 'orders' 
  | 'inventory' 
  | 'sales-report' 
  | 'demographics-report' 
  | 'performance-report';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    orders,
    updateProduct,
    addProduct,
    deleteProduct,
    updateOrderStatus,
    setSelectedOrder,
    setIsInvoiceOpen,
    setCurrentView,
    showToast,
    adminLogout,
  } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    const tabParam = new URLSearchParams(window.location.search).get('tab');
    if (tabParam && ['overview', 'products', 'orders', 'inventory', 'sales-report', 'demographics-report', 'performance-report'].includes(tabParam)) {
      return tabParam as AdminTab;
    }
    return 'overview';
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productPage, setProductPage] = useState(1);
  const [orderSearch, setOrderSearch] = useState('');

  // KPI Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalGSTCollected = orders.reduce((sum, o) => sum + o.gstAmount, 0);
  const lowStockThreshold = 8;
  const lowStockProducts = products.filter((p) =>
    p.sizes.some((s) => s.stock < lowStockThreshold)
  );

  // Stock Valuation
  const totalStockUnits = products.reduce(
    (total, p) => total + p.sizes.reduce((sTot, s) => sTot + s.stock, 0),
    0
  );
  const totalStockValuation = products.reduce(
    (total, p) =>
      total + p.price * p.sizes.reduce((sTot, s) => sTot + s.stock, 0),
    0
  );

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'oversized' | 'half-sleeve' | 'acid-wash' | 'graphic'>('oversized');
  const [newProdPrice, setNewProdPrice] = useState(999);
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState(1499);
  const [newProdGsm, setNewProdGsm] = useState(240);
  const [newProdFabric, setNewProdFabric] = useState('240 GSM 100% Combed Heavyweight Cotton');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `axd-${Date.now().toString().slice(-4)}`;
    const newProd: Product = {
      id: newId,
      name: newProdName,
      slug: newProdName.toLowerCase().replace(/\s+/g, '-'),
      category: newProdCategory,
      categoryLabel: 
        newProdCategory === 'oversized' ? 'Oversized Streetwear' :
        newProdCategory === 'half-sleeve' ? 'Half-Sleeve Minimal' :
        newProdCategory === 'acid-wash' ? 'Acid & Mineral Wash' : 'Cyber Typography Drop',
      price: Number(newProdPrice),
      originalPrice: Number(newProdOriginalPrice),
      gsm: Number(newProdGsm),
      fabric: newProdFabric,
      description: `${newProdName} crafted from premium ${newProdGsm} GSM heavyweight combed compact cotton.`,
      highlights: [
        `${newProdGsm} GSM dense knit drape`,
        'Reinforced thick collar ribbing',
        'Bio-washed and anti-shrink treated',
      ],
      images: [
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
      ],
      spinImages: [
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
      ],
      sizes: [
        { size: 'XS', stock: 15 },
        { size: 'S', stock: 20 },
        { size: 'M', stock: 25 },
        { size: 'L', stock: 20 },
        { size: 'XL', stock: 15 },
        { size: 'XXL', stock: 10 },
      ],
      colors: [
        { name: 'Pitch Black', hex: '#111111', code: 'blk' },
        { name: 'Bone Off-White', hex: '#f4f3ec', code: 'wht' },
      ],
      rating: 5.0,
      reviewCount: 1,
      isFeatured: true,
      isNewDrop: true,
      tags: ['New Release', '240 GSM', 'Streetwear'],
    };

    addProduct(newProd);
    setIsAddModalOpen(false);
    setNewProdName('');
    showToast(`Published new 240 GSM silhouette "${newProd.name}"`, 'success');
  };

  const handleUpdatePrice = (productId: string, price: number, originalPrice: number) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    updateProduct({ ...prod, price, originalPrice });
  };

  // Filtered Products for Catalog Management
  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      productSearch === '' ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.id.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [products, productSearch]);

  const productsPerPage = 15;
  const totalProductPages = Math.ceil(filteredProducts.length / productsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (productPage - 1) * productsPerPage,
    productPage * productsPerPage
  );

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        orderSearch === '' ||
        o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.trackingNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.city.toLowerCase().includes(orderSearch.toLowerCase())
    );
  }, [orders, orderSearch]);

  // CSV Export Utilities
  const exportCSV = (filename: string, rows: string[][]) => {
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded ${filename}.csv report`, 'success');
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn text-zinc-900 font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-700 font-mono font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>AXDORO BACK-OFFICE INTELLIGENCE & CONTROL SUITE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950 tracking-tight mt-1">
            Enterprise Admin Portal
          </h1>
          <p className="text-xs text-zinc-500 font-sans">
            Full analytics suite: Sales, 200-product inventory, performance funnel, and visitor age/category affinity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Admin User Chip */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-xs shadow-xs">
            <div className="w-6 h-6 rounded-full bg-zinc-950 text-amber-400 font-mono text-[10px] font-bold flex items-center justify-center">
              {DEMO_ADMIN_CREDENTIALS.avatar}
            </div>
            <div>
              <div className="font-mono text-zinc-900 font-bold leading-tight">
                {DEMO_ADMIN_CREDENTIALS.name}
              </div>
              <div className="text-[10px] text-zinc-500 font-sans">
                {DEMO_ADMIN_CREDENTIALS.role}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              adminLogout();
              setCurrentView('home');
              window.location.hash = '';
            }}
            className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="End administrator session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('home');
              window.location.hash = '';
            }}
            className="px-3.5 py-2 bg-white hover:bg-zinc-100 text-zinc-800 rounded-xl text-xs font-mono font-semibold transition-colors border border-zinc-200 shadow-xs cursor-pointer"
          >
            ← View Storefront
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 bg-zinc-950 hover:bg-zinc-800 text-white px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add New Variant</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-200 scrollbar-none">
        {[
          { id: 'overview', label: 'Executive Overview', icon: TrendingUp },
          { id: 'products', label: `Products Catalog (${products.length})`, icon: Package },
          { id: 'orders', label: `Orders & Logistics (${orders.length})`, icon: ShoppingBag },
          { id: 'inventory', label: `Inventory & Valuation`, icon: AlertTriangle },
          { id: 'sales-report', label: 'Sales & GST Report', icon: FileText },
          { id: 'demographics-report', label: 'Visitor & Age Affinity', icon: Users },
          { id: 'performance-report', label: 'Performance & Funnel', icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-zinc-950 text-white shadow-md'
                  : 'bg-white text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 border border-zinc-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-zinc-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-zinc-500 text-xs font-mono">
                <span>Total Gross Revenue</span>
                <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black text-zinc-950 font-mono">{formatINR(totalRevenue)}</div>
              <div className="text-[11px] text-emerald-700 font-mono font-medium">100% Razorpay Captured</div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-zinc-500 text-xs font-mono">
                <span>Total Active Products</span>
                <span className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                  <Package className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black text-zinc-950 font-mono">{products.length} Drops</div>
              <div className="text-[11px] text-zinc-500 font-mono">{totalStockUnits.toLocaleString()} units in warehouse</div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-zinc-500 text-xs font-mono">
                <span>Warehouse Stock Valuation</span>
                <span className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                  <Layers className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black text-amber-800 font-mono">{formatINR(totalStockValuation)}</div>
              <div className="text-[11px] text-zinc-500 font-mono">240 GSM inventory asset</div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-zinc-500 text-xs font-mono">
                <span>Monthly Active Visitors</span>
                <span className="p-2 bg-purple-50 text-purple-700 rounded-xl">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black text-zinc-950 font-mono">48,250</div>
              <div className="text-[11px] text-emerald-600 font-mono">↑ 28.4% MoM organic growth</div>
            </div>
          </div>

          {/* Snapshot Grid: Quick Analytics & Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Visitor Age Distribution Widget */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                    Visitor Age Distribution
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('demographics-report')}
                  className="text-xs text-amber-700 font-semibold hover:underline"
                >
                  Full Report →
                </button>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { range: '18–24 yrs', pct: 45, label: 'Gen Z / Cyber Drops', count: '21.7k' },
                  { range: '25–34 yrs', pct: 36, label: 'Urban / Boxy Solids', count: '17.4k' },
                  { range: '35–44 yrs', pct: 15, label: 'Mineral Washed Connoisseurs', count: '7.2k' },
                  { range: '45+ yrs', pct: 4, label: 'Minimalist & Casual', count: '1.9k' },
                ].map((item) => (
                  <div key={item.range} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="font-bold text-zinc-800">{item.range}</span>
                      <span className="text-zinc-500">{item.count} ({item.pct}%)</span>
                    </div>
                    <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-zinc-900 h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.pct}%` }}
                      ></div>
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Performance Metrics Widget */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                    Storefront Health & Vitals
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('performance-report')}
                  className="text-xs text-amber-700 font-semibold hover:underline"
                >
                  Full Funnel →
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="text-[10px] uppercase font-mono text-zinc-500">Checkout Rate</div>
                  <div className="text-lg font-bold font-mono text-emerald-700 mt-1">74.2%</div>
                  <div className="text-[10px] text-zinc-400">Add-to-cart conversion</div>
                </div>
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="text-[10px] uppercase font-mono text-zinc-500">Page Speed (LCP)</div>
                  <div className="text-lg font-bold font-mono text-zinc-900 mt-1">0.62s</div>
                  <div className="text-[10px] text-emerald-600">Grade A (Instant)</div>
                </div>
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="text-[10px] uppercase font-mono text-zinc-500">Exchange Rate</div>
                  <div className="text-lg font-bold font-mono text-blue-700 mt-1">1.38%</div>
                  <div className="text-[10px] text-zinc-400">Industry avg: 12%</div>
                </div>
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="text-[10px] uppercase font-mono text-zinc-500">Customer Rating</div>
                  <div className="text-lg font-bold font-mono text-amber-600 mt-1">4.92 ★</div>
                  <div className="text-[10px] text-zinc-400">890+ verified reviews</div>
                </div>
              </div>
            </div>

            {/* Quick Stock Alarms Widget */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                    Inventory Alarms ({lowStockProducts.length})
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className="text-xs text-amber-700 font-semibold hover:underline"
                >
                  Manage All →
                </button>
              </div>

              <div className="space-y-2.5 overflow-y-auto max-h-[220px] pr-1">
                {lowStockProducts.slice(0, 4).map((p) => {
                  const depleted = p.sizes.filter((s) => s.stock < lowStockThreshold);
                  return (
                    <div key={p.id} className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-zinc-900 truncate max-w-[150px]">{p.name}</div>
                        <div className="text-[10px] text-amber-800 font-mono">
                          Low: {depleted.map((s) => `${s.size} (${s.stock})`).join(', ')}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const restocked = p.sizes.map((s) => ({
                            ...s,
                            stock: s.stock < 15 ? 25 : s.stock,
                          }));
                          updateProduct({ ...p, sizes: restocked });
                          showToast(`Restocked ${p.name}`, 'success');
                        }}
                        className="px-2 py-1 bg-white hover:bg-zinc-100 text-zinc-900 rounded border border-zinc-200 text-[10px] font-bold shadow-xs"
                      >
                        +25 units
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-950 font-serif uppercase tracking-wider">
                Recent Customer Orders
              </h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs text-amber-800 hover:text-amber-900 font-mono font-semibold"
              >
                View All Orders →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 text-zinc-600 font-mono uppercase border-b border-zinc-200">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Courier</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-mono">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-zinc-950">#{order.id}</td>
                      <td className="py-3 px-4 text-zinc-900 font-sans font-semibold">
                        {order.customerName}
                      </td>
                      <td className="py-3 px-4 text-zinc-500">{order.city}, TN</td>
                      <td className="py-3 px-4 font-bold text-zinc-950">{formatINR(order.total)}</td>
                      <td className="py-3 px-4 text-zinc-500">{order.courier}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsInvoiceOpen(true);
                          }}
                          className="text-amber-800 hover:text-amber-950 font-bold p-1 text-xs"
                          title="Print Invoice"
                        >
                          Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS CATALOG (200 ITEMS) */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  setProductPage(1);
                }}
                placeholder="Search by name, ID, or category..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-zinc-500">
                Showing <strong>{(productPage - 1) * productsPerPage + 1}–{Math.min(productPage * productsPerPage, filteredProducts.length)}</strong> of <strong>{filteredProducts.length}</strong> items
              </span>
              <button
                onClick={() =>
                  exportCSV(
                    'axdoro_200_products_catalog',
                    [
                      ['ID', 'Name', 'Category', 'Price', 'GSM', 'Fabric', 'Total Stock', 'Rating'],
                      ...products.map((p) => [
                        p.id,
                        `"${p.name}"`,
                        p.category,
                        p.price.toString(),
                        p.gsm.toString(),
                        `"${p.fabric}"`,
                        p.sizes.reduce((t, s) => t + s.stock, 0).toString(),
                        p.rating.toString(),
                      ]),
                    ]
                  )
                }
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-50"
              >
                <Download className="w-3.5 h-3.5 text-zinc-500" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 text-zinc-600 font-mono uppercase border-b border-zinc-200">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Fabric</th>
                    <th className="py-3 px-4">Price (INR)</th>
                    <th className="py-3 px-4">Stock by Size (XS–XXL)</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {paginatedProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-zinc-100 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-zinc-900 line-clamp-1">{p.name}</div>
                            <div className="text-[10px] text-zinc-400 font-mono">ID: {p.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono capitalize bg-zinc-100 text-zinc-700 border border-zinc-200">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-500 font-mono text-[11px]">
                        {p.gsm} GSM Combed
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-mono">
                          <input
                            type="number"
                            value={p.price}
                            onChange={(e) =>
                              handleUpdatePrice(p.id, Number(e.target.value), p.originalPrice)
                            }
                            className="w-16 p-1 border border-zinc-200 rounded font-bold text-zinc-900 text-xs bg-zinc-50"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 font-mono text-[10px]">
                          {p.sizes.map((s) => (
                            <div
                              key={s.size}
                              className={`px-1.5 py-0.5 rounded text-center ${
                                s.stock < lowStockThreshold
                                  ? 'bg-red-100 text-red-800 font-bold border border-red-200'
                                  : 'bg-zinc-100 text-zinc-700'
                              }`}
                            >
                              <span className="text-zinc-400">{s.size}:</span> {s.stock}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-amber-600 font-bold">
                        ★ {p.rating}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-600 rounded transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between p-4 border-t border-zinc-200 bg-white">
              <span className="text-xs text-zinc-500 font-mono">
                Page {productPage} of {totalProductPages}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setProductPage((p) => Math.max(1, p - 1))}
                  disabled={productPage === 1}
                  className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setProductPage((p) => Math.min(totalProductPages, p + 1))}
                  disabled={productPage === totalProductPages}
                  className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS & LOGISTICS */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search by Order ID, tracking, customer..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-900"
              />
            </div>

            <button
              onClick={() =>
                exportCSV(
                  'axdoro_orders_manifest',
                  [
                    ['Order ID', 'Tracking Number', 'Customer Name', 'City', 'Phone', 'Items Count', 'Total', 'Payment Status', 'Courier Status'],
                    ...orders.map((o) => [
                      o.id,
                      o.trackingNumber,
                      `"${o.customerName}"`,
                      o.city,
                      o.phone,
                      o.items.length.toString(),
                      o.total.toString(),
                      o.paymentStatus,
                      o.status,
                    ]),
                  ]
                )
              }
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-50"
            >
              <Download className="w-3.5 h-3.5 text-zinc-500" />
              <span>Export Shiprocket Manifest CSV</span>
            </button>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 text-zinc-600 font-mono uppercase border-b border-zinc-200">
                  <tr>
                    <th className="py-3 px-4">Order & AWB</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Garments Ordered</th>
                    <th className="py-3 px-4">Total & GST</th>
                    <th className="py-3 px-4">Courier Partner</th>
                    <th className="py-3 px-4">Dispatch Status</th>
                    <th className="py-3 px-4 text-right">Tax Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-mono">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-zinc-950">#{order.id}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">{order.trackingNumber}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-zinc-900 font-sans">{order.customerName}</div>
                        <div className="text-[10px] text-zinc-500">{order.city}, TN • {order.phone}</div>
                      </td>
                      <td className="py-3 px-4 font-sans text-xs">
                        {order.items.map((i) => (
                          <div key={i.id} className="truncate max-w-[200px] text-zinc-700">
                            {i.quantity}x {i.product.name} ({i.selectedSize})
                          </div>
                        ))}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-zinc-950">{formatINR(order.total)}</div>
                        <div className="text-[10px] text-zinc-400">GST: {formatINR(order.gstAmount)}</div>
                      </td>
                      <td className="py-3 px-4 text-zinc-500 text-xs font-sans">
                        {order.courier}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value as OrderStatus)
                          }
                          className="text-[11px] font-bold py-1 px-2 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-900 cursor-pointer focus:outline-none"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsInvoiceOpen(true);
                          }}
                          className="px-3 py-1 bg-zinc-900 text-white rounded-lg text-xs font-bold hover:bg-zinc-800 transition-colors"
                        >
                          Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INVENTORY & VALUATION REPORT */}
      {activeTab === 'inventory' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Inventory Valuation Header */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">
                Total Inventory Valuation
              </span>
              <div className="text-2xl font-black font-mono text-zinc-950">
                {formatINR(totalStockValuation)}
              </div>
              <div className="text-[11px] text-zinc-500 font-mono">
                Asset worth based on wholesale selling prices
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">
                Total Physical Units
              </span>
              <div className="text-2xl font-black font-mono text-emerald-700">
                {totalStockUnits.toLocaleString()} Pcs
              </div>
              <div className="text-[11px] text-zinc-500 font-mono">
                Across 200 items in Tiruppur central facility
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">
                Low Stock Critical Alerts
              </span>
              <div className="text-2xl font-black font-mono text-amber-700">
                {lowStockProducts.length} Items
              </div>
              <div className="text-[11px] text-zinc-500 font-mono">
                Sizes with fewer than 8 garments left
              </div>
            </div>
          </div>

          {/* Size Velocity Distribution Analysis */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-950 font-serif uppercase tracking-wider">
              Garment Size Demand Velocity (Oversized Trend Analysis)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              {[
                { size: 'XS', share: '6%', velocity: 'Moderate', color: 'bg-zinc-100 text-zinc-700' },
                { size: 'S', share: '12%', velocity: 'Steady', color: 'bg-zinc-100 text-zinc-700' },
                { size: 'M', share: '20%', velocity: 'High', color: 'bg-blue-50 text-blue-800' },
                { size: 'L', share: '34%', velocity: 'Highest Volume', color: 'bg-emerald-50 text-emerald-800 font-bold' },
                { size: 'XL', share: '22%', velocity: 'Fast Depleting', color: 'bg-amber-50 text-amber-800 font-bold' },
                { size: 'XXL', share: '6%', velocity: 'Steady', color: 'bg-zinc-100 text-zinc-700' },
              ].map((s) => (
                <div key={s.size} className={`p-3.5 rounded-xl border border-zinc-200 text-center ${s.color}`}>
                  <div className="font-mono font-black text-base">{s.size}</div>
                  <div className="font-mono text-xs mt-0.5">{s.share} Sales</div>
                  <div className="text-[10px] opacity-75 mt-1">{s.velocity}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Management List */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-950 font-serif uppercase tracking-wider">
                Variant Restock Console ({lowStockProducts.length} items flagged)
              </h3>
              <button
                onClick={() => {
                  products.forEach((p) => {
                    const hasLow = p.sizes.some((s) => s.stock < lowStockThreshold);
                    if (hasLow) {
                      const restocked = p.sizes.map((s) => ({
                        ...s,
                        stock: s.stock < 15 ? 25 : s.stock,
                      }));
                      updateProduct({ ...p, sizes: restocked });
                    }
                  });
                  showToast('Batch restocked all low-stock variants to 25+ units!', 'success');
                }}
                className="px-4 py-2 bg-zinc-950 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-colors shadow-sm"
              >
                ⚡ Bulk Restock All Flagged Items (+25 Units)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 line-clamp-1">{p.name}</h4>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        {p.gsm} GSM • {p.categoryLabel}
                      </div>
                    </div>
                    <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-mono font-bold">
                      Low Stock
                    </span>
                  </div>

                  <div className="grid grid-cols-6 gap-1 text-center font-mono text-xs">
                    {p.sizes.map((s) => (
                      <div
                        key={s.size}
                        className={`p-1 rounded ${
                          s.stock < lowStockThreshold
                            ? 'bg-red-200 text-red-900 font-bold'
                            : 'bg-white text-zinc-700 border border-zinc-200'
                        }`}
                      >
                        <div className="text-[10px] font-bold text-zinc-500">{s.size}</div>
                        <div>{s.stock}</div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      const restocked = p.sizes.map((s) => ({
                        ...s,
                        stock: s.stock < 15 ? 25 : s.stock,
                      }));
                      updateProduct({ ...p, sizes: restocked });
                      showToast(`Restocked ${p.name} to 25 units`, 'success');
                    }}
                    className="w-full py-1.5 bg-white hover:bg-zinc-100 text-zinc-900 text-xs font-bold rounded-lg border border-zinc-300 shadow-xs"
                  >
                    Restock All Sizes (+25 Units)
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SALES & GST REPORT */}
      {activeTab === 'sales-report' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
              <div>
                <h3 className="text-sm font-bold text-zinc-950 font-mono uppercase tracking-wider">
                  Official Tamil Nadu GST & Turnover Statement
                </h3>
                <p className="text-xs text-zinc-500">
                  Compliant with Section 31 of CGST Act. Applicable HSN 61091000 for Cotton Knitted T-Shirts.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    exportCSV('axdoro_gst_sales_ledger', [
                      ['Order ID', 'Date', 'Customer', 'Base Value', 'CGST (2.5%)', 'SGST (2.5%)', 'Total Invoice'],
                      ...orders.map((o) => [
                        o.id,
                        o.createdAt,
                        `"${o.customerName}"`,
                        (o.total - o.gstAmount).toFixed(2),
                        (o.gstAmount / 2).toFixed(2),
                        (o.gstAmount / 2).toFixed(2),
                        o.total.toFixed(2),
                      ]),
                    ])
                  }
                  className="px-3.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-800 hover:bg-zinc-50 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Export GST Ledger
                </button>
              </div>
            </div>

            {/* Tax Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1">
                <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">
                  Total Taxable Turnover
                </span>
                <div className="text-xl font-black font-mono text-zinc-950">
                  {formatINR(totalRevenue - totalGSTCollected)}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono">Net Base Value</div>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1">
                <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">
                  Intra-State CGST (2.5%)
                </span>
                <div className="text-xl font-black font-mono text-amber-800">
                  {formatINR(totalGSTCollected / 2)}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono">Central Tax Payable</div>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1">
                <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">
                  Intra-State SGST (2.5%)
                </span>
                <div className="text-xl font-black font-mono text-amber-800">
                  {formatINR(totalGSTCollected / 2)}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono">Tamil Nadu State Tax Payable</div>
              </div>
            </div>

            {/* Payment Method Breakdown */}
            <div className="p-5 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                Payment Channel Distribution (Razorpay Gateway)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-white rounded-lg border border-zinc-200 text-center">
                  <div className="text-xs font-semibold text-zinc-600">UPI (GPay / PhonePe)</div>
                  <div className="text-lg font-bold font-mono text-emerald-700 mt-0.5">68.4%</div>
                  <div className="text-[10px] text-zinc-400">Zero MDR rate</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-zinc-200 text-center">
                  <div className="text-xs font-semibold text-zinc-600">Credit / Debit Cards</div>
                  <div className="text-lg font-bold font-mono text-zinc-900 mt-0.5">22.1%</div>
                  <div className="text-[10px] text-zinc-400">Visa / Mastercard / RuPay</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-zinc-200 text-center">
                  <div className="text-xs font-semibold text-zinc-600">Net Banking</div>
                  <div className="text-lg font-bold font-mono text-zinc-900 mt-0.5">6.8%</div>
                  <div className="text-[10px] text-zinc-400">HDFC / ICICI / SBI</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-zinc-200 text-center">
                  <div className="text-xs font-semibold text-zinc-600">Wallets & PayLater</div>
                  <div className="text-lg font-bold font-mono text-zinc-900 mt-0.5">2.7%</div>
                  <div className="text-[10px] text-zinc-400">Instant credit lines</div>
                </div>
              </div>
            </div>

            {/* Statutory Corporate Details */}
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs space-y-2 text-zinc-600 font-mono">
              <div className="text-zinc-950 font-bold">GSTIN Registration: 33AAAAA0000A1Z5</div>
              <div>Principal Place of Business: Tiruppur & Chennai, Tamil Nadu, 641603</div>
              <div>Primary Commodity: Knitted / Crocheted Cotton T-Shirts (HSN: 61091000)</div>
              <div>State Code: 33 (Tamil Nadu) • Reverse Charge Mechanism: NO</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: VISITOR RATE & AGE CATEGORY DEMOGRAPHICS REPORT */}
      {activeTab === 'demographics-report' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-zinc-200 shadow-xs space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-500">Monthly Visitors</span>
              <div className="text-2xl font-black font-mono text-zinc-950">48,250</div>
              <div className="text-[10px] text-emerald-600 font-mono">↑ 28.4% this month</div>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-zinc-200 shadow-xs space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-500">Avg Session Duration</span>
              <div className="text-2xl font-black font-mono text-zinc-950">4m 38s</div>
              <div className="text-[10px] text-zinc-500 font-mono">High 3D Studio engagement</div>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-zinc-200 shadow-xs space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-500">Bounce Rate</span>
              <div className="text-2xl font-black font-mono text-emerald-700">26.8%</div>
              <div className="text-[10px] text-emerald-600 font-mono">Well below 45% standard</div>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-zinc-200 shadow-xs space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-500">Peak Browsing Window</span>
              <div className="text-2xl font-black font-mono text-amber-700">8 PM–11 PM</div>
              <div className="text-[10px] text-zinc-500 font-mono">IST Evening shopping rush</div>
            </div>
          </div>

          {/* Age Category Breakdown Matrix */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
              <div>
                <h3 className="text-sm font-bold text-zinc-950 font-serif uppercase tracking-wider">
                  Visitor Age Demographics & Category Affinity Intelligence
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Correlation of shopper age brackets with garment silhouette preferences and conversion rates.
                </p>
              </div>

              <button
                onClick={() =>
                  exportCSV('axdoro_visitor_age_demographics', [
                    ['Age Bracket', 'Visitor Share', 'Monthly Visitors', 'Primary Category Affinity', 'Avg Order Value', 'Mobile Share'],
                    ['18-24 yrs', '44.8%', '21616', 'Cyber & 3D Puff Prints (58%)', 'Rs. 1199', '88%'],
                    ['25-34 yrs', '36.2%', '17466', 'Oversized Boxy Solids (64%)', 'Rs. 2140', '68%'],
                    ['35-44 yrs', '14.5%', '6996', 'Acid & Mineral Wash (52%)', 'Rs. 1850', '58%'],
                    ['45+ yrs', '4.5%', '2172', 'Half-Sleeve Minimalist (72%)', 'Rs. 1499', '42%'],
                  ])
                }
                className="px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-800 hover:bg-zinc-50 flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" /> Export Report CSV
              </button>
            </div>

            {/* Age Cohorts Detailed Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Cohort 1: 18–24 */}
              <div className="p-5 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <h4 className="font-bold text-zinc-950 text-sm font-mono">Age 18–24 (Gen Z Streetwear)</h4>
                  </div>
                  <span className="text-xs font-bold font-mono bg-white px-2.5 py-1 rounded-full border border-zinc-200 text-zinc-900">
                    44.8% (21,616 visitors)
                  </span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Driven by streetwear aesthetics, drop culture, and oversized fits for college and weekend socials.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                  <div className="bg-white p-2.5 rounded-lg border border-zinc-200">
                    <span className="text-[10px] text-zinc-400 block">Top Category:</span>
                    <strong className="text-zinc-900 text-xs">Cyber & 3D Puff Graphics (58%)</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-zinc-200">
                    <span className="text-[10px] text-zinc-400 block">Device Channel:</span>
                    <strong className="text-zinc-900 text-xs">88% Mobile (iOS & Android)</strong>
                  </div>
                </div>
              </div>

              {/* Cohort 2: 25–34 */}
              <div className="p-5 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <h4 className="font-bold text-zinc-950 text-sm font-mono">Age 25–34 (Urban Creatives & Tech)</h4>
                  </div>
                  <span className="text-xs font-bold font-mono bg-white px-2.5 py-1 rounded-full border border-zinc-200 text-zinc-900">
                    36.2% (17,466 visitors)
                  </span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  High purchasing power; prefer structural boxy silhouettes for casual office Fridays and café work sessions.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                  <div className="bg-white p-2.5 rounded-lg border border-zinc-200">
                    <span className="text-[10px] text-zinc-400 block">Top Category:</span>
                    <strong className="text-zinc-900 text-xs">Oversized Solids & Boxy (64%)</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-zinc-200">
                    <span className="text-[10px] text-zinc-400 block">Avg Order Value:</span>
                    <strong className="text-emerald-700 text-xs">₹2,140 (Multi-unit bundles)</strong>
                  </div>
                </div>
              </div>

              {/* Cohort 3: 35–44 */}
              <div className="p-5 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <h4 className="font-bold text-zinc-950 text-sm font-mono">Age 35–44 (Textile Connoisseurs)</h4>
                  </div>
                  <span className="text-xs font-bold font-mono bg-white px-2.5 py-1 rounded-full border border-zinc-200 text-zinc-900">
                    14.5% (6,996 visitors)
                  </span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Deeply value 240 GSM weight and longevity; prefer muted mineral washes and discrete branding.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                  <div className="bg-white p-2.5 rounded-lg border border-zinc-200">
                    <span className="text-[10px] text-zinc-400 block">Top Category:</span>
                    <strong className="text-zinc-900 text-xs">Acid & Mineral Washes (52%)</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-zinc-200">
                    <span className="text-[10px] text-zinc-400 block">Customer Retention:</span>
                    <strong className="text-blue-700 text-xs">31% Repeat Purchase Rate</strong>
                  </div>
                </div>
              </div>

              {/* Cohort 4: 45+ */}
              <div className="p-5 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                    <h4 className="font-bold text-zinc-950 text-sm font-mono">Age 45+ (Casual & Gifting)</h4>
                  </div>
                  <span className="text-xs font-bold font-mono bg-white px-2.5 py-1 rounded-full border border-zinc-200 text-zinc-900">
                    4.5% (2,172 visitors)
                  </span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Focus on half-sleeve classic cuts, premium pure cotton comfort, and gifts for family.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                  <div className="bg-white p-2.5 rounded-lg border border-zinc-200">
                    <span className="text-[10px] text-zinc-400 block">Top Category:</span>
                    <strong className="text-zinc-900 text-xs">Half-Sleeve Street Classics (72%)</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-zinc-200">
                    <span className="text-[10px] text-zinc-400 block">Return Rate:</span>
                    <strong className="text-purple-700 text-xs">&lt; 0.5% (Extremely low)</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Regional & Device Traffic Distribution */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                  Regional Traffic Breakdown
                </h5>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span>Chennai Metropolitan</span>
                    <strong className="text-zinc-900">34.2%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Coimbatore & Tiruppur Hub</span>
                    <strong className="text-zinc-900">23.8%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Bengaluru & Hyderabad</span>
                    <strong className="text-zinc-900">18.5%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Madurai, Salem & Trichy</span>
                    <strong className="text-zinc-900">12.1%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Mumbai, Delhi NCR & Others</span>
                    <strong className="text-zinc-900">11.4%</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                  Traffic Acquisition Channels
                </h5>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span>Instagram Drop Links & Stories</span>
                    <strong className="text-amber-700">46.5%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Direct Brand Type-In (AXDORO.COM)</span>
                    <strong className="text-zinc-900">27.8%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Organic Google Search ("240 GSM Tamil Nadu")</span>
                    <strong className="text-zinc-900">15.7%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>WhatsApp Community Referrals</span>
                    <strong className="text-emerald-700">10.0%</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: PERFORMANCE & CONVERSION FUNNEL REPORT */}
      {activeTab === 'performance-report' && (
        <div className="space-y-6 animate-fadeIn">
          {/* E-Commerce Conversion Funnel */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
              <div>
                <h3 className="text-sm font-bold text-zinc-950 font-serif uppercase tracking-wider">
                  Full Storefront Conversion Funnel
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Session progression from catalog discovery to successful Razorpay settlement.
                </p>
              </div>

              <button
                onClick={() =>
                  exportCSV('axdoro_funnel_performance', [
                    ['Stage', 'Visitors/Sessions', 'Transition Rate', 'Drop-off Rate'],
                    ['1. Catalog Discovery', '142800', '100%', '0%'],
                    ['2. Product Detail Page View', '34250', '24.0%', '76.0%'],
                    ['3. Added to Cart', '3840', '11.2%', '88.8%'],
                    ['4. Checkout Initiated', '2980', '77.6%', '22.4%'],
                    ['5. Completed Razorpay Payment', '2210', '74.2%', '25.8%'],
                  ])
                }
                className="px-3.5 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-800 hover:bg-zinc-50 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Export Funnel CSV
              </button>
            </div>

            {/* Funnel Steps */}
            <div className="space-y-3">
              {[
                { stage: '1. Garment Catalog Impressions', count: '142,800', pct: 100, note: 'Home & Shop collection views' },
                { stage: '2. Product Detail & 3D Studio Views', count: '34,250', pct: 24, note: '24.0% view depth' },
                { stage: '3. Added to Bag (Cart Creation)', count: '3,840', pct: 11.2, note: '11.2% add-to-bag intent' },
                { stage: '4. Initiated Checkout', count: '2,980', pct: 8.7, note: '77.6% cart-to-checkout conversion' },
                { stage: '5. Completed Orders (Paid)', count: '2,210', pct: 6.4, note: '74.2% payment completion rate' },
              ].map((step) => (
                <div key={step.stage} className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono">
                    <span className="font-bold text-zinc-900">{step.stage}</span>
                    <div className="flex items-center gap-3">
                      <strong className="text-zinc-900">{step.count}</strong>
                      <span className="text-zinc-400">({step.note})</span>
                    </div>
                  </div>
                  <div className="w-full bg-zinc-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-zinc-900 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(4, step.pct)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Overall Conversion Highlight */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Overall Storefront Conversion Rate: 1.55%</span>
              </div>
              <span className="font-mono text-emerald-800 text-[11px]">
                Exceeds Indian D2C Fashion Benchmark (1.10%)
              </span>
            </div>
          </div>

          {/* Web Vitals & Core Speed Metrics */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-zinc-950 font-serif uppercase tracking-wider">
              Technical Speed & Core Web Vitals (CWV)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className="text-xs font-mono text-zinc-500">Largest Contentful Paint (LCP)</div>
                <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">0.62s</div>
                <div className="text-[10px] text-zinc-500 mt-1">Vite bundle optimization + WebP images</div>
              </div>
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className="text-xs font-mono text-zinc-500">Interaction to Next Paint (INP)</div>
                <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">12ms</div>
                <div className="text-[10px] text-zinc-500 mt-1">Instant UI reaction on mobile touch</div>
              </div>
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className="text-xs font-mono text-zinc-500">Cumulative Layout Shift (CLS)</div>
                <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">0.00</div>
                <div className="text-[10px] text-zinc-500 mt-1">Zero visual jank or unexpected shifting</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Variant Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white border border-zinc-300 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-zinc-950 font-serif uppercase tracking-wider">
              Add New 240 GSM Garment Drop
            </h3>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-zinc-600 uppercase mb-1 font-semibold">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Acid Wash Obsidian Boxy Tee"
                  className="w-full bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 p-2.5 rounded-xl focus:outline-none focus:border-zinc-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-600 uppercase mb-1 font-semibold">
                    Category
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as any)}
                    className="w-full bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 p-2.5 rounded-xl focus:outline-none cursor-pointer"
                  >
                    <option value="oversized">Oversized Streetwear</option>
                    <option value="half-sleeve">Half-Sleeve Minimal</option>
                    <option value="acid-wash">Acid & Mineral Wash</option>
                    <option value="graphic">Cyber Typography</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-600 uppercase mb-1 font-semibold">
                    Fabric GSM
                  </label>
                  <input
                    type="number"
                    value={newProdGsm}
                    onChange={(e) => setNewProdGsm(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 p-2.5 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-600 uppercase mb-1 font-semibold">
                    Selling Price (INR)
                  </label>
                  <input
                    type="number"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 p-2.5 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-600 uppercase mb-1 font-semibold">
                    Original Price (INR)
                  </label>
                  <input
                    type="number"
                    value={newProdOriginalPrice}
                    onChange={(e) => setNewProdOriginalPrice(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 p-2.5 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-600 uppercase mb-1 font-semibold">
                  Fabric Composition
                </label>
                <input
                  type="text"
                  value={newProdFabric}
                  onChange={(e) => setNewProdFabric(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 p-2.5 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-zinc-100 text-zinc-700 text-xs rounded-xl hover:bg-zinc-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-zinc-950 text-white text-xs font-bold rounded-xl hover:bg-zinc-800 font-mono uppercase"
                >
                  Publish Variant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
