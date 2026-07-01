import type { ReactNode } from "react";

import { AuthActions } from "@/features/auth/components/AuthActions";
import { Navigation } from "@/modules/smartadmin/components/Navigation";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="sa-app-shell">
      <header className="sa-header">
        <div className="sa-header-content">
          <span className="sa-brand">Temple SmartAdmin</span>
          <AuthActions />
        </div>
      </header>
      <div className="sa-body">
        <aside className="sa-sidebar" aria-label="Primary navigation">
          <Navigation />
        </aside>
        <main>{children}</main>
      </div>
      <footer className="sa-footer">SmartAdmin React migration foundation</footer>
    </div>
  );
}
