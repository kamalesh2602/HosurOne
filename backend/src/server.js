import app from './app.js';
import config from './config/env.js';
import { connectDB } from './config/db.js';
import { seedGovernmentData } from './modules/government/government.service.js';
import { seedBankData } from './modules/banks/bank.service.js';

async function startServer() {
  // Connect to MongoDB if configured (non-blocking for weather services)
  await connectDB();
  await Promise.allSettled([seedGovernmentData(), seedBankData()]);

  const server = app.listen(config.port, () => {
    console.log(`====================================================`);
    console.log(`  HosurOne Backend API Server`);
    console.log(`  Environment: ${config.nodeEnv}`);
    console.log(`  Port:        ${config.port}`);
    console.log(`  Health:      http://localhost:${config.port}/api/health`);
    console.log(`  Weather:     http://localhost:${config.port}/api/weather`);
    console.log(`====================================================`);
  });

  // Graceful shutdown handling
  const shutdown = (signal) => {
    console.log(`\n[Server] Received ${signal}. Closing HTTP server gracefully...`);
    server.close(() => {
      console.log('[Server] HTTP server closed cleanly.');
      process.exit(0);
    });

    // Force exit after 10s if hanging
    setTimeout(() => {
      console.error('[Server Error] Forcing exit after timeout.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer().catch((err) => {
  console.error('[Fatal Error] Failed to start server:', err);
  process.exit(1);
});

