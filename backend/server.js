const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const recipeRoutes = require('./routes/recipeRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB Database
connectDB();

// Initialize Express App
const app = express();

// Trust proxy for rate limiters behind load balancers/reverse proxies
app.set('trust proxy', 1);

// 1. Security HTTP Headers
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Allow cross-origin image loading
  })
);

// 2. Response Compression (Gzip / Deflate)
app.use(compression());

// 3. Configure CORS
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 4. Body parser middlewares with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Global API Rate Limiter
app.use('/api', apiLimiter);

// 6. Health check & Telemetry endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Vyanjan API',
    message: '🍲 Vyanjan Recipe & Masterclass API is running!',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  const memoryUsage = process.memoryUsage();
  res.status(200).json({
    status: 'OK',
    app: 'Vyanjan API Server',
    uptime: `${Math.floor(process.uptime())}s`,
    environment: process.env.NODE_ENV || 'development',
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
    },
    timestamp: new Date().toISOString(),
  });
});

// 7. API Routes (With dedicated strict rate limiting on Auth)
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/admin', adminRoutes);

// 8. 404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found on Vyanjan API server.`,
  });
});

// 9. Centralized Error Handling Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Vyanjan API Server running on port ${PORT}`);
  console.log(`🌐 Local API URL: http://localhost:${PORT}`);
  console.log(`👑 Admin API mounted at: http://localhost:${PORT}/api/admin`);
  console.log(`=========================================`);
});
