export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' }
];

// Fallback rates relative to USD if API fails or API key is absent
export const MOCK_EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  AUD: 1.51,
  CAD: 1.36,
  INR: 83.50
};
