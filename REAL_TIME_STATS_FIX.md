# 🔧 Real-Time Stats Fix - Database Connection Issue

## 🔴 Problem Identified

The global stats are showing **mock data** (12,400+ users, 45,200+ actions) instead of real-time data from the Neon database.

### Root Cause

Database connection is **timing out** (ETIMEDOUT error):
```
❌ Connection failed!
Error code: ETIMEDOUT
Error message: 
Error stack: AggregateError [ETIMEDOUT]
```

## 🔍 Why This Happens

### 1. Neon Database Auto-Pause
Neon databases automatically pause after 5 minutes of inactivity to save resources. When paused:
- First connection attempt times out
- Database wakes up after ~10-30 seconds
- Subsequent connections work fine

### 2. Connection String Issue
Current connection string uses the **pooler** endpoint:
```
postgresql://neondb_owner:****@ep-odd-flower-anybv22r-pooler.c-6.us-east-1.aws.neon.tech/neondb
```

## ✅ Solutions

### Solution 1: Use Direct Connection (Recommended)

Neon provides two types of connection strings:
1. **Pooled** (for serverless/edge functions) - has timeout issues
2. **Direct** (for long-running servers) - more reliable

**Action Required:**
1. Go to your Neon dashboard: https://console.neon.tech/
2. Select your project
3. Go to "Connection Details"
4. Copy the **Direct connection** string (not pooled)
5. Update `.env.local`:

```env
# Replace this (pooler):
DATABASE_URL=postgresql://neondb_owner:npg_pAbXDEuGZs21@ep-odd-flower-anybv22r-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require

# With this (direct):
DATABASE_URL=postgresql://neondb_owner:npg_pAbXDEuGZs21@ep-odd-flower-anybv22r.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Notice the difference**: Remove `-pooler` from the hostname.

### Solution 2: Increase Connection Timeout

Add timeout settings to the connection:

```javascript
// In server.js
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 30000, // 30 seconds
  idleTimeoutMillis: 30000,
  max: 10,
});
```

### Solution 3: Keep Database Awake

Add a keep-alive query that runs every 4 minutes:

```javascript
// In server.js, after pool creation
setInterval(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('[Database] Keep-alive ping successful');
  } catch (error) {
    console.error('[Database] Keep-alive ping failed:', error.message);
  }
}, 4 * 60 * 1000); // Every 4 minutes
```

### Solution 4: Retry Logic

Add automatic retry on connection failure:

```javascript
async function queryWithRetry(query, params, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await pool.query(query, params);
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`[Database] Retry ${i + 1}/${retries} after error:`, error.message);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s before retry
    }
  }
}
```

## 🎯 Recommended Fix (Combination)

Apply **all four solutions** for maximum reliability:

1. ✅ Use direct connection string (not pooled)
2. ✅ Increase connection timeout
3. ✅ Add keep-alive pings
4. ✅ Add retry logic

## 📊 Current Behavior

### What's Happening Now:
```
1. Browser loads → Calls /api/getGlobalStats
2. Server tries to connect to database
3. Connection times out (ETIMEDOUT)
4. Server returns mock data as fallback
5. UI shows: 12,400+ users, 45,200+ actions (fake)
```

### What Should Happen:
```
1. Browser loads → Calls /api/getGlobalStats
2. Server connects to database successfully
3. Server queries: SELECT COUNT(*), SUM(points) FROM user_impact_logs
4. Server returns real data
5. UI shows: Actual user count, actual actions (real-time)
```

## 🔧 Implementation Steps

### Step 1: Get Direct Connection String

1. Visit: https://console.neon.tech/
2. Login to your account
3. Select project: `sustainx-751ef` (or your project name)
4. Click "Connection Details"
5. Look for "Direct connection" or "Connection string"
6. Copy the string that does NOT have `-pooler` in it

### Step 2: Update .env.local

```env
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-odd-flower-anybv22r.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Important**: Remove `-pooler` from the hostname!

### Step 3: Update server.js

I'll create an updated version with all fixes applied.

### Step 4: Restart Server

```powershell
cd D:\SustainX_Ecocoders1
npm run server
```

### Step 5: Verify

1. Check server logs for: `[Database] Connected successfully`
2. Refresh browser
3. Check browser console for real data
4. Verify numbers change when you log actions

## 🐛 Troubleshooting

### Still showing mock data?

**Check 1**: Server logs show database connected?
```
[Database] Connected successfully ✓
```

**Check 2**: Browser console shows real data?
```javascript
[getGlobalStats API] Response data: {
  success: true,
  data: {
    activeUsers: 1,  // Real number
    ecoActionsLogged: 5,  // Real number
    ...
  }
}
```

**Check 3**: Hard refresh browser (Ctrl+Shift+R)

### Connection still timing out?

1. **Check Neon dashboard** - Is database active?
2. **Check firewall** - Is port 5432 blocked?
3. **Try from Neon dashboard** - Can you connect using their SQL editor?
4. **Check credentials** - Is password correct?

## 📝 Next Steps

1. I'll update the server.js with all fixes
2. You get the direct connection string from Neon
3. Update .env.local
4. Restart server
5. Test and verify real-time stats work

## 🎉 Expected Result

After fixing:
- ✅ Database connects immediately
- ✅ Real-time stats show actual numbers
- ✅ Numbers update when you log actions
- ✅ No more mock data
- ✅ Global stats reflect all users' actions

Let me know when you have the direct connection string, and I'll help you test it!
