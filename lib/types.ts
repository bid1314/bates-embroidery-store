export type SectionType =
  | 'hero'
  | 'productGrid'
  | 'richText'
  | 'banner';

export interface BaseSection {
  id: string;
  type: SectionType;
  props: Record<string, unknown>;
}

export interface HeroSectionProps {
  headline: string;
  subheadline?: string;
  backgroundImage?: string;
  ctaLabel?: string;
  ctaLink?: string;
}

export interface ProductGridSectionProps {
  title?: string;
  collectionId?: string;
  limit?: number;
}

export interface RichTextSectionProps {
  markdown: string;
}

export interface BannerSectionProps {
  text: string;
  link?: string;
}

export type SectionPropsMap = {
  hero: HeroSectionProps;
  productGrid: ProductGridSectionProps;
  richText: RichTextSectionProps;
  banner: BannerSectionProps;
};

export type Section<T extends SectionType = SectionType> = BaseSection & {
  type: T;
  props: SectionPropsMap[T];
};

export interface Page {
  id: string;
  tenant_id: string;
  slug: string;
  title: string;
  sections: Section[];
  mdx?: string;
  draft: boolean;
  updated_at: string;
  created_at: string;
} 