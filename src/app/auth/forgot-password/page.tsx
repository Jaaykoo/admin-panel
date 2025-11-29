'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { setResetEmail } from '@/helpers/crud-helper/AuthHelpers';
import { QUERIES } from '@/helpers/crud-helper/Consts';
import { get400ErrorMessage } from '@/helpers/ErrorMessageHelper';
import { resetPassword } from '@/services/AuthService';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide').min(1, 'Email requis'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const mutation = useMutation(
    [QUERIES.RESET_PASSWORD],
    async (data: ForgotPasswordForm) => {
      await resetPassword(data.email);
      return data.email;
    },
    {
      onSuccess: (email) => {
        // Stocker l'email dans localStorage pour 15 minutes
        setResetEmail(email);
        toast.success('Email envoyé !', {
          description: 'Vérifiez votre boîte de réception pour le code de vérification.',
        });
        // Rediriger vers la page de vérification OTP
        router.push('/auth/forgot-password/verify-otp');
      },
      onError: (error) => {
        get400ErrorMessage(error);
      },
    },
  );

  const onSubmit = (data: ForgotPasswordForm) => {
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

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Mot de passe oublié ?</h1>
            <p className="mt-2 text-sm text-gray-600">
              Entrez votre email pour recevoir un code de vérification
            </p>
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-900">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="email@exemple.com"
              className="mt-1.5 h-12 border-gray-300 bg-white"
              {...register('email')}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={mutation.isLoading}
            className="h-12 w-full bg-[#009ef7] text-base font-medium hover:bg-[#0077b6]"
          >
            {mutation.isLoading ? 'Envoi en cours...' : 'Continuer'}
            {!mutation.isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
          </Button>

          <div className="text-center">
            <Link href="/auth/login" className="text-sm font-medium text-[#009ef7] hover:underline">
              Retour à la connexion
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
