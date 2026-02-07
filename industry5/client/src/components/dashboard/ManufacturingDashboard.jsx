import React from 'react';
import UniversalCore from './UniversalCore';
import { INDUSTRY_PRESETS } from '../../data/industryPresets';

const ManufacturingDashboard = (props) => {
  const preset = INDUSTRY_PRESETS.manufacturing;
  const initialInputs = {
    industry_type: preset.label,
    units_sold: 0,
    selling_price: 0,
    customer_base: 0,
    customer_acquisition: 0,
    customer_churn: 0,
    monthly_revenue: 0,
    last_month_revenue: 0,
    this_month_customers: 0,
    last_month_customers: 0
  };
  return <UniversalCore initialInputs={initialInputs} {...props} />;
};

export default ManufacturingDashboard;
