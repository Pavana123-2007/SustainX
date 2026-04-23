import { useMemo } from 'react';

interface UserStats {
  totalPoints: number;
  goodActionsCount: number;
  badActionsCount: number;
  allTimePoints: number;
}

type Selections = Record<string, { points: number; tier: 'best' | 'better' | 'least' }>;

interface Insight {
  status: 'detected' | 'improving';
  description: string;
}

interface SustainXInsights {
  usageInsight: Insight;
  mealInsight: Insight;
  commuteInsight: Insight;
}

export const useSustainXInsights = (
  _unused: unknown,
  stats?: UserStats,
  selections?: Selections
): SustainXInsights => {
  return useMemo(() => {
    const totalPoints = stats?.totalPoints ?? 0;
    const goodActions = stats?.goodActionsCount ?? 0;
    const badActions = stats?.badActionsCount ?? 0;

    // --- Usage insight from real DB stats ---
    let usageDesc: string;
    let usageStatus: 'detected' | 'improving';
    if (goodActions === 0 && badActions === 0) {
      usageDesc = 'No actions logged yet today. Start tracking to see your impact!';
      usageStatus = 'detected';
    } else if (totalPoints > 0) {
      usageDesc = `Great progress! You've earned ${totalPoints} point${totalPoints !== 1 ? 's' : ''} today with ${goodActions} eco-friendly action${goodActions !== 1 ? 's' : ''}.`;
      usageStatus = 'improving';
    } else {
      usageDesc = `You have ${badActions} high-impact action${badActions !== 1 ? 's' : ''} today. Small swaps can make a big difference!`;
      usageStatus = 'detected';
    }

    // --- Meal insight from selections (key = "food") ---
    const food = selections?.['food'];
    let mealDesc: string;
    let mealStatus: 'detected' | 'improving';
    if (!food) {
      mealDesc = 'No meal choices tracked yet. Log your food habits to get personalised insights!';
      mealStatus = 'detected';
    } else if (food.tier === 'best') {
      mealDesc = "Excellent! You're choosing Vegan — the most eco-friendly option. Keep it up!";
      mealStatus = 'improving';
    } else if (food.tier === 'better') {
      mealDesc = "Good choice going Vegetarian! Consider going fully vegan occasionally for even more impact.";
      mealStatus = 'improving';
    } else {
      mealDesc = "Meat has a high carbon footprint. Try swapping for plant-based proteins to save CO₂.";
      mealStatus = 'detected';
    }

    // --- Commute insight from selections (key = "travel") ---
    const travel = selections?.['travel'];
    let commuteDesc: string;
    let commuteStatus: 'detected' | 'improving';
    if (!travel) {
      commuteDesc = 'No commute data yet. Log your transport choices to track your footprint!';
      commuteStatus = 'detected';
    } else if (travel.tier === 'best') {
      commuteDesc = "Amazing! Walking is the greenest commute choice. You're making eco-friendly decisions!";
      commuteStatus = 'improving';
    } else if (travel.tier === 'better') {
      commuteDesc = "Great job using public transit! It's much greener than driving solo.";
      commuteStatus = 'improving';
    } else {
      commuteDesc = "Driving detected. Consider carpooling, cycling, or public transport to cut your carbon footprint!";
      commuteStatus = 'detected';
    }

    return {
      usageInsight: { status: usageStatus, description: usageDesc },
      mealInsight: { status: mealStatus, description: mealDesc },
      commuteInsight: { status: commuteStatus, description: commuteDesc },
    };
  }, [stats, selections]);
};
