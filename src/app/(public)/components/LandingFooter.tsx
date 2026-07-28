'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LandingFooterProps {
  t: (key: string) => string;
}

export function LandingFooter({ t }: LandingFooterProps) {
  return (
    <footer className="bg-[#18181b] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Image
            src="/assets/icon.svg"
            alt=""
            width={38}
            height={38}
            className="h-9 w-9 object-contain"
          />
          <p className="text-pretty text-[13px] text-[#a1a1aa]">{t('about.footer.rights')}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/auth/customer"
            className="landing-press inline-flex min-h-10 items-center rounded-full px-4 text-[13px] text-[#d4d4d8] hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00]"
          >
            {t('about.signIn')}
          </Link>
          <Link
            href="/auth/admin"
            className="landing-press inline-flex min-h-10 items-center rounded-full px-4 text-[13px] text-[#d4d4d8] hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00]"
          >
            {t('about.footer.admin')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
