'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface BottomCtaBannerProps {
  t: (key: string) => string;
}

export function BottomCtaBanner({ t }: BottomCtaBannerProps) {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-7 rounded-[24px] sm:rounded-[36px] bg-[#09090b] p-8 text-white shadow-[0_16px_48px_rgba(0,0,0,0.16)] ring-1 ring-black/10 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-[680px]">
          <h2 className="text-balance text-[34px] font-semibold leading-[1.16] tracking-[-0.01em] text-white sm:text-[44px]">
            {t('about.cta.title')}
          </h2>
          <p className="mt-3 max-w-[58ch] text-pretty text-[15px] leading-[1.55] text-[#a1a1aa]">
            {t('about.cta.subtitle')}
          </p>
        </div>
        <Link
          href="/customer/booking/create"
          className="landing-press inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-7 text-[14px] font-medium text-[#09090b] shadow-md hover:bg-[#f4f4f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00] focus-visible:ring-offset-2"
        >
          {t('landing.bookNow')}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
