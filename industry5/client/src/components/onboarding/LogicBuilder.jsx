import React from 'react';
import ManufacturingBuilder from './builders/ManufacturingBuilder';
import SaasBuilder from './builders/SaasBuilder';
import LogisticsBuilder from './builders/LogisticsBuilder';

const LogicBuilder = ({ industryData, onComplete }) => {
  if (!industryData) return null;

  switch (industryData.id) {
    case 'manufacturing':
      return <ManufacturingBuilder onComplete={onComplete} />;
    case 'saas':
      return <SaasBuilder onComplete={onComplete} />;
    case 'logistics':
      return <LogisticsBuilder onComplete={onComplete} />;
    default:
      // Fallback
      return <ManufacturingBuilder onComplete={onComplete} />;
  }
};

export default LogicBuilder;