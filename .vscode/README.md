# VS Code Setup for Room & Food Finder

## Running the Backend in VS Code

### Option 1: Using Debug Panel
1. Press `F5` or go to Run > Start Debugging
2. Select "Debug Backend Server" from the dropdown
3. The server will start and you can set breakpoints

### Option 2: Using Tasks
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Tasks: Run Task"
3. Select "Start Backend" or "Start All (Backend + Frontend)"

### Option 3: Using Terminal
1. Open terminal in VS Code (`Ctrl+`` ` or Terminal > New Terminal)
2. Navigate to backend: `cd backend`
3. Run: `npm run dev` (with nodemon) or `npm start`

## Common Issues

### Backend Not Starting

1. **Check .env file exists**:
   - File should be at: `backend/.env`
   - Should contain `MONGO_URI` and `JWT_SECRET`

2. **MongoDB Connection Issues**:
   - Make sure MONGO_URI includes database name
   - Format: `mongodb+srv://user:pass@cluster.mongodb.net/database_name?retryWrites=true&w=majority`
   - Check if MongoDB Atlas allows connections from your IP

3. **Port Already in Use**:
   - Change PORT in `.env` file (default: 5000)
   - Or kill the process using port 5000

4. **Module Not Found**:
   - Run: `cd backend && npm install`

### Frontend Not Starting

1. **Check .env file**:
   - File should be at: `frontend/.env`
   - Should contain `VITE_API_URL` and `VITE_GOOGLE_MAPS_API_KEY`

2. **Dependencies Missing**:
   - Run: `cd frontend && npm install`

## Quick Start Commands

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

