'use client';

import Link from "next/link";
import {usePathname} from "next/navigation";

export default function NavLink ({ path, label }: { path: string; label: string }) {
  const pathname = usePathname()
  return (
    <Link
      href={path}
      className={`whitespace-nowrap hover:underline transition-colors text-sm py-1` + (pathname === path ? ' text-foreground font-semibold' : ' text-muted-foreground')}
    >
      {label}
    </Link>
  );
};