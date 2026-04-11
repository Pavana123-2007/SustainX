import { useState } from "react";
import { Bike, Car, Footprints, Utensils, Home, MapPin, Zap, Lightbulb, Flame } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations, Text, type FimoString } from "@fimo/ui";
import { Badge } from "@/components/ui/badge";

interface ActionOption {
  icon: React.ElementType;
  label: FimoString;
  id: string;
}

interface ActionCategory {
  title: FimoString;
  emoji: string;
  id: string;
  options: ActionOption[];
}

export default function QuickActionsSection() {
  const { t } = useTranslations();
  const [logged, setLogged] = useState<string | null>(null);

  const categories: ActionCategory[] = [
    {
      title: t("actions.travel", "Travel"),
      emoji: "🚗",
      id: "travel",
      options: [
        { icon: Bike, label: t("actions.bike", "Bike"), id: "bike" },
        { icon: Car, label: t("actions.car", "Car"), id: "car" },
        { icon: Footprints, label: t("actions.walk", "Walk"), id: "walk" },
      ],
    },
    {
      title: t("actions.food", "Food"),
      emoji: "🍽️",
      id: "food",
      options: [
        { icon: Utensils, label: t("actions.ordered", "Ordered"), id: "ordered" },
        { icon: Home, label: t("actions.homemade", "Homemade"), id: "homemade" },
        { icon: MapPin, label: t("actions.local", "Local"), id: "local" },
      ],
    },
    {
      title: t("actions.electricity", "Electricity"),
      emoji: "⚡",
      id: "electricity",
      options: [
        { icon: Zap, label: t("actions.ac", "AC"), id: "ac" },
        { icon: Lightbulb, label: t("actions.light", "Light"), id: "light" },
      ],
    },
  ];

  const handleAction = (catId: string, optId: string) => {
    setLogged(`${catId}.${optId}`);
    setTimeout(() => setLogged(null), 1500);
  };

  return (
    <section id="features" className="relative px-6 py-28">
      <div className="mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="secondary" className="mb-4 bg-primary/15 text-primary">
            <Text value={t("actions.badge", "Quick Actions")} />
          </Badge>
          <h2
            className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <Text value={t("actions.title", "Quick Actions — Zero Friction")} />
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, ci) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: ci * 0.1 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm"
            >
              <p className="text-lg font-semibold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                {cat.emoji}{" "}
                <Text value={cat.title} />
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                {cat.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleAction(cat.id, opt.id)}
                    className="flex items-center gap-2 rounded-xl border border-border bg-secondary/60 px-4 py-2.5 text-sm text-foreground transition-all hover:border-primary/40 hover:bg-primary/10"
                  >
                    <opt.icon className="h-4 w-4 text-primary" />
                    <Text value={opt.label} />
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {logged && logged.startsWith(cat.id) && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-3 text-sm font-medium text-primary"
                  >
                    <Text value={t("actions.logged", "Action logged! ✅")} />
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-destructive/10 px-5 py-2 text-sm font-medium text-destructive"
        >
          <Flame className="h-4 w-4" />
          <Text value={t("actions.streak", "3 eco actions today")} />
        </motion.div>
      </div>
    </section>
  );
}