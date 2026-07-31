import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from '../services/authApi';
import { forgotPasswordSchema } from '../validation/authSchemas';
import { ROUTES } from '../../../constants/routes';

import AuthLayout from '../components/AuthLayout';
import AuthForm from '../components/AuthForm';
import FormField from '../components/FormField';

const ForgotPassword = () => {
  const [globalError, setGlobalError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setGlobalError(null);
    try {
      await authApi.requestPasswordReset(data.email);
      setIsSuccess(true);
    } catch (error) {
      setGlobalError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout navActionText="Log In" navActionRoute={ROUTES.LOGIN}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(34, 211, 238, 0.1)',
            color: 'var(--primary-cyan)',
            marginBottom: '1.5rem'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Check Your Email</h2>
          <p className="text-secondary" style={{ marginBottom: '2rem' }}>
            We've sent password reset instructions to your email address.
          </p>
          <a href={ROUTES.LOGIN} className="btn btn-primary btn-block" style={{ padding: '1rem', textDecoration: 'none' }}>
            Return to Log In
          </a>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout navActionText="Log In" navActionRoute={ROUTES.LOGIN}>
      <AuthForm
        title="Reset Password"
        subtitle="Enter your email to receive reset instructions"
        onSubmit={handleSubmit(onSubmit)}
        submitText="Send Reset Link"
        isLoading={isLoading}
        globalError={globalError}
        footerText="Remember your password?"
        footerLinkText="Log in"
        footerLinkRoute={ROUTES.LOGIN}
      >
        <FormField
          label="Email Address"
          id="email"
          type="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
          error={errors.email}
          {...register('email')}
        />
      </AuthForm>
    </AuthLayout>
  );
};

export default ForgotPassword;
