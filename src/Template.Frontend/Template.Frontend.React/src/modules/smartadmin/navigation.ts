export type NavigationItem = {
  label: string;
  href: string;
};

export const navigationItems: NavigationItem[] = [
  { label: "Dashboard", href: "/" },
  { label: "Status", href: "/status" },
  { label: "Authentication", href: "/auth" },
  { label: "Settings", href: "/settings" },
];
