import { motion } from "motion/react";

export default function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-8">
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mx-4 h-2 w-2 shrink-0 rotate-45 rounded-sm bg-primary/50"
      />
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />
    </div>
  );
}