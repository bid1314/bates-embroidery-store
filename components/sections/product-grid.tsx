import { Suspense } from 'react';
import ProductGridItems from '@/components/layout/product-grid-items';
import { getProductsByCategory } from '@/lib/swell';
import type { ProductGridSectionProps } from '@/lib/types';

export default async function ProductGridSection({
  title,
  collectionId,
  limit = 12
}: ProductGridSectionProps) {
  // Fetch products from Swell by category
  const products = await getProductsByCategory(collectionId || '');

  return (
    <section className="container mx-auto my-12 px-4">
      {title && (
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl dark:text-white">
          {title}
        </h2>
      )}
      <Suspense fallback={<p>Loading products...</p>}>
        <ProductGridItems products={products.slice(0, limit)} />
      </Suspense>
    </section>
  );
}
