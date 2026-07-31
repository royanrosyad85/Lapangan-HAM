import { describe, expect, it } from 'vitest';

import { currentMonthRange, selectTransactionReportRows, transactionReportHtml } from './transaction-report';

describe('transaction report helpers', () => {
  it('uses the current calendar month and applies status and date filters', () => {
    expect(currentMonthRange(new Date(2026, 1, 10))).toEqual({ from: '2026-02-01', to: '2026-02-28' });
    expect(selectTransactionReportRows([
      { id: 1, status: 'confirmed', booking_date: '2026-02-03' },
      { id: 2, status: 'pending', booking_date: '2026-02-10' },
      { id: 3, status: 'confirmed', booking_date: '2026-03-01' },
    ] as never, 'confirmed', '2026-02-01', '2026-02-28').map((row) => row.id)).toEqual([1]);
  });

  it('uses the supplied absolute logo URL in the printable report', () => {
    expect(transactionReportHtml([], '2026-02-01', '2026-02-28', 'Semua', 'https://example.com/assets/logo.png')).toContain('src="https://example.com/assets/logo.png"');
  });
});
