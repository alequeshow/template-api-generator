import Link from "next/link";
import type { ReactNode } from "react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PageContainerProps = {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  headerActions?: ReactNode;
  children: ReactNode;
};

export function PageContainer({
  title,
  subtitle,
  breadcrumbs,
  headerActions,
  children,
}: PageContainerProps) {
  return (
    <section className="sa-page-container">
      <div className="sa-page-header">
        <div className="sa-page-header-left">
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <ol className="sa-breadcrumb" aria-label="Breadcrumb">
              {breadcrumbs.map((crumb, i) => (
                <li key={crumb.href ?? `${crumb.label}-${i}`} className="sa-breadcrumb-item">
                  {crumb.href ? (
                    <Link href={crumb.href}>{crumb.label}</Link>
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          ) : null}
          <h1 className="sa-page-title">{title}</h1>
          {subtitle ? <p className="sa-page-subtitle">{subtitle}</p> : null}
        </div>
        {headerActions ? (
          <div className="sa-page-header-actions">{headerActions}</div>
        ) : null}
      </div>
      {children}
    </section>
  );
}
