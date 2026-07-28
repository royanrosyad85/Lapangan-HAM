'use client';

import { Globe } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export function LanguageToggle() {
  const { locale, setLocale } = useTranslation();

  return (
    <button
      type="button"
      id="language-toggle"
      onClick={() => setLocale(locale === 'en' ? 'id' : 'en')}
      className="flex min-h-8 items-center gap-1.5 rounded-md border border-[#d2cecb] bg-[#f4f2f0] px-2.5 text-[11px] font-medium uppercase tracking-[0.02em] text-[#4d505d] transition-[border-color,background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-[#999ba3] hover:text-[#0c0a08] active:scale-[0.96] focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
      aria-label={`Switch language to ${locale === 'en' ? 'Indonesian' : 'English'}`}
    >
      <Globe size={13} className="text-[#999ba3]" />
      {locale === 'en' ? 'EN' : 'ID'}
    </button>
  );
}
