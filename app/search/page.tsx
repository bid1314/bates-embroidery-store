import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';
import { getProducts } from 'lib/swell';

export const runtime = 'edge';

export const metadata = {
  title: 'Search',
  description: 'Search for products in the store.'
};

export default async function SearchPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : '';
  const searchValue = typeof searchParams.q === 'string' ? searchParams.q : '';

  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  let products = [];
  try {
    products = await getProducts({
      query: searchValue,
      sort: `${sortKey} ${reverse ? 'desc' : 'asc'}`
    });
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  const resultsText = products.length > 1 ? 'results' : 'result';

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? 'There are no products that match '
            : `Showing ${products.length} ${resultsText} for `}
          <span className="font-bold">"{searchValue}"</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
    </>
  );
}
