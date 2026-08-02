/**
 * Pure functions for budget calculations.
 * React-agnostic, deterministic math layer.
 */

import { BUDGET_CATEGORIES_CONFIG } from '../constants/budgetConfig';

/**
 * Convert all inputted expenses when the user changes their base currency.
 * Applies the conversion rate and rounds to integers to keep inputs clean.
 */
export const convertExpenses = (expenses, conversionRate) => {
  const converted = {};
  for (const [key, value] of Object.entries(expenses)) {
    if (value === '' || value === 0) {
      converted[key] = value;
    } else {
      converted[key] = Math.round(value * conversionRate);
    }
  }
  return converted;
};

/**
 * Given an expenses object and config, calculate the total annual cost.
 */
export const calculateAnnualTotal = (expenses) => {
  return BUDGET_CATEGORIES_CONFIG.reduce((total, config) => {
    const value = expenses[config.id] || 0;
    return total + (value * config.multiplier);
  }, 0);
};

/**
 * Calculate individual category annual totals without aggregating
 * Returns an object mapping config.id to its annual cost
 */
export const calculateCategoryTotals = (expenses) => {
  return BUDGET_CATEGORIES_CONFIG.reduce((totals, config) => {
    const value = expenses[config.id] || 0;
    totals[config.id] = value * config.multiplier;
    return totals;
  }, {});
};

/**
 * Safely calculate percentages
 */
export const calculatePercentage = (part, total) => {
  if (total <= 0) return 0;
  return (part / total) * 100;
};

/**
 * Generate structural segments for the CSS breakdown chart.
 * Returns: Array of { id, label, color, amount, widthPercentage }
 */
export const generateChartSegments = (expenses, total) => {
  if (total <= 0) {
    return [{
      id: 'empty',
      label: 'No Expenses',
      color: 'var(--border-color)',
      amount: 0,
      widthPercentage: 100
    }];
  }

  const segments = BUDGET_CATEGORIES_CONFIG.map(config => {
    const rawValue = expenses[config.id] || 0;
    const annualAmount = rawValue * config.multiplier;
    const widthPercentage = calculatePercentage(annualAmount, total);
    
    return {
      id: config.id,
      label: config.label.replace(' (Monthly)', '').replace(' (Yearly)', ''),
      color: config.color,
      amount: annualAmount,
      widthPercentage
    };
  });

  // Filter out zero-width segments to keep DOM clean
  return segments.filter(seg => seg.widthPercentage > 0);
};
