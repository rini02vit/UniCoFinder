# Architecture Document

# Project Name

UniCoFinder – Smart Study Abroad Advisor

---

# 1. System Overview

UniCoFinder follows a modern MERN Stack architecture.

```
                User
                  │
                  ▼
         React Frontend (Vite)
                  │
         Axios REST API Calls
                  │
                  ▼
        Express + Node Backend
                  │
        Authentication Middleware
                  │
                  ▼
             MongoDB Atlas
```

The application follows a client-server architecture where the React frontend communicates with a RESTful Express backend, and all persistent data is stored in MongoDB.

---

# 2. Tech Stack

## Frontend

- React 19
- Vite
- React Router DOM
- Tailwind CSS
- Framer Motion
- Axios
- React Hook Form
- React Icons
- Recharts
- React Toastify

---

## Backend

- Node.js
- Express.js
- JWT Authentication
- bcrypt
- dotenv
- CORS
- Morgan
- Mongoose
- Express Validator

---

## Database

MongoDB Atlas

Collections

- Users
- Universities
- Countries
- Scholarships
- Applications
- Wishlists
- Notifications

---

# 3. Folder Structure

```
UniCoFinder/

│
├── client/
│
│   ├── public/
│   │
│   ├── src/
│   │
│   ├── assets/
│   ├── components/
│   │      Navbar
│   │      Footer
│   │      UniversityCard
│   │      ScholarshipCard
│   │      CountryCard
│   │      BudgetChart
│   │      CompareTable
│   │      SearchBar
│   │      Filters
│   │      Loader
│   │      Sidebar
│   │      StatsCard
│   │
│   ├── pages/
│   │      Home
│   │      Login
│   │      Register
│   │      Dashboard
│   │      Universities
│   │      Scholarships
│   │      Countries
│   │      Compare
│   │      Wishlist
│   │      Profile
│   │      Budget
│   │      ApplicationTracker
│   │      AIAdvisor
│   │
│   ├── hooks/
│   ├── context/
│   ├── services/
│   ├── utils/
│   ├── routes/
│   ├── App.jsx
│   └── main.jsx
│
├── server/
│
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── services/
│   ├── seed/
│   ├── server.js
│   └── app.js
│
└── README.md
```

---

# 4. Database Design

## Users

```
_id (ObjectId)

name (String)

email (String)

password (String)

cgpa (Number)

course (String)

degree (String)

budget (Number)

countryPreference (String)

englishExam (String)

examScore (Number)

wishlist (Array of ObjectIds)

applications (Array of ObjectIds)

createdAt (Date)
```

---

## Universities

```
_id (ObjectId)

name (String)

country (String)

city (String)

courseOffered (Array of Strings)

minimumCGPA (Number)

averageCGPA (Number)

tuitionFee (Number)

livingCost (Number)

worldRanking (Number)

acceptanceRate (Number)

employmentRate (Number)

scholarships (Array of ObjectIds)

image (String)

website (String)

description (String)
```

---

## Countries

```
_id (ObjectId)

name (String)

currency (String)

averageTuition (Number)

averageLivingCost (Number)

visaDifficulty (String)

language (String)

climate (String)

partTimeAllowed (Boolean)

averageSalary (Number)

topUniversities (Array of ObjectIds)

image (String)
```

---

## Scholarships

```
_id (ObjectId)

title (String)

country (String)

provider (String)

amount (Number)

deadline (Date)

minimumCGPA (Number)

eligibleCourses (Array of Strings)

officialWebsite (String)

description (String)
```

---

## Applications

```
_id (ObjectId)

userId (ObjectId)

universityId (ObjectId)

status (String)

documentsCompleted (Array of Strings)

createdAt (Date)

updatedAt (Date)
```

---

## Wishlist

```
_id (ObjectId)

userId (ObjectId)

universityId (ObjectId)
```

---

## Notifications

```
_id (ObjectId)

userId (ObjectId)

title (String)

message (String)

read (Boolean)

createdAt (Date)
```

---

# 5. Authentication Flow

```
User

↓

Register

↓

Password Encrypted

↓

MongoDB

↓

Login

↓

JWT Token Generated

↓

Stored in Local Storage

↓

Protected Routes
```

