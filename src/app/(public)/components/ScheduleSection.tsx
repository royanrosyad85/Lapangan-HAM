'use client';

import Link from 'next/link';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { BOOKING_PRICE_SLOTS, calculateBookingPrice } from '@/config/pricing';

type DBBooking = {
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
};

const rupiah = new Intl.NumberFormat('id-ID');

function toLocalDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatHour(hour: number) {
  return `${String(hour).padStart(2, '0')}.00`;
}

function formatPrice(value: number | null, fallback: string) {
  return value === null ? fallback : `Rp${rupiah.format(value)}`;
}

function isSlotClosed(date: Date, slot: (typeof BOOKING_PRICE_SLOTS)[number]) {
  const day = date.getDay();
  if (day >= 1 && day <= 4) return slot.weekdayPrice === null;
  if (day === 5) return slot.fridayPrice === null;
  return false;
}

interface ScheduleSectionProps {
  dates: Date[];
  bookings: DBBooking[];
  loadingBookings: boolean;
  scheduleError: boolean;
  setScheduleAttempt: React.Dispatch<React.SetStateAction<number>>;
  locale: 'en' | 'id';
  t: (key: string) => string;
}

export function ScheduleSection({
  dates,
  bookings,
  loadingBookings,
  scheduleError,
  setScheduleAttempt,
  locale,
  t,
}: ScheduleSectionProps) {
  const isSlotBooked = (dateString: string, startHour: number, endHour: number) =>
    bookings.some((booking) => {
      if (booking.booking_date !== dateString) return false;
      const bookingStart = Number(booking.start_time.split(':')[0]);
      const bookingEnd = Number(booking.end_time.split(':')[0]);
      return Math.max(startHour, bookingStart) < Math.min(endHour, bookingEnd);
    });

  const formatGridDate = (date: Date, index: number) => {
    const language = locale === 'id' ? 'id-ID' : 'en-US';
    const label = date.toLocaleDateString(language, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
    return index === 0 ? `${label} (${t('landing.today')})` : label;
  };

  return (
    <section id="schedule" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="text-balance text-[36px] font-semibold leading-[1.16] tracking-[-0.01em] sm:text-[48px]">
          {t('about.schedule.title')}
        </h2>
        <p className="mt-3 max-w-[62ch] text-pretty text-[15px] leading-[1.55] text-[#52525b]">
          {t('about.schedule.subtitle')}
        </p>

        {loadingBookings ? (
          <div className="mt-8 overflow-x-auto pb-3" aria-label={t('about.schedule.loading')}>
            <div className="grid min-w-[1000px] grid-cols-5 gap-3">
              {dates.map((date) => (
                <div key={date.toISOString()} className="rounded-[24px] bg-[#ececee] p-4 animate-pulse">
                  <div className="h-5 w-3/4 rounded-[12px] bg-[#d4d4d8]" />
                  <div className="mt-5 space-y-3">
                    {BOOKING_PRICE_SLOTS.map((slot) => (
                      <div
                        key={slot.startHour}
                        className="h-[62px] rounded-[14px] bg-white/75"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : scheduleError ? (
          <div className="mt-8 flex flex-col items-start rounded-[24px] sm:rounded-[36px] bg-white p-7 ring-1 ring-[#ececee]">
            <h3 className="text-[20px] font-semibold">{t('about.schedule.errorTitle')}</h3>
            <p className="mt-2 max-w-[56ch] text-pretty text-[14px] leading-[1.55] text-[#52525b]">
              {t('about.schedule.errorDescription')}
            </p>
            <button
              type="button"
              onClick={() => setScheduleAttempt((attempt) => attempt + 1)}
              className="landing-press mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#09090b] px-5 text-[14px] font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00] focus-visible:ring-offset-2"
            >
              <RotateCcw size={15} aria-hidden="true" />
              {t('about.schedule.retry')}
            </button>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto pb-3">
            <div className="grid min-w-[1000px] grid-cols-5 gap-3">
              {dates.map((date, dayIndex) => {
                const dateString = toLocalDateString(date);
                return (
                  <div key={dateString} className="rounded-[20px] sm:rounded-[24px] bg-[#ececee] p-3.5">
                    <p className="min-h-11 text-balance text-center text-[13px] font-semibold leading-[1.4] text-[#09090b]">
                      {formatGridDate(date, dayIndex)}
                    </p>
                    <div className="mt-3 space-y-2.5">
                      {BOOKING_PRICE_SLOTS.map((slot) => {
                        const closed = isSlotClosed(date, slot);
                        const booked = isSlotBooked(dateString, slot.startHour, slot.endHour);
                        const { total } = calculateBookingPrice(
                          date,
                          slot.startHour,
                          slot.endHour,
                        );
                        const time = `${formatHour(slot.startHour)} - ${formatHour(slot.endHour)}`;

                        if (closed || booked) {
                          const stateLabel = closed
                            ? t('about.schedule.closed')
                            : t('about.schedule.booked');
                          return (
                            <div
                              key={slot.startHour}
                              aria-label={`${time}, ${stateLabel}`}
                              className="min-h-[62px] rounded-[14px] bg-[#d4d4d8] px-3 py-2.5 text-[#71717a]"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="tabular-nums text-[12px] font-semibold">
                                  {time}
                                </span>
                                <Minus size={14} aria-hidden="true" />
                              </div>
                              <span className="mt-1 block text-[11px] font-medium">{stateLabel}</span>
                            </div>
                          );
                        }

                        const price = formatPrice(total, '');
                        return (
                          <Link
                            key={slot.startHour}
                            href={`/customer/booking/create?date=${dateString}&start=${slot.startHour}&end=${slot.endHour}`}
                            aria-label={`${time}, ${t('about.schedule.available')}, ${price}`}
                            className="landing-press block min-h-[62px] rounded-[14px] bg-white px-3 py-2.5 text-[#09090b] ring-1 ring-[#ececee] hover:border-[#09090b]/20 hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00]"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="tabular-nums text-[12px] font-semibold">
                                {time}
                              </span>
                              <Plus size={14} className="text-[#ff5a00]" aria-hidden="true" />
                            </div>
                            <span className="mt-1 block tabular-nums text-[11px] font-medium text-[#52525b]">
                              {price}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
