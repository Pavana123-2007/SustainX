import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Users, TreePine, Zap, Globe } from "lucide-react";
import { useTranslations, Text } from "@fimo/ui";
import { getGlobalStats } from "@/api/sustainability";

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(interval);
  }, [started, target, duration]);

  return (
    <motion.span
      onViewportEnter={() => setStarted(true)}
      className="text-3xl font-bold text-foreground sm:text-4xl"
      style={{ fontFamily: "var(--font-heading)" }}
    >
      {count.toLocaleString()}+
    </motion.span>
  );
}

export default function ImpactCounterStrip() {
  const { t } = useTranslations();
  const [stats, setStats] = useState({
    activeUsers: 12400,
    treesEquivalent: 8650,
    ecoActionsLogged: 45200,
    co2Prevented: 1840,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        console.log('[ImpactCounterStrip] Fetching global stats...');
        const response = await getGlobalStats();
        console.log('[ImpactCounterStrip] Response:', response);
        
        if (response.success && response.data) {
          console.log('[ImpactCounterStrip] Setting stats:', response.data);
          setStats(response.data);
          
          if (response.warning) {
            console.warn('[ImpactCounterStrip] Warning:', response.warning);
          }
        } else {
          console.error('[ImpactCounterStrip] Failed to fetch stats:', response.error);
        }
      } catch (error) {
        console.error("Error fetching global stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const counters = [
    { icon: Users, value: stats.activeUsers, label: t("counter.users", "Active Users") },
    { icon: TreePine, value: stats.treesEquivalent, label: t("counter.trees", "Trees Equivalent Saved") },
    { icon: Zap, value: stats.ecoActionsLogged, label: t("counter.actions", "Eco Actions Logged") },
    { 
      icon: Globe, 
      value: stats.co2Prevented, 
      label: stats.co2Prevented >= 1000 
        ? t("counter.co2", "Tonnes CO₂ Prevented")
        : t("counter.co2kg", "kg CO₂ Prevented")
    },
  ];

  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {counters.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <c.icon className="h-6 w-6 text-primary" />
              </div>
              <AnimatedCounter target={c.value} />
              <span className="text-sm text-muted-foreground">
                <Text value={c.label} />
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}