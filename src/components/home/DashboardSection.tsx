import { TrendingDown, TreePine } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations, Text } from "@fimo/ui";
import { Badge } from "@/components/ui/badge";

export default function DashboardSection() {
  const { t } = useTranslations();

  return (
    <section id="dashboard" className="relative overflow-hidden px-6 py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
        {/* Left – text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" className="mb-4 bg-primary/15 text-primary">
            <Text value={t("dashboard.badge", "Daily Impact")} />
          </Badge>
          <h2
            className="text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <Text value={t("dashboard.title", "Your Sustainability Dashboard")} />
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
            <Text
              value={t(
                "dashboard.description",
                "See your real-time impact score, track CO₂ savings, and compare good vs bad actions — all in one glance."
              )}
            />
          </p>
          <div className="mt-6 flex items-center gap-2 text-primary">
            <TreePine className="h-5 w-5" />
            <span className="text-sm font-medium">
              <Text value={t("dashboard.equivalent", "Equivalent to planting 3 trees 🌳")} />
            </span>
          </div>
        </motion.div>

        {/* Right – mock dashboard */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="rounded-2xl border border-border bg-card/80 p-6 shadow-[0_0_60px_-12px_rgba(16,185,129,0.15)] backdrop-blur-sm"
        >
          {/* Score */}
          <div className="flex items-center gap-6">
            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-muted/40" strokeWidth="8" />
                <motion.circle
                  cx="50" cy="50" r="42" fill="none" stroke="url(#scoreGrad)" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={264}
                  initial={{ strokeDashoffset: 264 }}
                  whileInView={{ strokeDashoffset: 264 - 264 * 0.76 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>76</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                <Text value={t("dashboard.scoreLabel", "Sustainability Score")} />
              </p>
              <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                76<span className="text-sm font-normal text-muted-foreground"> / 100</span>
              </p>
            </div>
          </div>

          {/* CO₂ */}
          <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-secondary/50 px-4 py-3">
            <div>
              <p className="text-xs text-muted-foreground">
                <Text value={t("dashboard.co2Label", "CO₂ Equivalent")} />
              </p>
              <p className="text-lg font-semibold text-foreground">
                <Text value={t("dashboard.co2Value", "2.4 kg saved today")} />
              </p>
            </div>
            <TrendingDown className="h-5 w-5 text-primary" />
          </div>

          {/* Good vs Bad */}
          <div className="mt-4 flex gap-3">
            <div className="flex-1 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-center">
              <p className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-heading)" }}>5</p>
              <p className="text-xs text-muted-foreground">
                <Text value={t("dashboard.good", "Good Actions")} />
              </p>
            </div>
            <div className="flex-1 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-center">
              <p className="text-2xl font-bold text-destructive" style={{ fontFamily: "var(--font-heading)" }}>2</p>
              <p className="text-xs text-muted-foreground">
                <Text value={t("dashboard.bad", "Bad Actions")} />
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}