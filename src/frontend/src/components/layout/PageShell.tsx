import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageShellProps {
  children: ReactNode;
  className?: string;
  /** Optional eyebrow label rendered above the page heading. */
  eyebrow?: string;
  title?: string;
  description?: string;
}

/**
 * Shared page container: consistent max width, vertical rhythm and an optional
 * page header. Pages own their own sections inside this shell.
 */
export function PageShell({
  children,
  className,
  eyebrow,
  title,
  description,
}: PageShellProps) {
  return (
    <div className={cn("relative z-10", className)}>
      {(eyebrow || title || description) && (
        <header className="mx-auto w-full max-w-6xl px-6 pt-16 pb-10 sm:pt-20">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          {title && (
            <h1 className="max-w-3xl text-4xl leading-[1.08] font-semibold sm:text-5xl">
              {title}
            </h1>
          )}
          {description && (
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              {description}
            </p>
          )}
        </header>
      )}
      {children}
    </div>
  );
}

/** Standard section wrapper used by page bodies. */
export function Section({
  children,
  className,
  id,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  id?: string;
} & Omit<HTMLAttributes<HTMLElement>, "children" | "className" | "id">) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-24 py-16 sm:py-20", className)}
      {...rest}
    >
      <div className="mx-auto w-full max-w-6xl px-6">{children}</div>
    </section>
  );
}
