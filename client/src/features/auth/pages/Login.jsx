import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { loginSchema } from '../validation/authSchemas';
import { mapBackendErrorsToForm } from '../validation/errorMapper';
import { ROUTES } from '../../../constants/routes';

import AuthLayout from '../components/AuthLayout';
import AuthForm from '../components/AuthForm';
import FormField from '../components/FormField';
import PasswordField from '../components/PasswordField';

const Login = () => {
  const { login } = useAuth();
  const [globalError, setGlobalError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setGlobalError(null);
    try {
      await login(data);
      // Navigation is handled by GuestRoute automatically when isAuthenticated changes
    } catch (error) {
      const formError = mapBackendErrorsToForm(error, setError);
      if (formError) {
        setGlobalError(formError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout navActionText="Sign Up" navActionRoute={ROUTES.REGISTER}>
      <AuthForm
        title="Welcome Back"
        subtitle="Log in to your account"
        onSubmit={handleSubmit(onSubmit)}
        submitText="Log In"
        isLoading={isLoading}
        globalError={globalError}
        footerText="Don't have an account?"
        footerLinkText="Sign up"
        footerLinkRoute={ROUTES.REGISTER}
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
        
        <PasswordField
          label="Password"
          id="password"
          placeholder="••••••••"
          required
          autoComplete="current-password"
          forgotPasswordLink={ROUTES.FORGOT_PASSWORD}
          error={errors.password}
          {...register('password')}
        />
      </AuthForm>
    </AuthLayout>
  );
};

export default Login;
