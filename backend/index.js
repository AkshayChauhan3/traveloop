require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const tripsRoutes = require('./routes/trips');
const stopsRoutes = require('./routes/stops');
const expensesRoutes = require('./routes/expenses');
const searchRoutes = require('./routes/search');
const extraRoutes = require('./routes/extras');
const tripCollaborationRoutes = require('./routes/tripCollaboration');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripsRoutes);
app.use('/api/trips', tripCollaborationRoutes);
app.use('/api/stops', stopsRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/extras', extraRoutes);
app.use("/uploads", express.static("uploads"));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
