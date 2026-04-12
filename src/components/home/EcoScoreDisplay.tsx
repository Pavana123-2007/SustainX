interface EcoScoreDisplayProps {
  score: number;
  xpGained?: number;
}

function getScoreColor(score: number): { bg: string; text: string; label: string } {
  if (score >= 70) return { bg: "bg-emerald-500/20", text: "text-emerald-400", label: "Great" };
  if (score >= 40) return { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "Okay" };
  return { bg: "bg-red-500/20", text: "text-red-400", label: "Poor" };
}

/**
 * EcoScoreDisplay — shows a scan's eco score with color-coded feedback.
 * Fully self-contained; no global state or context required.
 */
export default function EcoScoreDisplay({ score, xpGained }: EcoScoreDisplayProps) {
  const { bg, text, label } = getScoreColor(score);

  return (
    <div className={`inline-flex items-center gap-3 rounded-xl px-4 py-3 ${bg} border border-white/10`}>
      <div className="flex flex-col items-center">
        <span className={`text-3xl font-black leading-none ${text}`}>{score}</span>
        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-0.5">Eco Score</span>
      </div>

      <div className="flex flex-col gap-0.5">
        <span className={`text-sm font-semibold ${text}`}>{label}</span>
        {xpGained !== undefined && (
          <span className={`text-xs font-semibold ${xpGained < 0 ? "text-red-400" : "text-emerald-400"}`}>
            {xpGained < 0 ? `${xpGained} XP` : `+${xpGained} XP`}
          </span>
        )}
      </div>
    </div>
  );
}
