'use client';

import { useTranslation } from '@/lib/i18n';
import { BOOKING_PRICE_SLOTS } from '@/config/pricing';

const money = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

export function PriceTable() {
  const { t } = useTranslation();

  return (
    <div className="overflow-hidden rounded-xl border border-[#d2cecb] bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-3 border-b border-[#d2cecb] bg-[#f4f2f0] px-3.5 py-3 dark:border-slate-800 dark:bg-slate-900/60">
        <p className="text-sm font-semibold text-[#0c0a08] dark:text-white">{t('booking.pricePerSlot')}</p>
        <span className="text-[11px] text-[#6b6d75] dark:text-slate-400">2-hour slots</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-[11px] sm:min-w-[360px] sm:text-[12px]">
          <thead>
            <tr className="border-b border-[#d2cecb] bg-[#f4f2f0]/55 dark:border-slate-800 dark:bg-slate-900/20">
              <th className="px-2 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-[#6b6d75] whitespace-nowrap sm:px-3">{t('booking.slot')}</th>
              <th className="px-2 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wide text-[#6b6d75] whitespace-nowrap sm:px-3">{t('booking.monThu')}</th>
              <th className="px-2 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wide text-[#6b6d75] whitespace-nowrap sm:px-3">{t('booking.friday')}</th>
              <th className="px-2 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wide text-[#6b6d75] whitespace-nowrap sm:px-3">{t('booking.satSun')}</th>
            </tr>
          </thead>
          <tbody>
            {BOOKING_PRICE_SLOTS.map((slot) => (
              <tr key={slot.startHour} className="border-b border-[#f4f2f0] last:border-0 hover:bg-[#f4f2f0]/70 dark:border-slate-800 dark:hover:bg-slate-900/30">
                <td className="px-2 py-2.5 font-semibold tabular-nums text-[#0c0a08] whitespace-nowrap dark:text-white sm:px-3">
                  {String(slot.startHour).padStart(2, '0')}.00 - {String(slot.endHour).padStart(2, '0')}.00
                </td>
                <td className="px-2 py-2.5 text-right tabular-nums text-[#4d505d] whitespace-nowrap dark:text-slate-300 sm:px-3">
                  {slot.weekdayPrice ? money.format(slot.weekdayPrice) : t('booking.na')}
                </td>
                <td className="px-2 py-2.5 text-right tabular-nums text-[#4d505d] whitespace-nowrap dark:text-slate-300 sm:px-3">
                  {slot.fridayPrice ? money.format(slot.fridayPrice) : t('booking.na')}
                </td>

                <td className="px-2 py-2.5 text-right font-semibold tabular-nums text-[#0c0a08] whitespace-nowrap dark:text-white sm:px-3">
                  {money.format(slot.weekendPrice)}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
