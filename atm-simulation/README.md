# 🏧 ATM Simulation — MEAN Stack Project

A full-stack ATM simulation system with **3 role-based modules**:  
`SuperAdmin` · `Admin` · `User`

Built with **MongoDB + Express + Angular + Node.js**

---

## 📁 Project Structure

```
atm-simulation/
├── backend/                        ← Node.js + Express API
│   ├── config/
│   │   └── seed.js                 ← Database seeder
│   ├── controllers/
│   │   ├── auth.controller.js      ← Login / Register / Change Password
│   │   ├── superadmin.controller.js← SuperAdmin operations
│   │   ├── admin.controller.js     ← Admin operations
│   │   └── user.controller.js      ← ATM operations (withdraw, deposit, transfer)
│   ├── middleware/
│   │   └── auth.js                 ← JWT protect + role authorize
│   ├── models/
│   │   ├── User.js                 ← User schema (superadmin / admin / user)
│   │   ├── Account.js              ← Bank account schema
│   │   └── Transaction.js          ← Transaction schema
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── superadmin.routes.js
│   │   ├── admin.routes.js
│   │   └── user.routes.js
│   ├── .env                        ← Environment config
│   ├── package.json
│   └── server.js                   ← Entry point
│
└── frontend/                       ← Angular 17 (Standalone)
    ├── src/
    │   ├── app/
    │   │   ├── app.component.ts
    │   │   ├── app.routes.ts        ← Root routing with lazy loading
    │   │   ├── core/
    │   │   │   ├── guards/
    │   │   │   │   ├── auth.service.ts   ← Auth state + login/logout
    │   │   │   │   ├── auth.guard.ts     ← Route protection
    │   │   │   │   └── role.guard.ts     ← Role-based access
    │   │   │   └── interceptors/
    │   │   │       └── auth.interceptor.ts ← JWT token injection
    │   │   ├── shared/
    │   │   │   ├── components/
    │   │   │   │   └── layout.component.ts ← Sidebar + Topbar
    │   │   │   └── services/
    │   │   │       └── api.service.ts   ← SuperadminService, AdminService, UserAtmService
    │   │   └── modules/
    │   │       ├── auth/             ← Login + Register pages
    │   │       ├── superadmin/       ← Dashboard, Admins, Users, Accounts, Transactions
    │   │       ├── admin/            ← Dashboard, Users, Accounts, Transactions
    │   │       └── user/             ← Dashboard, Withdraw, Deposit, Transfer, History, Change PIN
    │   ├── index.html
    │   ├── main.ts
    │   └── styles.css
    ├── angular.json
    ├── tsconfig.json
    └── package.json
```

---

## ⚙️ Prerequisites

Make sure the following are installed:

| Tool       | Version  | Download |
|------------|----------|----------|
| Node.js    | ≥ 18.x   | https://nodejs.org |
| npm        | ≥ 9.x    | Comes with Node.js |
| MongoDB    | ≥ 6.x    | https://www.mongodb.com/try/download/community |
| Angular CLI| 17.x     | `npm install -g @angular/cli` |

---

## 🚀 Step-by-Step Setup Guide

### STEP 1 — Install MongoDB

**Windows:**
1. Download MongoDB Community from https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB runs as a Windows Service automatically on port 27017

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

**Ubuntu/Linux:**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

Verify MongoDB is running:
```bash
mongosh
# Should show: Connecting to: mongodb://127.0.0.1:27017/...
# Type: exit
```

---

### STEP 2 — Install Angular CLI (globally)

```bash
npm install -g @angular/cli@17
```

Verify:
```bash
ng version
# Should show: Angular CLI: 17.x.x
```

---

### STEP 3 — Setup Backend

Open Terminal / Command Prompt:

```bash
# Navigate into backend folder
cd atm-simulation/backend

# Install all dependencies
npm install

# Verify .env file exists with correct settings
# File: backend/.env should contain:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/atm_simulation
# JWT_SECRET=atm_super_secret_key_2024_change_in_production
# JWT_EXPIRE=7d
```

---

### STEP 4 — Seed the Database

This creates initial SuperAdmin, Admin, Users and Bank Accounts:

```bash
# Still inside backend/ folder
npm run seed
```

Expected output:
```
✅ Seed data created successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 SuperAdmin → superadmin@atm.com / superadmin123
🔐 Admin      → admin@atm.com / admin123
🔐 User 1     → rahul@example.com / user123 | PIN: 1234
🔐 User 2     → priya@example.com / user123 | PIN: 5678
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### STEP 5 — Start the Backend Server

```bash
# Development mode (auto-restarts on file changes)
npm run dev

# OR Production mode
npm start
```

Expected output:
```
✅ MongoDB Connected
🚀 Server running on http://localhost:5000
```

Leave this terminal open and running.

---

### STEP 6 — Setup Frontend

Open a **new terminal window**:

```bash
# Navigate into frontend folder
cd atm-simulation/frontend

