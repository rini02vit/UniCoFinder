import { useState, useCallback, useMemo } from 'react';
import { BUDGET_CATEGORIES_CONFIG } from '../constants/budgetConfig';
import { calculateAnnualTotal, generateChartSegments, convertExpenses } from '../utils/budgetMath';
import { fetchExchangeRates } from '../services/exchangeRateApi';

export const useBudgetCalculator = () => {
  const initialExpenses = useMemo(() => {
    return BUDGET_CATEGORIES_CONFIG.reduce((acc, config) => {
      acc[config.id] = config.defaultValue;
      return acc;
    }, {});
  }, []);

  const [expenses, setExpenses] = useState(initialExpenses);
  const [currency, setCurrency] = useState('USD');
  const [isConverting, setIsConverting] = useState(false);

  const updateExpense = useCallback((id, value) => {
    setExpenses(prev => {
      if (value === '') return { ...prev, [id]: '' };
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0) return prev;
      return { ...prev, [id]: Math.min(numValue, 1000000) };
    });
  }, []);

  const reset = useCallback(() => {
    // If the currency is not USD, we should ideally convert the default values,
    // but for simplicity, we'll reset to USD and default values.
    setCurrency('USD');
    setExpenses(initialExpenses);
  }, [initialExpenses]);

  const handleCurrencyChange = useCallback(async (newCurrency) => {
    if (newCurrency === currency) return;
    
    setIsConverting(true);
    try {
      const rates = await fetchExchangeRates(currency);
      const conversionRate = rates[newCurrency];
      
      if (conversionRate) {
        setExpenses(prev => convertExpenses(prev, conversionRate));
        setCurrency(newCurrency);
      }
    } catch (error) {
      console.error('Failed to convert currency', error);
    } finally {
      setIsConverting(false);
    }
  }, [currency]);

  const totalAnnualCost = useMemo(() => {
    const normalizedExpenses = Object.keys(expenses).reduce((acc, key) => {
      acc[key] = expenses[key] === '' ? 0 : expenses[key];
      return acc;
    }, {});
    return calculateAnnualTotal(normalizedExpenses);
  }, [expenses]);

  const chartSegments = useMemo(() => {
    const normalizedExpenses = Object.keys(expenses).reduce((acc, key) => {
      acc[key] = expenses[key] === '' ? 0 : expenses[key];
      return acc;
    }, {});
    return generateChartSegments(normalizedExpenses, totalAnnualCost);
  }, [expenses, totalAnnualCost]);

  return {
    expenses,
    updateExpense,
    reset,
    currency,
    isConverting,
    handleCurrencyChange,
    derived: {
      totalAnnualCost,
      chartSegments
    }
  };
};
