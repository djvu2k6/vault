const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Import the connection from Step 1

// 1. Define the Table Schema
const Financials = sequelize.define('Financials', {
    // Input Columns
    industry_type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    selling_price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    variable_cost_unit: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    units_sold: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fixed_costs: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    // Calculated Columns (The Server computes these)
    revenue: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    cm1_margin: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    cm1_total: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    cm2_margin: {
        type: DataTypes.FLOAT,
        allowNull: true
    }
});

// 2. Export the Model so server.js can call Financials.create()
module.exports = Financials;