'use client';

import { useEffect, useMemo, useState } from 'react';
import { DM_Sans } from 'next/font/google';
import { fetchBookedSlotsAction } from '@/actions/bookings';
import { useTranslation } from '@/lib/i18n';

import { LandingHeader } from './components/LandingHeader';
import { HeroSection } from './components/HeroSection';
import { MatchDayBundlePromo } from './components/MatchDayBundlePromo';
import { PricingSection } from './components/PricingSection';
import { GallerySection } from './components/GallerySection';
import { ScheduleSection } from './components/ScheduleSection';
import { LocationSection } from './components/LocationSection';
import { FaqSection } from './components/FaqSection';
import { BottomCtaBanner } from './components/BottomCtaBanner';
import { LandingFooter } from './components/LandingFooter';

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
});

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

export default function LandingPage() {
  const { t, locale, setLocale } = useTranslation();
  const [bookings, setBookings] = useState<DBBooking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [scheduleError, setScheduleError] = useState(false);
  const [scheduleAttempt, setScheduleAttempt] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        const { data, error } = await fetchBookedSlotsAction(
          toLocalDateString(dates[0]),
          toLocalDateString(dates[4]),
        );

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

  return (
    <main
      className={`${dmSans.className} min-h-[100dvh] overflow-x-clip bg-[#f4f4f5] text-[#09090b] antialiased`}
    >
      <style jsx global>{`
        .landing-press {
          transition: transform 150ms cubic-bezier(0.23, 1, 0.32, 1),
            opacity 150ms cubic-bezier(0.23, 1, 0.32, 1),
            background-color 150ms cubic-bezier(0.23, 1, 0.32, 1);
        }

        .landing-press:active {
          transform: scale(0.96);
        }

        .landing-nav-link {
          display: inline-flex;
          height: 38px;
          align-items: center;
          border-radius: 9999px;
          padding-inline: 14px;
          color: #3f3f46;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 150ms cubic-bezier(0.23, 1, 0.32, 1),
            color 150ms cubic-bezier(0.23, 1, 0.32, 1),
            transform 150ms cubic-bezier(0.23, 1, 0.32, 1);
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
            background-color: rgba(0, 0, 0, 0.05);
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

      <LandingHeader
        t={t}
        locale={locale}
        setLocale={setLocale}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <HeroSection t={t} />

      <MatchDayBundlePromo locale={locale} t={t} />

      <PricingSection t={t} />

      <GallerySection t={t} />

      <ScheduleSection
        dates={dates}
        bookings={bookings}
        loadingBookings={loadingBookings}
        scheduleError={scheduleError}
        setScheduleAttempt={setScheduleAttempt}
        locale={locale}
        t={t}
      />

      <LocationSection t={t} />

      <FaqSection t={t} />

      <BottomCtaBanner t={t} />

      <LandingFooter t={t} />
    </main>
  );
}
