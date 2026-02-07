const { Sequelize } = require('sequelize');

// 1. Setup the Connection
const sequelize = new Sequelize('industry5_db', 'postgres', 'admin123', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false, // Set to console.log to see raw SQL queries
});

// 2. Export the Connection Instance
module.exports = sequelize;