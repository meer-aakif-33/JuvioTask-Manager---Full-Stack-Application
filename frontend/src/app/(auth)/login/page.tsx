// frontend/src/app/(auth)/login/page.tsx

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LogIn } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 sm:p-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center w-14 h-14 bg-primary-600 rounded-full mb-4">
            <LogIn className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome Back
          </h1>
          <p className="text-gray-600 mt-2">
            Sign in to continue to your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            disabled={isLoading}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            disabled={isLoading}
            {...register('password')}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Sign In
          </Button>
        </form>

        <p className="text-xs text-center text-gray-400 mt-4">
          Secure login with encrypted credentials
        </p>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-primary-600 hover:text-primary-700"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
