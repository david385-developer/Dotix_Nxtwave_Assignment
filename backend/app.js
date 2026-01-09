const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jobRoutes = require('./routes/jobRoutes');
const db = require('./database');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/', jobRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// DB Sync & Server Start
db.sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
}).catch(err => {
  console.error('DB sync failed:', err);
});

process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
});
