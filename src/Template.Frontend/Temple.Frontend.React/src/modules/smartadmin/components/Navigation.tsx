"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navigationItems } from "@/modules/smartadmin/navigation";

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="sa-navigation">
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            className="sa-navigation-link"
            data-active={isActive}
            href={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
