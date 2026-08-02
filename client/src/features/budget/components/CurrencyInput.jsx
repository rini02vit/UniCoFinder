import React from 'react';

const CurrencyInput = React.memo(({ id, value, onChange, placeholder, min = 0, step = 10, ariaDescribedBy, currencySymbol = '$' }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
      <span 
        style={{ position: 'absolute', marginLeft: '1rem', color: 'var(--text-secondary)' }}
        aria-hidden="true"
      >
        {currencySymbol}
      </span>
      <input
        id={id}
        type="number"
        className="form-control"
        style={{ paddingLeft: '2.5rem', width: '100%' }}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        min={min}
        step={step}
        inputMode="decimal"
        aria-describedby={ariaDescribedBy}
      />
    </div>
  );
});

export default CurrencyInput;
