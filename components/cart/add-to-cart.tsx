'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { addItem } from 'components/cart/actions';
import LoadingDots from 'components/loading-dots';
import { ProductFragment } from 'lib/swell/__generated__/graphql';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

export function AddToCart({
  availableForSale,
  product
}: {
  product: ProductFragment;
  availableForSale: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [selectedOptions, setSelectedOptions] = useState([]);
  useEffect(() => {
    const currentVariantArray: any = [];
    searchParams.forEach((value, key) => {
      currentVariantArray.push({ value, name: key });
    });
    setSelectedOptions(currentVariantArray);
  }, [searchParams]);

  return (
    <button
      aria-label="Add item to cart"
      disabled={isPending}
      title={availableForSale ? 'Add To Cart' : 'Out Of Stock'}
      onClick={() => {
        // Safeguard in case someone messes with `disabled` in devtools.
        if (!availableForSale) return;

        startTransition(async () => {
          const error = await addItem(product.id, selectedOptions);

          if (error) {
            // Trigger the error boundary in the root error.js
            throw new Error(error.toString());
          }

          router.refresh();
        });
      }}
      className={clsx(
        'relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white hover:opacity-90',
        {
          'cursor-not-allowed opacity-60 hover:opacity-60': !availableForSale,
          'cursor-not-allowed': isPending
        }
      )}
    >
      <div className="absolute left-0 ml-4">
        {!isPending ? <PlusIcon className="h-5" /> : <LoadingDots className="mb-3 bg-white" />}
      </div>
      <span>{availableForSale ? 'Add To Cart' : 'Out Of Stock'}</span>
    </button>
  );
}
