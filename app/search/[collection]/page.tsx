import { defaultSort, sorting } from 'lib/constants';
import { getCategory, getProductsByCategory } from 'lib/swell';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';

export const runtime = 'edge';

export async function generateMetadata({
  params
}: {
  params: { collection: string };
}): Promise<Metadata> {
  const { collection } = params;
  const collectionData = await getCategory(collection);

  if (!collectionData) return notFound();

  return {
    title: collectionData.name,
    description:
      collectionData.metaDescription ||
      collectionData.description ||
      `${collectionData.name} products`,
    openGraph: {
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(collectionData.name)}`,
          width: 1200,
          height: 630
        }
      ]
    }
  };
}

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: { collection: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { collection } = params;
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProductsByCategory(collection, {
    query: searchValue,
    sort: `${sortKey} ${reverse ? 'desc' : 'asc'}`
  });

  return (
    <section>
      {products.length === 0 ? (
        <p className="py-3 text-lg">{`No products found in this collection`}</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      )}
    </section>
  );
}
