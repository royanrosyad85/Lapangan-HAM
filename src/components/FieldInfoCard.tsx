'use client';

import Image from 'next/image';
import { CheckCircle2, MapPin } from 'lucide-react';

import { useTranslation } from '@/lib/i18n';
import { PriceTable } from './PriceTable';

type FieldInfoCardProps = {
  fieldName: string;
  fieldAddress: string | null;
};

export function FieldInfoCard({ fieldName, fieldAddress }: FieldInfoCardProps) {
  const { t } = useTranslation();

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-[#d2cecb] bg-white shadow-[0_12px_30px_-24px_rgba(12,10,8,0.35)] dark:border-slate-800 dark:bg-slate-900/60">
      <div className="relative h-36 overflow-hidden bg-slate-900 sm:h-40">
        <Image
          src="https://images.unsplash.com/photo-1597783442538-368f06281679?auto=format&fit=crop&w=600&q=80"
          alt="HAM Stadium Field"
          fill
          sizes="(max-width: 1024px) 100vw, 340px"
          className="object-cover opacity-70 transition-transform duration-500 ease-out motion-reduce:transition-none sm:hover:scale-105"
          unoptimized
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(12,10,8,0.72))]" />
        <div className="absolute inset-x-4 bottom-3 flex items-center justify-between gap-3 text-white sm:inset-x-5">
          <p className="text-xs font-medium">HAM Stadium</p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm">
            <CheckCircle2 size={13} />
            {t('booking.fieldAvailable')}
          </span>
        </div>
      </div>

      <div className="space-y-5 p-4 sm:p-5">
        <div>
        <h3 className="text-balance break-words text-xl font-semibold tracking-tight text-[#0c0a08] dark:text-white">{fieldName}</h3>
        {fieldAddress && (
          <p className="mt-2 flex items-start gap-1.5 break-words text-[13px] leading-5 text-[#6b6d75] dark:text-slate-400">
            <MapPin size={14} className="mt-0.5 shrink-0" />
            <span>{fieldAddress}</span>
          </p>
        )}
        </div>

        <PriceTable />
      </div>
    </section>
  );
}
