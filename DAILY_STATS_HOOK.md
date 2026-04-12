# useDailyStats Hook Documentation

## Overview

The `useDailyStats` hook queries the Neon Postgres database to fetch real-time sustainability statistics for the current authenticated user for TODAY only.

## Features

✅ **Real-time Database Queries** - Fetches data directly from `user_impact_logs` table  
✅ **Today's Data Only** - Filters by `created_at >= today 00:00:00`  
✅ **Correct Point Calculation** - Sums ALL points (positive and negative)  
✅ **Separate Action Counting** - Good and bad actions counted independently  
✅ **Auto-refresh** - Can be manually triggered after new actions  

## Usage

```typescript
import { useDailyStats } from '@/hooks/useDailyStats';

function MyComponent() {
  const { stats, loading, error, refetch } = useDailyStats();

  return (
    <div>
      <p>Total Points: {stats.totalPoints}</p>
      <p>Good Actions: {stats.goodActionsCount}</p>
      <p>Bad Actions: {stats.badActionsCount}</p>
    </div>
  );
}
```

## Return Value

```typescript
{
  stats: {
    totalPoints: number;        // Sum of ALL points (positive + negative)
    goodActionsCount: number;   // Count of actions where points > 0
    badActionsCount: number;    // Count of actions where points < 0
    allTimePoints: number;      // Total points across all time
  },
  loading: boolean;             // True while fetching data
  error: string | null;         // Error message if fetch fails
  refetch: () => Promise<void>; // Function to manually refresh data
}
```

## Database Query

The hook executes this SQL query:

```sql
SELECT 
  COALESCE(SUM(points), 0) as total_points,
  COUNT(CASE WHEN points > 0 THEN 1 END) as good_actions,
  COUNT(CASE WHEN points < 0 THEN 1 END) as bad_actions
FROM user_impact_logs
WHERE user_id = $1 
  AND created_at >= $2  -- Today 00:00:00
  AND created_at < $3   -- Tomorrow 00:00:00
```

## Critical Behavior: Negative Actions

### ✅ Correct Behavior (Implemented)

When a user logs a negative action (e.g., Drive -2):

| Action | totalPoints | goodActionsCount | badActionsCount |
|--------|-------------|------------------|-----------------|
| Walk +5 | 5 | 1 | 0 |
| Drive -2 | **3** | **1** | **1** |
| Walk +5 | 8 | 2 | 1 |

**Key Points:**
- ✅ `totalPoints` decreases (5 → 3)
- ✅ `goodActionsCount` stays at 1 (NOT decremented)
- ✅ `badActionsCount` increases (0 → 1)

### ❌ Wrong Behavior (NOT Implemented)

```typescript
// WRONG: This would decrement good actions
goodActionsCount = goodActionsCount - 1; // ❌ Never do this!

// CORRECT: Count separately
goodActionsCount = COUNT(WHERE points > 0); // ✅ Always count from DB
```

## Connected Components

### 1. DashboardSection
Displays the sustainability score and action counts:

```typescript
<DashboardSection 
  score={stats.totalPoints}           // Shows total points (can be negative)
  goodActions={stats.goodActionsCount} // Shows count of positive actions
  badActions={stats.badActionsCount}   // Shows count of negative actions
/>
```

### 2. QuickActionsSection
Triggers refetch after each action is logged:

```typescript
<QuickActionsSection 
  onActionSaved={refetchStats}  // Refreshes stats after save
  goodActions={stats.goodActionsCount}
/>
```

## Example Scenarios

### Scenario 1: All Good Actions
```
User logs:
- Walk (+5)
- Vegan (+5)
- Solar (+5)

Result:
totalPoints: 15
goodActionsCount: 3
badActionsCount: 0
```

### Scenario 2: Mixed Actions
```
User logs:
- Walk (+5)
- Drive (-2)
- Vegan (+5)
- Meat (-2)

Result:
totalPoints: 6  (5 - 2 + 5 - 2)
goodActionsCount: 2  (Walk, Vegan)
badActionsCount: 2  (Drive, Meat)
```

### Scenario 3: More Bad Than Good
```
User logs:
- Walk (+5)
- Drive (-2)
- Drive (-2)
- Drive (-2)

Result:
totalPoints: -1  (5 - 2 - 2 - 2)
goodActionsCount: 1  (Walk)
badActionsCount: 3  (3x Drive)
```

## Dashboard Display

### Sustainability Score Ring
- Shows `totalPoints` value
- Color changes based on score:
  - Green (≥9): Excellent
  - Yellow (3-8): Good
  - Red (<3): Needs improvement
- Can show negative values

### Good Actions Card
- Shows `goodActionsCount`
- Always displays count of positive actions
- Never decreases when bad actions are logged

### Bad Actions Card
- Shows `badActionsCount`
- Displays count of negative actions
- Helps user see areas for improvement

## Refetch Behavior

The hook automatically refetches when:
1. Component mounts (initial load)
2. `refetch()` is called manually
3. After an action is saved (via `onActionSaved` callback)

```typescript
// Manual refetch example
const { refetch } = useDailyStats();

const handleSaveAction = async () => {
  await logAction();
  await refetch(); // Refresh stats from database
};
```

## Error Handling

```typescript
const { stats, loading, error } = useDailyStats();

if (loading) return <Spinner />;
if (error) return <Error message={error} />;

return <Dashboard stats={stats} />;
```

## Performance

- **Initial Load**: ~100-200ms (database query)
- **Refetch**: ~100-200ms (cached connection)
- **Caching**: No caching (always fresh data)
- **Optimization**: Uses indexed queries on `user_id` and `created_at`

## Testing

```typescript
// Test that negative actions don't decrement good actions
test('negative action reduces points but not good actions count', async () => {
  // Log Walk (+5)
  await logAction('travel', 'Walk', 5);
  let stats = await fetchStats();
  expect(stats.totalPoints).toBe(5);
  expect(stats.goodActionsCount).toBe(1);
  
  // Log Drive (-2)
  await logAction('travel', 'Drive', -2);
  stats = await fetchStats();
  expect(stats.totalPoints).toBe(3);  // Decreased
  expect(stats.goodActionsCount).toBe(1);  // NOT decreased
  expect(stats.badActionsCount).toBe(1);  // Increased
});
```

## Troubleshooting

### Stats showing 0
- Check if user is authenticated
- Verify DATABASE_URL is configured
- Check if any actions have been logged today
- Look for errors in browser console

### Stats not updating
- Ensure `refetch()` is called after logging actions
- Check if `onActionSaved` callback is connected
- Verify server is running on port 5000

### Wrong counts
- Check database query in server.js
- Verify `points > 0` condition for good actions
- Ensure `created_at` is using correct timezone (UTC)
