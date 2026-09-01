import { type ReactNode } from "react";

/**
 * Reading frame for long-form legal content.
 *
 * Presentational only. It supplies a measured column, a sticky section index on
 * wide screens and consistent heading rhythm — it never transforms, summarises
 * or rewords the text it is given.
 */
export function LegalPage({
  updated,
  title,
  intro,
  sections,
  children,
}: {
  updated: string;
  title: string;
  intro?: string;
  /** Anchors for the desktop index. Ids must match each LegalSection. */
  sections: Array<{ id: string; title: string }>;
  children: ReactNode;
}) {
  return (
    <main id="main-content">
      <div className="bg-mesh border-b">
        <div className="container mx-auto max-w-5xl px-4 py-14">
          <p className="text-caption uppercase text-primary">{updated}</p>
          <h1 className="mt-3 font-display text-h1 text-foreground">{title}</h1>
          {intro ? (
            <p className="mt-4 max-w-3xl text-body-lg text-muted-foreground">{intro}</p>
          ) : null}
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_14rem]">
          {/* Measured reading column — capped so lines stay comfortable. */}
          <div className="min-w-0 max-w-[68ch] space-y-10">{children}</div>

          <nav
            className="order-first h-fit lg:order-last lg:sticky lg:top-20"
            aria-label="On this page"
          >
            <p className="text-caption uppercase text-muted-foreground">On this page</p>
            <ul className="mt-3 space-y-1.5 border-l border-border pl-4">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="block rounded-md text-small text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </main>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="font-display text-h3 text-foreground">{title}</h2>
      <p className="mt-3 text-body leading-8 text-muted-foreground">{children}</p>
    </section>
  );
}
