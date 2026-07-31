import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { registerSchema } from '../validation/authSchemas';
import { mapBackendErrorsToForm } from '../validation/errorMapper';
import { ROUTES } from '../../../constants/routes';

import AuthLayout from '../components/AuthLayout';
import AuthForm from '../components/AuthForm';
import FormField from '../components/FormField';
import PasswordField from '../components/PasswordField';

const Register = () => {
  const { register: registerUser } = useAuth();
  const [globalError, setGlobalError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setGlobalError(null);
    try {
      await registerUser(data);
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
    <AuthLayout navActionText="Log In" navActionRoute={ROUTES.LOGIN}>
      <AuthForm
        title="Create Account"
        subtitle="Start your study abroad journey"
        onSubmit={handleSubmit(onSubmit)}
        submitText="Create Account"
        isLoading={isLoading}
        globalError={globalError}
        footerText="Already have an account?"
        footerLinkText="Log in"
        footerLinkRoute={ROUTES.LOGIN}
      >
        <FormField
          label="Full Name"
          id="name"
          placeholder="John Doe"
          required
          autoComplete="name"
          error={errors.name}
          {...register('name')}
        />

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
          autoComplete="new-password"
          error={errors.password}
          {...register('password')}
        />
      </AuthForm>
    </AuthLayout>
  );
};

export default Register;
