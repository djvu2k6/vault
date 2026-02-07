// This file acts as the "Brain" for different industries.
// It pre-fills the input forms so the user doesn't start from zero.

export const INDUSTRY_PRESETS = {
  manufacturing: {
    id: 'manufacturing',
    label: 'Manufacturing & Hardware',
    description: 'For physical product creation, factories, and assembly lines.',
    attributes: {
      revenue: [
        { id: 1, name: 'Unit Sales', value: 0, type: 'revenue' },
        { id: 2, name: 'Service Contracts', value: 0, type: 'revenue' }
      ],
      variable: [
        { id: 3, name: 'Raw Materials (BOM)', value: 0, type: 'variable' },
        { id: 4, name: 'Direct Labor', value: 0, type: 'variable' },
        { id: 5, name: 'Shipping & Packaging', value: 0, type: 'variable' }
      ],
      fixed: [
        { id: 6, name: 'Factory Rent', value: 0, type: 'fixed' },
        { id: 7, name: 'Machinery Maintenance (CapEx)', value: 0, type: 'fixed' },
        { id: 8, name: 'Salaries (Management)', value: 0, type: 'fixed' }
      ]
    }
  },
  saas: {
    id: 'saas',
    label: 'SaaS & Digital Product',
    description: 'For software, subscriptions, and digital services.',
    attributes: {
      revenue: [
        { id: 1, name: 'Subscription MRR', value: 0, type: 'revenue' },
        { id: 2, name: 'Enterprise Licenses', value: 0, type: 'revenue' }
      ],
      variable: [
        { id: 3, name: 'AWS/Cloud Server Costs', value: 0, type: 'variable' },
        { id: 4, name: 'Payment Gateway Fees', value: 0, type: 'variable' },
        { id: 5, name: 'Customer Support Costs', value: 0, type: 'variable' }
      ],
      fixed: [
        { id: 6, name: 'Developer Salaries', value: 0, type: 'fixed' },
        { id: 7, name: 'Software Licenses (Jira/Slack)', value: 0, type: 'fixed' },
        { id: 8, name: 'Office Rent (OpEx)', value: 0, type: 'fixed' }
      ]
    }
  },
  logistics: {
    id: 'logistics',
    label: 'Logistics & Supply Chain',
    description: 'For fleets, warehousing, and transportation.',
    attributes: {
      revenue: [
        { id: 1, name: 'Freight Fees', value: 0, type: 'revenue' },
      ],
      variable: [
        { id: 3, name: 'Fuel Costs', value: 0, type: 'variable' },
        { id: 4, name: 'Driver Overtime', value: 0, type: 'variable' },
        { id: 5, name: 'Vehicle Maintenance', value: 0, type: 'variable' }
      ],
      fixed: [
        { id: 6, name: 'Fleet Insurance', value: 0, type: 'fixed' },
        { id: 7, name: 'Warehouse Lease', value: 0, type: 'fixed' },
        { id: 8, name: 'Fleet Financing (CapEx)', value: 0, type: 'fixed' }
      ]
    }
  },
  retail: {
    id: 'retail',
    label: 'Retail & E-Commerce',
    description: 'For shops, supermarkets, and online stores.',
    attributes: {
      revenue: [
        { id: 1, name: 'Product Sales', value: 0, type: 'revenue' },
      ],
      variable: [
        { id: 3, name: 'Cost of Goods Sold (COGS)', value: 0, type: 'variable' },
        { id: 4, name: 'Transaction Fees', value: 0, type: 'variable' }
      ],
      fixed: [
        { id: 6, name: 'Store Rent', value: 0, type: 'fixed' },
        { id: 7, name: 'Staff Salaries', value: 0, type: 'fixed' },
        { id: 8, name: 'Marketing Budget', value: 0, type: 'fixed' }
      ]
    }
  }
};