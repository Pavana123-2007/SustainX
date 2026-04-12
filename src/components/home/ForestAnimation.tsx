import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getForestTrees } from "@/utils/gamification";

/**
 * ForestAnimation — displays planted trees below the XP bar.
 * Polls localStorage for new trees. No props required.
 */
export default function ForestAnimation() {
  const [trees, setTrees] = useState<string[]>(getForestTrees);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrees(getForestTrees());
    }, 800);
    return () => clearInterval(interval);
  }, []);

  if (trees.length === 0) return null;

  return (
    <div className="w-full mt-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">
        Your Forest · {trees.length} {trees.length === 1 ? "tree" : "trees"}
      </p>
      <div className="flex flex-wrap gap-1">
        <AnimatePresence>
          {trees.map((emoji, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="text-2xl select-none"
            >
              {emoji}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
