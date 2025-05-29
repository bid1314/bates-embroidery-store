import { SWELL_GRAPHQL_API_ENDPOINT } from 'lib/constants';

const domain = `https://${process.env.SWELL_STORE_ID!}.swell.store`;
const endpoint = `${domain}${SWELL_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SWELL_PUBLIC_KEY!;

import { GraphQLClient } from 'graphql-request';
import { TAGS } from 'lib/constants';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { SwellCartItemOptionInput, getSdk } from './__generated__/graphql';

const client = new GraphQLClient(endpoint, {
  headers: {
    Authorization: key
  },
  fetch
});
const SwellClient = getSdk(client);

export const getProduct = async (slug: string) => {
  const { data } = await SwellClient.getProduct({
    slug
  });
  return data.productBySlug;
};

export const getProducts = async ({ query, sort }: { query?: string; sort?: string }) => {
  const { data } = await SwellClient.getProducts({
    query,
    sort
  });
  return data.products.results;
};

export const getCart = async (sessionToken: string) => {
  try {
    client.setHeader('X-Session', sessionToken);
    const data = await getSdk(client).getCart();
    if (data.data.cart) {
      return {
        ...data.data.cart
      };
    }
  } catch (e) {
    client.setHeader('X-Session', '');
    const data = await getSdk(client).getCart();
    if (data.data.cart) {
      return {
        ...data.data.cart
      };
    }
  }
};

export const addToCart = async (
  sessionToken: string | undefined,
  {
    productId,
    quantity,
    options
  }: { productId: string; quantity: number; options: SwellCartItemOptionInput[] | undefined }
) => {
  if (sessionToken) {
    client.setHeader('X-Session', sessionToken);
  }
  try {
    const addCartItem = await getSdk(client).addToCart({
      productId,
      quantity,
      options
    });
    return addCartItem;
  } catch (e) {
    client.setHeader('X-Session', '');
    const addCartItem = await getSdk(client).addToCart({
      productId,
      quantity,
      options
    });
    return addCartItem;
  }
};

export const updateCart = async (
  sessionToken: string,
  {
    itemId,
    quantity
  }: {
    itemId: string;
    quantity: number;
  }
) => {
  client.setHeader('X-Session', sessionToken);
  const updateCart = await getSdk(client).editCartItem({
    itemId,
    quantity
  });
  return updateCart;
};

export const removeFromCart = async (sessionToken: string, itemId: string) => {
  client.setHeader('X-Session', sessionToken);
  const removeCart = await getSdk(client).removeFromCart({
    itemId
  });
  return removeCart;
};

export const getCategory = async (slug: string) => {
  const { data } = await SwellClient.getGategory({
    slug
  });
  return data.categoryBySlug;
};

export const getProductsByCategory = async (
  category: string,
  params?: {
    query?: string;
    sort?: string;
  }
) => {
  const { sort, query } = params || {};
  const { data } = await SwellClient.getProductsByCategory({
    category,
    sort,
    query
  });
  return data?.products.results;
};

export const getCategories = async () => {
  const { data } = await SwellClient.getCategories();
  return data.categories.results;
};

export const getMenus = async () => {
  const { data } = await SwellClient.getMenus();
  return data.menuSettings;
};

export const getMenu = async (id: string) => {
  const menus = await getMenus();
  return menus.sections.find((menu) => menu.id === id);
};

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  const collectionWebhooks = ['category.created', 'category.deleted', 'category.updated'];
  const productWebhooks = ['product.created', 'product.deleted', 'product.updated'];
  const { type } = await req.json();
  const secret = req.nextUrl.searchParams.get('secret');
  const isCollectionUpdate = collectionWebhooks.includes(type);
  const isProductUpdate = productWebhooks.includes(type);

  if (!secret || secret !== process.env.SWELL_REVALIDATION_SECRET) {
    console.error('Invalid revalidation secret.');
    return NextResponse.json({ status: 200 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections);
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products);
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
