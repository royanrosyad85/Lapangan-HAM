'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Lock, Mail } from 'lucide-react';

import { loginAction, type LoginActionState } from '@/actions/auth';
import { useTranslation } from '@/lib/i18n';

export function CustomerLoginForm() {
  const { t } = useTranslation();
  const [state, formAction, isPending] = useActionState<LoginActionState | undefined, FormData>(
    loginAction,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#4d505d] dark:text-[#999ba3]">
          {t('auth.email')}
        </label>
        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999ba3]" />
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder={t('auth.enterEmail')}
            className="h-12 w-full rounded-xl border border-[#d2cecb] bg-[#ffffff] py-3 pl-10 pr-4 text-[15px] text-[var(--text-primary)] placeholder:text-[#999ba3] transition-[border-color,box-shadow] duration-150 focus:border-[#0c0a08] focus:outline-none focus:ring-4 focus:ring-[#0c0a08]/5 dark:border-slate-800 dark:bg-slate-900"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#4d505d] dark:text-[#999ba3]">
          {t('auth.password')}
        </label>
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999ba3]" />
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder={t('auth.enterPassword')}
            className="h-12 w-full rounded-xl border border-[#d2cecb] bg-[#ffffff] py-3 pl-10 pr-4 text-[15px] text-[var(--text-primary)] placeholder:text-[#999ba3] transition-[border-color,box-shadow] duration-150 focus:border-[#0c0a08] focus:outline-none focus:ring-4 focus:ring-[#0c0a08]/5 dark:border-slate-800 dark:bg-slate-900"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        id="login-submit"
        className="mt-2 min-h-12 w-full rounded-xl bg-[#0c0a08] px-4 py-3 text-[15px] font-semibold text-white transition-[transform,opacity] duration-150 hover:opacity-90 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? t('common.loading') : t('auth.login')}
      </button>

      <div className="border-t border-[#d2cecb] pt-5 text-center text-sm text-[#999ba3] dark:border-slate-800">
        {t('auth.noAccount')}{' '}
        <Link href="/auth/customer/register" className="font-medium text-[#0c0a08] dark:text-white transition hover:text-[#5683d2] hover:underline">
          {t('auth.registerNow')} →
        </Link>
      </div>
    </form>
  );
}
