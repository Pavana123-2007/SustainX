import { Link } from 'react-router';
import { Leaf } from 'lucide-react';

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  html: string;
}

export function LegalPage({ title, lastUpdated, html }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_45%_at_50%_0%,rgba(16,185,129,0.08),transparent_70%)]" />

      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center gap-2 px-6 py-4">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>SustainX</span>
            <span className="rounded bg-primary/20 px-1.5 py-0.5 text-xs font-semibold text-primary">AI</span>
          </Link>
        </div>
      </nav>

      <main className="relative mx-auto w-full max-w-4xl px-6 py-12 md:py-16">
        <header className="mb-10 border-b border-border pb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-primary/70">Legal</p>
          <h1 className="mt-3 text-3xl font-semibold md:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>{title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
        </header>

        <article
          className="prose prose-invert max-w-none prose-headings:font-semibold prose-headings:text-foreground prose-headings:scroll-mt-20 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>

      <footer className="relative border-t border-border">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4 text-sm text-muted-foreground">
          <span>Legal documents</span>
          <nav className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}