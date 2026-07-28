import { describe, expect, it } from 'vitest';

import { invoiceNumber, paymentStageLabel, paymentStatusLabel } from './invoice';

describe('invoice helpers', () => {
  it('creates a stable booking-based invoice number', () => {
    expect(invoiceNumber('2026-07-28T10:30:00.000Z', 15)).toBe('INV-HAM-20260728-015');
  });

  it('uses English payment labels', () => {
    expect(paymentStageLabel('dp')).toBe('Deposit (DP)');
    expect(paymentStatusLabel('payment_2_pending')).toBe('Final payment pending verification');
  });
});
