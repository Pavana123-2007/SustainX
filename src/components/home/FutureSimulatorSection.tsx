import { motion } from "motion/react";
import { useTranslations, Text } from "@fimo/ui";
import { useEffect, useState } from "react";

interface Props {
  stats: {
    totalPoints: number;
    goodActionsCount: number;
    badActionsCount: number;
    allTimePoints: number;
  };
}

export default function FutureSimulatorSection({ stats }: Props) {
  const { t } = useTranslations();
  const [co2Data, setCo2Data] = useState({
    badFuture: 132,
    goodFuture: 58,
  });

  useEffect(() => {
    console.log('[FutureSimulator] Stats updated:', stats);
    
    // Calculate CO₂ based on user's actual points
    // 1 point = 0.5 kg CO₂
    // Project weekly average based on today's data
    
    const todayPoints = stats.totalPoints;
    const todayCO2 = Math.abs(todayPoints * 0.5); // Convert points to kg CO₂
    
    console.log('[FutureSimulator] Today points:', todayPoints);
    console.log('[FutureSimulator] Today CO2:', todayCO2);
    console.log('[FutureSimulator] Good actions:', stats.goodActionsCount, 'Bad actions:', stats.badActionsCount);
    
    // Project to weekly (multiply by 7)
    const weeklyCO2 = todayCO2 * 7;
    console.log('[FutureSimulator] Weekly CO2:', weeklyCO2);
    
    // If user has data, calculate based on their actions
    if (stats.goodActionsCount > 0 || stats.badActionsCount > 0) {
      // Bad future: If user continues current bad habits
      // Calculate based on ratio of bad to good actions
      const totalActions = stats.goodActionsCount + stats.badActionsCount;
      const badActionPercentage = stats.badActionsCount / totalActions;
      
      // If mostly bad actions, project higher CO2
      // If mostly good actions, still show some risk
      const badFutureCO2 = weeklyCO2 * (1 + badActionPercentage * 2);
      
      // Good future: If user improves (assume mostly positive actions)
      // Reduce by the improvement potential
      const goodActionPercentage = stats.goodActionsCount / totalActions;
      const goodFutureCO2 = weeklyCO2 * (1 - goodActionPercentage * 0.5);
      
      console.log('[FutureSimulator] Bad future:', badFutureCO2, 'Good future:', goodFutureCO2);
      
      setCo2Data({
        badFuture: Math.max(Math.round(badFutureCO2), 50), // Minimum 50 kg
        goodFuture: Math.max(Math.round(goodFutureCO2), 15), // Minimum 15 kg
      });
    } else {
      // No data yet, show defaults
      console.log('[FutureSimulator] No data, using defaults');
      setCo2Data({
        badFuture: 132,
        goodFuture: 58,
      });
    }
  }, [stats]);

  return (
    <section id="future" className="relative px-6 py-28" style={{ background: "#0d1117" }}>
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <Text value={t("future.title", "Future Simulator")} />
        </motion.h2>

        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-center md:gap-6">
          {/* Bad future */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="flex flex-1 flex-col items-center"
          >
            <span className="mb-6 inline-block rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-1.5 text-sm font-medium text-orange-400">
              <Text value={t("future.ifContinue", "If you continue...")} />
            </span>
            <div className="relative">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative h-56 w-56 overflow-hidden rounded-full sm:h-64 sm:w-64"
                style={{
                  boxShadow: "0 0 50px 8px rgba(249,115,22,0.3), 0 0 100px 20px rgba(249,115,22,0.1)",
                }}
              >
                <img
                  src="https://probable-lime-rabbit-7f8e69b480.fimo.site/uploads/2026/04/08/burning-earth-bad-future.png"
                  alt="Burning Earth"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <motion.span 
                    key={co2Data.badFuture}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl font-bold text-orange-400" 
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {co2Data.badFuture} kg CO₂
                  </motion.span>
                </div>
              </motion.div>
            </div>
            <div className="mt-6 text-center">
              <motion.p 
                key={co2Data.badFuture}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-3xl font-bold text-orange-400" 
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {co2Data.badFuture} kg CO₂
              </motion.p>
              <p className="mt-1 text-sm text-muted-foreground">
                <Text value={t("future.perWeek", "Equivalent / Week")} />
              </p>
            </div>
          </motion.div>

          {/* VS */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-lg font-bold text-muted-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            vs
          </motion.div>

          {/* Good future */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="flex flex-1 flex-col items-center"
          >
            <span className="mb-6 inline-block rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
              <Text value={t("future.ifImprove", "If you improve...")} />
            </span>
            <div className="relative">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="relative h-56 w-56 overflow-hidden rounded-full sm:h-64 sm:w-64"
                style={{
                  boxShadow: "0 0 50px 8px rgba(16,185,129,0.3), 0 0 100px 20px rgba(16,185,129,0.1)",
                }}
              >
                <img
                  src="https://probable-lime-rabbit-7f8e69b480.fimo.site/uploads/2026/04/08/green-earth-good-future.png"
                  alt="Healthy Earth"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <motion.span 
                    key={co2Data.goodFuture}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl font-bold text-emerald-400" 
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {co2Data.goodFuture} kg CO₂
                  </motion.span>
                </div>
              </motion.div>
            </div>
            <div className="mt-6 text-center">
              <motion.p 
                key={co2Data.goodFuture}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-3xl font-bold text-emerald-400" 
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {co2Data.goodFuture} kg CO₂
              </motion.p>
              <p className="mt-1 text-sm text-muted-foreground">
                <Text value={t("future.perWeek", "Equivalent / Week")} />
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}