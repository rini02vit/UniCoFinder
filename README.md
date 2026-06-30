# UniCoFinder – Smart Study Abroad Advisor

UniCoFinder is a modern MERN Stack web application designed to help students discover the best universities, countries, scholarships, and estimate admission chances based on their academic profile, budget, and career goals.

---

## Prerequisites

Ensure you have the following installed before starting:

- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local instance or MongoDB Atlas cluster)
- **Git**

---

## Installation

The repository is structured into `client` (Frontend) and `server` (Backend) directories.

1. **Clone the repository**:

   ```bash
   git clone https://github.com/rini02vit/UniCoFinder.git
   cd UniCoFinder
   ```

2. **Install Root Dependencies** (for linting and formatting):

   ```bash
   npm install
   ```

3. **Install Frontend Dependencies**:

   ```bash
   cd client
   npm install
   ```

4. **Install Backend Dependencies**:
   ```bash
   cd ../server
   npm install
   ```

---

## Environment Setup

The backend requires a strict database connection to boot up. You must configure the environment variables before starting the server.

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and configure your variables:
   - `PORT`: (Optional) The port the backend server runs on (defaults to `5000` in code if absent, `5005` in example).
   - `MONGO_URI`: **(Strictly Required)** The MongoDB connection string (e.g., `mongodb://localhost:27017/unicofinder`).

---

## Running the Application

### Running the Backend

The backend server must connect successfully to MongoDB. If it fails to connect, the process will crash safely.

```bash
cd server
npm run dev
```

### Running the Frontend

```bash
cd client
npm run dev
```

---

## Available Scripts

We enforce strict code quality using centrally managed ESLint and Prettier configurations. You can run these from the **root** folder:

- `npm run lint` — Lints both the `client` and `server` codebase.
- `npm run format` — Formats all supported files in the repository using Prettier.
- `npm run format:check` — Validates that all files conform to the Prettier standards without making changes.

---

## Development Health Check

The backend exposes a public health endpoint to easily verify the status of the server and its database connection.

**Endpoint**: `GET /api/health`

**Expected Response (HTTP 200 OK)**:

```json
{
  "status": "ok",
  "database": "connected",
  "uptime": 12.345,
  "timestamp": "2026-06-30T12:00:00.000Z"
}
```

_Note: The `database` field dynamically returns `connected`, `disconnected`, `connecting`, or `uninitialized`._

---

## Folder Structure

```text
UniCoFinder/
├── client/                 # React Frontend (Vite)
│   ├── public/
│   └── src/
│       ├── assets/         # Static assets (images, icons)
│       ├── components/     # Reusable UI components
│       ├── context/        # React Context providers
│       ├── hooks/          # Custom React hooks
│       ├── layouts/        # Page layouts (wrappers)
│       ├── pages/          # Main application pages/routes
│       ├── routes/         # Routing configurations
│       ├── services/       # API integration services
│       └── utils/          # Helper functions
│
├── server/                 # Express Backend
│   ├── config/             # Config files (e.g., db.js)
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom Express middleware
│   ├── models/             # Mongoose database schemas
│   ├── routes/             # API route definitions
│   ├── seed/               # Database seed scripts
│   ├── services/           # Backend business logic services
│   ├── utils/              # Helper functions
│   └── server.js           # Entry point and connection orchestrator
│
├── docs/                   # Documentation and UI Prototypes
├── eslint.config.js        # Global ESLint rules
├── .prettierrc             # Global Prettier formatting rules
└── package.json            # Root dependency manager (Lint/Format scripts)
```
