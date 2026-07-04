import type { ReactNode } from "react";

import { AuthActions } from "@/features/auth/components/AuthActions";
import { Navigation } from "@/modules/smartadmin/components/Navigation";
import { ThemeSwitcher } from "@/modules/smartadmin/components/ThemeSwitcher";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="sa-app-shell">
      <header className="sa-header">
        <div className="sa-header-inner">
          <div className="sa-header-start">
            <span className="sa-brand">Temple SmartAdmin</span>
          </div>
          <div className="sa-header-end">
            <ThemeSwitcher />
            <AuthActions />
          </div>
        </div>
      </header>
      <nav className="sa-nav-bar" aria-label="Primary navigation">
        <div className="sa-nav-bar-inner">
          <Navigation />
        </div>
      </nav>
      <div className="sa-content-wrapper">
        <main>{children}</main>
      </div>
      <footer className="sa-footer">© 2024 SmartAdmin React — Template API Generator</footer>
    </div>
  );
}
