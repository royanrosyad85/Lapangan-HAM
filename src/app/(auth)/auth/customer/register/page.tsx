'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import { CustomerRegisterForm } from './CustomerRegisterForm';

export default function CustomerRegisterPage() {
  const { t } = useTranslation();

  return (
    <main className="grid min-h-screen overflow-x-hidden bg-[#f4f2f0] font-sans text-[var(--text-primary)] lg:grid-cols-12">
      {/* Left Panel: Immersive Sports Imagery & Branding */}
      <section
        className="relative hidden overflow-hidden bg-[#0c0a08] p-12 text-white lg:col-span-5 lg:flex lg:flex-col lg:justify-between xl:p-16"
        style={{
          background: 'linear-gradient(165deg, #0c0a08 0%, #0c0a08 22%, #1d2740 52%, #3a548c 74%, #5683d2 88%, #f4f2f0 100%)',
        }}
      >
        {/* Full-bleed background image with premium dark gradient overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1597783442538-368f06281679?auto=format&fit=crop&w=1200&q=80"
            alt="Soccer kicker action"
            fill
            sizes="50vw"
            className="object-cover object-center opacity-70"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,10,8,0.82),rgba(12,10,8,0.18)_48%,rgba(12,10,8,0.94))]" />
        </div>

        {/* Brand Header */}
        <Link href="/" className="relative z-10 inline-flex w-fit transition-opacity hover:opacity-90">
          <Image
            src="/assets/icon.svg"
            alt="HAM Stadium Logo"
            width={96}
            height={96}
            className="h-16 w-16 shrink-0 object-contain"
          />
        </Link>

        {/* Content Statement & Footer */}
        <div className="relative z-10 max-w-md space-y-8">
          <div>
            <h2 className="max-w-md text-balance text-4xl font-semibold leading-[1.06] tracking-tight text-white xl:text-5xl">
              {t('auth.panel.title.register')}
            </h2>
            <p className="mt-5 max-w-sm text-[15px] leading-6 text-white/70">
              {t('auth.panel.desc.register')}
            </p>
          </div>

          <p className="text-xs font-medium text-white/50">
            HAM Stadium booking
          </p>
        </div>
      </section>

      {/* Right Panel: Clean Form Layout */}
       <section className="relative flex flex-col justify-center bg-white px-5 py-10 sm:px-10 sm:py-16 lg:col-span-7 lg:px-20 xl:px-28">
         <div className="mx-auto w-full max-w-md space-y-8">
           <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#4d505d] transition-colors hover:text-[#0c0a08] lg:hidden">
             <Image src="/assets/icon.svg" alt="HAM Stadium Logo" width={28} height={28} className="size-7" />
             HAM Stadium
           </Link>
           <div>
             <h1 className="max-w-md text-balance text-3xl font-semibold leading-tight tracking-tight text-[var(--text-primary)] sm:text-4xl">
              {t('auth.registerTitle')}
            </h1>
             <p className="mt-3 max-w-sm text-[15px] leading-6 text-[var(--text-secondary)]">
              {t('auth.registerSubtitle')}
            </p>
          </div>

          <CustomerRegisterForm />
        </div>
      </section>
    </main>
  );
}
