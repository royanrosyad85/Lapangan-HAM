'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { DM_Sans } from 'next/font/google';
import { ArrowRight, Check, MapPin, Minus, Plus, RotateCcw } from 'lucide-react';

import {
  ADD_ON_ITEMS,
  BOOKING_PRICE_SLOTS,
  BUNDLES,
  calculateBookingPrice,
  type AddOnId,
  type Bundle,
  type BundleId,
} from '@/config/pricing';
import { useTranslation } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/client';

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
});

const HAMMapWrapper = dynamic(() => import('@/components/HAMMapWrapper'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#ececee]" aria-hidden="true" />,
});

const rupiah = new Intl.NumberFormat('id-ID');
// Photo by Omar Ramadan on Unsplash: https://unsplash.com/photos/jvBRJWFGbtg
const MATCH_DAY_IMAGE =
  'https://images.unsplash.com/photo-1586048971443-b20f8df772a9?auto=format&fit=crop&w=1800&q=82';

type DBBooking = {
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
};

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

function bundleOriginalPrice(bundle: Bundle) {
  return bundle.items.reduce(
    (sum, id) => sum + (ADD_ON_ITEMS.find((item) => item.id === id)?.price ?? 0),
    0,
  );
}

function MatchDayBundlePromo({
  locale,
  t,
}: {
  locale: 'en' | 'id';
  t: (key: string) => string;
}) {
  const [selectedId, setSelectedId] = useState<BundleId>('complete_match_day');
  const selected = BUNDLES.find((bundle) => bundle.id === selectedId) ?? BUNDLES[0];
  const originalPrice = bundleOriginalPrice(selected);
  const savings = originalPrice - selected.price;
  const savingsPercent = Math.round((savings / originalPrice) * 100);

  const itemLabel = (id: AddOnId) => t(`landing.bundle.item.${id}`);

  return (
    <section className="px-4 py-10 sm:px-6 sm:py-12" aria-labelledby="match-day-title">
      <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[36px] bg-white p-2 ring-1 ring-[#ececee]">
        <div className="grid gap-2 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="flex min-w-0 flex-col rounded-[28px] bg-[#ececee] p-6 sm:p-8 lg:p-10">
            <p className="text-[12px] font-semibold uppercase text-[#ff5a00]">
              {t('landing.bundle.eyebrow')}
            </p>
            <h2
              id="match-day-title"
              className="mt-4 max-w-[560px] text-balance text-[34px] font-semibold leading-[1.12] text-[#09090b] sm:text-[44px]"
            >
              {t('landing.bundle.title')}
            </h2>
            <p className="mt-4 max-w-[54ch] text-pretty text-[15px] leading-[1.55] text-[#52525b] sm:text-[16px]">
              {t('landing.bundle.description')}
            </p>

            <div className="relative mt-8 aspect-[16/8] min-h-[210px] overflow-hidden rounded-[20px] outline outline-1 -outline-offset-1 outline-black/10">
              <Image
                src={MATCH_DAY_IMAGE}
                alt={t('landing.bundle.imageAlt')}
                fill
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-col p-4 sm:p-6 lg:p-8">
            <div
              className="grid gap-2 sm:grid-cols-3"
              role="group"
              aria-label={t('landing.bundle.selectorLabel')}
            >
              {BUNDLES.map((bundle) => {
                const selectedBundle = bundle.id === selectedId;
                return (
                  <button
                    key={bundle.id}
                    type="button"
                    aria-pressed={selectedBundle}
                    onClick={() => setSelectedId(bundle.id)}
                    className={`landing-press min-h-12 rounded-[14px] px-3 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#09090b] focus-visible:ring-offset-2 ${
                      selectedBundle
                        ? 'bg-[#09090b] text-white'
                        : 'bg-[#f4f4f5] text-[#3f3f46] ring-1 ring-[#ececee]'
                    }`}
                  >
                    <span className="block text-[13px] font-semibold leading-tight">
                      {bundle.label}
                    </span>
                    {bundle.id === 'complete_match_day' && (
                      <span
                        className={`mt-1 block text-[10px] font-semibold uppercase ${
                          selectedBundle ? 'text-[#ff8a4c]' : 'text-[#ff5a00]'
                        }`}
                      >
                        {t('landing.bundle.bestValue')}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-7 flex flex-wrap items-end gap-x-4 gap-y-1">
              <p className="tabular-nums text-[40px] font-semibold leading-none text-[#09090b] sm:text-[48px]">
                {formatPrice(selected.price, '')}
              </p>
              <p className="pb-1 tabular-nums text-[14px] text-[#71717a] line-through">
                {formatPrice(originalPrice, '')}
              </p>
            </div>

            <p className="mt-3 inline-flex w-fit rounded-[12px] bg-[#fff1e9] px-2.5 py-1.5 tabular-nums text-[12px] font-semibold text-[#b13e00]">
              {t('landing.bundle.save')} {formatPrice(savings, '')} ({savingsPercent}%)
            </p>

            <div className="mt-7">
              <p className="text-[13px] font-semibold text-[#27272a]">
                {t('landing.bundle.includes')}
              </p>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {selected.items.slice(0, 4).map((id) => (
                  <li
                    key={id}
                    className="flex min-w-0 items-start gap-2 text-pretty text-[14px] leading-[1.45] text-[#52525b]"
                  >
                    <Check
                      size={16}
                      strokeWidth={2}
                      className="mt-0.5 shrink-0 text-[#ff5a00]"
                      aria-hidden="true"
                    />
                    <span>{itemLabel(id)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href={`/customer/booking/create?bundle=${selected.id}`}
              className="landing-press mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-[#09090b] pl-5 pr-[18px] text-[14px] font-medium whitespace-nowrap text-white shadow-[inset_0_0.5px_0_rgba(255,255,255,0.5),inset_0_9px_14px_-5px_rgba(117,123,133,0.4),0_0_0_1.5px_rgb(44,46,52),0_4px_6px_rgba(0,0,0,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00] focus-visible:ring-offset-2 sm:w-fit"
            >
              {t('landing.bundle.cta')}
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>

            <span className="sr-only">
              {locale === 'id'
                ? `Paket aktif: ${selected.label}`
                : `Active package: ${selected.label}`}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const { t, locale, setLocale } = useTranslation();
  const [bookings, setBookings] = useState<DBBooking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [scheduleError, setScheduleError] = useState(false);
  const [scheduleAttempt, setScheduleAttempt] = useState(0);

  const dates = useMemo(
    () =>
      Array.from({ length: 5 }, (_, index) => {
        const date = new Date();
        date.setHours(12, 0, 0, 0);
        date.setDate(date.getDate() + index);
        return date;
      }),
    [],
  );

  useEffect(() => {
    let active = true;

    async function fetchBookings() {
      setLoadingBookings(true);
      setScheduleError(false);

      try {
        const supabase = createClient();
        const { data, error } = await supabase.rpc('get_booked_slots', {
          p_start_date: toLocalDateString(dates[0]),
          p_end_date: toLocalDateString(dates[4]),
        });

        if (!active) return;
        if (error) {
          setBookings([]);
          setScheduleError(true);
          return;
        }

        setBookings((data ?? []) as DBBooking[]);
      } catch {
        if (active) {
          setBookings([]);
          setScheduleError(true);
        }
      } finally {
        if (active) setLoadingBookings(false);
      }
    }

    fetchBookings();
    return () => {
      active = false;
    };
  }, [dates, scheduleAttempt]);

  const isSlotBooked = (dateString: string, startHour: number, endHour: number) =>
    bookings.some((booking) => {
      if (booking.booking_date !== dateString) return false;
      const bookingStart = Number(booking.start_time.split(':')[0]);
      const bookingEnd = Number(booking.end_time.split(':')[0]);
      return Math.max(startHour, bookingStart) < Math.min(endHour, bookingEnd);
    });

  const isSlotClosed = (date: Date, slot: (typeof BOOKING_PRICE_SLOTS)[number]) => {
    const day = date.getDay();
    if (day >= 1 && day <= 4) return slot.weekdayPrice === null;
    if (day === 5) return slot.fridayPrice === null;
    return false;
  };

  const formatGridDate = (date: Date, index: number) => {
    const language = locale === 'id' ? 'id-ID' : 'en-US';
    const label = date.toLocaleDateString(language, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
    return index === 0 ? `${label} (${t('landing.today')})` : label;
  };

  const faqItems = [
    [t('about.faq.q1'), t('about.faq.a1')],
    [t('about.faq.q2'), t('about.faq.a2')],
    [t('about.faq.q3'), t('about.faq.a3')],
  ];

  return (
    <main
      className={`${dmSans.className} min-h-[100dvh] overflow-x-clip bg-[#f4f4f5] text-[#09090b] antialiased`}
    >
      <style jsx global>{`
        .landing-press {
          transition: transform 150ms cubic-bezier(0.23, 1, 0.32, 1),
            opacity 150ms cubic-bezier(0.23, 1, 0.32, 1);
        }

        .landing-press:active {
          transform: scale(0.96);
        }

        .landing-nav-link {
          display: inline-flex;
          min-height: 44px;
          align-items: center;
          border-radius: 14px;
          padding-inline: 6px;
          color: #3f3f46;
          font-size: 14px;
          font-weight: 500;
        }

        .landing-nav-link:focus-visible {
          outline: 2px solid #ff5a00;
          outline-offset: 2px;
        }

        @media (hover: hover) and (pointer: fine) {
          .landing-press:hover {
            transform: translateY(-1px);
          }

          .landing-nav-link:hover {
            color: #09090b;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .landing-press {
            transition: none;
          }

          .landing-press:active,
          .landing-press:hover {
            transform: none;
          }
        }
      `}</style>

      <nav className="sticky top-0 z-20 h-[72px] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="landing-press flex min-h-11 shrink-0 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00] focus-visible:ring-offset-2"
          >
            <Image
              src="/assets/Logo-HAM-fix.png"
              alt="Stadion H. Abdul Malik"
              width={118}
              height={42}
              className="h-10 w-auto object-contain invert"
            />
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            <a className="landing-nav-link" href="#lapangan">
              {t('about.nav.gallery')}
            </a>
            <a className="landing-nav-link" href="#pricing">
              {t('about.nav.pricing')}
            </a>
            <a className="landing-nav-link" href="#schedule">
              {t('about.nav.schedule')}
            </a>
            <a className="landing-nav-link" href="#location">
              {t('about.nav.location')}
            </a>
            <a className="landing-nav-link" href="#faq">
              {t('about.nav.faq')}
            </a>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setLocale(locale === 'id' ? 'en' : 'id')}
              className="landing-press min-h-11 min-w-11 rounded-[14px] px-3 text-[13px] font-semibold text-[#3f3f46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00]"
              aria-label={t('landing.languageToggle')}
            >
              {locale.toUpperCase()}
            </button>
            <Link
              href="/auth/customer"
              className="landing-press hidden min-h-11 items-center rounded-[14px] px-3 text-[14px] font-medium text-[#3f3f46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00] sm:inline-flex"
            >
              {t('about.signIn')}
            </Link>
            <Link
              href="/auth/customer/register"
              className="landing-press inline-flex min-h-11 items-center rounded-[14px] bg-[#09090b] px-4 text-[14px] font-medium whitespace-nowrap text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00] focus-visible:ring-offset-2"
            >
              {t('about.register')}
            </Link>
          </div>
        </div>
      </nav>

      <section className="flex min-h-[calc(100dvh-72px)] items-center px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto grid w-full max-w-[1200px] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div className="max-w-[600px]">
            <h1 className="text-balance text-[44px] font-semibold leading-[1.08] text-[#09090b] sm:text-[56px] lg:text-[64px]">
              {t('landing.heroTitle')}
            </h1>
            <p className="mt-5 max-w-[54ch] text-pretty text-[17px] leading-[1.55] text-[#52525b]">
              {t('landing.heroDescription')}
            </p>
            <div className="mt-8">
              <Link
                href="/customer/booking/create"
                className="landing-press inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] bg-[#09090b] pl-5 pr-[18px] text-[14px] font-medium whitespace-nowrap text-white shadow-[inset_0_0.5px_0_rgba(255,255,255,0.5),inset_0_9px_14px_-5px_rgba(117,123,133,0.4),0_0_0_1.5px_rgb(44,46,52),0_4px_6px_rgba(0,0,0,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00] focus-visible:ring-offset-2"
              >
                {t('landing.bookNow')}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <p className="mt-6 flex max-w-[48ch] items-start gap-2 text-pretty text-[14px] leading-[1.5] text-[#71717a]">
              <MapPin size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              {t('about.heroSub')}
            </p>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-[36px] outline outline-1 -outline-offset-1 outline-black/10">
            <Image
              src="/assets/Stadion HAM side view.png"
              alt={t('landing.heroImageAlt')}
              fill
              preload
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <MatchDayBundlePromo locale={locale} t={t} />

      <section id="pricing" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="text-balance text-[36px] font-semibold leading-[1.16] sm:text-[48px]">
            {t('about.priceTable.title')}
          </h2>
          <p className="mt-3 max-w-[62ch] text-pretty text-[15px] leading-[1.55] text-[#52525b]">
            {t('about.priceTable.subtitle')}
          </p>

          <div className="mt-8 overflow-x-auto rounded-[36px] bg-white ring-1 ring-[#ececee]">
            <table className="w-full min-w-[700px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#ececee] text-[12px] font-semibold text-[#3f3f46]">
                  <th className="px-7 py-5">{t('about.priceTable.colSlot')}</th>
                  <th className="px-7 py-5">{t('about.priceTable.colWeekday')}</th>
                  <th className="px-7 py-5">{t('about.priceTable.colFriday')}</th>
                  <th className="px-7 py-5">{t('about.priceTable.colWeekend')}</th>
                </tr>
              </thead>
              <tbody>
                {BOOKING_PRICE_SLOTS.map((slot, index) => (
                  <tr
                    key={`${slot.startHour}-${slot.endHour}`}
                    className={index === BOOKING_PRICE_SLOTS.length - 1 ? '' : 'border-b border-[#f4f4f5]'}
                  >
                    <td className="px-7 py-4 tabular-nums text-[14px] font-semibold whitespace-nowrap">
                      {formatHour(slot.startHour)} - {formatHour(slot.endHour)}
                    </td>
                    <td className="px-7 py-4 tabular-nums text-[14px] text-[#52525b]">
                      {formatPrice(slot.weekdayPrice, t('about.priceTable.na'))}
                    </td>
                    <td className="px-7 py-4 tabular-nums text-[14px] text-[#52525b]">
                      {formatPrice(slot.fridayPrice, t('about.priceTable.na'))}
                    </td>
                    <td className="px-7 py-4 tabular-nums text-[14px] font-medium">
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

      <section id="lapangan" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="max-w-[700px]">
            <h2 className="text-balance text-[36px] font-semibold leading-[1.16] sm:text-[48px]">
              {t('about.gallery.title')}
            </h2>
            <p className="mt-3 max-w-[58ch] text-pretty text-[15px] leading-[1.55] text-[#52525b]">
              {t('about.gallery.desc')}
            </p>
          </div>
          <div className="relative mt-8 aspect-[16/8] min-h-[300px] overflow-hidden rounded-[36px] outline outline-1 -outline-offset-1 outline-black/10">
            <Image
              src="/assets/Golden Hour HAM.png"
              alt={t('landing.galleryImageAlt')}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section id="schedule" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="text-balance text-[36px] font-semibold leading-[1.16] sm:text-[48px]">
            {t('about.schedule.title')}
          </h2>
          <p className="mt-3 max-w-[62ch] text-pretty text-[15px] leading-[1.55] text-[#52525b]">
            {t('about.schedule.subtitle')}
          </p>

          {loadingBookings ? (
            <div className="mt-8 overflow-x-auto pb-3" aria-label={t('about.schedule.loading')}>
              <div className="grid min-w-[1000px] grid-cols-5 gap-3">
                {dates.map((date) => (
                  <div key={date.toISOString()} className="rounded-[24px] bg-[#ececee] p-4">
                    <div className="h-5 w-3/4 rounded-[12px] bg-[#d4d4d8]" />
                    <div className="mt-5 space-y-3">
                      {BOOKING_PRICE_SLOTS.map((slot) => (
                        <div
                          key={slot.startHour}
                          className="h-[58px] rounded-[14px] bg-white/75"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : scheduleError ? (
            <div className="mt-8 flex flex-col items-start rounded-[36px] bg-white p-7 ring-1 ring-[#ececee]">
              <h3 className="text-[20px] font-semibold">{t('about.schedule.errorTitle')}</h3>
              <p className="mt-2 max-w-[56ch] text-pretty text-[14px] leading-[1.55] text-[#52525b]">
                {t('about.schedule.errorDescription')}
              </p>
              <button
                type="button"
                onClick={() => setScheduleAttempt((attempt) => attempt + 1)}
                className="landing-press mt-5 inline-flex min-h-11 items-center gap-2 rounded-[14px] bg-[#09090b] px-4 text-[14px] font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00] focus-visible:ring-offset-2"
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
                    <div key={dateString} className="rounded-[24px] bg-[#ececee] p-3.5">
                      <p className="min-h-11 text-balance text-center text-[13px] font-semibold leading-[1.4]">
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
                              className="landing-press block min-h-[62px] rounded-[14px] bg-white px-3 py-2.5 text-[#09090b] ring-1 ring-[#ececee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00]"
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

      <section id="location" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-[1200px] overflow-hidden rounded-[36px] bg-white p-2 ring-1 ring-[#ececee] lg:grid-cols-[1.5fr_0.5fr]">
          <div className="h-[360px] overflow-hidden rounded-[28px] sm:h-[440px]">
            <HAMMapWrapper />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <h2 className="text-balance text-[32px] font-semibold leading-[1.16]">
              {t('about.schedule.mapTitle')}
            </h2>
            <p className="mt-3 text-pretty text-[15px] leading-[1.55] text-[#52525b]">
              {t('about.heroSub')}
            </p>
            <a
              href="https://maps.app.goo.gl/zWhDSF6oPnzU7vvQ7"
              target="_blank"
              rel="noopener noreferrer"
              className="landing-press mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-[14px] bg-[#f4f4f5] pl-4 pr-[14px] text-[14px] font-medium text-[#18181b] ring-1 ring-[#ececee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00]"
            >
              {t('about.schedule.openMaps')}
              <ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[900px]">
          <h2 className="text-balance text-[36px] font-semibold leading-[1.16] sm:text-[48px]">
            {t('about.faq.title')}
          </h2>
          <div className="mt-8 space-y-3">
            {faqItems.map(([question, answer]) => (
              <details
                key={question}
                className="group rounded-[24px] bg-white px-5 ring-1 ring-[#ececee] open:pb-5 sm:px-6"
              >
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[16px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00] focus-visible:ring-offset-2">
                  <span className="text-pretty">{question}</span>
                  <Plus size={18} className="shrink-0 group-open:hidden" aria-hidden="true" />
                  <Minus
                    size={18}
                    className="hidden shrink-0 group-open:block"
                    aria-hidden="true"
                  />
                </summary>
                <p className="max-w-[68ch] text-pretty text-[14px] leading-[1.6] text-[#52525b]">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-7 rounded-[36px] bg-white p-8 ring-1 ring-[#ececee] sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-[680px]">
            <h2 className="text-balance text-[34px] font-semibold leading-[1.16] sm:text-[44px]">
              {t('about.cta.title')}
            </h2>
            <p className="mt-3 max-w-[58ch] text-pretty text-[15px] leading-[1.55] text-[#52525b]">
              {t('about.cta.subtitle')}
            </p>
          </div>
          <Link
            href="/customer/booking/create"
            className="landing-press inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-[14px] bg-[#09090b] pl-5 pr-[18px] text-[14px] font-medium whitespace-nowrap text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00] focus-visible:ring-offset-2"
          >
            {t('landing.bookNow')}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <footer className="bg-[#18181b] px-4 py-10 text-white sm:px-6">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/Logo-HAM-fix.png"
              alt=""
              width={38}
              height={38}
              className="h-9 w-9 object-contain"
            />
            <p className="text-pretty text-[13px] text-[#a1a1aa]">{t('about.footer.rights')}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/auth/customer"
              className="landing-press inline-flex min-h-11 items-center rounded-[14px] px-3 text-[13px] text-[#d4d4d8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00]"
            >
              {t('about.signIn')}
            </Link>
            <Link
              href="/auth/admin"
              className="landing-press inline-flex min-h-11 items-center rounded-[14px] px-3 text-[13px] text-[#d4d4d8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00]"
            >
              {t('about.footer.admin')}
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
