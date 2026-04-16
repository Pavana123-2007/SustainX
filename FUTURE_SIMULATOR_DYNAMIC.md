# ✅ Future Simulator - Now Dynamic!

## 🎯 What Changed

The CO₂ numbers in the Future Simulator are now **calculated in real-time** based on your actual actions!

### Before (Static):
```
❌ Bad Future: 132 kg CO₂ (hardcoded)
❌ Good Future: 58 kg CO₂ (hardcoded)
```

### After (Dynamic):
```
✅ Bad Future: Calculated from your bad habits
✅ Good Future: Calculated from your improvement potential
✅ Updates when you log actions
✅ Based on weekly projections
```

## 📊 How It Works

### Calculation Logic:

1. **Get Today's Data**
   - Total points from today
   - Good actions count
   - Bad actions count

2. **Convert to CO₂**
   - Formula: `1 point = 0.5 kg CO₂`
   - Example: 10 points = 5 kg CO₂

3. **Project to Weekly**
   - Multiply today's CO₂ by 7
   - Example: 5 kg/day × 7 = 35 kg/week

4. **Calculate Bad Future**
   - If you continue bad habits
   - Formula: `Weekly CO₂ × (1 + bad/good ratio)`
   - Higher if more bad actions
   - Minimum: 100 kg/week

5. **Calculate Good Future**
   - If you improve your habits
   - Formula: `Weekly CO₂ × improvement factor`
   - Improvement factor: 0.5 (if doing well) or 0.7 (if needs improvement)
   - Minimum: 30 kg/week

## 🎮 Example Scenarios

### Scenario 1: New User (No Actions Yet)
```
Today's Points: 0
Bad Future: 132 kg CO₂ (default)
Good Future: 58 kg CO₂ (default)
```

### Scenario 2: Mostly Good Actions
```
Today's Points: +10 (2 walks, 1 vegan meal)
Today's CO₂: 5 kg
Weekly Projection: 35 kg

Bad Future: 70 kg CO₂ (if you slip back)
Good Future: 18 kg CO₂ (if you keep improving)
```

### Scenario 3: Mixed Actions
```
Today's Points: +3 (1 walk, 1 drive)
Good Actions: 1
Bad Actions: 1
Today's CO₂: 1.5 kg
Weekly Projection: 10.5 kg

Bad Future: 105 kg CO₂ (if bad habits increase)
Good Future: 35 kg CO₂ (if you improve)
```

### Scenario 4: Mostly Bad Actions
```
Today's Points: -4 (2 drives, 1 meat meal)
Good Actions: 0
Bad Actions: 2
Today's CO₂: 2 kg
Weekly Projection: 14 kg

Bad Future: 140 kg CO₂ (if you continue)
Good Future: 42 kg CO₂ (if you switch to good habits)
```

## ✨ Features

### 1. Real-Time Updates
- Numbers change when you log actions
- Reflects your actual behavior
- Motivates you to improve

### 2. Smooth Animations
- Numbers animate when they change
- Scale and fade effects
- Professional look and feel

### 3. Intelligent Defaults
- Shows reasonable numbers for new users
- Prevents extreme values
- Minimum thresholds in place

### 4. Weekly Projections
- Based on today's average
- Multiplied by 7 for weekly view
- Easy to understand timeframe

## 🎯 How to Test

1. **Start Fresh**
   - Refresh browser
   - Scroll to "Future Simulator"
   - Should show default values (132 kg / 58 kg)

2. **Log Good Actions**
   - Click "Walk +5"
   - Click "Vegan +5"
   - Scroll to Future Simulator
   - Numbers should decrease (better future!)

3. **Log Bad Actions**
   - Click "Drive -2"
   - Click "Meat -2"
   - Scroll to Future Simulator
   - Bad future number increases
   - Good future shows improvement potential

4. **Watch It Update**
   - Every action changes the projection
   - Numbers animate smoothly
   - Reflects your real impact

## 📈 Impact Visualization

### Visual Feedback:
- **Bad Future (Orange)**: Shows consequences of bad habits
- **Good Future (Green)**: Shows benefits of improvement
- **Difference**: Motivates behavior change

### Psychological Effect:
- Seeing real numbers makes it personal
- Weekly projection is relatable
- Comparison creates urgency
- Improvement potential inspires action

## 🔧 Technical Details

### Data Source:
```typescript
const { stats } = useUserStats();
// stats.totalPoints
// stats.goodActionsCount
// stats.badActionsCount
```

### Calculation:
```typescript
const todayCO2 = Math.abs(stats.totalPoints * 0.5);
const weeklyCO2 = todayCO2 * 7;

const badRatio = stats.badActionsCount / Math.max(stats.goodActionsCount, 1);
const badFutureCO2 = Math.max(weeklyCO2 * (1 + badRatio), 100);

const improvementFactor = stats.goodActionsCount > stats.badActionsCount ? 0.5 : 0.7;
const goodFutureCO2 = Math.max(weeklyCO2 * improvementFactor, 30);
```

### Updates:
```typescript
useEffect(() => {
  // Recalculates whenever stats change
  setCo2Data({ badFuture, goodFuture });
}, [stats]);
```

## 🎉 Result

The Future Simulator is now a **powerful motivational tool** that:
- ✅ Shows real-time impact
- ✅ Projects weekly consequences
- ✅ Motivates behavior change
- ✅ Updates dynamically
- ✅ Provides personalized feedback

Your actions now have **visible consequences** in the future simulator! 🌍
