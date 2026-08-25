# Installation & Setup Guide

This guide covers setting up the UniCoFinder application for local development and production deployment.

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local instance or MongoDB Atlas cluster)
- **Git**

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/rini02vit/UniCoFinder.git
cd UniCoFinder
```

### 2. Install Dependencies

The repository has three `package.json` files: root, client, and server.

```bash
# Install root dependencies (Linting & Formatting)
npm install

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### 3. Environment Variables Configuration

You must configure the backend environment variables before starting the server.

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and configure your variables. The following variables exist:
   - `PORT`: (Optional) Backend port, defaults to 5000 in code.
   - `MONGO_URI`: **(Strictly Required)** Your MongoDB connection string.
   - `NODE_ENV`: Should be `development` locally.
   - `JWT_SECRET`: Secret key for signing authentication tokens.
   - `JWT_EXPIRES_IN`: Token expiry duration (e.g., `7d`).
   - `GROQ_API_KEY`: API key for AI features.
   - `EXCHANGE_RATE_API_KEY`: API key for currency conversion.
   - `SMTP_*`: Variables for configuring email notifications.

**Security Warning**: `server/.env.example` contains only placeholder values. *Never commit your actual `.env` file or expose secrets in documentation or source control.*

### 4. Running the Application Locally

**Start the Backend:**
```bash
cd server
npm run dev
```

**Start the Frontend:**
```bash
cd client
npm run dev
```

The application should now be accessible locally (typically `http://localhost:5173` for Vite).

## Production Deployment

### Frontend (Vercel)
The `client` directory is built with Vite.
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment**: Configure any Vercel specific settings (e.g. backend URL) in the dashboard.

### Backend (Render)
The `server` directory contains the Express application.
- **Start Command**: `node server.js`
- **Environment Variables**: Configure all required secrets (like `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`) directly in the Render dashboard.

## Tests
Make sure to manually verify application health and run formatting checks (`npm run format:check`) and linting (`npm run lint`) before committing.
