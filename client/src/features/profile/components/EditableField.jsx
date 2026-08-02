import React from 'react';
import CurrencyInput from '../../budget/components/CurrencyInput';

const EditableField = ({ config, value, onChange, error, disabled }) => {
  const handleChange = (e) => onChange(config.id, e.target.value);
  const handleCurrencyChange = (val) => onChange(config.id, val);

  const commonProps = {
    id: `profile-${config.id}`,
    disabled,
    'aria-invalid': !!error,
    'aria-describedby': error ? `error-${config.id}` : undefined,
  };

  if (config.type === 'select') {
    return (
      <select
        className="form-control"
        value={value}
        onChange={handleChange}
        {...commonProps}
      >
        <option value="" disabled>Select {config.label}</option>
        {config.options?.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    );
  }

  if (config.type === 'currency') {
    return (
      <CurrencyInput
        id={commonProps.id}
        value={value}
        onChange={handleCurrencyChange}
        placeholder={config.placeholder}
        min={config.min}
        step={config.step}
        ariaDescribedBy={commonProps['aria-describedby']}
        disabled={disabled}
        currencySymbol="$" // Hardcoded for profile scale unless multi-currency is expanded here
      />
    );
  }

  // text, email, tel, number
  return (
    <input
      type={config.type}
      className="form-control"
      value={value}
      onChange={handleChange}
      placeholder={config.placeholder}
      min={config.min}
      max={config.max}
      step={config.step}
      {...commonProps}
    />
  );
};

export default React.memo(EditableField);
