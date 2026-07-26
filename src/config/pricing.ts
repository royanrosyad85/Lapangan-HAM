export interface PriceSlot {
  startHour: number;
  endHour: number;
  weekdayPrice: number | null;
  fridayPrice: number | null;
  weekendPrice: number;
}

export const BOOKING_PRICE_SLOTS: PriceSlot[] = [
  { startHour: 6, endHour: 8, weekdayPrice: null, fridayPrice: null, weekendPrice: 2600000 },
  { startHour: 8, endHour: 10, weekdayPrice: 1300000, fridayPrice: null, weekendPrice: 2600000 },
  { startHour: 10, endHour: 12, weekdayPrice: 800000, fridayPrice: null, weekendPrice: 1500000 },
  { startHour: 12, endHour: 14, weekdayPrice: 800000, fridayPrice: null, weekendPrice: 1500000 },
  { startHour: 14, endHour: 16, weekdayPrice: 1300000, fridayPrice: 1300000, weekendPrice: 2600000 },
  { startHour: 16, endHour: 18, weekdayPrice: 2000000, fridayPrice: 2300000, weekendPrice: 2600000 },
  { startHour: 18, endHour: 20, weekdayPrice: 2300000, fridayPrice: 2500000, weekendPrice: 2800000 },
  { startHour: 20, endHour: 22, weekdayPrice: 2300000, fridayPrice: 2500000, weekendPrice: 2800000 },
];

export function calculateBookingPrice(
  date: Date,
  startHour: number,
  endHour: number,
): { total: number; dp: number } {
  const day = date.getDay();
  let total = 0;

  for (const slot of BOOKING_PRICE_SLOTS) {
    if (slot.startHour >= startHour && slot.endHour <= endHour) {
      let price: number | null = slot.weekendPrice;

      if (day >= 1 && day <= 4) {
        price = slot.weekdayPrice;
      } else if (day === 5) {
        price = slot.fridayPrice;
      }

      if (price === null) {
        return { total: 0, dp: 0 };
      }

      total += price;
    }
  }

  return { total, dp: Math.max(total * 0.3, 500000) };
}

export function grandTotalDp(grandTotal: number): number {
  return Math.max(grandTotal * 0.3, 500000);
}

// ---- Add-ons & bundles ----

export type AddOnId = 'wasit' | 'videografer' | 'rompi' | 'kiper';
export type BundleId = 'match_essentials' | 'match_content' | 'complete_match_day';

export interface AddOnItem {
  id: AddOnId;
  label: string;
  price: number;
}

export interface Bundle {
  id: BundleId;
  label: string;
  items: AddOnId[];
  price: number;
  tag?: string;
}

export interface AddOnSnapshot {
  items: AddOnId[];
  bundle: BundleId | null;
  original: number;
  discount: number;
  total: number;
}

export const ADD_ON_ITEMS: AddOnItem[] = [
  { id: 'wasit', label: 'Wasit Internal (non-license)', price: 200000 },
  { id: 'videografer', label: 'Videografer', price: 400000 },
  { id: 'rompi', label: 'Rompi (11 pcs)', price: 40000 },
  { id: 'kiper', label: 'Sarung Tangan Kiper', price: 25000 },
];

export const BUNDLES: Bundle[] = [
  { id: 'match_essentials', label: 'Match Essentials', items: ['wasit', 'rompi', 'kiper'], price: 200000 },
  { id: 'match_content', label: 'Match Content', items: ['wasit', 'videografer'], price: 450000 },
  {
    id: 'complete_match_day',
    label: 'Complete Match Day',
    items: ['wasit', 'videografer', 'rompi', 'kiper'],
    price: 475000,
    tag: 'Paling Hemat',
  },
];

const ADD_ON_PRICE: Record<AddOnId, number> = Object.fromEntries(
  ADD_ON_ITEMS.map((item) => [item.id, item.price]),
) as Record<AddOnId, number>;

export const VALID_ADD_ON_IDS: ReadonlySet<string> = new Set(ADD_ON_ITEMS.map((item) => item.id));

export function isValidAddOnId(value: string): value is AddOnId {
  return VALID_ADD_ON_IDS.has(value);
}

export const EMPTY_ADD_ONS: AddOnSnapshot = { items: [], bundle: null, original: 0, discount: 0, total: 0 };

function dedupeItems(items: AddOnId[]): AddOnId[] {
  const seen = new Set<AddOnId>();
  const out: AddOnId[] = [];
  for (const id of items) {
    if (!seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }
  return out;
}

function sumPrices(items: AddOnId[]): number {
  return items.reduce((sum, id) => sum + ADD_ON_PRICE[id], 0);
}

/**
 * Resolve the final add-on price for a selection.
 *
 * Applies the single best-eligible bundle (max savings) whose items are all
 * selected, charges any extra items individually, and never stacks discounts.
 */
export function resolveAddOns(selectedItems: AddOnId[]): AddOnSnapshot {
  const items = dedupeItems(selectedItems);
  const itemSet = new Set(items);
  const original = sumPrices(items);

  let best: Bundle | null = null;
  let bestSavings = 0;
  for (const bundle of BUNDLES) {
    if (bundle.items.every((id) => itemSet.has(id))) {
      const savings = sumPrices(bundle.items) - bundle.price;
      if (savings > bestSavings) {
        bestSavings = savings;
        best = bundle;
      }
    }
  }

  if (!best) {
    return { items, bundle: null, original, discount: 0, total: original };
  }

  const covered = new Set(best.items);
  const extraPrice = sumPrices(items.filter((id) => !covered.has(id)));
  const total = best.price + extraPrice;
  return { items, bundle: best.id, original, discount: original - total, total };
}
