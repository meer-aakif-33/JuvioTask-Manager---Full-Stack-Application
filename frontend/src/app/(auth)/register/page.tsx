// frontend/src/app/(auth)/register/page.tsx

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UserPlus } from 'lucide-react';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain uppercase letter')
      .regex(/[a-z]/, 'Must contain lowercase letter')
      .regex(/[0-9]/, 'Must contain number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await registerUser(data.email, data.password, data.name);
    } finally {
      setIsLoading(false);
    }
  };

  return (
<div className="min-h-screen flex items-start sm:items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4 sm:px-6 py-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6 sm:p-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center w-12 h-12 bg-primary-600 rounded-full mb-4">
            <UserPlus className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900">
            Create Account
          </h1>
          <p className="text-gray-600 mt-2">
            Start managing your tasks efficiently
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            error={errors.name?.message}
            disabled={isLoading}
            {...register('name')}
          />

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
          <p className="text-xs text-gray-500">
            Must contain 8+ chars, uppercase, lowercase & number
          </p>

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            disabled={isLoading}
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Sign Up
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-primary-600 hover:text-primary-700"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
