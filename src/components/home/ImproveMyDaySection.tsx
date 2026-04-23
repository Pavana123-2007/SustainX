import { useState } from "react";
import { Zap, Lightbulb, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations, Text } from "@fimo/ui";
import { Button } from "@/components/ui/button";
import { generateDayTips, type DayTip } from "@/lib/gemini";
import { playSuccessChime } from "@/utils/sounds";

interface Props {
  selections: Record<string, { points: number; tier: "best" | "better" | "least" }>;
}

export default function ImproveMyDaySection({ selections }: Props) {
  const { t } = useTranslations();
  const [tips, setTips] = useState<DayTip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shown, setShown] = useState(false);

  const hasSelections = Object.keys(selections).length > 0;

  const handleClick = async () => {
    if (shown) { setShown(false); return; }
    if (!hasSelections) {
      // fallback static tips if nothing selected
      setTips([
        { emoji: "🚶", text: t("improve.walk", "Walk instead of driving — save 1.2 kg CO₂") },
        { emoji: "🧴", text: t("improve.bottle", "Use a reusable bottle — save 0.5 kg CO₂") },
        { emoji: "🥗", text: t("improve.cook", "Cook at home tonight — save 0.8 kg CO₂") },
      ]);
      setShown(true);
      playSuccessChime();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await generateDayTips(selections);
      setTips(result);
      setShown(true);
      playSuccessChime();
    } catch (e: any) {
      setError(e.message ?? "Failed to generate tips");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <Text value={t("improve.title", "One Tap. Better Choices.")} />
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
            <Text value={t("improve.subtitle", "Get personalized sustainability tips in one tap.")} />
          </p>
          {!hasSelections && (
            <p className="mt-2 text-sm text-muted-foreground/60">
              Select actions above for personalised tips
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-10"
        >
          <Button
            size="lg"
            onClick={handleClick}
            disabled={loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-6 text-lg shadow-[0_0_30px_-6px_rgba(16,185,129,0.4)]"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Zap className="mr-2 h-5 w-5" />
            )}
            <Text value={shown ? t("improve.hide", "Hide Tips") : t("improve.button", "Improve My Day")} />
          </Button>
        </motion.div>

        {error && (
          <p className="mt-4 text-sm text-destructive">{error}</p>
        )}

        <AnimatePresence>
          {shown && tips.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-10 flex flex-col gap-4"
            >
              {tips.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card/60 px-6 py-4 text-left backdrop-blur-sm"
                >
                  <span className="text-2xl">{s.emoji}</span>
                  <p className="text-foreground">{s.text}</p>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground"
              >
                <Lightbulb className="h-4 w-4 text-accent" />
                <Text value={t("improve.equivalent", "Small changes, big impact — keep it up!")} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
