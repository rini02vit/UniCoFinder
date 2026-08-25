# UniCoFinder API Documentation

This document outlines the core API routes available in the UniCoFinder backend.

**Base URL (Production)**: `https://unicofinder.onrender.com/api`  
**Base URL (Local)**: `http://localhost:5000/api`

## Health Check
- `GET /health`
  - Returns server status, database connection state, and uptime.

## Authentication (`/auth`)
- `POST /auth/register` - Register a new user.
- `POST /auth/login` - Authenticate a user and receive a JWT.

## Users (`/users`)
- *(Requires Authentication)*
- `GET /users/profile` - Get logged-in user profile.
- `PUT /users/profile` - Update user profile.

## Universities (`/universities`)
- `GET /universities` - Get all universities or search/filter.
- `GET /universities/:id` - Get details of a specific university.
- `POST /universities/recommend` - Recommend universities based on profile.

## Countries (`/countries`)
- `GET /countries` - Get all countries.
- `GET /countries/:id` - Get country details.
- `POST /countries/recommend` - Recommend countries based on profile.

## Scholarships (`/scholarships`)
- `GET /scholarships` - Get all scholarships.
- `GET /scholarships/:id` - Get scholarship details.
- `POST /scholarships/recommend` - Recommend scholarships based on profile.

## Wishlist (`/wishlist`)
- *(Requires Authentication)*
- `GET /wishlist` - View user's wishlist.
- `POST /wishlist/:universityId` - Add university to wishlist.
- `DELETE /wishlist/:universityId` - Remove university from wishlist.

## Applications (`/applications`)
- *(Requires Authentication)*
- `GET /applications` - View all user applications.
- `POST /applications` - Add a new application.
- `PUT /applications/:id` - Update application status.
- `DELETE /applications/:id` - Delete an application.

## AI Advisor (`/ai-advisor`)
- *(Requires Authentication)*
- Endpoints to connect to AI for career and course recommendations.

## Currency (`/currency`)
- Currency conversion helper endpoints.

## Admin (`/admin`)
- *(Requires Admin Authentication)*
- Endpoints to manage universities, countries, scholarships, users, and view analytics.

---
*For detailed request bodies, parameters, and authentication contracts, refer to the source controllers in `server/controllers/` or detailed technical specs in `docs/technical/api-contracts/`.*
