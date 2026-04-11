import { Link } from "react-router";
import { Leaf } from "lucide-react";
import { useTranslations, Text } from "@fimo/ui";

export default function Footer() {
  const { t } = useTranslations();

  return (
    <footer className="border-t border-border bg-card/40 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary" />
          <span className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            SustainX
          </span>
          <span className="text-xs font-semibold text-primary">AI</span>
        </div>

        <p className="text-sm text-muted-foreground">
          <Text value={t("footer.tagline", "Built for a sustainable future 🌱")} />
        </p>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/privacy" className="transition-colors hover:text-foreground">
            <Text value={t("footer.privacy", "Privacy")} />
          </Link>
          <Link to="/terms" className="transition-colors hover:text-foreground">
            <Text value={t("footer.terms", "Terms")} />
          </Link>
        </div>
      </div>
    </footer>
  );
}