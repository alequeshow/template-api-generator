import type { CSSProperties, HTMLAttributes } from "react";

export type IconProps = {
  /**
   * Icon identifier using the MonsterAdmin naming convention, e.g. "fa-home",
   * "mdi-content-save", or "ti-bolt". The icon source (FontAwesome, Material
   * Design Icons, or Themify) is inferred from the name's prefix, so callers
   * can swap between sources by only changing this value.
   */
  name: string;
  /**
   * Optional icon size. Numbers are treated as pixels. When omitted, the icon
   * inherits the font-size of its containing element (the default behavior
   * of all three vendored icon fonts).
   */
  size?: number | string;
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, "className">;

function resolveIconClassName(name: string): string {
  if (name.startsWith("fa-")) {
    return `fa ${name}`;
  }

  if (name.startsWith("mdi-")) {
    return `mdi ${name}`;
  }

  // Themify ("ti-*") and any other icon source that only needs its own class.
  return name;
}

export function Icon({ name, size, className, style, ...rest }: IconProps) {
  const classes = [resolveIconClassName(name), className].filter(Boolean).join(" ");

  const mergedStyle: CSSProperties | undefined =
    size === undefined
      ? style
      : {
          ...style,
          fontSize: typeof size === "number" ? `${size}px` : size,
        };

  return <i className={classes} style={mergedStyle} aria-hidden="true" {...rest} />;
}
