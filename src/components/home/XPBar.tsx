import { getUserProgress, getLevelInfo, getForestTrees } from "@/utils/gamification";

/**
 * XPBar — shows Sapling → Tree cycle progress.
 * No required props; reads from localStorage.
 */
export default function XPBar() {
  const progress = getUserProgress();
  const info = getLevelInfo(progress.xp);
  const treeCount = getForestTrees().length;

  return (
    <div className="w-full rounded-xl bg-white/5 border border-white/10 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-emerald-400">
          {info.name === "Sapling" ? "🌱 Sapling" : "🌿 Tree"}
        </span>
        <span className="text-base font-semibold text-white/60">
          {progress.xp} / {info.nextLevelXP} XP
        </span>
      </div>

      <div className="w-full h-4 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-400 transition-all duration-500"
          style={{ width: `${info.pct}%` }}
          role="progressbar"
          aria-valuenow={info.pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`XP progress: ${info.pct}%`}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-white/40">
          {info.nextLevelXP - progress.xp} XP to plant next tree
        </p>
        {treeCount > 0 && (
          <p className="text-sm font-semibold text-emerald-400/80">
            🌳 ×{treeCount} planted
          </p>
        )}
      </div>
    </div>
  );
}
