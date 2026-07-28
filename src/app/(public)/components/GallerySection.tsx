'use client';

import Image from 'next/image';

interface GallerySectionProps {
  t: (key: string) => string;
}

export function GallerySection({ t }: GallerySectionProps) {
  return (
    <section id="lapangan" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-[1200px]">
        <div className="max-w-[700px]">
          <h2 className="text-balance text-[36px] font-semibold leading-[1.16] tracking-[-0.01em] sm:text-[48px]">
            {t('about.gallery.title')}
          </h2>
          <p className="mt-3 max-w-[58ch] text-pretty text-[15px] leading-[1.55] text-[#52525b]">
            {t('about.gallery.desc')}
          </p>
        </div>

        <div className="relative mt-8 aspect-[4/3] sm:aspect-[16/8] min-h-[220px] sm:min-h-[300px] overflow-hidden rounded-[24px] sm:rounded-[36px] outline outline-1 -outline-offset-1 outline-black/10 shadow-[0_12px_36px_rgba(0,0,0,0.06)]">
          <Image
            src="/assets/Golden Hour HAM.png"
            alt={t('landing.galleryImageAlt')}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
          />
        </div>
      </div>
    </section>
  );
}
