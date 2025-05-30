import Link from 'next/link';
import type { BannerSectionProps } from '@/lib/types';

export default function BannerSection({ text, link }: BannerSectionProps) {
  const Content = (
    <p className="mx-auto max-w-4xl text-center text-base font-medium text-white md:text-lg">
      {text}
    </p>
  );

  return (
    <section className="bg-primary-600 py-4 px-2 md:py-6">
      {link ? <Link href={link}>{Content}</Link> : Content}
    </section>
  );
} 