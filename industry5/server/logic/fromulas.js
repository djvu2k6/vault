// server/logic/formulas.js
const calculateFinancials = (inputs) => {
    // Convert strings to numbers to prevent math errors
    const selling_price = parseFloat(inputs.selling_price) || 0;
    const variable_cost_unit = parseFloat(inputs.variable_cost_unit) || 0;
    const units_sold = parseInt(inputs.units_sold) || 0;
    const fixed_costs = parseFloat(inputs.fixed_costs) || 0;

    // 1. Revenue
    const revenue = selling_price * units_sold;

    // 2. CM1 (Contribution Margin 1) per unit
    const cm1_margin = selling_price - variable_cost_unit;

    // 3. CM1 Total
    const cm1_total = cm1_margin * units_sold;

    // 4. CM2 (Contribution Margin 2)
    const cm2_margin = cm1_total - fixed_costs;

    return {
        revenue,
        cm1_margin,
        cm1_total,
        cm2_margin
    };
};

module.exports = { calculateFinancials };