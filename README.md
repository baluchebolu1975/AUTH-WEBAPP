# AUTH-WEBAPP

A full-stack authentication web application built with **React**, **Express.js**, and **MySQL**. Features secure user registration, login, JWT-based session management, and a protected dashboard.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)

---

## Features

- **User Signup** — with real-time password strength indicator and field validation
- **User Login** — with brute-force protection (rate limiting + login attempt tracking)
- **JWT Authentication** — access tokens (15m) + refresh tokens (7d) with automatic rotation
- **Protected Dashboard** — displays user profile, role, and account details
- **Session Management** — hashed refresh tokens stored in MySQL with expiry tracking
- **Security** — Helmet headers, CORS, bcrypt (12 rounds), parameterized SQL queries, input sanitization

---

## Tech Stack

| Layer      | Technology                                      |
|------------|--------------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, React Hook Form, Zod, Framer Motion |
| Backend    | Node.js, Express.js, express-validator, JWT      |
| Database   | MySQL 8.0                                        |
| Security   | bcryptjs, Helmet, express-rate-limit, CORS       |

---

## Project Structure

```
auth-webapp/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection & migration
│   │   ├── controllers/     # Auth & admin request handlers
│   │   ├── middleware/       # JWT auth & validation middleware
│   │   ├── routes/           # API route definitions
│   │   ├── services/         # Business logic (user, session)
│   │   ├── utils/            # JWT helpers, response formatter
│   │   └── server.js         # Express app entry point
│   ├── .env.example          # Environment variable template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios instance with interceptors
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React auth context provider
│   │   ├── pages/            # Login, Signup, Dashboard pages
│   │   ├── App.jsx           # Route definitions & guards
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Tailwind + custom styles
│   └── package.json
├── database/
│   └── schema.sql            # MySQL schema (tables, indexes, seed data)
└── .gitignore
```

---

## Prerequisites

- **Node.js** ≥ 18
- **MySQL** ≥ 8.0 (running on localhost:3306)
- **npm** ≥ 9

---

## Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/baluchebolu1975/AUTH-WEBAPP.git
cd AUTH-WEBAPP
```

### 2. Configure environment variables

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=auth_webapp
```

### 3. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 4. Create database & tables

```bash
cd backend && npm run db:migrate
```

This creates the `auth_webapp` database with 4 tables:
- `users` — user accounts with hashed passwords
- `sessions` — refresh token session tracking
- `login_attempts` — security audit trail
- `password_resets` — password reset tokens

### 5. Start the application

```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend && npx vite
```

Open **http://localhost:5173** in your browser.

---

## API Endpoints

| Method | Endpoint           | Auth | Description              |
|--------|--------------------|------|--------------------------|
| POST   | `/api/auth/signup`  | No   | Register a new user      |
| POST   | `/api/auth/login`   | No   | Login with email/password|
| POST   | `/api/auth/refresh` | No   | Refresh access token     |
| POST   | `/api/auth/logout`  | No   | Invalidate refresh token |
| GET    | `/api/auth/me`      | Yes  | Get current user profile |
| GET    | `/api/health`       | No   | Health check             |

### Admin Endpoints (requires admin role)

| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| GET    | `/api/admin/users`    | List all users      |
| GET    | `/api/admin/users/:id`| Get user by ID      |
| PUT    | `/api/admin/users/:id`| Update user         |
| DELETE | `/api/admin/users/:id`| Delete user         |

---

## Database Schema

```
┌─────────────────┐     ┌──────────────────┐
│     users        │     │    sessions       │
├─────────────────┤     ├──────────────────┤
│ id (PK)         │──┐  │ id (PK)          │
│ uuid (UNIQUE)   │  │  │ user_id (FK)     │
│ first_name      │  └──│ refresh_token_hash│
│ last_name       │     │ ip_address       │
│ username (UQ)   │     │ user_agent       │
│ email (UQ)      │     │ expires_at       │
│ password_hash   │     │ created_at       │
│ role            │     └──────────────────┘
│ is_active       │
│ is_verified     │     ┌──────────────────┐
│ created_at      │     │  login_attempts   │
│ updated_at      │     ├──────────────────┤
└─────────────────┘     │ id (PK)          │
                        │ email            │
┌─────────────────┐     │ ip_address       │
│ password_resets  │     │ success          │
├─────────────────┤     │ failure_reason   │
│ id (PK)         │     │ attempted_at     │
│ user_id (FK)    │     └──────────────────┘
│ token_hash (UQ) │
│ expires_at      │
│ used            │
│ created_at      │
└─────────────────┘
```

---

## Security Measures

- **Password Hashing** — bcrypt with 12 salt rounds
- **JWT Tokens** — short-lived access (15m) + rotating refresh (7d)
- **Rate Limiting** — 100 req/15min global, 10 req/15min on auth endpoints
- **Login Tracking** — failed attempts logged; lockout after 5 failures
- **Input Validation** — server-side via express-validator, client-side via Zod
- **Security Headers** — Helmet.js (CSP, HSTS, X-Frame-Options, etc.)
- **SQL Injection Prevention** — parameterized queries via mysql2
- **CORS** — restricted to frontend origin only

---

## License

This project is for educational and demonstration purposes.
