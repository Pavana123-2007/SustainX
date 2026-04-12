# Database Setup Guide

## Quick Setup (Automated)

Run this single command to create the database table:

```bash
npm run setup-db
```

That's it! The script will:
- ✅ Connect to your Neon database
- ✅ Create the `user_impact_logs` table
- ✅ Create indexes for better performance
- ✅ Verify everything is set up correctly

## What Gets Created

### Table: `user_impact_logs`

| Column       | Type                        | Description                          |
|--------------|-----------------------------|--------------------------------------|
| id           | SERIAL PRIMARY KEY          | Auto-incrementing unique identifier  |
| user_id      | VARCHAR(255)                | Firebase UID of the user             |
| category     | VARCHAR(100)                | Action category (travel, food, etc.) |
| action_label | VARCHAR(255)                | Specific action (Walk, Vegan, etc.)  |
| points       | INTEGER                     | Impact points earned/lost            |
| created_at   | TIMESTAMP WITH TIME ZONE    | When the action was logged           |

### Indexes Created

- `idx_user_id` - Fast lookups by user
- `idx_created_at` - Fast date-based queries
- `idx_user_created` - Fast user + date queries

## Manual Setup (Alternative)

If you prefer to create the table manually in Neon console:

1. Go to https://console.neon.tech
2. Select your project: `sustainx-751ef`
3. Go to SQL Editor
4. Copy and paste this SQL:

```sql
CREATE TABLE IF NOT EXISTS user_impact_logs (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  action_label VARCHAR(255) NOT NULL,
  points INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_id ON user_impact_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_created_at ON user_impact_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_user_created ON user_impact_logs(user_id, created_at);
```

5. Click "Run" to execute

## Verify Setup

After running the setup, restart your backend server:

```bash
# Stop the current server (Ctrl+C)
node server.js
```

Then test by clicking an action button in your app. Check the server logs - you should see successful database inserts instead of warnings.

## Troubleshooting

### "DATABASE_URL not found"
- Make sure `.env.local` exists and contains `DATABASE_URL`
- The URL should start with `postgresql://`

### "Connection refused"
- Check that your Neon database is active
- Verify the connection string is correct
- Make sure your IP is allowed (Neon allows all IPs by default)

### "Table already exists"
- This is fine! The script uses `CREATE TABLE IF NOT EXISTS`
- Your existing data is safe

## What Happens Now

Once the table is created:
- ✅ All user actions are saved to the database
- ✅ Dashboard shows real data from database
- ✅ Stats persist across sessions
- ✅ AI insights use real historical data
- ✅ Data is backed up by Neon automatically

## Need Help?

If you encounter any issues:
1. Check the error message from `npm run setup-db`
2. Verify your DATABASE_URL in `.env.local`
3. Make sure the Neon database is active in the console
