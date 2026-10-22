# SmartCampus – Setup

## 1. Backend
```
cd backend
npm install
npm run seed      # (or: node seed.js)  – fills MongoDB + creates login accounts
npm run dev       # http://localhost:5000
```
Requires MongoDB running locally (`mongodb://127.0.0.1:27017/SmartCampus`, see `backend/.env`).

## 2. Frontend
```
cd frontend
npm install
npm run dev       # http://localhost:5173  (proxies /api -> :5000)
```

## Login accounts (created by the seed)
| Role    | Email                              | Password    |
|---------|------------------------------------|-------------|
| Admin   | admin@smartcampus.ac.in            | Admin@123   |
| Faculty | ramesh.babu@smartcampus.ac.in      | Faculty@123 |
| Student | saicharan@smartcampus.ac.in        | Student@123 |

All seeded faculty use `Faculty@123`, all seeded students use `Student@123`.
Public sign-up creates Student accounts; faculty/admin accounts are created by an admin.
