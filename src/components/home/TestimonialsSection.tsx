import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";
import { useTranslations, Text } from "@fimo/ui";

export default function TestimonialsSection() {
  const { t } = useTranslations();

  const testimonials = [
    {
      name: "Sarah Chen",
      role: t("testimonials.role1", "Environmental Scientist"),
      quote: t("testimonials.quote1", "SustainX made tracking my carbon footprint effortless. The camera scan feature is genuinely innovative."),
      initials: "SC",
      color: "from-primary/40 to-accent/40",
    },
    {
      name: "Marcus Rivera",
      role: t("testimonials.role2", "Urban Planner"),
      quote: t("testimonials.quote2", "The future simulator gave me chills. Seeing the impact visually changed how my entire team approaches sustainability."),
      initials: "MR",
      color: "from-accent/40 to-primary/40",
    },
    {
      name: "Priya Sharma",
      role: t("testimonials.role3", "Student Activist"),
      quote: t("testimonials.quote3", "Finally an app that doesn't lecture you — it just makes being eco-friendly feel natural and rewarding."),
      initials: "PS",
      color: "from-primary/40 to-chart-5/40",
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
            <Text value={t("testimonials.title", "What People Say")} />
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="relative rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm"
            >
              <Quote className="mb-4 h-6 w-6 text-primary/30" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                <Text value={item.quote} />
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${item.color}`}>
                  <span className="text-xs font-bold text-foreground">{item.initials}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    <Text value={item.role} />
                  </p>
                </div>
              </div>
              <div className="mt-3 flex gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-primary text-primary" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}