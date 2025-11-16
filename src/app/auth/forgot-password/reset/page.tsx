'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { clearResetEmail } from '@/helpers/crud-helper/AuthHelpers';
import { QUERIES } from '@/helpers/crud-helper/consts';
import { get400ErrorMessage } from '@/helpers/errorMessage';
import { resetPasswordWithCode } from '@/services/AuthService';

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/\d/, 'Le mot de passe doit contenir au moins un chiffre')
    .regex(/[^A-Z0-9]/i, 'Le mot de passe doit contenir au moins un caractère spécial'),
  confirmPassword: z.string().min(1, 'Veuillez confirmer le mot de passe'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    // Vérifier que le code OTP a été vérifié
    const verifiedCode = sessionStorage.getItem('verified_otp_code');
    if (!verifiedCode) {
      toast.error('Code non vérifié', {
        description: 'Veuillez d\'abord vérifier votre code OTP.',
      });
      router.push('/auth/forgot-password/verify-otp');
      return;
    }
    setCode(verifiedCode);
  }, [router]);

  const mutation = useMutation(
    [QUERIES.RESET_PASSWORD_WITH_CODE],
    async (data: ResetPasswordForm) => {
      if (!code) {
        throw new Error('Code non trouvé');
      }
      await resetPasswordWithCode(code, data.password);
    },
    {
      onSuccess: () => {
        // Nettoyer toutes les données stockées
        sessionStorage.removeItem('verified_otp_code');
        clearResetEmail();

        toast.success('Mot de passe réinitialisé !', {
          description: 'Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.',
          duration: 5000,
        });

        // Rediriger vers la page de login
        router.push('/auth/login');
      },
      onError: (error) => {
        get400ErrorMessage(error);
      },
    },
  );

  const onSubmit = (data: ResetPasswordForm) => {
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
            <h1 className="text-2xl font-bold text-gray-900">Réinitialiser le mot de passe</h1>
            <p className="mt-2 text-sm text-gray-600">Entrez votre nouveau mot de passe</p>
          </div>

          <div>
            <Label htmlFor="new-password" className="text-sm font-medium text-gray-900">
              Nouveau mot de passe
            </Label>
            <div className="relative mt-1.5">
              <Input
                id="new-password"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Entrez un nouveau mot de passe"
                className="h-12 border-gray-300 bg-white pr-10"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>

          <div>
            <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-900">
              Confirmer le nouveau mot de passe
            </Label>
            <div className="relative mt-1.5">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Saisissez à nouveau le mot de passe"
                className="h-12 border-gray-300 bg-white pr-10"
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
          </div>

          {/* Exigences du mot de passe */}
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="mb-2 text-sm font-medium text-gray-900">Le mot de passe doit contenir :</p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Au moins 8 caractères</li>
              <li>• Au moins une lettre majuscule</li>
              <li>• Au moins une lettre minuscule</li>
              <li>• Au moins un chiffre</li>
              <li>• Au moins un caractère spécial (!@#$%^&*)</li>
            </ul>
          </div>

          <Button
            type="submit"
            disabled={mutation.isLoading}
            className="h-12 w-full bg-[#009ef7] text-base font-medium hover:bg-[#0077b6]"
          >
            {mutation.isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
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
