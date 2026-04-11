import { motion } from "motion/react";
import { useTranslations, Text } from "@fimo/ui";

export default function FutureSimulatorSection() {
  const { t } = useTranslations();

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
                  <span className="text-2xl font-bold text-orange-400" style={{ fontFamily: "var(--font-heading)" }}>
                    132 kg CO₂
                  </span>
                </div>
              </motion.div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-3xl font-bold text-orange-400" style={{ fontFamily: "var(--font-heading)" }}>
                132 kg CO₂
              </p>
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
                  <span className="text-2xl font-bold text-emerald-400" style={{ fontFamily: "var(--font-heading)" }}>
                    58 kg CO₂
                  </span>
                </div>
              </motion.div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-3xl font-bold text-emerald-400" style={{ fontFamily: "var(--font-heading)" }}>
                58 kg CO₂
              </p>
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