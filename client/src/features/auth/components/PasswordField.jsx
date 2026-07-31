import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordField = forwardRef(({ 
  label = 'Password', 
  id, 
  error, 
  required,
  forgotPasswordLink,
  ...rest 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const errorId = `${id}-error`;

  return (
    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
      <label htmlFor={id} className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>
          {label} {required && <span aria-hidden="true" style={{ color: '#ef4444' }}>*</span>}
        </span>
        {forgotPasswordLink && (
          <a href={forgotPasswordLink} style={{ color: 'var(--primary-cyan)', textDecoration: 'none', fontSize: '0.85rem' }}>
            Forgot?
          </a>
        )}
      </label>
      
      <div style={{ position: 'relative' }}>
        <input
          ref={ref}
          id={id}
          type={showPassword ? 'text' : 'password'}
          className="form-control"
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          required={required}
          style={{
            borderColor: error ? '#ef4444' : undefined,
            paddingRight: '2.5rem' // make room for the toggle icon
          }}
          {...rest}
        />
        
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      
      {error && (
        <div id={errorId} style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          {error.message}
        </div>
      )}
    </div>
  );
});

PasswordField.displayName = 'PasswordField';

export default PasswordField;
