const { Sequelize } = require('sequelize');

// Only load dotenv locally
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT), // REQUIRED
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      connectTimeout: 10000
    }
  }
);

(async () => {
  try {
    console.log('🔎 DB CONFIG CHECK:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      db: process.env.DB_NAME
    });

    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Unable to connect to database');
    console.error(error);
    process.exit(1);
  }
})();

module.exports = sequelize;
