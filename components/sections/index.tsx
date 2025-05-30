import dynamic from 'next/dynamic';
import type { Section } from '@/lib/types';

// Lazy import heavy components to keep bundle small
const HeroSection = dynamic(() => import('./hero'));
const ProductGridSection = dynamic(() => import('./product-grid'));
const RichTextSection = dynamic(() => import('./rich-text'));
const BannerSection = dynamic(() => import('./banner'));

export function SectionRenderer({ section }: { section: Section }) {
  switch (section.type) {
    case 'hero':
      return <HeroSection {...(section.props as any)} />;
    case 'productGrid':
      return <ProductGridSection {...(section.props as any)} />;
    case 'richText':
      return <RichTextSection {...(section.props as any)} />;
    case 'banner':
      return <BannerSection {...(section.props as any)} />;
    default:
      return null;
  }
}

export default function Sections({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </>
  );
} 