import React, { useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  FileText, 
  Building2, 
  HelpCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Printer, 
} from 'lucide-react';

export const PolicyModal: React.FC = () => {
  const { isPolicyModalOpen, setIsPolicyModalOpen, activePolicyTab, setActivePolicyTab } = useStore();

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsPolicyModalOpen(false);
    };
    if (isPolicyModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPolicyModalOpen, setIsPolicyModalOpen]);

  if (!isPolicyModalOpen) return null;

  const tabs = [
    { id: 'shipping', label: 'Shipping & Delivery', icon: Truck, badge: 'Free in TN' },
    { id: 'returns', label: '7-Day Return & Size Exchange', icon: RotateCcw, badge: 'Easy Pickup' },
    { id: 'privacy', label: 'Privacy & Data Protection', icon: ShieldCheck, badge: 'DPDP 2023' },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText, badge: 'Legal' },
    { id: 'compliance', label: 'GST & Corporate Compliance', icon: Building2, badge: 'GSTIN Verified' },
    { id: 'support', label: 'Customer Support & FAQ', icon: HelpCircle, badge: '9AM-8PM' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-5xl max-h-[90vh] bg-[#faf9f6] text-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 flex flex-col overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 text-amber-400 flex items-center justify-center font-serif text-lg font-bold shadow-md">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight font-serif text-zinc-900">
                  AXDORO Legal & Customer Trust Suite
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                  100% Verified
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-sans">
                Official policies, corporate registration, GST transparency, and customer service commitments.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors title='Print Policy'"
              title="Print policy document"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsPolicyModalOpen(false)}
              className="p-2 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body: Split Layout with Sidebar Tabs */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-72 bg-zinc-50/90 border-r border-zinc-200 p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
            <div className="space-y-1.5">
              <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Policy Sections
              </div>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activePolicyTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActivePolicyTab(tab.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-zinc-900 text-white shadow-md'
                        : 'text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-zinc-400'}`} />
                      <span>{tab.label}</span>
                    </div>
                    {tab.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                        isActive ? 'bg-zinc-800 text-amber-300' : 'bg-zinc-200 text-zinc-600'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Support Quick Contact card */}
            <div className="mt-6 p-3.5 bg-white rounded-xl border border-zinc-200 shadow-sm text-xs space-y-2">
              <div className="font-semibold text-zinc-800 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                Customer Concierge
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Direct WhatsApp & phone assistance for size consultation and shipment updates.
              </p>
              <div className="font-mono text-xs font-semibold text-zinc-900">
                +91 98401 23456
              </div>
              <div className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                Mon - Sat: 9:00 AM - 8:00 PM IST
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#faf9f6] text-zinc-800 space-y-6">
            {/* 1. SHIPPING POLICY */}
            {activePolicyTab === 'shipping' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-zinc-200 pb-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-medium mb-2">
                    <Truck className="w-3.5 h-3.5" /> Fulfilment SLA & Dispatch Matrix
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-zinc-900">
                    Shipping & Delivery Policy
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Last updated: September 2026 • Dispatched from Tiruppur Knitwear Hub, Tamil Nadu
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                    <div className="text-amber-700 font-serif font-bold text-lg mb-1">FREE</div>
                    <div className="text-xs font-bold text-zinc-800">Across Tamil Nadu</div>
                    <div className="text-[11px] text-zinc-500 mt-1">
                      On all prepaid orders. Delivered within 24–48 hours across all 38 districts.
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                    <div className="text-zinc-900 font-serif font-bold text-lg mb-1">2:00 PM IST</div>
                    <div className="text-xs font-bold text-zinc-800">Same-Day Dispatch SLA</div>
                    <div className="text-[11px] text-zinc-500 mt-1">
                      Orders placed before 2:00 PM IST leave our warehouse the very same afternoon.
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                    <div className="text-emerald-700 font-serif font-bold text-lg mb-1">Real-Time</div>
                    <div className="text-xs font-bold text-zinc-800">SMS & WhatsApp Alerts</div>
                    <div className="text-[11px] text-zinc-500 mt-1">
                      Live AWB tracking via Shiprocket, BlueDart Express, Delhivery & DTDC.
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-xs leading-relaxed text-zinc-600 bg-white p-6 rounded-xl border border-zinc-200">
                  <h4 className="text-sm font-bold text-zinc-900 font-serif">1. Delivery Timelines by Region</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-200 text-zinc-400 text-[11px] uppercase">
                          <th className="py-2 font-medium">Destination Zone</th>
                          <th className="py-2 font-medium">Estimated Delivery</th>
                          <th className="py-2 font-medium">Carrier Partner</th>
                          <th className="py-2 font-medium text-right">Standard Shipping Cost</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 font-mono text-[11px]">
                        <tr>
                          <td className="py-2.5 font-sans font-medium text-zinc-900">Tamil Nadu (Chennai, CBE, Tiruppur, Madurai)</td>
                          <td className="py-2.5 text-emerald-700 font-medium font-sans">24 – 48 Hours</td>
                          <td className="py-2.5">BlueDart / DTDC Air</td>
                          <td className="py-2.5 text-right font-bold text-emerald-600">FREE</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-sans font-medium text-zinc-900">South India (Karnataka, Kerala, AP, Telangana)</td>
                          <td className="py-2.5 font-sans">2 – 3 Business Days</td>
                          <td className="py-2.5">Shiprocket Surface/Air</td>
                          <td className="py-2.5 text-right font-bold text-emerald-600">FREE</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-sans font-medium text-zinc-900">Rest of India (Metro & Non-Metro Cities)</td>
                          <td className="py-2.5 font-sans">3 – 5 Business Days</td>
                          <td className="py-2.5">Delhivery / BlueDart</td>
                          <td className="py-2.5 text-right font-bold text-emerald-600">FREE (Orders &gt; ₹499)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h4 className="text-sm font-bold text-zinc-900 font-serif pt-2">2. Packaging & Environmental Standard</h4>
                  <p>
                    All AXDORO 240 GSM garments are packed in custom 100% biodegradable cornstarch polybags sealed with moisture-resistant tape. Heavyweight T-shirts feature branded silicone hangtags and inner anti-crease tissue wrap to preserve collar structure during transit.
                  </p>

                  <h4 className="text-sm font-bold text-zinc-900 font-serif pt-2">3. Address Correction & Delivery Attempts</h4>
                  <p>
                    Couriers will make up to 3 delivery attempts. Customers can adjust their delivery address or reschedule delivery time directly using the SMS/WhatsApp tracking link dispatched upon shipment.
                  </p>
                </div>
              </div>
            )}

            {/* 2. RETURNS & SIZE EXCHANGE POLICY */}
            {activePolicyTab === 'returns' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-zinc-200 pb-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-medium mb-2">
                    <RotateCcw className="w-3.5 h-3.5" /> 7-Day Fit Guarantee
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-zinc-900">
                    7-Day Return & Size Exchange Policy
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Hassle-free doorstep exchanges across all sizes (XS to XXL)
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                    <div className="text-amber-700 font-serif font-bold text-lg mb-1">7 Days</div>
                    <div className="text-xs font-bold text-zinc-800">Return & Exchange Window</div>
                    <div className="text-[11px] text-zinc-500 mt-1">
                      From the confirmed moment of delivery recorded by the courier partner.
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                    <div className="text-emerald-700 font-serif font-bold text-lg mb-1">Free Reverse</div>
                    <div className="text-xs font-bold text-zinc-800">Doorstep Courier Pickup</div>
                    <div className="text-[11px] text-zinc-500 mt-1">
                      Our courier agent picks up the item from your doorstep. No printing required.
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                    <div className="text-zinc-900 font-serif font-bold text-lg mb-1">48 Hours</div>
                    <div className="text-xs font-bold text-zinc-800">Instant UPI/Bank Refund</div>
                    <div className="text-[11px] text-zinc-500 mt-1">
                      Processed directly to your original payment account or store wallet.
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-xs leading-relaxed text-zinc-600 bg-white p-6 rounded-xl border border-zinc-200">
                  <h4 className="text-sm font-bold text-zinc-900 font-serif">1. Eligibility Criteria for Exchange / Return</h4>
                  <ul className="space-y-2 list-disc pl-4 text-zinc-700">
                    <li><strong>Condition:</strong> The 240 GSM garment must be unworn, unwashed, free of perfume or deodorant marks, with original tags intact.</li>
                    <li><strong>Fit Exchanges:</strong> If your oversized T-shirt feels roomier or more fitted than desired, exchange for XS, S, M, L, XL, or XXL with zero surcharge.</li>
                    <li><strong>Manufacturing Defects:</strong> Any stitching defect, fabric blemish, or puff-print misalignment reported within 48 hours is eligible for an instant replacement dispatch before reverse pickup.</li>
                  </ul>

                  <h4 className="text-sm font-bold text-zinc-900 font-serif pt-2">2. Step-by-Step Exchange Flow</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                      <div className="font-bold text-zinc-900 text-xs mb-1">Step 1: Initiate</div>
                      <p className="text-[11px] text-zinc-500">
                        Go to Order Tracking (#tracking) or WhatsApp our hotline with your Order ID (e.g. AXD-8492).
                      </p>
                    </div>
                    <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                      <div className="font-bold text-zinc-900 text-xs mb-1">Step 2: Doorstep Handover</div>
                      <p className="text-[11px] text-zinc-500">
                        Hand over the garment in its original bag. The pickup agent scans the return AWB.
                      </p>
                    </div>
                    <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                      <div className="font-bold text-zinc-900 text-xs mb-1">Step 3: New Size Dispatch</div>
                      <p className="text-[11px] text-zinc-500">
                        Your replacement size is dispatched immediately with priority express tracking.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. PRIVACY & DATA PROTECTION */}
            {activePolicyTab === 'privacy' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-zinc-200 pb-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-medium mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" /> India DPDP Act 2023 & IT Act 2000
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-zinc-900">
                    Privacy & Data Protection Policy
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Your digital privacy, payment tokenization, and personal information safeguards
                  </p>
                </div>

                <div className="space-y-4 text-xs leading-relaxed text-zinc-600 bg-white p-6 rounded-xl border border-zinc-200">
                  <h4 className="text-sm font-bold text-zinc-900 font-serif">1. Information We Collect</h4>
                  <p>
                    AXDORO collects personal information strictly required to deliver your bespoke apparel orders:
                  </p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Full Name, Shipping Address, Pincode, and District for courier routing.</li>
                    <li>Mobile Phone Number for delivery OTPs and WhatsApp dispatch notifications.</li>
                    <li>Email Address for GST tax invoices and digital order receipts.</li>
                    <li>Optional Body Measurements / Fit Preferences when using the AI Fit Studio or 3D viewer.</li>
                  </ul>

                  <h4 className="text-sm font-bold text-zinc-900 font-serif pt-2">2. Payment Security & PCI-DSS Tokenization</h4>
                  <p>
                    <strong>AXDORO does NOT store, process, or record your Debit/Credit Card CVV, Card Number, or UPI PINs on our servers.</strong> All payments are handled directly by RBI-authorized payment aggregator <strong>Razorpay Software Private Limited</strong> via 256-bit SSL encrypted PCI-DSS Level 1 compliant gateways.
                  </p>

                  <h4 className="text-sm font-bold text-zinc-900 font-serif pt-2">3. Zero Third-Party Data Selling Commitment</h4>
                  <p>
                    We never rent, sell, or monetize customer identity or shopping preferences to ad brokers or third-party marketers. Your data is accessed solely by authenticated logistics partners (Shiprocket, BlueDart) to execute physical package delivery.
                  </p>

                  <h4 className="text-sm font-bold text-zinc-900 font-serif pt-2">4. Your Data Subject Rights</h4>
                  <p>
                    Under the Digital Personal Data Protection Act, 2023, you retain the right to review, update, or permanently delete your customer account profile and purchase history. To exercise this, email <span className="font-mono text-zinc-900">privacy@axdoro.com</span>.
                  </p>
                </div>
              </div>
            )}

            {/* 4. TERMS & CONDITIONS */}
            {activePolicyTab === 'terms' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-zinc-200 pb-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-medium mb-2">
                    <FileText className="w-3.5 h-3.5" /> Commercial Agreement
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-zinc-900">
                    Terms & Conditions of Sale
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Governed by the laws of India • Jurisdiction: Courts of Chennai & Tiruppur
                  </p>
                </div>

                <div className="space-y-4 text-xs leading-relaxed text-zinc-600 bg-white p-6 rounded-xl border border-zinc-200">
                  <h4 className="text-sm font-bold text-zinc-900 font-serif">1. Fabric & Product Specifications</h4>
                  <p>
                    Every AXDORO garment is manufactured in compliance with Tiruppur export-grade standards using 100% Combed Compact Cotton at an authentic weight of 240 GSM (±3% manufacturing tolerance). All garments are bio-washed and pre-shrunk to achieve dimensional stability under 1% after initial domestic cold wash.
                  </p>

                  <h4 className="text-sm font-bold text-zinc-900 font-serif pt-2">2. Pricing, GST & Taxes</h4>
                  <p>
                    All prices displayed on the storefront are inclusive of Goods and Services Tax (GST) at 5% for apparel under ₹1000 and 12% for luxury custom drops, in accordance with the Central Goods and Services Tax (CGST) and Tamil Nadu Goods and Services Tax (SGST) Acts.
                  </p>

                  <h4 className="text-sm font-bold text-zinc-900 font-serif pt-2">3. Intellectual Property Rights</h4>
                  <p>
                    The trademark "AXDORO", the proprietary logo, 3D photogrammetry garment scans, puff-print artworks, typography, and site software are exclusive intellectual properties of AXDORO Apparels Pvt. Ltd. Unauthorized reproduction or commercial emulation is strictly prohibited.
                  </p>

                  <h4 className="text-sm font-bold text-zinc-900 font-serif pt-2">4. Order Cancellations</h4>
                  <p>
                    Orders can be cancelled free of charge at any time prior to warehouse courier dispatch (typically within 2 hours of payment confirmation). Once a shipment label has been generated and handed to the carrier, customers may use the 7-day exchange/return flow upon delivery.
                  </p>
                </div>
              </div>
            )}

            {/* 5. GST & CORPORATE COMPLIANCE */}
            {activePolicyTab === 'compliance' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-zinc-200 pb-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-medium mb-2">
                    <Building2 className="w-3.5 h-3.5" /> Corporate Legal Identity & Taxation
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-zinc-900">
                    GST & Corporate Compliance
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Registered entity information and statutory tax disclosures
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-sm space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Corporate Entity Name
                    </div>
                    <div className="font-serif font-bold text-base text-zinc-900">
                      AXDORO APPARELS PRIVATE LIMITED
                    </div>
                    <div className="text-xs text-zinc-600">
                      CIN: <span className="font-mono text-zinc-900">U18101TN2024PTC168920</span>
                    </div>
                    <div className="text-xs text-zinc-600">
                      Incorporation Date: 14 January 2024, ROC Chennai
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-sm space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      GST Identification Number
                    </div>
                    <div className="font-mono font-bold text-lg text-emerald-700">
                      33AAAAA0000A1Z5
                    </div>
                    <div className="text-xs text-zinc-600">
                      State Code: <span className="font-medium text-zinc-900">33 (Tamil Nadu)</span>
                    </div>
                    <div className="text-xs text-zinc-600">
                      GST Status: <span className="text-emerald-700 font-medium">Active & Fully Compliant</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-xs leading-relaxed text-zinc-600 bg-white p-6 rounded-xl border border-zinc-200">
                  <h4 className="text-sm font-bold text-zinc-900 font-serif">HSN Code Classification & B2B Input Tax Credit</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-mono text-xs">
                      <thead>
                        <tr className="border-b border-zinc-200 text-zinc-400 text-[11px] uppercase">
                          <th className="py-2">HSN Code</th>
                          <th className="py-2">Commodity Description</th>
                          <th className="py-2">Fabric Weight</th>
                          <th className="py-2 text-right">Standard GST Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        <tr>
                          <td className="py-2.5 font-bold text-zinc-900">61091000</td>
                          <td className="py-2.5 font-sans">T-shirts, singlets and other vests, knitted or crocheted, of cotton</td>
                          <td className="py-2.5">240 GSM Compact Combed</td>
                          <td className="py-2.5 text-right font-bold text-emerald-700">5.0% GST</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-bold text-zinc-900">61099090</td>
                          <td className="py-2.5 font-sans">T-shirts of other textile materials (Acid wash / Terry blends)</td>
                          <td className="py-2.5">240 GSM Terry Blend</td>
                          <td className="py-2.5 text-right font-bold text-emerald-700">5.0% GST</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h4 className="text-sm font-bold text-zinc-900 font-serif pt-2">Registered Offices & Manufacturing Hubs</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                      <div className="font-bold text-zinc-900 mb-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        Manufacturing & Dispatch Hub
                      </div>
                      <p className="text-zinc-600 text-[11px] leading-relaxed">
                        Plot 14/82, Avinashi Road, Near Rayapuram Cotton Market,<br />
                        Tiruppur, Tamil Nadu – 641603, India.
                      </p>
                    </div>
                    <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                      <div className="font-bold text-zinc-900 mb-1 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-zinc-700" />
                        Chennai Corporate & Design Atelier
                      </div>
                      <p className="text-zinc-600 text-[11px] leading-relaxed">
                        Suite 4B, 22 Khader Nawaz Khan Road, Nungambakkam,<br />
                        Chennai, Tamil Nadu – 600006, India.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. SUPPORT & FAQ */}
            {activePolicyTab === 'support' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-zinc-200 pb-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-medium mb-2">
                    <HelpCircle className="w-3.5 h-3.5" /> Dedicated Assistance & Care Guide
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-zinc-900">
                    Customer Support & FAQ
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Everything you need to know about 240 GSM care, sizing, and order assistance
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-sm space-y-1">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-xs text-zinc-900">WhatsApp & Phone</div>
                    <div className="text-sm font-mono font-semibold text-emerald-700">+91 98401 23456</div>
                    <div className="text-[11px] text-zinc-500">Mon - Sat: 9 AM to 8 PM</div>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-sm space-y-1">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-xs text-zinc-900">Concierge Email</div>
                    <div className="text-sm font-mono font-semibold text-blue-700">support@axdoro.com</div>
                    <div className="text-[11px] text-zinc-500">Replies within 2 hours</div>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-sm space-y-1">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-2">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-xs text-zinc-900">Flagship Studio</div>
                    <div className="text-xs font-semibold text-zinc-800">Khader Nawaz Khan Rd</div>
                    <div className="text-[11px] text-zinc-500">Chennai, Tamil Nadu</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-zinc-900 font-serif">Frequently Asked Questions</h4>
                  
                  <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-sm space-y-1.5">
                    <div className="font-bold text-xs text-zinc-900">
                      Q: What makes 240 GSM heavyweight fabric superior to regular T-shirts?
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      Standard retail T-shirts weigh between 140–180 GSM and lose drape after a few washes. AXDORO's 240 GSM combed compact cotton provides a structured boxy silhouette, zero sheer transparency, a substantial handfeel, and maximum durability that retains shape wash after wash.
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-sm space-y-1.5">
                    <div className="font-bold text-xs text-zinc-900">
                      Q: How should I care for my 240 GSM puff print & acid wash T-shirts?
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      Machine wash cold (30°C or below) inside-out with like colors. Do not bleach. Tumble dry low or line dry in the shade to protect color intensity. Never iron directly over high-density 3D puff graphics—iron inside out using medium heat.
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-sm space-y-1.5">
                    <div className="font-bold text-xs text-zinc-900">
                      Q: How do I know which size to choose?
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      All our products feature a relaxed oversized street silhouette. If you prefer a regular tailored fit, order one size down from your usual size. For the intended relaxed street look, select your true size. You can also use our interactive <strong>3D Studio</strong> and <strong>Size Guide</strong> on any product page.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-zinc-200 bg-white/90 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>All policies compliant with Indian Consumer Protection (E-Commerce) Rules 2020</span>
          </div>
          <button
            onClick={() => setIsPolicyModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors shadow-sm"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
