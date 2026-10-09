import type { ReactNode } from "react";

export function PageIntro({ title, eyebrow, children }: { title: string; eyebrow?: string; children?: ReactNode }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
      {eyebrow ? <p className="label-caps mb-3 text-espresso">{eyebrow}</p> : null}
      <h1 className="font-display text-3xl font-semibold sm:text-4xl lg:text-5xl">{title}</h1>
      {children ? <div className="mt-4 text-sm leading-relaxed text-muted-foreground">{children}</div> : null}
    </div>
  );
}