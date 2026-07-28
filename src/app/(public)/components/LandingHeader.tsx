'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface LandingHeaderProps {
  t: (key: string) => string;
  locale: 'en' | 'id';
  setLocale: (locale: 'en' | 'id') => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function LandingHeader({
  t,
  locale,
  setLocale,
  mobileMenuOpen,
  setMobileMenuOpen,
}: LandingHeaderProps) {
  return (
    <header className="sticky top-3 z-50 w-full px-4 sm:px-6">
      <nav
        className="mx-auto flex h-[58px] max-w-[1040px] items-center justify-between gap-2 rounded-[24px] border border-white/70 bg-white/80 p-2 pl-3 sm:pl-4 shadow-[0_8px_32px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.06] backdrop-blur-xl transition-all"
        aria-label="Main Navigation"
      >
        <Link
          href="/"
          className="landing-press flex shrink-0 items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00]"
        >
          <Image
            src="/assets/icon.svg"
            alt="Stadion H. Abdul Malik"
            width={48}
            height={48}
            className="h-10 w-10 sm:h-11 sm:w-11 object-contain"
          />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
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
            className="landing-press flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-[13px] font-semibold text-[#3f3f46] hover:bg-black/5 hover:text-[#09090b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00]"
            aria-label={t('landing.languageToggle')}
          >
            <span className="tabular-nums">{locale.toUpperCase()}</span>
          </button>
          <Link
            href="/auth/customer"
            className="landing-press hidden h-10 items-center rounded-full px-3.5 text-[14px] font-medium text-[#3f3f46] hover:bg-black/5 hover:text-[#09090b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00] sm:inline-flex"
          >
            {t('about.signIn')}
          </Link>
          <Link
            href="/auth/customer/register"
            className="landing-press inline-flex h-10 items-center rounded-full bg-[#09090b] px-5 text-[14px] font-medium text-white shadow-sm hover:bg-[#27272a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00] focus-visible:ring-offset-2"
          >
            {t('about.register')}
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="landing-press flex h-10 w-10 items-center justify-center rounded-full text-[#3f3f46] hover:bg-black/5 hover:text-[#09090b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00] md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="mx-auto mt-2 max-w-[1040px] overflow-hidden rounded-[24px] border border-white/70 bg-white/90 p-4 shadow-[0_12px_36px_rgba(0,0,0,0.1)] ring-1 ring-black/[0.06] backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            <a
              className="flex h-11 items-center rounded-[16px] px-4 text-[15px] font-medium text-[#3f3f46] hover:bg-black/5 hover:text-[#09090b] active:scale-[0.98]"
              href="#lapangan"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('about.nav.gallery')}
            </a>
            <a
              className="flex h-11 items-center rounded-[16px] px-4 text-[15px] font-medium text-[#3f3f46] hover:bg-black/5 hover:text-[#09090b] active:scale-[0.98]"
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('about.nav.pricing')}
            </a>
            <a
              className="flex h-11 items-center rounded-[16px] px-4 text-[15px] font-medium text-[#3f3f46] hover:bg-black/5 hover:text-[#09090b] active:scale-[0.98]"
              href="#schedule"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('about.nav.schedule')}
            </a>
            <a
              className="flex h-11 items-center rounded-[16px] px-4 text-[15px] font-medium text-[#3f3f46] hover:bg-black/5 hover:text-[#09090b] active:scale-[0.98]"
              href="#location"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('about.nav.location')}
            </a>
            <a
              className="flex h-11 items-center rounded-[16px] px-4 text-[15px] font-medium text-[#3f3f46] hover:bg-black/5 hover:text-[#09090b] active:scale-[0.98]"
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('about.nav.faq')}
            </a>
            <div className="my-1.5 h-[1px] bg-black/5" />
            <Link
              href="/auth/customer"
              className="flex h-11 items-center rounded-[16px] px-4 text-[15px] font-medium text-[#3f3f46] hover:bg-black/5 hover:text-[#09090b] active:scale-[0.98] sm:hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('about.signIn')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
