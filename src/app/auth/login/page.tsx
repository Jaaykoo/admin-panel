'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QUERIES } from '@/helpers/crud-helper/Consts';
import { get400ErrorMessage } from '@/helpers/ErrorMessageHelper';
import { login } from '@/services/AuthService';

const loginInputSchema = z.object({
  email: z.email().min(1, 'Required'),
  password: z.string().min(5, 'Required'),
});

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginInputSchema),
  });
  const mutation = useMutation(
    [QUERIES.LOGIN],
    async (data: z.infer<typeof loginInputSchema>) => {
      // Call your login API here
      await login(data.email, data.password);
    },
    {
      onSuccess: () => {
        // Handle successful login
        toast.success('Connexion réussie !');
        router.push('/');
      },
      onError: (error) => {
        // Handle login error
        get400ErrorMessage(error);
      },
    },
  );
  const onSubmit = (data: z.infer<typeof loginInputSchema>) => {
    // Handle login logic here
    mutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="relative h-40 w-80">
            <Image
              src="/Logo.svg"
              alt="Logo"
              fill
              className="object-contain"
              style={{
                filter: 'brightness(0) saturate(100%) invert(45%) sepia(97%) saturate(2439%) hue-rotate(178deg) brightness(98%) contrast(101%)',
              }}
              priority
            />
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-900">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="email@exemple.com"
              className="mt-1.5 h-12 border-gray-300 bg-white"
              required
              {...register('email')}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-gray-900">
                Mot de passe
              </Label>
              <Link href="/auth/forgot-password" className="text-sm font-medium text-[#009ef7] hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>
            <div className="relative mt-1.5">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Entrez votre mot de passe"
                className="h-12 border-gray-300 bg-white pr-10"
                required
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>
          </div>
          <Button type="submit" className="h-12 w-full bg-[#009ef7] text-base font-medium hover:bg-[#0077b6]">
            Se connecter
          </Button>
        </form>
      </div>
    </div>
  );
}
