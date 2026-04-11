import { motion } from "motion/react";
import { Smartphone, BarChart3, Lightbulb, TrendingUp } from "lucide-react";
import { useTranslations, Text } from "@fimo/ui";

export default function HowItWorksSection() {
  const { t } = useTranslations();

  const steps = [
    {
      icon: Smartphone,
      number: "01",
      title: t("howItWorks.step1.title", "Log Your Actions"),
      desc: t("howItWorks.step1.desc", "Tap to record travel, food, and energy choices in seconds."),
    },
    {
      icon: BarChart3,
      number: "02",
      title: t("howItWorks.step2.title", "See Your Impact"),
      desc: t("howItWorks.step2.desc", "Get instant feedback with your sustainability score and CO₂ metrics."),
    },
    {
      icon: Lightbulb,
      number: "03",
      title: t("howItWorks.step3.title", "Get Smart Tips"),
      desc: t("howItWorks.step3.desc", "Receive AI-powered suggestions tailored to your daily habits."),
    },
    {
      icon: TrendingUp,
      number: "04",
      title: t("howItWorks.step4.title", "Improve Over Time"),
      desc: t("howItWorks.step4.desc", "Watch your score climb as you build sustainable habits day by day."),
    },
  ];

  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2
            className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <Text value={t("howItWorks.title", "How It Works")} />
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
            <Text value={t("howItWorks.subtitle", "Four simple steps to a greener lifestyle.")} />
          </p>
        </motion.div>

        <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connecting line */}
          <div className="pointer-events-none absolute top-14 left-[10%] right-[10%] hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent lg:block" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 backdrop-blur-sm">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <span
                  className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {step.number}
                </span>
              </div>
              <h3
                className="text-lg font-semibold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Text value={step.title} />
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                <Text value={step.desc} />
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}