import { Sparkles, Zap, Camera, Globe, Brain } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations, Text, fimo } from "@fimo/ui";
import { Button } from "@/components/UI/button";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function HeroSection() {
  const { t } = useTranslations();

  const scrollToFeatures = () => {
    document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" });
  };

  const stats = [
    { icon: Zap, label: t("hero.stat.track", "Track Impact") },
    { icon: Camera, label: t("hero.stat.camera", "Camera Scan") },
    { icon: Globe, label: t("hero.stat.predict", "Predict Future") },
    { icon: Brain, label: t("hero.stat.tips", "Smart Tips") },
  ];

  return (
    <>
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
        {/* Nebula glow effects */}
        <div
          className="pointer-events-none absolute top-1/4 left-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.4), transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full opacity-15 blur-[100px]"
          style={{ background: "radial-gradient(circle, rgba(56,189,248,0.3), transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full opacity-10 blur-[100px]"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.3), transparent 70%)" }}
        />

        {/* Content */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 flex max-w-4xl flex-col items-center text-center"
        >
          <motion.div variants={item} className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              <Text value={t("hero.badge", "AI-Powered Sustainability")} />
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <Text value={t("hero.title1", "Smart Sustainability")} />
            <br />
            <span className="text-foreground">
              <Text value={fimo`${t("hero.title2prefix", "")}AI `} as="span" className="text-primary" />
              <Text value={t("hero.title2", "Assistant")} />
            </span>
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            <Text
              value={t(
                "hero.subtitle",
                "Track impact. Predict future. Transform habits. One platform to make every action count."
              )}
            />
          </motion.p>

          <motion.div variants={item} className="mt-10 flex justify-center">
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToFeatures}
              className="border-border text-foreground hover:bg-secondary text-base px-8 backdrop-blur-sm"
            >
              <Text value={t("hero.explore", "Explore Features")} />
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="relative z-10 mt-20 grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card/40 backdrop-blur-md px-4 py-3"
            >
              <stat.icon className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">
                <Text value={stat.label} />
              </span>
            </div>
          ))}
        </motion.div>
      </section>
    </>
  );
}