"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navigationItems } from "@/modules/smartadmin/navigation";

export function Navigation() {
  const pathname = usePathname();

  return (
    <ul className="sa-navigation" role="list" style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <li key={item.href} style={{ display: "flex" }}>
            <Link
              className="sa-navigation-link"
              data-active={isActive}
              href={item.href}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
