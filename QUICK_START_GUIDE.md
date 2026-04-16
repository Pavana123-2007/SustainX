# 🚀 Quick Start Guide - SustainX

## ❌ The Error You Encountered

```
PS C:\Users\gkpav> node server.js
Error: Cannot find module 'C:\Users\gkpav\server.js'
```

**Why this happened**: You were in the wrong directory (`C:\Users\gkpav\`) instead of the project directory (`D:\SustainX_Ecocoders1\`).

## ✅ How to Fix It - 3 Easy Methods

### **Method 1: Using PowerShell (Recommended)**

```powershell
# Step 1: Navigate to project directory
cd D:\SustainX_Ecocoders1

# Step 2: Start the server
node server.js
```

### **Method 2: Using npm script (Easiest)**

```powershell
# Step 1: Navigate to project directory
cd D:\SustainX_Ecocoders1

# Step 2: Use npm script
npm run server
```

### **Method 3: Using the batch file (Double-click)**

1. Navigate to `D:\SustainX_Ecocoders1\`
2. Double-click `start-server.bat`
3. Server starts automatically!

## 🎯 Complete Development Workflow

### 1. Start the Backend Server

```powershell
cd D:\SustainX_Ecocoders1
npm run server
```

**Expected Output:**
```
◇ injected env (9) from .env.local
[Server] Running in DEVELOPMENT MODE - Firebase Admin verification disabled
Server running on port 5000
Press Ctrl+C to stop the server
[Database] Connected successfully
```

### 2. Start the Frontend (In a NEW terminal)

```powershell
cd D:\SustainX_Ecocoders1
npm run dev
```

**Expected Output:**
```
VITE v6.0.11  ready in 1234 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 3. Open Your Browser

Navigate to: `http://localhost:5173/`

## 📋 All Available Commands

```powershell
# Navigate to project (always do this first!)
cd D:\SustainX_Ecocoders1

# Start backend server
npm run server          # or: node server.js

# Start frontend dev server
npm run dev

# Setup database (first time only)
npm run setup-db

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🔧 Troubleshooting

### Problem: "Cannot find module"
**Solution**: Make sure you're in the project directory
```powershell
cd D:\SustainX_Ecocoders1
```

### Problem: "Port 5000 already in use"
**Solution**: Server is already running. Either:
- Use the existing server
- Stop it (Ctrl+C in the terminal running the server)
- Change the port in `server.js`

### Problem: "Database connection failed"
**Solution**: Check your `.env.local` file has a valid `DATABASE_URL`

### Problem: Frontend can't connect to backend
**Solution**: Make sure both are running:
- Backend: `http://localhost:5000` (check by visiting in browser)
- Frontend: `http://localhost:5173`

## 🎓 Understanding the Project Structure

```
D:\SustainX_Ecocoders1\
├── server.js              ← Backend server (Node.js + Express)
├── src/                   ← Frontend code (React + Vite)
├── database/              ← Database migrations
├── .env.local             ← Environment variables (DATABASE_URL, etc.)
├── package.json           ← Project dependencies and scripts
└── start-server.bat       ← Quick start batch file
```

## 💡 Pro Tips

1. **Always navigate to the project directory first**
   ```powershell
   cd D:\SustainX_Ecocoders1
   ```

2. **Use two terminals** - one for backend, one for frontend

3. **Check if server is running**
   - Visit `http://localhost:5000/api/getGlobalStats` in your browser
   - Should return JSON data

4. **Use the batch file** for quick server starts
   - Just double-click `start-server.bat`

5. **Keep the server running** while developing
   - Don't close the terminal
   - Use Ctrl+C to stop when done

## 🚨 Common Mistakes to Avoid

❌ Running `node server.js` from home directory (`C:\Users\gkpav\`)
✅ Navigate to project first: `cd D:\SustainX_Ecocoders1`

❌ Forgetting to start the backend server
✅ Always run `npm run server` before testing

❌ Closing the terminal running the server
✅ Keep it open while developing

❌ Not checking if port 5000 is available
✅ Stop existing servers before starting a new one

## 📞 Need Help?

If you're still having issues:

1. Check you're in the right directory:
   ```powershell
   pwd  # Should show: D:\SustainX_Ecocoders1
   ```

2. Check if `server.js` exists:
   ```powershell
   ls server.js  # Should show the file
   ```

3. Check Node.js is installed:
   ```powershell
   node --version  # Should show v24.13.0 or similar
   ```

4. Check npm is installed:
   ```powershell
   npm --version  # Should show version number
   ```

## 🎉 You're All Set!

Now you can start developing. Remember:
1. Navigate to project directory
2. Start backend server
3. Start frontend dev server (in new terminal)
4. Open browser to `http://localhost:5173`

Happy coding! 🚀
