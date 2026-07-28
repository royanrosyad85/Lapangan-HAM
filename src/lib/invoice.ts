export type InvoicePayment = {
  amount: number | string;
  payment_type: string;
  status: string;
  created_at: string;
  receipt_url: string | null;
};

export function invoiceNumber(createdAt: string, bookingId: number) {
  const date = createdAt.slice(0, 10).replaceAll('-', '');
  return `INV-HAM-${date}-${String(bookingId).padStart(3, '0')}`;
}

export function paymentStatusLabel(status: string) {
  return ({
    pending: 'Pending verification',
    dp_paid: 'DP approved',
    payment_2_pending: 'Final payment pending verification',
    paid: 'Paid',
    confirmed: 'Paid',
    cancelled: 'Cancelled',
  } as Record<string, string>)[status] ?? status;
}

export function paymentStageLabel(type: string) {
  return type === 'dp' ? 'Deposit (DP)' : 'Final payment';
}
