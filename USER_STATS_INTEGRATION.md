# User Stats Integration Summary

## Overview
Created a complete system to fetch and display real-time user statistics from the Neon Postgres database, replacing mock data with actual database values.

## What Was Created

### 1. API Endpoint (`server.js`)
**POST /api/getUserStats**

Fetches user statistics from the database:
- Verifies Firebase ID token
- Queries `user_impact_logs` table
- Returns today's stats and all-time totals

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "today": {
      "totalPoints": 15,
      "goodActionsCount": 3,
      "badActionsCount": 1
    },
    "allTime": {
      "totalPoints": 150
    }
  }
}
```

**SQL Queries:**
- Today's stats: Filters by date range (00:00 to 23:59 UTC)
- Counts good actions (points > 0)
- Counts bad actions (points < 0)
- Sums total points

### 2. Client API Function (`src/api/sustainability.ts`)
**getUserStats()**

- Gets Firebase ID token from current user
- Calls `/api/getUserStats` endpoint
- Returns typed response with error handling

### 3. React Hook (`src/hooks/useUserStats.ts`)
**useUserStats()**

Custom hook that:
- Fetches stats on mount
- Manages loading and error states
- Provides refetch function for manual updates
- Returns typed stats object

**Return Value:**
```typescript
{
  stats: {
    totalPoints: number;
    goodActionsCount: number;
    badActionsCount: number;
    allTimePoints: number;
  },
  loading: boolean,
  error: string | null,
  refetch: () => Promise<void>
}
```

### 4. Component Updates

#### Index.tsx
- Imports `useUserStats` hook
- Fetches real stats from database
- Passes stats to DashboardSection
- Passes refetch function to QuickActionsSection

#### QuickActionsSection.tsx
- Accepts `onActionSaved` callback prop
- Calls refetch after successful action save
- Ensures dashboard updates immediately

#### DashboardSection.tsx
- No changes needed!
- Already displays stats passed as props
- Now shows real database values

## Data Flow

```
User clicks action button
         ↓
logSustainabilityAction() saves to DB
         ↓
onActionSaved() callback triggered
         ↓
refetchStats() fetches new data
         ↓
useUserStats updates stats state
         ↓
Dashboard displays new values
```

## Key Features

✅ **Real-time Updates** - Stats refresh after each action  
✅ **Database-Driven** - All values come from Neon Postgres  
✅ **Today's Stats** - Filtered by current day (UTC)  
✅ **All-Time Tracking** - Total points across all time  
✅ **Loading States** - Shows loading while fetching  
✅ **Error Handling** - Graceful fallbacks on errors  
✅ **Type Safety** - Full TypeScript support  
✅ **Automatic Refetch** - Updates after each action  

## Dashboard Metrics

### Sustainability Score
- Sum of all points from today's actions
- Range: -6 to +15 (based on 3 categories)
- Color-coded: Green (9+), Yellow (3-8), Red (<3)

### Good Actions Count
- Number of actions with positive points today
- Displayed in green card

### Bad Actions Count
- Number of actions with negative points today
- Displayed in red card

### CO₂ Equivalent
- Calculated as: totalPoints × 0.5 kg
- Shows "saved" for positive, "emitted" for negative

## Testing

1. **Initial Load:**
   - Dashboard shows 0 points if no actions today
   - Loading state appears briefly

2. **After Action:**
   - Click "Walk" button
   - Watch loading animation
   - Dashboard updates with +5 points
   - Good actions count increases to 1

3. **Multiple Actions:**
   - Add more actions
   - Each updates the dashboard
   - Score accumulates correctly

4. **Next Day:**
   - Stats reset to 0 for new day
   - All-time total continues to grow

## Database Schema

The hook queries the `user_impact_logs` table:
```sql
SELECT 
  COALESCE(SUM(points), 0) as total_points,
  COUNT(CASE WHEN points > 0 THEN 1 END) as good_actions,
  COUNT(CASE WHEN points < 0 THEN 1 END) as bad_actions
FROM user_impact_logs
WHERE user_id = $1 
  AND created_at >= $2 
  AND created_at < $3
```

## Error Scenarios

- **Not Authenticated**: Returns error, stats remain at 0
- **Network Error**: Shows error state, can retry
- **Database Error**: Logs error, shows fallback values
- **Invalid Token**: Returns 401, user may need to re-login

## Future Enhancements

Possible additions:
- Weekly/monthly stats
- Streak tracking
- Leaderboards
- Historical charts
- Goal setting
- Achievements/badges
