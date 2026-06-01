import Link from 'next/link';
import { Fragment } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="breadcrumb flex items-center justify-start text-stone-400">
      {items.map((item, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="bc-sep mx-2 opacity-30">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-accent transition-colors">{item.label}</Link>
          ) : (
            <span className="text-stone-800 font-medium">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
