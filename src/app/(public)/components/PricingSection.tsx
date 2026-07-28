'use client';

import { BOOKING_PRICE_SLOTS } from '@/config/pricing';

const rupiah = new Intl.NumberFormat('id-ID');

function formatHour(hour: number) {
  return `${String(hour).padStart(2, '0')}.00`;
}

function formatPrice(value: number | null, fallback: string) {
  return value === null ? fallback : `Rp${rupiah.format(value)}`;
}

interface PricingSectionProps {
  t: (key: string) => string;
}

export function PricingSection({ t }: PricingSectionProps) {
  return (
    <section id="pricing" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="text-balance text-[36px] font-semibold leading-[1.16] tracking-[-0.01em] sm:text-[48px]">
          {t('about.priceTable.title')}
        </h2>
        <p className="mt-3 max-w-[62ch] text-pretty text-[15px] leading-[1.55] text-[#52525b]">
          {t('about.priceTable.subtitle')}
        </p>

        <div className="mt-8 overflow-x-auto rounded-[24px] sm:rounded-[36px] bg-white ring-1 ring-[#ececee] shadow-xs">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#ececee] bg-[#f9f9fb] text-[12px] font-semibold uppercase tracking-wider text-[#3f3f46]">
                <th className="px-7 py-5">{t('about.priceTable.colSlot')}</th>
                <th className="px-7 py-5">{t('about.priceTable.colWeekday')}</th>
                <th className="px-7 py-5">{t('about.priceTable.colFriday')}</th>
                <th className="px-7 py-5">{t('about.priceTable.colWeekend')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f4f5]">
              {BOOKING_PRICE_SLOTS.map((slot) => (
                <tr
                  key={`${slot.startHour}-${slot.endHour}`}
                  className="transition-colors hover:bg-[#f9f9fb]"
                >
                  <td className="px-7 py-4 tabular-nums text-[14px] font-semibold whitespace-nowrap text-[#09090b]">
                    {formatHour(slot.startHour)} - {formatHour(slot.endHour)}
                  </td>
                  <td className="px-7 py-4 tabular-nums text-[14px] text-[#52525b]">
                    {formatPrice(slot.weekdayPrice, t('about.priceTable.na'))}
                  </td>
                  <td className="px-7 py-4 tabular-nums text-[14px] text-[#52525b]">
                    {formatPrice(slot.fridayPrice, t('about.priceTable.na'))}
                  </td>
                  <td className="px-7 py-4 tabular-nums text-[14px] font-medium text-[#09090b]">
                    {formatPrice(slot.weekendPrice, t('about.priceTable.na'))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-[72ch] text-pretty text-[13px] leading-[1.55] text-[#52525b]">
          {t('about.priceTable.note')}
        </p>
      </div>
    </section>
  );
}
