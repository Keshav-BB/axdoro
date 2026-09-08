import { Order } from '../types';

export const AXDORO_WHATSAPP_NUMBER = '919876543210'; // Client official WhatsApp

export const getWhatsAppSupportUrl = (message?: string): string => {
  const defaultMsg = "Hi AXDORO Team! I have an inquiry regarding your 240 GSM Oversized T-Shirts.";
  const encoded = encodeURIComponent(message || defaultMsg);
  return `https://wa.me/${AXDORO_WHATSAPP_NUMBER}?text=${encoded}`;
};

export const getWhatsAppOrderShareUrl = (order: Order): string => {
  const itemsSummary = order.items
    .map(
      (item) =>
        `• ${item.product.name} (Size: ${item.selectedSize}, Color: ${item.selectedColor.name}) x ${item.quantity}`
    )
    .join('\n');

  const text = `*AXDORO Order Confirmation*
Order ID: #${order.id}
Customer: ${order.customerName}
Phone: ${order.phone}
Total: ₹${order.total} (${order.paymentMethod})
Status: ${order.status}
Estimated Delivery: ${order.estimatedDelivery}

*Items:*
${itemsSummary}

Shipping to: ${order.address}, ${order.city}, ${order.state} - ${order.pincode}
Tracking via Shiprocket: ${order.trackingNumber}`;

  return `https://wa.me/${AXDORO_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};

export const getWhatsAppBulkEnquiryUrl = (data: {
  name: string;
  phone: string;
  companyOrCollege: string;
  quantity: number;
  fitType: string;
  printType: string;
  notes: string;
}): string => {
  const text = `*AXDORO Bulk / Custom Order Enquiry*
Name: ${data.name}
Organization/College: ${data.companyOrCollege || 'Individual'}
Contact: ${data.phone}
Quantity: ${data.quantity} pcs
Fit Specification: ${data.fitType}
Print Requirement: ${data.printType}
Additional Notes: ${data.notes || 'None'}`;

  return `https://wa.me/${AXDORO_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};
