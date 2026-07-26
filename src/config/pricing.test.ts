import { describe, expect, it } from 'vitest';

import { calculateBookingPrice, resolveAddOns } from './pricing';

describe('Pricing Calculator', () => {
  it('calculates weekday morning price correctly', () => {
    const date = new Date('2026-06-15');

    const result = calculateBookingPrice(date, 8, 10);

    expect(result.total).toBe(1300000);
    expect(result.dp).toBe(500000);
  });

  it('calculates weekend evening price correctly', () => {
    const date = new Date('2026-06-21');

    const result = calculateBookingPrice(date, 18, 20);

    expect(result.total).toBe(2800000);
    expect(result.dp).toBe(840000);
  });
});

describe('calculateBookingPrice operating hours', () => {
  it('returns zero for Friday morning closed hours (6-14)', () => {
    const friday = new Date('2026-07-17'); // Friday
    expect(calculateBookingPrice(friday, 6, 8)).toEqual({ total: 0, dp: 0 });
    expect(calculateBookingPrice(friday, 8, 10)).toEqual({ total: 0, dp: 0 });
    expect(calculateBookingPrice(friday, 10, 12)).toEqual({ total: 0, dp: 0 });
    expect(calculateBookingPrice(friday, 12, 14)).toEqual({ total: 0, dp: 0 });
    expect(calculateBookingPrice(friday, 6, 14)).toEqual({ total: 0, dp: 0 });
  });

  it('returns valid price for Friday afternoon hours (14-22)', () => {
    const friday = new Date('2026-07-17'); // Friday
    const result = calculateBookingPrice(friday, 14, 16);
    expect(result.total).toBeGreaterThan(0);
    expect(result.dp).toBe(Math.max(result.total * 0.3, 500000));
  });

  it('returns zero for Mon-Thu morning closed hours (6-8)', () => {
    const monday = new Date('2026-07-13'); // Monday
    expect(calculateBookingPrice(monday, 6, 8)).toEqual({ total: 0, dp: 0 });
  });

  it('returns valid price for Mon-Thu open hours (8-22)', () => {
    const monday = new Date('2026-07-13'); // Monday
    const result = calculateBookingPrice(monday, 8, 10);
    expect(result.total).toBeGreaterThan(0);
  });
});

describe('resolveAddOns', () => {
  it('returns zero totals for an empty selection', () => {
    expect(resolveAddOns([])).toEqual({
      items: [],
      bundle: null,
      original: 0,
      discount: 0,
      total: 0,
    });
  });

  it('charges items individually when no bundle qualifies', () => {
    const result = resolveAddOns(['rompi']);
    expect(result).toMatchObject({ items: ['rompi'], bundle: null, original: 40000, discount: 0, total: 40000 });
  });

  it('applies Match Essentials (wasit + rompi + kiper) and saves 65.000', () => {
    const result = resolveAddOns(['wasit', 'rompi', 'kiper']);
    expect(result.bundle).toBe('match_essentials');
    expect(result.original).toBe(265000);
    expect(result.total).toBe(200000);
    expect(result.discount).toBe(65000);
  });

  it('applies Match Content (wasit + videografer) and saves 150.000', () => {
    const result = resolveAddOns(['wasit', 'videografer']);
    expect(result.bundle).toBe('match_content');
    expect(result.original).toBe(600000);
    expect(result.total).toBe(450000);
    expect(result.discount).toBe(150000);
  });

  it('auto-upgrades to Complete Match Day (best discount) when all items selected', () => {
    const result = resolveAddOns(['wasit', 'videografer', 'rompi', 'kiper']);
    expect(result.bundle).toBe('complete_match_day');
    expect(result.original).toBe(665000);
    expect(result.total).toBe(475000);
    expect(result.discount).toBe(190000);
  });

  it('charges extra items outside the applied bundle individually without stacking', () => {
    // Match Content (wasit + videografer) + rompi extra
    const result = resolveAddOns(['wasit', 'videografer', 'rompi']);
    expect(result.bundle).toBe('match_content');
    expect(result.total).toBe(490000); // 450000 bundle + 40000 rompi
    expect(result.original).toBe(640000);
    expect(result.discount).toBe(150000);
  });

  it('never stacks: a single best bundle is chosen even when two are eligible', () => {
    // wasit + videografer + rompi + kiper: match_essentials and complete are both eligible,
    // complete saves more so it wins alone.
    const result = resolveAddOns(['kiper', 'videografer', 'wasit', 'rompi']);
    expect(result.bundle).toBe('complete_match_day');
    expect(result.discount).toBe(190000);
  });

  it('dedupes repeated ids', () => {
    const result = resolveAddOns(['wasit', 'wasit', 'rompi']);
    expect(result.items).toEqual(['wasit', 'rompi']);
  });
});
