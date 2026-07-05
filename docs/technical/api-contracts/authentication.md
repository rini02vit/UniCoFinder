# Authentication API Specification

**Module:** Authentication  
**Status:** Approved  
**Version:** v1.0  
**Last Updated:** 2026-07-05  
**Related Phase:** Phase 3  

*This document is the approved API specification for the Authentication module. Any implementation must conform to this contract.*

---

## 1. Register User

**1. Endpoint Name**  
Register User

**2. HTTP Method**  
`POST`

**3. URL**  
`/api/auth/register`

**4. Purpose**  
To create a new user account on the UniCoFinder platform. The user creates an account first with basic information and completes their full profile (CGPA, budget, preferences) later via Profile APIs.

**5. Authentication Required**  
- Public

**6. Request Headers**  
- `Content-Type`: `application/json`

**7. Request Body**  
- **Required Fields:** `name`, `email`, `password`
- **Optional Fields:** None

**Example JSON:**
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "StrongPassword123!"
}
```

**8. Success Response**  
- **HTTP Status:** `201 Created`
- **Response JSON:** Returns a success message, the JWT token, and the basic user identity details.

**Example JSON:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5c...",
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "name": "Jane Doe",
      "email": "jane.doe@example.com"
    }
  }
}
```

**9. Error Responses**  

- **400 Bad Request**
  - **When it occurs:** Missing required fields in the request body.
  - **Response Format:**
    ```json
    { 
      "success": false,
      "message": "Missing required fields", 
      "errors": ["name, email, and password are required."] 
    }
    ```
- **409 Conflict**
  - **When it occurs:** The provided email address is already registered.
  - **Response Format:**
    ```json
    { 
      "success": false,
      "message": "User with this email already exists.", 
      "errors": [] 
    }
    ```
- **422 Validation Error**
  - **When it occurs:** The email format is invalid, or the password does not meet complexity requirements.
  - **Response Format:**
    ```json
    {
      "success": false,
      "message": "Validation failed",
      "errors": [
        { "field": "password", "message": "Password must be at least 8 characters long." }
      ]
    }
    ```
- **500 Internal Server Error**
  - **When it occurs:** Database connection failure or unhandled server exception.
  - **Response Format:**
    ```json
    { 
      "success": false,
      "message": "Internal server error. Please try again later.", 
      "errors": [] 
    }
    ```

**10. Business Rules**  
- **Duplicate Email:** An email address can only be registered once. Checking must be case-insensitive.
- **Account State:** A newly registered user has an empty profile for academic and financial details.

**11. Validation Rules**  
- **Name:** Must be a string between 2 and 50 characters.
- **Email:** Must be a valid email format.
- **Password:** Must be at least 8 characters long.

**12. Security Considerations**  
- **Password Hashing:** Passwords must be hashed using `bcrypt` before storing in MongoDB. Plain text passwords must never be logged or stored.
- **Rate Limiting:** (Recommendation) Implement rate limiting to prevent bot abuse and mass registrations.
- **Response Payload:** Authentication responses must never expose sensitive fields including:
  - password
  - password hash
  - `__v`
  - internal authentication secrets
  - any future refresh token fields

**13. Notes**  
- The frontend should securely store the JWT token (e.g., in `localStorage`) and redirect the user to the Profile Completion flow.

---

## 2. Login User

**1. Endpoint Name**  
Login User

**2. HTTP Method**  
`POST`

**3. URL**  
`/api/auth/login`

**4. Purpose**  
To authenticate an existing user and return a JWT token for accessing protected routes.

**5. Authentication Required**  
- Public

**6. Request Headers**  
- `Content-Type`: `application/json`

**7. Request Body**  
- **Required Fields:** `email`, `password`
- **Optional Fields:** None

**Example JSON:**
```json
{
  "email": "jane.doe@example.com",
  "password": "StrongPassword123!"
}
```

**8. Success Response**  
- **HTTP Status:** `200 OK`
- **Response JSON:** Returns the JWT token and the authenticated user's basic data.

