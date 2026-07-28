'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';

interface HeroSectionProps {
  t: (key: string) => string;
}

export function HeroSection({ t }: HeroSectionProps) {
  return (
    <section className="flex min-h-[calc(100dvh-88px)] items-center px-4 pt-16 pb-10 sm:px-6 sm:pt-20 sm:pb-14 lg:pt-24">
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <div className="max-w-[600px]">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-black/[0.08] bg-white/90 p-1.5 pr-4 text-[13px] font-medium text-[#18181b] shadow-[0_2px_10px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all hover:border-black/15 hover:bg-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] active:scale-[0.98]">
            <span className="flex items-center gap-1.5 rounded-full bg-[#ff5a00]/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#d04500]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff5a00] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ff5a00]" />
              </span>
              Official
            </span>
            <span className="text-[13px] font-semibold text-[#18181b]">
              Stadion H. Abdul Malik
            </span>
          </div>

          <h1 className="mt-4 text-balance text-[44px] font-semibold leading-[1.08] tracking-[-0.02em] text-[#09090b] sm:text-[56px] lg:text-[64px]">
            {t('landing.heroTitle')}
          </h1>

          <p className="mt-5 max-w-[54ch] text-pretty text-[17px] leading-[1.55] text-[#52525b]">
            {t('landing.heroDescription')}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/customer/booking/create"
              className="landing-press inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#09090b] px-6 text-[14px] font-medium text-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:bg-[#18181b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00] focus-visible:ring-offset-2"
            >
              {t('landing.bookNow')}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <a
              href="#schedule"
              className="landing-press inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-[14px] font-medium text-[#27272a] ring-1 ring-black/10 hover:bg-[#f4f4f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00]"
            >
              {t('about.nav.schedule')}
            </a>
          </div>

          <p className="mt-6 flex max-w-[48ch] items-start gap-2 text-pretty text-[14px] leading-[1.5] text-[#71717a]">
            <MapPin size={16} className="mt-0.5 shrink-0 text-[#ff5a00]" aria-hidden="true" />
            {t('about.heroSub')}
          </p>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] sm:rounded-[36px] outline outline-1 -outline-offset-1 outline-black/10 shadow-[0_12px_36px_rgba(0,0,0,0.08)]">
          <Image
            src="/assets/Stadion HAM side view.png"
            alt={t('landing.heroImageAlt')}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
          />
        </div>
      </div>
    </section>
  );
}
