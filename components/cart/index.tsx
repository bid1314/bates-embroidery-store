import { getCart } from 'lib/swell';
import { cookies } from 'next/headers';
import CartModal from './modal';

export default async function Cart() {
  const cartId = cookies().get('sessionToken')?.value;
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  return <CartModal cart={cart} />;
}
