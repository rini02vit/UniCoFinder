import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';

import { initNotificationCron } from './services/notificationService.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start server
const startServer = async () => {
  await connectDB();

  // Initialize background jobs
  initNotificationCron();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
