import React from 'react';
import UniversalCore from './UniversalCore';
import { INDUSTRY_PRESETS } from '../../data/industryPresets';

const ManufacturingDashboard = (props) => {
  const preset = INDUSTRY_PRESETS.manufacturing;
  const initialInputs = {
    industry_type: preset.label,
    // Variable Costs
    cost_per_unit: 0,
    marketing_spend: 0,
    variable_costs: 0,
    sales_spend: 0,
    utilities: 0,
    logistics_cost: 0,
    variable_salaries: 0,
    // Fixed Costs (OPEX)
    fixed_costs_opex_rent_salaries: 0,
    tools: 0,
    other_fixed_costs: 0,
    // Capital Expenditure (CapEx)
    machinery: 0,
    server: 0,
    vehicles: 0,
    office_setup: 0,
    other_capex: 0,
    // Financial Metrics
    cash_in_bank: 0,
    monthly_expenses: 0,
    current_profit: 0,
    last_profit: 0
  };
  return <UniversalCore initialInputs={initialInputs} {...props} />;
};

export default ManufacturingDashboard;
