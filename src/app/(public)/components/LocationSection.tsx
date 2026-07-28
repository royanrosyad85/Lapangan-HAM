'use client';

import dynamic from 'next/dynamic';
import { ArrowRight } from 'lucide-react';

const HAMMapWrapper = dynamic(() => import('@/components/HAMMapWrapper'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#ececee]" aria-hidden="true" />,
});

interface LocationSectionProps {
  t: (key: string) => string;
}

export function LocationSection({ t }: LocationSectionProps) {
  return (
    <section id="location" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto grid max-w-[1200px] overflow-hidden rounded-[24px] sm:rounded-[36px] bg-white p-2 ring-1 ring-[#ececee] shadow-xs lg:grid-cols-[1.5fr_0.5fr]">
        <div className="h-[280px] overflow-hidden rounded-[20px] sm:h-[360px] lg:h-[440px] sm:rounded-[28px]">
          <HAMMapWrapper />
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-8">
          <h2 className="text-balance text-[32px] font-semibold leading-[1.16] tracking-[-0.01em]">
            {t('about.schedule.mapTitle')}
          </h2>
          <p className="mt-3 text-pretty text-[15px] leading-[1.55] text-[#52525b]">
            {t('about.heroSub')}
          </p>
          <a
            href="https://maps.app.goo.gl/zWhDSF6oPnzU7vvQ7"
            target="_blank"
            rel="noopener noreferrer"
            className="landing-press mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-[#f4f4f5] pl-4 pr-[14px] text-[14px] font-medium text-[#18181b] ring-1 ring-[#ececee] hover:bg-[#eaeaea] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00]"
          >
            {t('about.schedule.openMaps')}
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
