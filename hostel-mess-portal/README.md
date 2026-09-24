# Hostel Mess Feedback and Menu Portal (RWW-4)

A MERN application that gives hostel students a single place to view the weekly mess menu and submit one rating + comment per meal per day, while mess admins get an analytics dashboard and a form-based weekly menu editor.

## Tech Stack

- **Frontend:** React 18 (Vite), React Router v6, Axios, Recharts, Lucide React, Tailwind CSS
- **Backend:** Node.js, Express.js, JWT authentication, bcryptjs
- **Database:** MongoDB (Mongoose ODM)

## Folder Structure

```
hostel-mess-portal/
├── backend/
│   ├── config/db.js
│   ├── models/           # User, Menu, Feedback
│   ├── middleware/       # authenticate / authorize (RBAC)
│   ├── controllers/      # auth, menu, feedback, analytics
│   ├── routes/
│   ├── seed/seed.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/        # Login, Register, StudentMenu, FeedbackForm, MyFeedback, AdminMenuEditor, AdminDashboard
│   │   ├── components/   # Navbar, MealCard, RatingStars, ProtectedRoute
│   │   ├── context/      # AuthContext
│   │   ├── api/          # axiosClient
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env        # then edit JWT_SECRET (and MONGO_URI if needed)
npm install
npm run seed                # seeds admin, 2 students, this week's menu, ~23 feedback entries
npm run dev                 # starts Express on http://localhost:5001
```

> Note: if port 5001 is also busy, set `PORT=5002` in `backend/.env` and update
> `VITE_API_URL` in `frontend/.env` to match.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                 # starts Vite on http://localhost:5173
```

Optional: create `frontend/.env` with `VITE_API_URL=http://localhost:5001/api` (this is the default).

## Demo Accounts (after seeding)

| Role | Email | Password |
|---|---|---|
| Admin | admin@mess.com | admin123 |
| Student | student1@mess.com | student123 |
| Student | student2@mess.com | student123 |

## Features

- **Weekly Menu Display** — day-by-day tabs (Mon–Sun), "Today" highlighted, read-only for students.
- **Daily Feedback** — 1–5 star rating + comment (max 500 chars) per meal per day; re-submission updates the same entry (unique compound index on `student + date + mealType`).
- **My Feedback** — student's history with meal badges, dates, and edit links.
- **Admin Menu Editor** — 7×4 grid form to create/update any week's menu; publishes immediately.
- **Analytics Dashboard** — total feedback, overall average, best/worst meal, 7/30-day rating trend line chart, average-rating-by-meal bar chart, top complaint keywords (from ratings ≤ 2), and a filterable/paginated raw feedback table.

## API Overview

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Signup (student/admin) |
| POST | `/api/auth/login` | Public | Login, returns JWT (7d) |
| GET | `/api/auth/me` | Auth | Current profile |
| GET | `/api/menu/current` | Public | This week's menu |
| GET | `/api/menu?weekStartDate=YYYY-MM-DD` | Auth | Menu for a specific week |
| PUT | `/api/menu` | Admin | Create/update weekly menu |
| POST | `/api/feedback` | Student | Submit/update rating + comment |
| GET | `/api/feedback/me` | Auth | Own feedback history |
| GET | `/api/analytics/summary` | Admin | Aggregates, trends, top complaints |
| GET | `/api/analytics/feedback` | Admin | Filterable paginated raw feedback |

Analytics query filters: `mealType`, `minRating`, `maxRating`, `startDate`, `endDate`, `page`, `limit`.

## Key Business Rules

1. One feedback entry per student per meal per day — enforced by a unique MongoDB compound index; upserting makes re-submission an edit.
2. Dates are normalized to UTC midnight (`YYYY-MM-DD`) everywhere.
3. `weekStartDate` is always normalized to the Monday of that week (UTC).
4. Role-based access: students can submit feedback; only admins can edit menus and view analytics.
