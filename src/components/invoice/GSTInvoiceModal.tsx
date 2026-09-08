import React from 'react';
import { X, Printer, Download, CheckCircle2, Building, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/currency';
import { calculateGST } from '../../utils/gst';

export const GSTInvoiceModal: React.FC = () => {
  const { selectedOrder, isInvoiceOpen, setIsInvoiceOpen } = useStore();

  if (!isInvoiceOpen || !selectedOrder) return null;

  const gst = calculateGST(selectedOrder.total, selectedOrder.state);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white text-zinc-900 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl border border-zinc-200 my-8 flex flex-col font-sans">
        {/* Modal Toolbar (hidden during print) */}
        <div className="p-4 bg-zinc-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-zinc-950 font-black px-2 py-0.5 rounded text-xs font-mono">
              TAX INVOICE
            </span>
            <span className="text-xs text-zinc-300 font-mono">#{selectedOrder.id}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-3 py-1.5 rounded-lg text-xs font-mono transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={() => setIsInvoiceOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Invoice Body */}
        <div id="printable-invoice" className="p-8 sm:p-10 space-y-6 text-xs bg-white text-zinc-900">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b-2 border-zinc-900 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-black text-white font-black flex items-center justify-center text-sm rounded">
                  AX
                </div>
                <span className="text-2xl font-black tracking-wider text-black font-mono">
                  AXDORO
                </span>
              </div>
              <div className="text-[11px] text-zinc-600 font-medium">AXDORO APPAREL PRIVATE LIMITED</div>
              <div className="text-zinc-600">Plot 14, SIDCO Garment Complex, Tiruppur & Chennai</div>
              <div className="text-zinc-600">Tamil Nadu, India - 641603</div>
              <div className="font-mono font-bold text-zinc-800 mt-1">
                GSTIN: 33AAAAA0000A1Z5 (State Code: 33)
              </div>
              <div className="text-zinc-500 text-[10px]">Email: care@axdoro.com | www.axdoro.com</div>
            </div>

            <div className="text-right sm:text-right font-mono space-y-1">
              <div className="text-lg font-black uppercase text-black">TAX INVOICE</div>
              <div className="text-zinc-600">Invoice No: <strong className="text-black">INV-{selectedOrder.id}</strong></div>
              <div className="text-zinc-600">Date: {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN')}</div>
              <div className="text-zinc-600">Place of Supply: <strong className="text-black">Tamil Nadu (33)</strong></div>
              <div className="text-zinc-600">Shiprocket AWB: {selectedOrder.trackingNumber}</div>
            </div>
          </div>

          {/* Billed To & Shipped To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
            <div>
              <div className="font-bold text-black uppercase font-mono text-[11px] mb-1">
                Billed To (Customer):
              </div>
              <div className="font-bold text-black text-sm">{selectedOrder.customerName}</div>
              <div className="text-zinc-600">{selectedOrder.address}</div>
              <div className="text-zinc-600">
                {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}
              </div>
              <div className="text-zinc-600 font-mono mt-1">Phone: +91 {selectedOrder.phone}</div>
              {selectedOrder.gstin && (
                <div className="text-blue-700 font-mono font-bold mt-1">
                  Buyer GSTIN: {selectedOrder.gstin}
                </div>
              )}
            </div>

            <div>
              <div className="font-bold text-black uppercase font-mono text-[11px] mb-1">
                Dispatch & Courier:
              </div>
              <div className="text-zinc-700 font-medium">Shiprocket Priority Express</div>
              <div className="text-zinc-600">Shipping Mode: Surface / Air</div>
              <div className="text-zinc-600 font-mono">Tracking: {selectedOrder.trackingNumber}</div>
              <div className="text-emerald-700 font-bold mt-1">
                Status: {selectedOrder.paymentStatus} ({selectedOrder.paymentMethod})
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-zinc-300 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-zinc-100 border-b border-zinc-300 text-zinc-700 font-mono text-[10px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Item Description (Fabric & Size)</th>
                  <th className="py-2.5 px-3">HSN Code</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Taxable Val</th>
                  <th className="py-2.5 px-3 text-right">CGST (2.5%)</th>
                  <th className="py-2.5 px-3 text-right">SGST (2.5%)</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 font-mono text-[11px]">
                {selectedOrder.items.map((item, idx) => {
                  const itemTotal = item.product.price * item.quantity;
                  const itemGst = calculateGST(itemTotal, selectedOrder.state);
                  return (
                    <tr key={item.id}>
                      <td className="py-3 px-3 text-zinc-500">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-black">{item.product.name}</div>
                        <div className="text-[10px] text-zinc-500">
                          Size: {item.selectedSize} | {item.selectedColor.name} | 240 GSM Combed Cotton
                        </div>
                      </td>
                      <td className="py-3 px-3 text-zinc-600">61091000</td>
                      <td className="py-3 px-3 text-center font-bold">{item.quantity}</td>
                      <td className="py-3 px-3 text-right">{formatINR(itemGst.taxableAmount)}</td>
                      <td className="py-3 px-3 text-right">{formatINR(itemGst.cgstAmount)}</td>
                      <td className="py-3 px-3 text-right">{formatINR(itemGst.sgstAmount)}</td>
                      <td className="py-3 px-3 text-right font-bold text-black">
                        {formatINR(itemTotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Tax Summary Totals */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
            <div className="text-[11px] text-zinc-500 max-w-sm space-y-1">
              <div className="font-bold text-black font-mono uppercase">Tax Breakdown Note:</div>
              <p>
                Tax is calculated in accordance with Tamil Nadu intra-state GST rates for cotton knitted
                apparel (HSN 61091000). Total CGST @ 2.5% and SGST @ 2.5% are inclusive.
              </p>
              <div className="pt-2 font-mono text-zinc-600">
                Payment Received: <strong className="text-black">{selectedOrder.paymentMethod}</strong>
              </div>
            </div>

            <div className="w-full sm:w-72 bg-zinc-50 p-4 rounded-xl border border-zinc-200 font-mono space-y-1.5 text-right">
              <div className="flex justify-between text-zinc-600">
                <span>Total Taxable Value:</span>
                <span>{formatINR(gst.taxableAmount)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>CGST @ 2.5%:</span>
                <span>{formatINR(gst.cgstAmount)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>SGST @ 2.5%:</span>
                <span>{formatINR(gst.sgstAmount)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Shipping (Shiprocket):</span>
                <span className="text-emerald-700 font-bold">FREE</span>
              </div>
              <div className="pt-2 border-t border-zinc-300 flex justify-between font-black text-sm text-black">
                <span>Invoice Total:</span>
                <span>{formatINR(selectedOrder.total)}</span>
              </div>
            </div>
          </div>

          {/* Signatory */}
          <div className="pt-8 border-t border-zinc-300 flex flex-col sm:flex-row justify-between items-end text-[11px] text-zinc-500 gap-4">
            <div>
              <div className="font-bold text-black">Terms & Conditions:</div>
              <div>• 7-Day size exchange for unworn garments with intact tags.</div>
              <div>• Computer generated invoice. No physical signature required.</div>
            </div>

            <div className="text-right">
              <div className="font-mono text-black font-bold">For AXDORO APPAREL PVT LTD</div>
              <div className="h-10"></div>
              <div className="border-t border-zinc-400 pt-1 font-mono">Authorized Signatory</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
