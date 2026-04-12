import { TrendingDown, TrendingUp, TreePine, Info } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations, Text } from "@fimo/ui";
import { Badge } from "@/components/ui/badge";

interface Props {
  score: number;
  goodActions: number;
  badActions: number;
}

// Max possible = 15 (3 × +5), min = -6 (3 × -2)
function getScoreColor(score: number): string {
  if (score >= 9)  return "#00C896";
  if (score >= 3)  return "#FACC15";
  return "#F87171";
}

// Normalize score to 0–100 for the ring (range is -6 to 15, span = 21)
function normalizeScore(score: number): number {
  const clamped = Math.max(-6, Math.min(15, score));
  return Math.round(((clamped + 6) / 21) * 100);
}

export default function DashboardSection({ score, goodActions, badActions }: Props) {
  const { t } = useTranslations();
  const displayScore = normalizeScore(score);
  const scoreColor = getScoreColor(score);
  const dashOffset = 264 - 264 * (displayScore / 100);
  const co2 = (score * 0.5).toFixed(1);
  const co2Positive = score >= 0;

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
            <Text value={t("dashboard.description", "See your real-time impact score, track CO₂ savings, and compare good vs bad actions — all in one glance.")} />
          </p>
          <div className="mt-6 flex items-center gap-2 text-primary">
            <TreePine className="h-5 w-5" />
            <span className="text-sm font-medium">
              <Text value={t("dashboard.equivalent", "Equivalent to planting 3 trees 🌳")} />
            </span>
          </div>

          {/* Legend */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-2.5 text-xs backdrop-blur-sm">
            <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span style={{ color: "#00C896" }} className="font-medium">Best: +5</span>
            <span className="text-muted-foreground">|</span>
            <span style={{ color: "#FACC15" }} className="font-medium">Better: +3</span>
            <span className="text-muted-foreground">|</span>
            <span style={{ color: "#F87171" }} className="font-medium">Least: −2</span>
            <span className="text-muted-foreground ml-1">pts</span>
          </div>
        </motion.div>

        {/* Right – dashboard */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="rounded-2xl border border-border bg-card/80 p-6 shadow-[0_0_60px_-12px_rgba(16,185,129,0.15)] backdrop-blur-sm"
        >
          {/* Score ring */}
          <div className="flex items-center gap-6">
            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-muted/40" strokeWidth="8" />
                <motion.circle
                  cx="50" cy="50" r="42" fill="none" stroke={scoreColor} strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={264}
                  initial={{ strokeDashoffset: 264 }}
                  animate={{ strokeDashoffset: dashOffset }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </svg>
              <motion.span
                key={score}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute text-2xl font-bold"
                style={{ fontFamily: "var(--font-heading)", color: scoreColor, transition: "color 0.5s ease" }}
              >
                {score}
              </motion.span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                <Text value={t("dashboard.scoreLabel", "Sustainability Score")} />
              </p>
              <motion.p
                key={score}
                className="text-2xl font-bold"
                style={{ fontFamily: "var(--font-heading)", color: scoreColor, transition: "color 0.5s ease" }}
              >
                {score} pts
              </motion.p>
              <p className="text-xs text-muted-foreground mt-0.5">max 15 · min −6</p>
            </div>
          </div>

          {/* CO₂ */}
          <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-secondary/50 px-4 py-3">
            <div>
              <p className="text-xs text-muted-foreground">CO₂ Equivalent (1 pt = 0.5 kg)</p>
              <motion.p
                key={co2}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg font-semibold"
                style={{ color: co2Positive ? "#00C896" : "#F87171" }}
              >
                {co2Positive ? `${co2} kg saved` : `${Math.abs(Number(co2))} kg emitted`}
              </motion.p>
            </div>
            {co2Positive
              ? <TrendingDown className="h-5 w-5" style={{ color: "#00C896" }} />
              : <TrendingUp className="h-5 w-5" style={{ color: "#F87171" }} />
            }
          </div>

          {/* Good vs Bad */}
          <div className="mt-4 flex gap-3">
            <div className="flex-1 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-center">
              <motion.p
                key={goodActions}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-primary"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {goodActions}
              </motion.p>
              <p className="text-xs text-muted-foreground">Good Actions</p>
            </div>
            <div className="flex-1 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-center">
              <motion.p
                key={badActions}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-destructive"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {badActions}
              </motion.p>
              <p className="text-xs text-muted-foreground">Bad Actions</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
