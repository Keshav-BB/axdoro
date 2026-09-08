import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/home/HomePage';
import { ProductGrid } from './components/product/ProductGrid';
import { ProductDetailPage } from './components/product/ProductDetailPage';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderSuccessPage } from './components/checkout/OrderSuccessPage';
import { OrderTracking } from './components/tracking/OrderTracking';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginGate } from './components/admin/AdminLoginGate';
import { CartDrawer } from './components/cart/CartDrawer';
import { AITryOnModal } from './components/product/AITryOnModal';
import { SizeGuideModal } from './components/product/SizeGuideModal';
import { GSTInvoiceModal } from './components/invoice/GSTInvoiceModal';
import { BulkOrderModal } from './components/custom/BulkOrderModal';
import { PolicyModal } from './components/policy/PolicyModal';
import { AuthModal } from './components/auth/AuthModal';
import { UserProfileDrawer } from './components/auth/UserProfileDrawer';
import { MessageCircle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { getWhatsAppSupportUrl } from './utils/whatsapp';

const MainContent: React.FC = () => {
  const {
    currentView,
    selectedProduct,
    isAITryOnOpen,
    setIsAITryOnOpen,
    isSizeGuideOpen,
    setIsSizeGuideOpen,
    toasts,
    isAdminAuthenticated,
  } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] text-zinc-900 selection:bg-amber-400 selection:text-zinc-950 font-sans">
      {/* Top Banner & Navigation */}
      <AnnouncementBar />
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && <HomePage />}
        {currentView === 'shop' && <ProductGrid />}
        {currentView === 'product-detail' && <ProductDetailPage />}
        {currentView === 'checkout' && <CheckoutPage />}
        {currentView === 'order-success' && <OrderSuccessPage />}
        {currentView === 'tracking' && <OrderTracking />}
        {currentView === 'admin' && (isAdminAuthenticated ? <AdminDashboard /> : <AdminLoginGate />)}
      </main>

      {/* Footer */}
      <Footer />

      {/* Persistent Global Modals */}
      <CartDrawer />

      {selectedProduct && (
        <AITryOnModal
          product={selectedProduct}
          isOpen={isAITryOnOpen}
          onClose={() => setIsAITryOnOpen(false)}
        />
      )}

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      <GSTInvoiceModal />
      <BulkOrderModal />
      <PolicyModal />
      <AuthModal />
      <UserProfileDrawer />

      {/* Floating WhatsApp Support Button */}
      <aside aria-label="Customer Support" className="fixed bottom-6 right-6 z-40">
        <a
          href={getWhatsAppSupportUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl shadow-emerald-500/30 transition-all hover:scale-105"
          title="WhatsApp Stylist Support"
        >
          <MessageCircle className="w-6 h-6 sm:w-5 sm:h-5 text-zinc-950" />
          <span className="hidden sm:inline text-xs font-mono font-bold tracking-tight">
            WhatsApp Help
          </span>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-zinc-950 animate-ping"></span>
        </a>
      </aside>

      {/* Toast Notification Container */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto px-4 py-3 rounded-2xl shadow-xl border text-xs font-mono font-medium flex items-center gap-2.5 animate-fadeIn ${
              t.type === 'success'
                ? 'bg-white border-emerald-300 text-emerald-900 shadow-emerald-500/10'
                : t.type === 'error'
                ? 'bg-white border-red-300 text-red-900 shadow-red-500/10'
                : 'bg-white border-zinc-200 text-zinc-900'
            }`}
          >
            {t.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
            {t.type === 'error' && <AlertCircle className="w-4 h-4 text-red-600" />}
            {t.type === 'info' && <Info className="w-4 h-4 text-amber-600" />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
