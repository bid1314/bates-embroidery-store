export type SortFilterItem = {
  name: string;
  slug: string | null;
  sortKey: 'RELEVANCE' | 'BEST_SELLING' | 'CREATED_AT' | 'price';
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  name: 'Relevance',
  slug: null,
  sortKey: 'RELEVANCE',
  reverse: false
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  // { name: 'Trending', slug: 'trending-desc', sortKey: 'BEST_SELLING', reverse: false }, // asc
  // { name: 'Latest arrivals', slug: 'latest-desc', sortKey: 'CREATED_AT', reverse: true },
  { name: 'Price: Low to high', slug: 'price-asc', sortKey: 'price', reverse: false }, // asc
  { name: 'Price: High to low', slug: 'price-desc', sortKey: 'price', reverse: true }
];

export const TAGS = {
  collections: 'collections',
  products: 'products',
  cart: 'cart'
};

export const HIDDEN_PRODUCT_TAG = 'nextjs-frontend-hidden';
export const DEFAULT_OPTION = 'Default Title';
export const SWELL_GRAPHQL_API_ENDPOINT = '/graphql';

export const PLACEHOLDER_IMAGE =
  'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=';
