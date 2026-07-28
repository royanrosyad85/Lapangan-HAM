'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import {
  ADD_ON_ITEMS,
  BUNDLES,
  type AddOnId,
  type Bundle,
  type BundleId,
} from '@/config/pricing';

const rupiah = new Intl.NumberFormat('id-ID');
const MATCH_DAY_IMAGE =
  'https://images.unsplash.com/photo-1586048971443-b20f8df772a9?auto=format&fit=crop&w=1800&q=82';

function formatPrice(value: number | null, fallback: string) {
  return value === null ? fallback : `Rp${rupiah.format(value)}`;
}

function bundleOriginalPrice(bundle: Bundle) {
  return bundle.items.reduce(
    (sum, id) => sum + (ADD_ON_ITEMS.find((item) => item.id === id)?.price ?? 0),
    0,
  );
}

interface MatchDayBundlePromoProps {
  locale: 'en' | 'id';
  t: (key: string) => string;
}

export function MatchDayBundlePromo({ locale, t }: MatchDayBundlePromoProps) {
  const [selectedId, setSelectedId] = useState<BundleId>('complete_match_day');
  const selected = BUNDLES.find((bundle) => bundle.id === selectedId) ?? BUNDLES[0];
  const originalPrice = bundleOriginalPrice(selected);
  const savings = originalPrice - selected.price;
  const savingsPercent = Math.round((savings / originalPrice) * 100);

  const itemLabel = (id: AddOnId) => t(`landing.bundle.item.${id}`);

  return (
    <section className="px-4 py-10 sm:px-6 sm:py-12" aria-labelledby="match-day-title">
      <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[24px] sm:rounded-[36px] bg-white p-2 ring-1 ring-[#ececee] shadow-xs">
        <div className="grid gap-2 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="flex min-w-0 flex-col rounded-[20px] sm:rounded-[28px] bg-[#ececee] p-6 sm:p-8 lg:p-10">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-[#ff5a00]">
              {t('landing.bundle.eyebrow')}
            </p>
            <h2
              id="match-day-title"
              className="mt-4 max-w-[560px] text-balance text-[34px] font-semibold leading-[1.12] tracking-[-0.01em] text-[#09090b] sm:text-[44px]"
            >
              {t('landing.bundle.title')}
            </h2>
            <p className="mt-4 max-w-[54ch] text-pretty text-[15px] leading-[1.55] text-[#52525b] sm:text-[16px]">
              {t('landing.bundle.description')}
            </p>

            <div className="relative mt-8 aspect-[4/3] sm:aspect-[16/8] min-h-[180px] sm:min-h-[210px] overflow-hidden rounded-[16px] sm:rounded-[20px] outline outline-1 -outline-offset-1 outline-black/10 shadow-xs">
              <Image
                src={MATCH_DAY_IMAGE}
                alt={t('landing.bundle.imageAlt')}
                fill
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover object-center transition-transform duration-500 hover:scale-[1.03]"
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
                    className={`landing-press min-h-12 rounded-[14px] px-3.5 py-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#09090b] focus-visible:ring-offset-2 ${
                      selectedBundle
                        ? 'bg-[#09090b] text-white shadow-sm'
                        : 'bg-[#f4f4f5] text-[#3f3f46] ring-1 ring-[#ececee] hover:bg-[#eaeaea]'
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
                      strokeWidth={2.2}
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
              className="landing-press mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#09090b] pl-5 pr-[18px] text-[14px] font-medium whitespace-nowrap text-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:bg-[#18181b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00] focus-visible:ring-offset-2 sm:w-fit"
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
