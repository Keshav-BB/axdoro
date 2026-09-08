import React, { useState } from 'react';
import {
  Search,
  Truck,
  CheckCircle2,
  MapPin,
  FileText,
  MessageCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import { formatINR } from '../../utils/currency';
import { getWhatsAppSupportUrl } from '../../utils/whatsapp';

export const OrderTracking: React.FC = () => {
  const { orders, setSelectedOrder, setIsInvoiceOpen } = useStore();
  const [lookupQuery, setLookupQuery] = useState(orders[0]?.id || 'AXD-8492');
  const [activeOrder, setActiveOrder] = useState<Order | null>(orders[0] || null);
  const [hasSearched, setHasSearched] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const cleaned = lookupQuery.trim().toUpperCase();
    const found = orders.find(
      (o) =>
        o.id.toUpperCase() === cleaned ||
        o.trackingNumber.toUpperCase() === cleaned ||
        o.phone.includes(cleaned)
    );
    setActiveOrder(found || null);
  };

  const getStepState = (targetStatus: OrderStatus, currentStatus: OrderStatus) => {
    const sequence: OrderStatus[] = [
      'Ordered',
      'Packed',
      'Shipped',
      'Out for Delivery',
      'Delivered',
    ];
    const currentIndex = sequence.indexOf(currentStatus);
    const targetIndex = sequence.indexOf(targetStatus);

    if (currentIndex > targetIndex) return 'completed';
    if (currentIndex === targetIndex) return 'current';
    return 'pending';
  };

  const steps: Array<{ status: OrderStatus; label: string; location: string }> = [
    {
      status: 'Ordered',
      label: 'Order Confirmed & Razorpay Paid',
      location: 'AXDORO Cloud HQ',
    },
    {
      status: 'Packed',
      label: 'Packed & Handed to Shiprocket',
      location: 'Tiruppur Fulfillment Center, Tamil Nadu',
    },
    {
      status: 'Shipped',
      label: 'In Transit between Hubs',
      location: 'Chennai Sorting Facility (Hub 33-A)',
    },
    {
      status: 'Out for Delivery',
      label: 'Out for Delivery with Courier Rider',
      location: 'Local Destination Delivery Center',
    },
    {
      status: 'Delivered',
      label: 'Package Handed to Customer',
      location: 'Customer Address',
    },
  ];

  return (
    <div className="py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-300 text-amber-900 px-3.5 py-1 rounded-full text-xs font-mono font-bold shadow-xs">
          <Truck className="w-3.5 h-3.5 text-amber-600" />
          <span>Shiprocket Priority Logistics</span>
        </div>
        <h1 className="text-3xl font-black text-zinc-950 tracking-tight">
          Track Your 240 GSM Order
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 max-w-md mx-auto">
          Enter your AXDORO Order ID (e.g. AXD-8492), AWB Tracking Number, or 10-digit phone number.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto">
        <div className="flex items-center bg-white border border-zinc-300 rounded-full p-1.5 focus-within:border-zinc-950 transition-colors shadow-sm">
          <Search className="w-5 h-5 text-zinc-400 ml-3 shrink-0" />
          <input
            type="text"
            value={lookupQuery}
            onChange={(e) => setLookupQuery(e.target.value)}
            placeholder="e.g. AXD-8492 or phone number"
            className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-zinc-900 focus:outline-none font-mono"
          />
          <button
            type="submit"
            className="bg-zinc-950 hover:bg-zinc-800 text-white font-bold px-6 py-2.5 rounded-full text-xs font-mono transition-colors uppercase tracking-wider shadow-xs"
          >
            Track
          </button>
        </div>
      </form>

      {/* Order Status Display */}
      {activeOrder ? (
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
          {/* Order Snapshot */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-zinc-950 font-mono">
                  Order #{activeOrder.id}
                </span>
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase">
                  {activeOrder.status}
                </span>
              </div>
              <div className="text-xs text-zinc-500 font-mono mt-1">
                Courier: <strong className="text-zinc-900">{activeOrder.courier}</strong> | AWB:{' '}
                <strong className="text-amber-700">{activeOrder.trackingNumber}</strong>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedOrder(activeOrder);
                  setIsInvoiceOpen(true);
                }}
                className="flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold py-2 px-3.5 rounded-full border border-zinc-200 transition-colors font-mono"
              >
                <FileText className="w-3.5 h-3.5 text-zinc-700" />
                <span>GST Invoice</span>
              </button>

              <a
                href={getWhatsAppSupportUrl(`Hello AXDORO, I am checking the status of Order #${activeOrder.id}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold py-2 px-3.5 rounded-full transition-colors font-mono"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Query</span>
              </a>
            </div>
          </div>

          {/* Timeline Visual Steps */}
          <div className="space-y-6">
            <h3 className="text-xs font-mono uppercase text-zinc-500 font-bold tracking-wider">
              Shiprocket Live Journey
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200">
              {steps.map((step, idx) => {
                const state = getStepState(step.status, activeOrder.status);
                return (
                  <div key={idx} className="relative group flex items-start gap-4">
                    {/* Step Icon */}
                    <div
                      className={`absolute -left-6 sm:-left-8 w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs transition-all ${
                        state === 'completed'
                          ? 'bg-emerald-600 text-white font-black shadow-xs'
                          : state === 'current'
                          ? 'bg-amber-500 text-zinc-950 font-black ring-4 ring-amber-200 animate-pulse'
                          : 'bg-zinc-100 text-zinc-400 border border-zinc-300'
                      }`}
                    >
                      {state === 'completed' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      ) : (
                        <span className="text-[10px] font-mono">{idx + 1}</span>
                      )}
                    </div>

                    {/* Step Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4
                          className={`text-xs sm:text-sm font-bold ${
                            state === 'current'
                              ? 'text-zinc-950'
                              : state === 'completed'
                              ? 'text-zinc-900'
                              : 'text-zinc-400'
                          }`}
                        >
                          {step.label}
                        </h4>
                        {state === 'current' && (
                          <span className="text-[10px] font-mono text-amber-800 uppercase font-bold bg-amber-100 px-2 py-0.5 rounded-full w-fit">
                            Active Step
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-500 flex items-center gap-1.5 mt-0.5 font-mono">
                        <MapPin className="w-3 h-3 text-zinc-400" />
                        <span>{step.location}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Address & Items Card */}
          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-zinc-500 font-mono uppercase text-[10px] mb-1 font-semibold">
                Destination Address:
              </div>
              <div className="font-bold text-zinc-950">{activeOrder.customerName}</div>
              <div className="text-zinc-600">{activeOrder.address}</div>
              <div className="text-zinc-600">
                {activeOrder.city}, {activeOrder.state} - {activeOrder.pincode}
              </div>
            </div>

            <div>
              <div className="text-zinc-500 font-mono uppercase text-[10px] mb-1 font-semibold">
                Items in Shipment ({activeOrder.items.length}):
              </div>
              <div className="space-y-1">
                {activeOrder.items.map((item) => (
                  <div key={item.id} className="text-zinc-700 flex justify-between font-mono">
                    <span className="truncate pr-2">
                      {item.product.name} ({item.selectedSize})
                    </span>
                    <span className="font-bold">x{item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 mt-2 border-t border-zinc-200 flex justify-between text-zinc-950 font-mono font-bold">
                <span>Total Paid:</span>
                <span className="text-zinc-950">{formatINR(activeOrder.total)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : hasSearched ? (
        <div className="text-center py-12 bg-white border border-zinc-200 rounded-3xl space-y-3 shadow-xs">
          <p className="text-sm font-semibold text-zinc-900">No Order Found Matching "{lookupQuery}"</p>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Please check your Order ID in your email or try our sample active order{' '}
            <button
              onClick={() => {
                setLookupQuery('AXD-8492');
                setActiveOrder(orders[0]);
              }}
              className="text-amber-800 font-bold underline font-mono"
            >
              AXD-8492
            </button>
          </p>
        </div>
      ) : null}
    </div>
  );
};
