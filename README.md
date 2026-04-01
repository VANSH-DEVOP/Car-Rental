# Car Rental (MERN)

This is a car rental app with:
- **Frontend:** React + Redux + Ant Design
- **Backend:** Node.js (Express) + MongoDB (Mongoose)

## Features
- Register + Login (secure authentication using **bcrypt + JWT**)
- Token-based authentication (JWT stored in localStorage)
- Protected routes (frontend + backend)
- Role-based access (admin/user)
- Browse available cars with date filtering
- Book cars
- Admin panel to add/edit cars
- Stripe Checkout integration (frontend uses a Stripe publishable key)

## Authentication & Security

The app now uses a secure authentication system:

- **Password Hashing:** User passwords are hashed using `bcrypt` before storing in the database
- **JWT Authentication:** On login, a JSON Web Token (JWT) is generated and sent to the client
- **Token Storage:** JWT is stored in `localStorage` and attached to API requests
- **Protected APIs:** Backend routes are protected using middleware that verifies JWT
- **Frontend Route Protection:** Unauthorized users are redirected to `/login`
- **Role-Based Access Control:** Admin routes are accessible only to users with `isAdmin = true`

## Prerequisites
- MongoDB Atlas (or another MongoDB instance)
- Node.js (LTS recommended)
- A Stripe account (for `REACT_APP_STRIPE_KEY`)

## Setup

### 1) Install dependencies
In two terminals:

Terminal 1:
```bash
cd server
npm install
```

Terminal 2:
```bash
cd client
npm install
```

### 2) Configure environment variables

#### Server (`server/.env`)
Copy the example:
```bash
cd server
cp .env.example .env
```

Set:
- `MONGO_URL` (MongoDB connection string)
- `PORT` (default: `5001`)
- `ADMIN_USERNAME` and `ADMIN_PASSWORD` (optional; creates/updates an admin user on server start)

#### Client (`client/.env`)
Copy the example:
```bash
cd client
cp .env.example .env
```

Set:
- `REACT_APP_STRIPE_KEY` (Stripe *publishable* key from dashboard)

## Run the app

Terminal 1 (backend):
```bash
cd server
npm run dev
```

Terminal 2 (frontend):
```bash
cd client
npm start
```

Open:
- Frontend: `http://localhost:3000`
- Backend API runs on: `http://localhost:5001`

## Admin access
1. Make sure you have an admin account:
   - easiest: set `ADMIN_USERNAME` + `ADMIN_PASSWORD` in `server/.env`, restart backend
2. Log in using the admin credentials (this updates `localStorage`)
3. Go to:
   - `http://localhost:3000/admin`

If you are not an admin, admin routes redirect to `/`.

## Notes
- Demo cars are auto-seeded on first successful Mongo connection (only if the `cars` collection is empty).
- Do not commit `server/.env` or `client/.env` (they contain secrets).
