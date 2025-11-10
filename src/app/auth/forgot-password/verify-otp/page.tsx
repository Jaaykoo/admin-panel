'use client';

import type React from 'react';

import { useMutation } from '@tanstack/react-query';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getResetEmail } from '@/helpers/crud-helper/AuthHelpers';
import { QUERIES } from '@/helpers/crud-helper/consts';
import { get400ErrorMessage } from '@/helpers/errorMessage';
import { getNewPasswordResetCode, verifyTwoFactorCode } from '@/services/authService';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [email, setEmail] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Récupérer l'email depuis localStorage
    const storedEmail = getResetEmail();
    if (!storedEmail) {
      toast.error('Session expirée', {
        description: 'Veuillez recommencer le processus de réinitialisation.',
      });
      router.push('/auth/forgot-password');
      return;
    }

    // Définir l'email de manière asynchrone pour éviter les cascading renders
    setTimeout(() => setEmail(storedEmail), 0);

    // Timer pour le countdown
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);
  const verifyMutation = useMutation(
    [QUERIES.VERIFY_OTP],
    async (code: string) => {
      await verifyTwoFactorCode(code);
      return code;
    },
    {
      onSuccess: (code) => {
        // Stocker le code vérifié dans sessionStorage pour la page de reset
        sessionStorage.setItem('verified_otp_code', code);
        toast.success('Code vérifié !', {
          description: 'Vous pouvez maintenant définir un nouveau mot de passe.',
        });
        router.push('/auth/forgot-password/reset');
      },
      onError: (error) => {
        // Réinitialiser les champs OTP en cas d'erreur
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        get400ErrorMessage(error);
      },
    },
  );

  const resendMutation = useMutation(
    async () => {
      if (!email) {
        throw new Error('Email non trouvé');
      }
      await getNewPasswordResetCode(email);
    },
    {
      onSuccess: () => {
        toast.success('Code renvoyé !', {
          description: 'Un nouveau code a été envoyé à votre email.',
        });
        setCountdown(300);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      },
      onError: (error) => {
        get400ErrorMessage(error);
      },
    },
  );

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      return;
    }

    // Accepter seulement les chiffres
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    // Vérifier que ce sont seulement des chiffres
    if (!/^\d+$/.test(pastedData)) {
      toast.error('Code invalide', {
        description: 'Le code doit contenir uniquement des chiffres.',
      });
      return;
    }

    const digits = pastedData.slice(0, 6).split('');
    const newOtp = [...otp];

    digits.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit;
      }
    });

    setOtp(newOtp);

    // Focus sur le dernier champ rempli ou le premier vide
    const nextEmptyIndex = newOtp.findIndex(val => !val);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      toast.error('Code incomplet', {
        description: 'Veuillez saisir les 6 chiffres du code.',
      });
      return;
    }

    verifyMutation.mutate(otpCode);
  };

  const handleResend = () => {
    if (countdown > 0) {
      return;
    }
    resendMutation.mutate();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, (_, start, middle, end) =>
        start + '*'.repeat(Math.min(middle.length, 4)) + end)
    : '';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md">
        {/* Content */}
        <div className="space-y-6">
          {/* Email Icon */}
          <div className="mb-8 flex justify-center">
            <div className="rounded-2xl bg-blue-50 p-6">
              <Mail className="h-20 w-20 text-[#009ef7]" />
            </div>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-2xl font-bold text-gray-900">Vérifiez votre email</h1>
            <p className="text-sm text-gray-600">Entrez le code de vérification que nous avons envoyé à</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{maskedEmail}</p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <Input
                  key={`otp-${index}`}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  disabled={verifyMutation.isLoading}
                  className="h-14 w-14 border-gray-300 bg-white text-center text-lg font-semibold"
                />
              ))}
            </div>

            <div className="text-center text-sm text-gray-600">
              {countdown > 0
                ? (
                    <>
                      Le code expire dans
                      {' '}
                      <span className="font-semibold text-gray-900">{formatTime(countdown)}</span>
                    </>
                  )
                : (
                    <span className="text-red-600">Code expiré</span>
                  )}
            </div>

            <div className="text-center text-sm text-gray-600">
              Vous n'avez pas reçu de code ?
              {' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0 || resendMutation.isLoading}
                className="font-semibold text-[#009ef7] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                {resendMutation.isLoading ? 'Envoi...' : 'Renvoyer'}
              </button>
            </div>

            <Button
              type="submit"
              disabled={verifyMutation.isLoading || otp.join('').length !== 6}
              className="h-12 w-full bg-[#009ef7] text-base font-medium hover:bg-[#0077b6]"
            >
              {verifyMutation.isLoading ? 'Vérification...' : 'Vérifier le code'}
            </Button>

            <div className="text-center">
              <Link href="/auth/login" className="text-sm font-medium text-[#009ef7] hover:underline">
                Retour à la connexion
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
