import { useState } from "react";
import { Zap, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations, Text } from "@fimo/ui";
import { Button } from "@/components/ui/button";

export default function ImproveMyDaySection() {
  const { t } = useTranslations();
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = [
    { emoji: "🚶", text: t("improve.walk", "Walk instead of driving — save 1.2 kg CO₂") },
    { emoji: "🧴", text: t("improve.bottle", "Use a reusable bottle — save 0.5 kg CO₂") },
    { emoji: "🥗", text: t("improve.cook", "Cook at home tonight — save 0.8 kg CO₂") },
  ];

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
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-6 text-lg shadow-[0_0_30px_-6px_rgba(16,185,129,0.4)]"
          >
            <Zap className="mr-2 h-5 w-5" />
            <Text value={t("improve.button", "Improve My Day")} />
          </Button>
        </motion.div>

        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-10 flex flex-col gap-4"
            >
              {suggestions.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card/60 px-6 py-4 text-left backdrop-blur-sm"
                >
                  <span className="text-2xl">{s.emoji}</span>
                  <p className="text-foreground">
                    <Text value={s.text} />
                  </p>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground"
              >
                <Lightbulb className="h-4 w-4 text-accent" />
                <Text
                  value={t(
                    "improve.equivalent",
                    "That's equivalent to keeping a light off for 12 hours!"
                  )}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}