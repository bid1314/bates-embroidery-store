import { Suspense } from 'react';
import { ProductGridItems } from '@/components/layout/product-grid-items';
import type { ProductGridSectionProps } from '@/lib/types';

export default function ProductGridSection({
  title,
  collectionId,
  limit = 12
}: ProductGridSectionProps) {
  return (
    <section className="container mx-auto my-12 px-4">
      {title && (
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white md:text-3xl">
          {title}
        </h2>
      )}
      <Suspense fallback={<p>Loading products...</p>}>
        <ProductGridItems collectionId={collectionId} limit={limit} />
      </Suspense>
    </section>
  );
} 