import React from 'react';
import { BUDGET_CATEGORIES_CONFIG } from '../constants/budgetConfig';
import { SUPPORTED_CURRENCIES } from '../constants/currencyConfig';
import BudgetCategoryInput from './BudgetCategoryInput';
import BudgetSection from './BudgetSection';

const BudgetForm = ({ expenses, updateExpense, onReset, currency, onCurrencyChange, isConverting }) => {
  const activeCurrencyConfig = SUPPORTED_CURRENCIES.find(c => c.code === currency) || SUPPORTED_CURRENCIES[0];

  return (
    <div className="card" style={{ padding: '2rem', opacity: isConverting ? 0.7 : 1, transition: 'opacity 0.2s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 className="card-title m-0">Expenses Breakdown</h3>
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <select 
            className="form-control" 
            value={currency} 
            onChange={e => onCurrencyChange(e.target.value)}
            disabled={isConverting}
            style={{ padding: '0.5rem', width: 'auto' }}
            aria-label="Select Base Currency"
          >
            {SUPPORTED_CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.code} - {c.label}</option>
            ))}
          </select>
          
          <button 
            className="btn btn-secondary" 
            onClick={onReset}
            disabled={isConverting}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            Reset Defaults
          </button>
        </div>
      </div>

      <form onSubmit={e => e.preventDefault()}>
        <BudgetSection title="Annual & Monthly Estimates">
          {BUDGET_CATEGORIES_CONFIG.map(config => (
            <BudgetCategoryInput
              key={config.id}
              config={config}
              value={expenses[config.id]}
              onChange={(val) => updateExpense(config.id, val)}
              currencySymbol={activeCurrencyConfig.symbol}
            />
          ))}
        </BudgetSection>
      </form>
    </div>
  );
};

export default BudgetForm;
