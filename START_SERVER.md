# How to Start the Server

## ✅ Correct Way

### Step 1: Navigate to the project directory
```bash
cd D:\SustainX_Ecocoders1
```

### Step 2: Start the server
```bash
node server.js
```

## ❌ Common Mistake

Running `node server.js` from the wrong directory:
```bash
PS C:\Users\gkpav> node server.js
# Error: Cannot find module 'C:\Users\gkpav\server.js'
```

## 🚀 Quick Start Commands

### From any directory:
```bash
cd D:\SustainX_Ecocoders1 && node server.js
```

### Or use npm script (if configured):
```bash
cd D:\SustainX_Ecocoders1
npm run server
```

## 📝 What the Server Does

- Runs on port 5000
- Connects to Neon PostgreSQL database
- Provides API endpoints:
  - `POST /api/logSustainabilityAction` - Save user actions
  - `POST /api/getUserStats` - Get user's daily stats
  - `GET /api/getGlobalStats` - Get global impact stats
  - `POST /ai` - Get AI sustainability insights

## 🔍 Troubleshooting

### Error: Cannot find module
**Cause**: Running from wrong directory
**Fix**: Navigate to `D:\SustainX_Ecocoders1` first

### Error: Port 5000 already in use
**Cause**: Server is already running
**Fix**: Stop the existing server (Ctrl+C) or use a different port

### Error: Database connection failed
**Cause**: DATABASE_URL not configured in .env.local
**Fix**: Check .env.local file has valid DATABASE_URL

## 🎯 Expected Output

When server starts successfully:
```
◇ injected env (9) from .env.local
[Server] Running in DEVELOPMENT MODE - Firebase Admin verification disabled
Server running on port 5000
Press Ctrl+C to stop the server
[Database] Connected successfully
```