Protected Pages

- Dashboard
- Wishlist
- Profile
- Application Tracker

---

# 6. Recommendation Engine

Inputs

- CGPA
- Course
- Budget
- Preferred Country
- IELTS/TOEFL Score

Processing

```
Filter Universities

↓

Remove Universities below minimum CGPA

↓

Filter by Budget

↓

Filter by Course

↓

Sort by Ranking

↓

Calculate Match Score

↓

Return Best Results
```

Each university gets a score based on:

- Academic match
- Budget compatibility
- Course availability
- Country preference
- Scholarship availability

---

# 7. Scholarship Matching

Filters

- Country
- Course
- Minimum CGPA
- Degree

Output

```
Eligible Scholarships

↓

Sort by Amount

↓

Nearest Deadline

↓

Highest Eligibility Match
```

---

# 8. Country Recommendation Logic

Factors

- Budget
- Tuition
- Living Cost
- Visa Ease
- Employment Rate
- Scholarships
- Student Safety

Algorithm

```
Budget Score

+

Education Score

+

Job Score

+

Scholarship Score

+

Visa Score

=

Overall Country Score
```

---

# 9. Budget Calculator

Formula

```
Total Cost =

Tuition Fee

+

Accommodation

+

Food

+

Transportation

+

Insurance

+

Miscellaneous
```

Display

- Monthly Cost
- Yearly Cost
- Currency Conversion
- Budget Remaining

---

# 10. Application Tracker Workflow

```
University Saved

↓

Documents Pending

↓

Documents Uploaded

↓

Application Submitted

↓

Interview

↓

Decision

↓

Accepted / Rejected
```

---

# 11. API Endpoints

## Authentication

```
POST /api/auth/register

POST /api/auth/login

GET /api/auth/profile
```

---

## Universities

```
GET /api/universities

GET /api/universities/:id

POST /api/universities/search

GET /api/universities/recommend
```

---

## Countries

```
GET /api/countries

GET /api/countries/:id

GET /api/countries/recommend
```

---

## Scholarships

```
GET /api/scholarships

GET /api/scholarships/:id

POST /api/scholarships/filter
```

---

## Wishlist

```
GET /api/wishlist

POST /api/wishlist

DELETE /api/wishlist/:id
```

---

## Applications

```
GET /api/applications

POST /api/applications

PUT /api/applications/:id

DELETE /api/applications/:id
```

---

## Profile

```
GET /api/profile

PUT /api/profile
```

---

# 12. Frontend Routing

```
/

/login

/register

/dashboard

/profile

/universities

/university/:id

/countries

/country/:id

/scholarships

/compare

/wishlist

/application-tracker

/budget

/ai-advisor
```

---

# 13. UI Components

Global Components

- Navbar
- Footer
- Sidebar
- Theme Toggle
- Search Bar
- Loader
- Toast Notifications

Cards

- University Card
- Scholarship Card
- Country Card
- Budget Card
- Statistics Card

Charts

- Tuition Comparison
- Living Cost Chart
- Budget Breakdown
- Country Ranking Graph

Modals

- University Details
- Scholarship Details
- Compare Universities
- Delete Confirmation

---

# 14. Security

- JWT Authentication
- Password Hashing with bcrypt
- Input Validation
- Protected Routes
- CORS Configuration
- Environment Variables
- Secure MongoDB Connection

---

# 15. Performance Optimizations

- Lazy Loading
- Code Splitting
- Pagination
- Debounced Search
- Image Lazy Loading
- Memoized Components
- Efficient MongoDB Indexes

---

# 16. Future Enhancements

- AI Chat Counselor
- SOP Generator
- Resume Analyzer
- Visa Eligibility Checker
- AI Scholarship Prediction
- Real-time University Data API
- Email Notifications
- Calendar Integration
- Admin Dashboard
- Multi-language Support
- PWA (Offline Support)

---

# 17. Deployment

Frontend

- Vercel

Backend

- Render

Database

- MongoDB Atlas

Media Assets

- Cloudinary

Version Control

- Git + GitHub

CI/CD

- GitHub Actions (Future)