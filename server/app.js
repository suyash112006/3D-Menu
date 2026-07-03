const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const path = require('path');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');

const apiRouter = express.Router();

// Basic health check route
apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Routes
apiRouter.use('/auth', authRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/', publicRoutes);

// Mount API routes (Handles both local '/api' and Vercel serverless '/' where '/api' is stripped)
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Static folder for uploads (only needed for local dev if at all)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

module.exports = app;
