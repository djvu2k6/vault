import React from 'react';
import UniversalCore from './UniversalCore';
import { INDUSTRY_PRESETS } from '../../data/industryPresets';

const RetailDashboard = (props) => {
  const preset = INDUSTRY_PRESETS.retail;
  const initialInputs = { industry_type: preset.label };
  return <UniversalCore initialInputs={initialInputs} {...props} />;
};

export default RetailDashboard;
