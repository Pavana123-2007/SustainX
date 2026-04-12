import { useMemo } from 'react';

interface UserAction {
  type: string;
  value: string;
  timestamp: number;
}

interface UsageInsight {
  status: 'detected' | 'improving';
  description: string;
  pointsLast24h: number;
  pointsPrevious24h: number;
  change: number;
}

interface MealInsight {
  status: 'detected' | 'improving';
  description: string;
  mostFrequentFood: string;
  count: number;
}

interface CommuteInsight {
  status: 'detected' | 'improving';
  description: string;
  driveCount: number;
}

interface SustainXInsights {
  usageInsight: UsageInsight;
  mealInsight: MealInsight;
  commuteInsight: CommuteInsight;
}

const POINTS_MAP: Record<string, number> = {
  'Walk': 10,
  'Bike': 15,
  'Public Transport': 8,
  'Drive': -5,
  'Vegetarian': 12,
  'Vegan': 15,
  'Meat': -3,
  'Recycle': 5,
  'Reuse': 8,
};

const FOOD_ALTERNATIVES: Record<string, string> = {
  'Meat': 'Try switching to plant-based proteins like lentils, chickpeas, or tofu for a greener meal!',
  'Vegetarian': 'Great choice! Consider going vegan occasionally for even more impact.',
};

export const useSustainXInsights = (userActions: UserAction[]): SustainXInsights => {
  return useMemo(() => {
    const now = Date.now();
    const last24h = now - 24 * 60 * 60 * 1000;
    const previous24h = last24h - 24 * 60 * 60 * 1000;

    // Calculate usage insight
    const actionsLast24h = userActions.filter(a => a.timestamp >= last24h);
    const actionsPrevious24h = userActions.filter(
      a => a.timestamp >= previous24h && a.timestamp < last24h
    );

    const pointsLast24h = actionsLast24h.reduce(
      (sum, action) => sum + (POINTS_MAP[action.value] || 0),
      0
    );
    const pointsPrevious24h = actionsPrevious24h.reduce(
      (sum, action) => sum + (POINTS_MAP[action.value] || 0),
      0
    );

    const change = pointsLast24h - pointsPrevious24h;
    const usageInsight: UsageInsight = {
      status: change >= 0 ? 'improving' : 'detected',
      description:
        change > 0
          ? `Great progress! You've earned ${change} more points than yesterday.`
          : change < 0
          ? `Your points decreased by ${Math.abs(change)} compared to yesterday. Let's get back on track!`
          : 'Your points are steady. Keep up the consistency!',
      pointsLast24h,
      pointsPrevious24h,
      change,
    };

    // Calculate meal insight
    const foodActions = userActions.filter(a => a.type === 'food' || a.type === 'meal');
    const foodCounts: Record<string, number> = {};
    
    foodActions.forEach(action => {
      foodCounts[action.value] = (foodCounts[action.value] || 0) + 1;
    });

    const mostFrequentFood = Object.entries(foodCounts).sort((a, b) => b[1] - a[1])[0];
    const [foodType, foodCount] = mostFrequentFood || ['None', 0];

    const mealInsight: MealInsight = {
      status: foodType === 'Meat' ? 'detected' : 'improving',
      description:
        foodCount === 0
          ? 'No meal data yet. Start tracking your meals to get personalized insights!'
          : foodType === 'Meat'
          ? FOOD_ALTERNATIVES['Meat']
          : foodType === 'Vegetarian'
          ? FOOD_ALTERNATIVES['Vegetarian']
          : `Excellent! You're choosing ${foodType} most often. Keep it up!`,
      mostFrequentFood: foodType,
      count: foodCount,
    };

    // Calculate commute insight
    const commuteActions = userActions.filter(a => a.type === 'commute' || a.type === 'transport');
    const driveCount = commuteActions.filter(a => a.value === 'Drive').length;

    const commuteInsight: CommuteInsight = {
      status: driveCount > 2 ? 'detected' : 'improving',
      description:
        driveCount > 2
          ? `You've driven ${driveCount} times recently. Consider carpooling, biking, or using public transport to reduce your carbon footprint!`
          : driveCount > 0
          ? `You're doing well! Only ${driveCount} drive(s) recorded. Keep exploring greener alternatives.`
          : `Amazing! No driving detected. You're making eco-friendly commute choices!`,
      driveCount,
    };

    return {
      usageInsight,
      mealInsight,
      commuteInsight,
    };
  }, [userActions]);
};
