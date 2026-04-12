/**
 * useDailyStats Hook
 * 
 * Queries the Neon database for today's sustainability stats for the current user.
 * 
 * Features:
 * - Fetches all rows where created_at date is TODAY
 * - Calculates totalPoints by summing the points column (includes negative points)
 * - Calculates ecoActionsCount by counting only rows where points > 0
 * - Calculates badActionsCount by counting only rows where points < 0
 * 
 * Important: Adding a negative action (e.g., -2 points) will:
 * ✅ Reduce totalPoints
 * ✅ NOT reduce ecoActionsCount (good actions count)
 * ✅ Increase badActionsCount
 * 
 * Example:
 * - Walk (+5) → totalPoints: 5, ecoActionsCount: 1, badActionsCount: 0
 * - Drive (-2) → totalPoints: 3, ecoActionsCount: 1, badActionsCount: 1
 * - Walk (+5) → totalPoints: 8, ecoActionsCount: 2, badActionsCount: 1
 */

export { useUserStats as useDailyStats } from './useUserStats';
