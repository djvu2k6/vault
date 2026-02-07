import React from 'react';
import UniversalCore from './UniversalCore';
import { INDUSTRY_PRESETS } from '../../data/industryPresets';

const LogisticsDashboard = (props) => {
  const preset = INDUSTRY_PRESETS.logistics;
  const initialInputs = { industry_type: preset.label };
  return <UniversalCore initialInputs={initialInputs} {...props} />;
};

export default LogisticsDashboard;