# Install all Angular dependencies
npm install
```

---

### STEP 7 — Start the Angular App

```bash
# Inside frontend/ folder
ng serve
```

Expected output:
```
✔ Browser application bundle generation complete.
Initial chunk files | Names    | Size
...
** Angular Live Development Server is listening on localhost:4200 **
```

---

### STEP 8 — Open in Browser

Visit: **http://localhost:4200**

You will see the ATM Login page.

---

## 🔑 Login Credentials

| Role       | Email                    | Password      | Notes             |
|------------|--------------------------|---------------|-------------------|
| SuperAdmin | superadmin@atm.com       | superadmin123 | Full system access |
| Admin      | admin@atm.com            | admin123      | Manage users & accounts |
| User 1     | rahul@example.com        | user123       | PIN: 1234, Balance: ₹50,000 |
| User 2     | priya@example.com        | user123       | PIN: 5678, Balance: ₹1,00,000 |

---

## 🧩 Module Features

### 👑 SuperAdmin Module (`/superadmin`)
- Dashboard with system-wide stats (total users, admins, balance, transactions)
- Create / Activate / Block / Delete admins
- View all users across the system
- View all bank accounts
- View all transactions

### 🏦 Admin Module (`/admin`)
- Dashboard with deposit/withdrawal summaries
- Create users
- Block / Activate users
- Open bank accounts for users (savings, current, salary)
- Set daily withdrawal limits
- Block / Activate accounts
- View all transactions

### 🏧 User Module (`/user`) — ATM Interface
- Dashboard with account card(s) showing real-time balance
- **Cash Withdrawal** — with quick amount buttons (₹500–₹20,000), PIN verification, daily limit enforcement
- **Cash Deposit** — instant balance update
- **Fund Transfer** — to any account number with PIN verification
- **Mini Statement** — last 50 transactions with colorful labels
- **Change PIN** — 4-digit PIN with confirmation

---

## 🔒 Security Features
- JWT Authentication with 7-day expiry
- Role-based route guards (auth + role)
- HTTP Interceptor auto-attaches Bearer token
- PIN hashed with bcrypt (10 rounds)
- Passwords hashed with bcrypt (12 rounds)
- Daily withdrawal limit enforcement
- Account status checks (active/blocked)

---

## 🌐 API Endpoints Reference

### Auth (`/api/auth`)
| Method | Endpoint            | Access |
|--------|---------------------|--------|
| POST   | /login              | Public |
| POST   | /register           | Public |
| GET    | /me                 | All    |
| PUT    | /change-password    | All    |

### SuperAdmin (`/api/superadmin`)
| Method | Endpoint                  | 
|--------|---------------------------|
| GET    | /dashboard                |
| GET/POST | /admins                 |
| PATCH  | /admins/:id/toggle        |
| DELETE | /admins/:id               |
| GET    | /users, /accounts, /transactions |

### Admin (`/api/admin`)
| Method | Endpoint                        |
|--------|---------------------------------|
| GET    | /dashboard                      |
| GET/POST | /users                        |
| PATCH  | /users/:id/toggle               |
| GET/POST | /accounts                     |
| PATCH  | /accounts/:id/toggle            |
| PATCH  | /accounts/:id/daily-limit       |
| GET    | /transactions                   |

### User/ATM (`/api/user`)
| Method | Endpoint              |
|--------|-----------------------|
| GET    | /accounts             |
| POST   | /verify-pin           |
| GET    | /balance/:accountId   |
| POST   | /withdraw             |
| POST   | /deposit              |
| POST   | /transfer             |
| GET    | /transactions         |
| POST   | /change-pin           |

---

## 🛠 Troubleshooting

**MongoDB connection error:**
- Make sure MongoDB service is running: `mongosh` to test
- Check MONGODB_URI in `.env` file

**Port 5000 already in use:**
- Change PORT in `.env` to 5001
- Update `http://localhost:5000` to `5001` in `src/app/shared/services/api.service.ts`

**Angular dependency errors:**
```bash
npm install --legacy-peer-deps
```

**CORS errors in browser:**
- Ensure backend is running on port 5000
- Ensure CORS is set to allow `http://localhost:4200`

**ngModel error in admin-accounts component:**
- Add `FormsModule` to imports if you see ngModel errors

---

## 📦 Tech Stack

| Layer     | Technology          |
|-----------|---------------------|
| Frontend  | Angular 17 (Standalone Components) |
| Backend   | Node.js + Express.js |
| Database  | MongoDB + Mongoose   |
| Auth      | JWT (jsonwebtoken)   |
| Passwords | bcryptjs             |
| HTTP      | Angular HttpClient   |
| Routing   | Angular Router (Lazy Loading) |