**Example JSON:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5c...",
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "name": "Jane Doe",
      "email": "jane.doe@example.com"
    }
  }
}
```

**9. Error Responses**  

- **400 Bad Request**
  - **When it occurs:** Missing email or password in the request body.
  - **Response Format:**
    ```json
    { 
      "success": false,
      "message": "Email and password are required.", 
      "errors": [] 
    }
    ```
- **401 Unauthorized**
  - **When it occurs:** The provided email is not registered, or the password does not match the hashed password. (Generic error message used for security).
  - **Response Format:**
    ```json
    { 
      "success": false,
      "message": "Invalid credentials.", 
      "errors": [] 
    }
    ```
- **422 Validation Error**
  - **When it occurs:** The email format provided is structurally invalid.
  - **Response Format:**
    ```json
    {
      "success": false,
      "message": "Validation failed",
      "errors": [
        { "field": "email", "message": "Invalid email format." }
      ]
    }
    ```
- **500 Internal Server Error**
  - **When it occurs:** Database or server-side failure.
  - **Response Format:**
    ```json
    { 
      "success": false,
      "message": "Internal server error. Please try again later.", 
      "errors": [] 
    }
    ```

**10. Business Rules**  
- **Invalid Credentials:** Do not specify whether the email or password failed to prevent user enumeration attacks.
- **JWT Expiration:** The JWT expiration duration is configurable through environment variables.

**11. Validation Rules**  
- **Email:** Must be a valid format.
- **Password:** Cannot be empty.

**12. Security Considerations**  
- **Rate Limiting:** (Recommendation) Implement rate limiting for login attempts to prevent brute-force attacks.
- **Response Payload:** Authentication responses must never expose sensitive fields including:
  - password
  - password hash
  - `__v`
  - internal authentication secrets
  - any future refresh token fields

**13. Notes**  
- The frontend should clear any existing invalid tokens upon receiving a 401 response and redirect to the login page.

---

## 3. Get Current User (Me)

**1. Endpoint Name**  
Get Current User

**2. HTTP Method**  
`GET`

**3. URL**  
`/api/auth/me`

**4. Purpose**  
To return the currently authenticated user's identity and profile information for frontend authentication state initialization. This also serves as a token validation check: a 200 OK means the token is valid, while a 401 Unauthorized means the token is invalid or expired. This keeps authentication concerns separate from future standard Profile APIs.

**5. Authentication Required**  
- Protected

**6. Request Headers**  
- `Authorization`: `Bearer <JWT_TOKEN>`

**7. Request Body**  
- None

**8. Success Response**  
- **HTTP Status:** `200 OK`
- **Response JSON:** Returns the user document (identity and any existing profile data), indicating the session is valid.

**Example JSON:**
```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "cgpa": 8.5,
      "course": "Computer Science",
      "degree": "Bachelors",
      "budget": 30000,
      "countryPreference": "USA",
      "englishExam": "IELTS",
      "examScore": 7.5,
      "createdAt": "2023-10-12T07:20:50.52Z"
    }
  }
}
```

**9. Error Responses**  

- **401 Unauthorized**
  - **When it occurs:** JWT token is missing, malformed, or has expired.
  - **Response Format:**
    ```json
    { 
      "success": false,
      "message": "Not authorized to access this route.", 
      "errors": [] 
    }
    ```
- **404 Not Found**
  - **When it occurs:** The token is valid, but the user ID contained in the token no longer exists in the database.
  - **Response Format:**
    ```json
    { 
      "success": false,
      "message": "User not found.", 
      "errors": [] 
    }
    ```
- **500 Internal Server Error**
  - **When it occurs:** Database or server-side failure.
  - **Response Format:**
    ```json
    { 
      "success": false,
      "message": "Internal server error. Please try again later.", 
      "errors": [] 
    }
    ```

**10. Business Rules**  
- **Authorization Rules:** Only the owner of the token can access their data.

**11. Validation Rules**  
- **Token:** Token must be successfully decoded and verified against the JWT Secret.

**12. Security Considerations**  
- **Response Payload:** Authentication responses must never expose sensitive fields including:
  - password
  - password hash
  - `__v`
  - internal authentication secrets
  - any future refresh token fields

**13. Notes**  
- The frontend calls this endpoint immediately after app initialization if a token is found in `localStorage` to rehydrate the user state. If a 401 is received, the frontend should delete the token from `localStorage` and redirect to Login.
