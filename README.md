# 🐠 Cursed Aquarium - Overwatch 2 Scrim Team Manager# Cursed Aquarium - Overwatch 2 Scrim Team Website# React + Vite



A React-based team management app for the **Cursed Aquarium** Overwatch 2 scrim team. Features schedule management, MVP points shop, role-based authentication, and admin controls.



![Overwatch Theme](https://img.shields.io/badge/Overwatch-Theme-orange)A complete team management website for the Cursed Aquarium Overwatch 2 scrim team with authentication, schedule management, MVP shop, and admin panel.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

![React](https://img.shields.io/badge/React-18-blue)

![Express](https://img.shields.io/badge/Express-4.18-green)



---## 🚀 FeaturesCurrently, two official plugins are available:



## ✨ Features



- 🗓️ **Schedule Management** - Create and manage scrim events with automatic past-event cleanup- **Role-Based Authentication**: Login system with 5 roles (Tank, Main DPS, Flex DPS, Main Support, Flex Support)- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- 🏆 **MVP Points System** - Award and track performance points for each role

- 🛍️ **Shop System** - Spend MVP points on buffs and nerfs- **Team Schedule**: View upcoming scrims and practice sessions with automatic removal of past events- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- 🔐 **Role-Based Auth** - Login system with role-specific passwords

- 👥 **Team Roster** - Manage player roster by role (Tank, DPS, Support)- **MVP Shop**: Buy buffs and nerfs using MVP points

- ⚙️ **Admin Panel** - Full control over schedules, shop, points, and permissions

- 🎨 **Overwatch-Themed UI** - Dark theme with Overwatch-inspired colors- **Admin Panel**: Complete management interface for admins to:## React Compiler



---  - Manage team roster (add/remove players)



## 🎮 Team Roles  - Create/delete schedule eventsThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).



- **Tank** 🛡️  - Add/remove shop items

- **Main DPS** 🎯 (Admin)

- **Flex DPS** 🎯  - Adjust MVP points for players## Expanding the ESLint configuration

- **Main Support** 💚

- **Flex Support** 💚  - Change player passwords



---If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



## 🚀 Quick Start (Local Development)## 🏗️ Tech Stack



### Prerequisites### Frontend

- Node.js 18+ installed- **React 18** with Vite for fast development

- npm or yarn- **React Router DOM** for navigation

- **Custom CSS** with Overwatch-themed styling

### Installation

### Backend

1. **Clone/Download the project**- **Express.js** for API server

   ```powershell- **JSON file storage** for data persistence

   cd "C:\Projects\Cursed Aquarium"- **CORS** enabled for cross-origin requests

   ```

## 🎮 Running the Application

2. **Install dependencies**

   ```powershell### Prerequisites

   # Install frontend dependencies- Node.js (v16 or higher)

   npm install- npm



   # Install backend dependencies### Start Backend API

   cd api```powershell

   npm installcd api

   cd ..npm install

   ```npm run dev

```

3. **Start the app** (Easy way!)Backend will run on **http://localhost:3001**

   ```powershell

   .\start.ps1### Start Frontend

   ``````powershell

   This will open two PowerShell windows - one for the backend, one for the frontend.npm install

npm run dev

   **OR manually start both servers:**```

   ```powershellFrontend will run on **http://localhost:5173**

   # Terminal 1 - Backend API

   cd api## 🔐 Default Credentials

   npm run dev

All roles use their role name as both username and password by default:

   # Terminal 2 - Frontend- Username: `tank`, Password: `tank`

   npm run dev- Username: `main dps`, Password: `main dps` ⭐ (has admin access)

   ```- Username: `flex dps`, Password: `flex dps`

- Username: `main support`, Password: `main support`

4. **Access the app**- Username: `flex support`, Password: `flex support`

   - Frontend: http://localhost:5173

   - Backend API: http://localhost:3001**Note**: Only `main dps` has admin access by default.



5. **Login**## 📁 Project Structure

   - Username: `main dps`

   - Password: `main dps````

cursed-aquarium/

---├── src/

│   ├── components/        # React components

## 📁 Project Structure│   │   ├── Login.jsx

│   │   ├── Schedule.jsx

```│   │   ├── Shop.jsx

Cursed Aquarium/│   │   ├── Admin.jsx

├── api/                      # Backend Express.js API│   │   ├── Navigation.jsx

│   ├── server.js            # Main API server│   │   └── ProtectedRoute.jsx

│   ├── data.json            # JSON database (passwords, roster, shop, etc.)│   ├── context/

│   └── package.json         # Backend dependencies│   │   └── AuthContext.jsx

├── src/                     # Frontend React app│   └── styles/           # Component styles

│   ├── components/          # React components├── api/

│   │   ├── Login.jsx       # Login page│   ├── server.js         # Express API server

│   │   ├── Navigation.jsx  # Navigation bar│   ├── data.json         # Data storage

│   │   ├── Schedule.jsx    # Schedule viewer│   └── package.json

│   │   ├── Shop.jsx        # MVP shop└── package.json

│   │   └── Admin.jsx       # Admin panel```

│   ├── context/

│   │   └── AuthContext.jsx # Authentication state## 🎯 API Endpoints

│   └── styles/             # Component CSS files

├── DEPLOYMENT.md           # Azure deployment guide### Authentication

├── start.ps1              # Easy startup script- `POST /api/auth/login` - User login

└── package.json           # Frontend dependencies

```### Schedule

- `GET /api/schedule` - Get all upcoming events

---- `POST /api/schedule` - Create new event

- `DELETE /api/schedule/:id` - Delete event

## 🔑 Default Passwords

### Shop

All roles use their role name as the password:- `GET /api/shop` - Get all shop items

- `tank` / `tank`- `POST /api/shop` - Add new item

- `main dps` / `main dps` (Admin)- `DELETE /api/shop/:id` - Delete item

- `flex dps` / `flex dps`

- `main support` / `main support`### Roster

- `flex support` / `flex support`- `GET /api/roster` - Get team roster

- `POST /api/roster` - Add player to roster

**⚠️ Change these passwords in the Admin Panel > Roster Management tab!**- `DELETE /api/roster/:role/:playerName` - Remove player



---### Balances

- `GET /api/balances` - Get all player balances

## 🛠️ Admin Panel Features- `GET /api/balances/:role` - Get specific player balance

- `PUT /api/balances/:role` - Update player balance

Access the admin panel by logging in as **Main DPS** or any role with admin permissions.

### Passwords

### Tabs:- `PUT /api/passwords/:role` - Update role password



1. **Roster Management**### Purchases

   - Add/remove players from each role- `GET /api/purchases` - Get purchase history

   - Change passwords for each role- `POST /api/purchases` - Record new purchase

   - Manage team composition

## 🎨 Styling

2. **Schedule Management**

   - Create scrim events with date, time, and agendaThe application uses a custom Overwatch-themed color scheme:

   - Select players from roster for each event- Primary Dark: `#0a0e27`

   - Auto-removes past events- Secondary Dark: `#1a1f3a`

- Accent Orange: `#ff9c00`

3. **Shop Management**- Success Green: `#00ff88`

   - Add/remove shop items- Error Red: `#ff4444`

   - Set prices, types (buff/nerf), and targets

   - Customize icons and descriptions## 🔧 Development



4. **Points Management**### Backend Development

   - Add, subtract, or set exact MVP point balancesThe backend uses nodemon for auto-reload during development:

   - Reward players for performance```powershell

cd api

5. **Permissions**npm run dev

   - Control who has admin access```

   - Main DPS always has admin (cannot be disabled)

   - Toggle admin rights for other roles### Frontend Development

Vite provides hot module replacement for instant updates:

---```powershell

npm run dev

## 🌐 Deployment to Azure```



See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete deployment instructions.## 📝 Data Storage



**Quick summary:**All data is stored in `api/data.json` with the following structure:

1. Deploy backend to Azure App Service (~$13/month)- `passwords`: User authentication credentials

2. Deploy frontend to Azure Static Web Apps (free)- `balances`: MVP points for each role

3. Update API URLs in frontend code- `roster`: Team members by role (tank, dps, support)

4. Your team can access it from anywhere!- `schedule`: Upcoming events

- `shopItems`: Available items in the MVP shop

---- `purchases`: Purchase history



## 🎨 Tech Stack## 🚢 Deployment



**Frontend:**Ready for deployment to Azure:

- React 18- Frontend: Azure Static Web Apps

- Vite- Backend: Azure App Service or Azure Container Apps

- React Router DOM

- Custom CSS (Overwatch theme)**Important**: Update the `API_URL` in frontend components from `http://localhost:3001/api` to your production API URL before deploying.



**Backend:**## 🎮 Current Team Roster

- Express.js 4.18.2

- CORS- **Tank**: APL Lun

- JSON file storage- **DPS**: ʰˢ RK, SirPudding

- Nodemon for development- **Support**: ᵐˢ Aggi, HiPriestess



------



## 📝 API EndpointsBuilt for the Cursed Aquarium Overwatch 2 team 🐠


### Authentication
- `POST /api/auth/login` - Login with username/password

### Schedule
- `GET /api/schedule` - Get all events
- `POST /api/schedule` - Create new event
- `DELETE /api/schedule/:id` - Delete event

### Shop
- `GET /api/shop` - Get all shop items
- `POST /api/shop` - Add new item
- `DELETE /api/shop/:id` - Delete item

### Roster
- `GET /api/roster` - Get team roster
- `POST /api/roster` - Add player
- `DELETE /api/roster` - Remove player

### Points
- `GET /api/balances` - Get all role balances
- `PUT /api/balances/:role` - Update role balance

### Permissions
- `GET /api/permissions` - Get admin permissions
- `PUT /api/permissions/:role` - Update role permissions

### Passwords
- `PUT /api/passwords/:role` - Change role password

---

## 🐛 Troubleshooting

**Can't login?**
- Make sure both backend and frontend are running
- Backend should show: `🐠 Cursed Aquarium API running on http://localhost:3001`
- Frontend should show: `http://localhost:5173/`

**Changes not saving?**
- Check `api/data.json` - this is your database
- Make sure backend has write permissions
- Check browser console for errors

**Port already in use?**
- Kill existing node processes: `Get-Process node | Stop-Process -Force`
- Or change ports in `api/server.js` and `vite.config.js`

---

## 📄 License

This is a private team management tool for Cursed Aquarium. Not intended for public distribution.

---

## 🎯 Roadmap

- [ ] Deploy to Azure
- [ ] Add match history tracking
- [ ] Team statistics dashboard
- [ ] Discord webhook integration
- [ ] Player performance analytics

---

**Made with 💙 for the Cursed Aquarium Overwatch 2 Team** 🐠🎮

For deployment help, see [DEPLOYMENT.md](./DEPLOYMENT.md)
