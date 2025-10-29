# Quick Start Guide

## ✅ Everything is Complete!

Your Cursed Aquarium website is fully functional with a backend API and all features working.

## 🚀 Current Status

### ✅ Backend API (Port 3001)
- Running on http://localhost:3001
- Using Express.js with JSON file storage
- All endpoints operational:
  - Authentication
  - Schedule management
  - Shop items
  - Roster management
  - MVP points
  - Password management

### ✅ Frontend (Port 5173)
- Running on http://localhost:5173
- All components updated to use API
- No more localStorage dependencies

## 🎮 How to Use

### 1. Access the Website
Open your browser and go to: **http://localhost:5173**

### 2. Login
Use any of these credentials:
- `tank` / `tank`
- `main dps` / `main dps` (has admin access)
- `flex dps` / `flex dps`
- `main support` / `main support`
- `flex support` / `flex support`

### 3. Regular User Features
- **Schedule**: View upcoming scrims and practice sessions
- **Shop**: Browse and purchase buffs/nerfs with MVP points

### 4. Admin Features (main dps only)
- **Roster Management**: Add/remove players, change passwords
- **Schedule Management**: Create/delete events, assign players
- **Shop Management**: Add/remove items
- **Points Management**: Adjust MVP points for all roles

## 🔧 If You Need to Restart

### Backend API
```powershell
cd api
npm run dev
```

### Frontend
```powershell
npm run dev
```

## 📝 What Changed from localStorage

All data is now stored on the backend in `api/data.json`. This means:
- ✅ All team members access the same data
- ✅ Changes are synchronized across all users
- ✅ Data persists even after browser closes
- ✅ Ready for deployment to Azure

## 🚢 Next Steps (Optional)

When ready to deploy to Azure:
1. Deploy backend to Azure App Service or Container Apps
2. Deploy frontend to Azure Static Web Apps
3. Update `API_URL` in frontend components to point to production API
4. Set up environment variables for production

## 🐠 Enjoy Your Team Management System!

The website is fully functional and ready to use for managing your Overwatch 2 scrim team.
