export type NavigationItem = {
  label: string;
  href: string;
  icon: string;
};

export const navigationItems: NavigationItem[] = [
  { label: "Home", href: "/", icon: "fa-home" },
  { label: "Dashboard", href: "/dashboard", icon: "ti-bar-chart" },
  { label: "Status", href: "/status", icon: "mdi-check-all" },
];
