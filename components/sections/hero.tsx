import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import type { HeroSectionProps } from '@/lib/types';

export default function HeroSection({
  headline,
  subheadline,
  backgroundImage,
  ctaLabel,
  ctaLink
}: HeroSectionProps) {
  return (
    <section className="relative w-full overflow-hidden bg-gray-900 text-white">
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt="Hero background"
          fill
          className="object-cover opacity-40"
          priority
        />
      )}
      <div className="container relative z-10 mx-auto flex h-[60vh] max-h-[38rem] flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl">
          {headline}
        </h1>
        {subheadline && (
          <p className="mb-6 max-w-2xl text-lg md:text-xl text-gray-100">
            {subheadline}
          </p>
        )}
        {ctaLabel && ctaLink && (
          <Link
            href={ctaLink}
            className={clsx(
              'rounded-md bg-white px-6 py-3 text-gray-900 font-semibold hover:bg-gray-200 transition-colors'
            )}
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </section>
  );
} 