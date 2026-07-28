'use client';

import { Minus, Plus } from 'lucide-react';

interface FaqSectionProps {
  t: (key: string) => string;
}

export function FaqSection({ t }: FaqSectionProps) {
  const faqItems = [
    [t('about.faq.q1'), t('about.faq.a1')],
    [t('about.faq.q2'), t('about.faq.a2')],
    [t('about.faq.q3'), t('about.faq.a3')],
  ];

  return (
    <section id="faq" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-[900px]">
        <h2 className="text-balance text-[36px] font-semibold leading-[1.16] tracking-[-0.01em] sm:text-[48px]">
          {t('about.faq.title')}
        </h2>
        <div className="mt-8 space-y-3">
          {faqItems.map(([question, answer]) => (
            <details
              key={question}
              className="group rounded-[20px] sm:rounded-[24px] bg-white px-5 ring-1 ring-[#ececee] open:pb-5 sm:px-6 transition-all duration-200 hover:ring-black/15"
            >
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[16px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00] focus-visible:ring-offset-2">
                <span className="text-pretty">{question}</span>
                <Plus
                  size={18}
                  className="shrink-0 group-open:hidden text-[#71717a] transition-transform duration-200"
                  aria-hidden="true"
                />
                <Minus
                  size={18}
                  className="hidden shrink-0 group-open:block text-[#ff5a00] transition-transform duration-200"
                  aria-hidden="true"
                />
              </summary>
              <p className="max-w-[68ch] text-pretty text-[14px] leading-[1.6] text-[#52525b]">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
