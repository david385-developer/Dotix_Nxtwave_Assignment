const express = require('express');
const cors = require('cors');
const jobRoutes = require('./routes/jobRoutes');
const db = require('./database');


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();

app.use(cors());
app.use(express.json());


app.use('/', jobRoutes); 



app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});


const PORT = process.env.PORT || 3000;


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

process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
});
