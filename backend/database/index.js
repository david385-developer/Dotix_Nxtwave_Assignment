const { Sequelize } = require('sequelize');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      connectTimeout: 10000
    }
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Job = require('./jobModel')(sequelize, Sequelize);

// Test connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Unable to connect to database');
    console.error(error);
    process.exit(1);
  }
})();

module.exports = db;
