import { useState } from "react";
import { Bus, Car, Footprints, Leaf, Salad, Drumstick, Zap, Lightbulb, Factory } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations, Text } from "@fimo/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/UI/dialog";
import { Button } from "@/components/UI/button";
import { useUserActions } from "@/context/UserActionsContext";
import { logSustainabilityAction } from "@/api/sustainability";

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
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TIER_COLORS = {
  best: { border: "#00C896", bg: "rgba(0,200,150,0.15)", text: "#00C896", shadow: "0 0 14px -2px rgba(0,200,150,0.45)" },
  better: { border: "#FACC15", bg: "rgba(250,204,21,0.12)", text: "#FACC15", shadow: "0 0 14px -2px rgba(250,204,21,0.35)" },
  least: { border: "#F87171", bg: "rgba(248,113,113,0.12)", text: "#F87171", shadow: "0 0 14px -2px rgba(248,113,113,0.35)" },
};

export default function QuickActionsModal({ open, onOpenChange }: Props) {
  const { t } = useTranslations();
  const { addAction } = useUserActions();
  const [selections, setSelections] = useState<Record<string, { points: number; tier: "best" | "better" | "least"; label: string }>>({});
  const [isSaving, setIsSaving] = useState(false);

  const categories: ActionCategory[] = [
    {
      title: "Travel",
      emoji: "🚗",
      id: "travel",
      options: [
        { icon: Footprints, label: "Walk", id: "walk", points: 5, tier: "best" },
        { icon: Bus, label: "Transit", id: "transit", points: 3, tier: "better" },
        { icon: Car, label: "Drive", id: "drive", points: -2, tier: "least" },
      ],
    },
    {
      title: "Food",
      emoji: "🍽️",
      id: "food",
      options: [
        { icon: Leaf, label: "Vegan", id: "vegan", points: 5, tier: "best" },
        { icon: Salad, label: "Vegetarian", id: "vegetarian", points: 3, tier: "better" },
        { icon: Drumstick, label: "Meat", id: "meat", points: -2, tier: "least" },
      ],
    },
    {
      title: "Electricity",
      emoji: "⚡",
      id: "electricity",
      options: [
        { icon: Zap, label: "Solar", id: "solar", points: 5, tier: "best" },
        { icon: Lightbulb, label: "Green Grid", id: "green", points: 3, tier: "better" },
        { icon: Factory, label: "Fossil", id: "fossil", points: -2, tier: "least" },
      ],
    },
  ];

  const handleAction = (catId: string, points: number, tier: "best" | "better" | "least", label: string) => {
    setSelections({ ...selections, [catId]: { points, tier, label } });
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Save each selection to database and context
      const savePromises = Object.entries(selections).map(async ([catId, selection]) => {
        // Save to database via API
        const result = await logSustainabilityAction({
          category: catId,
          actionLabel: selection.label,
          points: selection.points,
        });

        if (result.success) {
          // Also save to local context for immediate UI update
          addAction(catId, selection.label);
        }

        return result;
      });

      const results = await Promise.all(savePromises);
      
      // Check if all saves were successful
      const allSuccessful = results.every(r => r.success);
      
      if (allSuccessful) {
        // Reset selections and close modal
        setSelections({});
        onOpenChange(false);
      } else {
        console.error("Some actions failed to save:", results.filter(r => !r.success));
        alert("Some actions failed to save. Please try again.");
      }
    } catch (error) {
      console.error("Error saving actions:", error);
      alert("Failed to save actions. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const totalPoints = Object.values(selections).reduce((sum, sel) => sum + sel.points, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            <Text value={t("quickActions.modal.title", "Log Your Actions")} />
          </DialogTitle>
          <DialogDescription>
            <Text value={t("quickActions.modal.description", "Track your daily eco-friendly actions and earn points!")} />
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-sm"
            >
              <p className="text-lg font-semibold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                {cat.emoji} {cat.title}
              </p>
              <div className="flex flex-col gap-2">
                {cat.options.map((opt) => {
                  const isSelected = selections[cat.id]?.points === opt.points;
                  const colors = TIER_COLORS[opt.tier];
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleAction(cat.id, opt.points, opt.tier, opt.label)}
                      style={
                        isSelected
                          ? {
                              borderColor: colors.border,
                              background: colors.bg,
                              color: colors.text,
                              boxShadow: colors.shadow,
                              transition: "all 0.3s ease",
                            }
                          : { transition: "all 0.3s ease" }
                      }
                      className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm ${
                        isSelected
                          ? ""
                          : "border-border bg-secondary/60 text-foreground hover:border-primary/40 hover:bg-primary/10"
                      }`}
                    >
                      <opt.icon className="h-4 w-4" style={{ color: isSelected ? colors.text : undefined }} />
                      {opt.label}
                      <span className="ml-auto text-xs opacity-70">
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
                    className="mt-3 text-sm font-medium text-center"
                    style={{ color: TIER_COLORS[selections[cat.id].tier].text }}
                  >
                    {selections[cat.id].points > 0 ? "+" : ""}
                    {selections[cat.id].points} pts ✅
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {Object.keys(selections).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 px-6 py-4"
          >
            <div>
              <p className="text-sm text-muted-foreground">Total Points</p>
              <p className="text-2xl font-bold text-primary">{totalPoints > 0 ? `+${totalPoints}` : totalPoints}</p>
            </div>
            <Button onClick={handleSave} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={isSaving}>
              <Text value={isSaving ? t("quickActions.modal.saving", "Saving...") : t("quickActions.modal.save", "Save Actions")} />
            </Button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
