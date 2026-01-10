const express = require('express');
const cors = require('cors');
const db = require('./database');

// Load dotenv only in local development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express(); // ✅ app is defined HERE

app.use(cors());
app.use(express.json());

// Routes
const jobRoutes = require('./routes/jobRoutes');
app.use('/', jobRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;

// Sync DB, then start server
db.sequelize
  .sync()
  .then(() => {
    console.log('📦 Database synced');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ DB sync failed:', err);
    process.exit(1);
  });

// Catch unhandled promise rejections
process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
});
