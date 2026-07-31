import React, { forwardRef } from 'react';

const FormField = forwardRef(({ 
  label, 
  id, 
  error, 
  helperText, 
  required, 
  type = 'text', 
  ...rest 
}, ref) => {
  
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;
  
  let ariaDescribedBy = undefined;
  if (error) ariaDescribedBy = errorId;
  else if (helperText) ariaDescribedBy = helperId;

  return (
    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
      <label htmlFor={id} className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>
          {label} {required && <span aria-hidden="true" style={{ color: '#ef4444' }}>*</span>}
        </span>
      </label>
      
      <input
        ref={ref}
        id={id}
        type={type}
        className="form-control"
        aria-invalid={!!error}
        aria-describedby={ariaDescribedBy}
        required={required}
        style={{
          borderColor: error ? '#ef4444' : undefined,
        }}
        {...rest}
      />
      
      {error && (
        <div id={errorId} style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          {error.message}
        </div>
      )}
      
      {!error && helperText && (
        <div id={helperId} style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          {helperText}
        </div>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

export default FormField;
