import type { ReactNode } from "react";

type PageContainerProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function PageContainer({ title, subtitle, children }: PageContainerProps) {
  return (
    <section className="sa-page-container">
      <header>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </header>
      {children}
    </section>
  );
}
