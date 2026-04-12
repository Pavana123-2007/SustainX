import { useState } from "react";
import { Brain, TrendingUp, Leaf, BarChart3 } from "lucide-react";
import { motion, useAnimate } from "motion/react";
import { useTranslations, Text } from "@fimo/ui";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import ComingSoonDialog from "./ComingSoonDialog";
import QuickActionsModal from "./QuickActionsModal";
import { useSustainXInsights } from "@/hooks/useSustainXInsights";
import { useUserActions } from "@/context/UserActionsContext";

export default function SmartSuggestionsSection() {
  const { t } = useTranslations();
  const navigate = useNavigate();
  const { userActions } = useUserActions();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [quickActionsModalOpen, setQuickActionsModalOpen] = useState(false);

  const { usageInsight, mealInsight, commuteInsight } = useSustainXInsights(userActions);

  // Check if there are any actions logged today
  const hasActionsToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();
    
    return userActions.some(action => action.timestamp >= todayTimestamp);
  };

  const handleStartJourney = () => {
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // After scroll animation, check actions and navigate
    setTimeout(() => {
      if (hasActionsToday()) {
        // Navigate to analytics if actions exist
        navigate('/analytics');
      } else {
        // Open Quick Actions modal if no actions today
        setQuickActionsModalOpen(true);
      }
    }, 800); // Wait for scroll animation to complete
  };

  const insights = [
    {
      icon: TrendingUp,
      title: t("insights.pattern.title", "Usage Pattern Detected"),
      desc: usageInsight.description,
      status: usageInsight.status,
    },
    {
      icon: Leaf,
      title: t("insights.meal.title", "Meal Impact Analysis"),
      desc: mealInsight.description,
      status: mealInsight.status,
    },
    {
      icon: BarChart3,
      title: t("insights.commute.title", "Commute Optimization"),
      desc: commuteInsight.description,
      status: commuteInsight.status,
    },
  ];

  return (
    <>
      <section className="relative px-6 py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />
        <div className="relative mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                <Text value={t("insights.badge", "AI Insights")} />
              </span>
            </div>
            <h2
              className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <Text value={t("insights.title", "AI-Powered Insights")} />
            </h2>
          </motion.div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {insights.map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="rounded-2xl border border-border bg-card/60 p-6 text-left backdrop-blur-sm"
              >
                <div className="mb-4 inline-flex rounded-xl bg-primary/15 p-3">
                  <insight.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  <Text value={insight.title} />
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {insight.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-14"
          >
            <Button
              size="lg"
              onClick={handleStartJourney}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 text-base"
            >
              <Text value={t("insights.cta", "Start Your Journey")} />
            </Button>
          </motion.div>
        </div>
      </section>

      <ComingSoonDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <QuickActionsModal open={quickActionsModalOpen} onOpenChange={setQuickActionsModalOpen} />
    </>
  );
}