import { motion } from "motion/react";
import { Leaf, Droplets, Wind, Sun, TreePine, Recycle } from "lucide-react";
import { useTranslations, Text } from "@fimo/ui";

export default function EcoFactsMarquee() {
  const { t } = useTranslations();

  const facts = [
    { icon: Leaf, text: t("marquee.trees", "1 tree absorbs 22 kg of CO₂ per year") },
    { icon: Droplets, text: t("marquee.water", "A 5-min shower saves 45 liters vs a bath") },
    { icon: Wind, text: t("marquee.wind", "Wind energy prevents 1.1 billion tonnes of CO₂") },
    { icon: Sun, text: t("marquee.solar", "Solar panels reduce bills by up to 70%") },
    { icon: TreePine, text: t("marquee.forest", "Forests cover 31% of global land area") },
    { icon: Recycle, text: t("marquee.recycle", "Recycling 1 ton of paper saves 17 trees") },
  ];

  const doubled = [...facts, ...facts];

  return (
    <div className="relative overflow-hidden border-y border-border/50 bg-card/20 py-4 backdrop-blur-sm">
      <motion.div
        className="flex w-max gap-12"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((fact, i) => (
          <div key={i} className="flex shrink-0 items-center gap-3">
            <fact.icon className="h-4 w-4 text-primary/70" />
            <span className="whitespace-nowrap text-sm text-muted-foreground">
              <Text value={fact.text} />
            </span>
            <span className="text-border/60">•</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}