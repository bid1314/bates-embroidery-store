'use client';

import clsx from 'clsx';
import { MenuFragment } from 'lib/swell/__generated__/graphql';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const FooterMenuItem = ({ item }: { item: MenuFragment['items'][0] }) => {
  const pathname = usePathname();
  const [active, setActive] = useState(pathname === item.path);

  useEffect(() => {
    setActive(pathname === item.path);
  }, [pathname, item.path]);

  return (
    <li>
      <Link
        href={item.path}
        className={clsx(
          'block p-2 text-lg underline-offset-4 hover:text-black hover:underline dark:hover:text-neutral-300 md:inline-block md:text-sm',
          {
            'text-black dark:text-neutral-300': active
          }
        )}
      >
        {item.title}
      </Link>
    </li>
  );
};

export default function FooterMenu({ menu }: { menu: MenuFragment }) {
  if (!menu || !menu.items?.length) return null;

  return (
    <nav>
      <ul>
        {menu.items.map((item: MenuFragment) => {
          return <FooterMenuItem key={item.id} item={item} />;
        })}
      </ul>
    </nav>
  );
}
