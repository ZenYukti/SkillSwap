# SkillSwap — Project Setup Guide

A complete step-by-step guide to set up and run the SkillSwap application locally for the first time.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Clone the Repository](#clone-the-repository)
3. [Project Structure](#project-structure)
4. [Environment Variables](#environment-variables)
5. [Install Dependencies](#install-dependencies)
6. [Database Setup (MongoDB)](#database-setup-mongodb)
7. [Seed Default Admin](#seed-default-admin)
8. [Run the Application](#run-the-application)
9. [API Endpoints Reference](#api-endpoints-reference)
10. [Testing](#testing)
11. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Download Link |
|------|---------|---------------|
| **Node.js** | v18+ | [nodejs.org](https://nodejs.org/) |
| **npm** | v9+ | Comes with Node.js |
| **MongoDB** | v6+ | [mongodb.com](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas) |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |

Verify installations:

```powershell
node --version
npm --version
mongod --version
git --version
```

---

## Clone the Repository

```powershell
git clone https://github.com/ZenYukti/SkillSwap.git
cd SkillSwap
```

---

## Project Structure

```
SkillSwap/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service wrappers
│   │   └── styles/         # CSS files
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Node.js backend (Express)
│   ├── src/
│   │   ├── config/         # DB connection, constants
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── seeds/          # Database seeders
│   │   ├── tests/          # Backend tests
│   │   └── utils/          # Helper utilities
│   ├── uploads/            # File uploads directory
│   ├── package.json
│   └── .env                # Environment variables (create this)
│
├── .env.example            # Environment template
├── package.json            # Root package (scripts to run both)
└── README.md
```

---

## Environment Variables

### Step 1: Create the `.env` file

Copy the example file to the server directory:

```powershell
copy .env.example server\.env
```

### Step 2: Configure the `.env` file

Open `server/.env` in your editor and set the following values:

```env
# ===========================================
# SERVER CONFIGURATION
# ===========================================
PORT=5000
NODE_ENV=development

# ===========================================
# MONGODB CONNECTION
# ===========================================
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/skillswap

# OR MongoDB Atlas (cloud)
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/skillswap?retryWrites=true&w=majority

# ===========================================
# JWT AUTHENTICATION
# ===========================================
# Generate secure secrets using: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# ===========================================
# CLIENT URL (for CORS)
# ===========================================
CLIENT_URL=http://localhost:5173

# ===========================================
# FILE UPLOAD
# ===========================================
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# ===========================================
# RATE LIMITING
# ===========================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ===========================================
# EMAIL (Placeholder - configure for production)
# ===========================================
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password
FROM_EMAIL=noreply@skillswap.com
```

### Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/skillswap` |
| `JWT_SECRET` | Secret key for access tokens | Random 64+ char string |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens | Random 64+ char string |
| `JWT_EXPIRE` | Access token expiry | `15m`, `1h`, `1d` |
| `JWT_REFRESH_EXPIRE` | Refresh token expiry | `7d`, `30d` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `MAX_FILE_SIZE` | Max upload size in bytes | `5242880` (5MB) |

### Generate Secure JWT Secrets

Run this command to generate random secrets:

```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and paste it as your `JWT_SECRET` and `JWT_REFRESH_SECRET`.

---

## Install Dependencies

From the project root, install all dependencies (server + client):

```powershell
npm run install:all
```

Or install separately:

```powershell
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..
```

---

## Database Setup (MongoDB)

### Option A: Local MongoDB

1. **Start MongoDB service:**

   ```powershell
   # Windows (if installed as service)
   net start MongoDB

   # Or run mongod directly
   mongod --dbpath "C:\data\db"
   ```

2. **Verify MongoDB is running:**

   ```powershell
   mongosh
   # Should connect to mongodb://localhost:27017
   ```

### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user (username + password)
4. Whitelist your IP (or allow access from anywhere: `0.0.0.0/0`)
5. Get the connection string and update `MONGODB_URI` in `.env`:

   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/skillswap?retryWrites=true&w=majority
   ```

---

## Seed Default Admin

Create a default admin user for testing:

```powershell
cd server
npm run seed:admin
```

**Default Admin Credentials:**

| Field | Value |
|-------|-------|
| Email | `admin@skillswap.com` |
| Password | `Admin123!` |
| Role | `admin` |

---

## Run the Application

### Development Mode (Both Server & Client)

From the project root:

```powershell
npm run dev
```

This starts:
- **Backend:** `http://localhost:5000`
- **Frontend:** `http://localhost:5173`

### Run Separately

```powershell
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

### Verify Server is Running

Open browser or use curl:

```powershell
curl http://localhost:5000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "SkillSwap API is running",
  "timestamp": "2025-11-30T...",
  "environment": "development"
}
```

---

## API Endpoints Reference

### Base URL

```
http://localhost:5000/api
```

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register` | Register new user | No |
| `POST` | `/auth/login` | Login user | No |
| `POST` | `/auth/refresh` | Refresh access token | No |
| `POST` | `/auth/logout` | Logout user | Yes |
| `POST` | `/auth/forgot-password` | Request password reset | No |
| `POST` | `/auth/reset-password` | Reset password with token | No |
| `GET` | `/auth/me` | Get current user | Yes |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/users/me` | Get current user profile | Yes |
| `PUT` | `/users/me` | Update profile | Yes |
| `PUT` | `/users/me/password` | Change password | Yes |
| `GET` | `/users/public/:username` | Get public profile | No |
| `POST` | `/users/me/disable` | Disable account | Yes |

### Skills

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/skills` | List all skills | No |
| `GET` | `/skills/mine` | Get my skills | Yes |
| `GET` | `/skills/:id` | Get skill details | No |
| `POST` | `/skills` | Create skill offer/request | Yes |
| `PUT` | `/skills/:id` | Update skill | Yes |
| `DELETE` | `/skills/:id` | Delete skill | Yes |

### Deals

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/deals` | List my deals | Yes |
| `POST` | `/deals` | Create barter proposal | Yes |
| `GET` | `/deals/:id` | Get deal details | Yes |
| `PUT` | `/deals/:id/status` | Update deal status | Yes |
| `POST` | `/deals/:id/review` | Add review | Yes |

### Messages

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/messages/conversations` | List conversations | Yes |
| `GET` | `/messages/:conversationId` | Get messages | Yes |
| `POST` | `/messages` | Send message | Yes |
| `PUT` | `/messages/:conversationId/read` | Mark as read | Yes |

### Notifications

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/notifications` | List notifications | Yes |
| `PUT` | `/notifications/:id/read` | Mark as read | Yes |
| `PUT` | `/notifications/read-all` | Mark all as read | Yes |

### Admin

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/admin/dashboard` | Get stats | Admin |
| `GET` | `/admin/users` | List all users | Admin |
| `POST` | `/admin/users/:id/deactivate` | Deactivate user | Admin |
| `POST` | `/admin/deals/:id/force-complete` | Force complete deal | Admin |
| `DELETE` | `/admin/skills/:id` | Remove skill | Admin |

### Upload

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/upload/avatar` | Upload avatar image | Yes |

---

## Example API Calls

### Register a User

```powershell
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"name":"John Doe","username":"johndoe","email":"john@example.com","password":"Password123!"}'
```

### Login

```powershell
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"john@example.com","password":"Password123!"}'
```

Response:

```json
{
  "success": true,
  "data": {
    "user": { "name": "John Doe", "username": "johndoe", ... },
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Create a Skill Offer (Authenticated)

```powershell
curl -X POST http://localhost:5000/api/skills `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" `
  -d '{
    "type": "offer",
    "title": "Python Programming Lessons",
    "description": "I can teach Python basics to advanced topics including data structures, OOP, and web development.",
    "category": "Programming",
    "level": "intermediate",
    "mode": "online"
  }'
```

### Browse Skills

```powershell
curl http://localhost:5000/api/skills
curl "http://localhost:5000/api/skills?category=Programming&type=offer"
```

---

## Testing

### Run Backend Tests

```powershell
cd server
npm test
```

### Run Frontend Tests

```powershell
cd client
npm test
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `ECONNREFUSED` on MongoDB | Ensure MongoDB is running: `net start MongoDB` or `mongod` |
| `CORS error` in browser | Check `CLIENT_URL` in `.env` matches frontend URL |
| `401 Unauthorized` | Token expired; login again or use refresh token |
| `Port 5000 in use` | Change `PORT` in `.env` or kill existing process |
| `Cannot find module` | Run `npm run install:all` again |

### Check MongoDB Connection

```powershell
mongosh "mongodb://localhost:27017/skillswap"
```

### Check Server Logs

The server logs connection status and errors to the console. Watch for:

```
MongoDB Connected: localhost
SkillSwap Server Running - Port: 5000
```

### Reset Database

```powershell
mongosh
use skillswap
db.dropDatabase()
```

Then re-seed admin:

```powershell
cd server
npm run seed:admin
```

---

## Quick Start Checklist

- [ ] Node.js v18+ installed
- [ ] MongoDB running (local or Atlas)
- [ ] Cloned repository
- [ ] Created `server/.env` from `.env.example`
- [ ] Set `MONGODB_URI` in `.env`
- [ ] Generated and set `JWT_SECRET` and `JWT_REFRESH_SECRET`
- [ ] Ran `npm run install:all`
- [ ] Ran `npm run seed:admin` (optional)
- [ ] Started app with `npm run dev`
- [ ] Verified health check at `http://localhost:5000/api/health`
- [ ] Opened frontend at `http://localhost:5173`

---

## Next Steps

1. **Register a user** via the frontend or API
2. **Create skill offers/requests**
3. **Browse skills** and propose barter deals
4. **Test messaging** and notifications
5. **Login as admin** to access admin dashboard

---

## Need Help?

- Check the [README.md](./README.md) for project overview
- Open an issue on GitHub
- Contact: [info@zenyukti.in](mailto:info@zenyukti.in)

---

**Happy Skill Swapping! 🚀**
