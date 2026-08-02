export const BUDGET_CATEGORIES_CONFIG = [
  {
    id: 'tuition',
    label: 'Tuition Fee (Yearly)',
    description: 'Annual university tuition and academic fees.',
    placeholder: 'e.g. 30000',
    defaultValue: 30000,
    multiplier: 1, // Annual
    color: 'var(--primary-purple)',
    min: 0,
    step: 100,
    order: 1
  },
  {
    id: 'accommodation',
    label: 'Accommodation (Monthly)',
    description: 'Monthly rent, utilities, and internet.',
    placeholder: 'e.g. 800',
    defaultValue: 800,
    multiplier: 12, // Monthly
    color: 'var(--primary-cyan)',
    min: 0,
    step: 10,
    order: 2
  },
  {
    id: 'food',
    label: 'Food & Groceries (Monthly)',
    description: 'Monthly food, dining, and grocery expenses.',
    placeholder: 'e.g. 400',
    defaultValue: 400,
    multiplier: 12, // Monthly
    color: 'var(--primary-green)',
    min: 0,
    step: 10,
    order: 3
  },
  {
    id: 'transportation',
    label: 'Transportation (Monthly)',
    description: 'Public transit, flights, and travel.',
    placeholder: 'e.g. 100',
    defaultValue: 100,
    multiplier: 12, // Monthly
    color: '#f59e0b', // Custom warning/amber
    min: 0,
    step: 10,
    order: 4
  },
  {
    id: 'insurance',
    label: 'Health Insurance (Yearly)',
    description: 'Annual health cover required for students.',
    placeholder: 'e.g. 600',
    defaultValue: 600,
    multiplier: 1, // Annual
    color: '#ef4444', // Red
    min: 0,
    step: 10,
    order: 5
  },
  {
    id: 'miscellaneous',
    label: 'Miscellaneous (Monthly)',
    description: 'Entertainment, shopping, and personal items.',
    placeholder: 'e.g. 150',
    defaultValue: 150,
    multiplier: 12, // Monthly
    color: '#8b5cf6', // Indigo
    min: 0,
    step: 10,
    order: 6
  }
];
