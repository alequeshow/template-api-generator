import type { ReactNode } from "react";

type PanelProps = {
  title?: string;
  headerActions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Panel({ title, headerActions, footer, children, className }: PanelProps) {
  const hasHeader = Boolean(title || headerActions);

  return (
    <div className={["sa-panel", className].filter(Boolean).join(" ")}>
      {hasHeader ? (
        <div className="sa-panel-header">
          {title ? <h2 className="sa-panel-title">{title}</h2> : null}
          {headerActions ? <div>{headerActions}</div> : null}
        </div>
      ) : null}
      <div className="sa-panel-body">{children}</div>
      {footer ? <div className="sa-panel-footer">{footer}</div> : null}
    </div>
  );
}
