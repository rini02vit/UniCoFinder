import React from 'react';
import CurrencyInput from './CurrencyInput';

const BudgetCategoryInput = React.memo(({ config, value, onChange, currencySymbol }) => {
  const inputId = `budget-input-${config.id}`;
  const descId = `budget-desc-${config.id}`;

  return (
    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
      <label htmlFor={inputId} className="form-label" style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
        {config.label}
      </label>
      
      <CurrencyInput
        id={inputId}
        value={value}
        onChange={onChange}
        placeholder={config.placeholder}
        min={config.min}
        step={config.step}
        ariaDescribedBy={descId}
        currencySymbol={currencySymbol}
      />
      
      <p id={descId} className="help-text text-secondary" style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
        {config.description}
      </p>
    </div>
  );
});

export default BudgetCategoryInput;
