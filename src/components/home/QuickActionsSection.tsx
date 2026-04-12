import { Bus, Car, Footprints, Leaf, Salad, Drumstick, Zap, Lightbulb, Factory, Flame } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations, Text } from "@fimo/ui";
import { Badge } from "@/components/ui/badge";

// tier: "best" | "better" | "least"
interface ActionOption {
  icon: React.ElementType;
  label: string;
  id: string;
  points: number;
  tier: "best" | "better" | "least";
}

interface ActionCategory {
  title: string;
  emoji: string;
  id: string;
  options: ActionOption[];
}

interface Props {
  selections: Record<string, { points: number; tier: "best" | "better" | "least" }>;
  onSelect: (updated: Record<string, { points: number; tier: "best" | "better" | "least" }>) => void;
  goodActions: number;
}

const TIER_COLORS = {
  best:   { border: "#00C896", bg: "rgba(0,200,150,0.15)",  text: "#00C896", shadow: "0 0 14px -2px rgba(0,200,150,0.45)" },
  better: { border: "#FACC15", bg: "rgba(250,204,21,0.12)", text: "#FACC15", shadow: "0 0 14px -2px rgba(250,204,21,0.35)" },
  least:  { border: "#F87171", bg: "rgba(248,113,113,0.12)",text: "#F87171", shadow: "0 0 14px -2px rgba(248,113,113,0.35)" },
};

export default function QuickActionsSection({ selections, onSelect, goodActions }: Props) {
  const { t } = useTranslations();

  const categories: ActionCategory[] = [
    {
      title: "Travel",
      emoji: "🚗",
      id: "travel",
      options: [
        { icon: Footprints, label: "Walk",    id: "walk",    points:  5, tier: "best"   },
        { icon: Bus,        label: "Transit", id: "transit", points:  3, tier: "better" },
        { icon: Car,        label: "Drive",   id: "drive",   points: -2, tier: "least"  },
      ],
    },
    {
      title: "Food",
      emoji: "🍽️",
      id: "food",
      options: [
        { icon: Leaf,     label: "Vegan",       id: "vegan",       points:  5, tier: "best"   },
        { icon: Salad,    label: "Vegetarian",  id: "vegetarian",  points:  3, tier: "better" },
        { icon: Drumstick,label: "Meat",        id: "meat",        points: -2, tier: "least"  },
      ],
    },
    {
      title: "Electricity",
      emoji: "⚡",
      id: "electricity",
      options: [
        { icon: Zap,      label: "Solar",      id: "solar",   points:  5, tier: "best"   },
        { icon: Lightbulb,label: "Green Grid", id: "green",   points:  3, tier: "better" },
        { icon: Factory,  label: "Fossil",     id: "fossil",  points: -2, tier: "least"  },
      ],
    },
  ];

  const handleAction = (catId: string, points: number, tier: "best" | "better" | "least") => {
    onSelect({ ...selections, [catId]: { points, tier } });
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
                {cat.emoji} {cat.title}
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                {cat.options.map((opt) => {
                  const isSelected = selections[cat.id]?.points === opt.points;
                  const colors = TIER_COLORS[opt.tier];
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleAction(cat.id, opt.points, opt.tier)}
                      style={isSelected ? {
                        borderColor: colors.border,
                        background: colors.bg,
                        color: colors.text,
                        boxShadow: colors.shadow,
                        transition: "all 0.3s ease",
                      } : { transition: "all 0.3s ease" }}
                      className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm ${
                        isSelected
                          ? ""
                          : "border-border bg-secondary/60 text-foreground hover:border-primary/40 hover:bg-primary/10"
                      }`}
                    >
                      <opt.icon
                        className="h-4 w-4"
                        style={{ color: isSelected ? colors.text : undefined }}
                      />
                      {opt.label}
                      <span className="ml-1 text-xs opacity-70">
                        {opt.points > 0 ? `+${opt.points}` : opt.points}
                      </span>
                    </button>
                  );
                })}
              </div>
              <AnimatePresence>
                {selections[cat.id] !== undefined && (
                  <motion.p
                    key={selections[cat.id].points}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-3 text-sm font-medium"
                    style={{ color: TIER_COLORS[selections[cat.id].tier].text }}
                  >
                    {selections[cat.id].points > 0 ? "+" : ""}{selections[cat.id].points} pts logged ✅
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
          {goodActions} eco action{goodActions !== 1 ? "s" : ""} today
        </motion.div>
      </div>
    </section>
  );
}
