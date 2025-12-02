'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';

function EmailSentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || 'votre email';

  const handleResend = () => {
    console.warn('[v0] Resending email to:', email);
    // Handle resend logic
  };

  const handleSkip = () => {
    // Navigate to OTP verification
    router.push('/auth/forgot-password/verify-otp');
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

        {/* Content */}
        <div className="space-y-6 text-center">
          {/* Illustration */}
          <div className="mb-8 flex justify-center">
            <div className="relative h-48 w-48">
              <svg viewBox="0 0 200 150" className="h-full w-full">
                {/* Person 1 with letter */}
                <ellipse cx="60" cy="120" rx="15" ry="5" fill="#e5e7eb" opacity="0.5" />
                <path
                  d="M 45 90 Q 45 70 60 70 Q 75 70 75 90 L 75 110 Q 75 120 60 120 Q 45 120 45 110 Z"
                  fill="none"
                  stroke="#000"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="60" cy="60" r="12" fill="none" stroke="#000" strokeWidth="2" />
                <path d="M 55 58 Q 60 62 65 58" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />

                {/* Yellow envelope */}
                <rect x="35" y="85" width="20" height="15" fill="#ffc700" stroke="#000" strokeWidth="1.5" rx="2" />
                <path d="M 35 85 L 45 92 L 55 85" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />

                {/* Person 2 */}
                <ellipse cx="140" cy="120" rx="15" ry="5" fill="#e5e7eb" opacity="0.5" />
                <path
                  d="M 125 90 Q 125 70 140 70 Q 155 70 155 90 L 155 110 Q 155 120 140 120 Q 125 120 125 110 Z"
                  fill="none"
                  stroke="#000"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="140" cy="60" r="12" fill="none" stroke="#000" strokeWidth="2" />
                <path d="M 135 58 Q 140 55 145 58" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />
                <circle cx="137" cy="57" r="1.5" fill="#000" />
                <circle cx="143" cy="57" r="1.5" fill="#000" />

                {/* Decorative elements */}
                <circle cx="100" cy="30" r="2" fill="#e5e7eb" />
                <path d="M 70 25 L 75 20" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="mb-4 text-2xl font-bold text-gray-900">Vérifiez votre email</h1>
            <p className="mb-2 text-sm text-gray-600">
              Veuillez cliquer sur le lien envoyé à votre email
              {' '}
              <span className="font-semibold text-gray-900">{email}</span>
            </p>
            <p className="mb-8 text-sm text-gray-600">pour réinitialiser votre mot de passe. Merci</p>
          </div>

          <Button
            onClick={handleSkip}
            className="h-12 w-full bg-[#009ef7] text-base font-medium hover:bg-[#0077b6]"
          >
            Passer pour le moment
          </Button>

          <div>
            <button type="button" onClick={handleResend} className="text-sm text-gray-600 hover:text-gray-900">
              Vous n'avez pas reçu l'email ?
              {' '}
              <span className="font-semibold text-[#009ef7] hover:underline">Renvoyer</span>
            </button>
          </div>

          <div className="text-center">
            <Link href="/auth/login" className="text-sm font-medium text-[#009ef7] hover:underline">
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmailSentPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <EmailSentContent />
    </Suspense>
  );
}
