export interface GSTBreakdown {
  ratePercent: number;
  taxableAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalGst: number;
  isInterstate: boolean;
  hsnCode: string;
}

export const calculateGST = (totalAmount: number, state: string = 'Tamil Nadu'): GSTBreakdown => {
  // AXDORO is based in Tamil Nadu (Tiruppur / Chennai)
  // Intra-state (Tamil Nadu) applies CGST + SGST (5% total on apparel <= 1000, 12% on premium/oversized heavyweight)
  // For AXDORO 240 GSM premium apparel, we apply 5% standard GST embedded/calculated:
  const gstRate = 0.05; // 5% GST
  const ratePercent = 5;
  const isInterstate = state.trim().toLowerCase() !== 'tamil nadu';

  // Amount includes GST or calculation
  const taxableAmount = Math.round((totalAmount / (1 + gstRate)) * 100) / 100;
  const totalGst = Math.round((totalAmount - taxableAmount) * 100) / 100;

  if (isInterstate) {
    return {
      ratePercent,
      taxableAmount,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: totalGst,
      totalGst,
      isInterstate: true,
      hsnCode: '61091000', // Cotton T-Shirts
    };
  }

  const halfGst = Math.round((totalGst / 2) * 100) / 100;
  return {
    ratePercent,
    taxableAmount,
    cgstAmount: halfGst,
    sgstAmount: totalGst - halfGst,
    igstAmount: 0,
    totalGst,
    isInterstate: false,
    hsnCode: '61091000', // Cotton T-Shirts
  };
};
