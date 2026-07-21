import type { ReactNode } from "react";

import { AuthAccountMenu } from "@/features/auth/components/AuthAccountMenu";
import { Navigation } from "@/modules/smartadmin/components/Navigation";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="sa-app-shell">
      <header className="sa-header">
        <div className="sa-header-inner">
          <div className="sa-header-start">
            <span className="sa-brand">Template.Frontend.React</span>
          </div>
          <div className="sa-header-end">
            <AuthAccountMenu />
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
      <footer className="sa-footer">MonsterAdmin.React — Template App Generator</footer>
    </div>
  );
}
