'use client';

import type React from 'react';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(37);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    console.log('[v0] OTP submitted:', otpCode);
    // Navigate to reset password page
    router.push('/auth/forgot-password/reset');
  };

  const handleResend = () => {
    console.log('[v0] Resending OTP');
    setCountdown(37);
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white px-8 py-12 shadow-sm">
          {/* Phone Icon */}
          <div className="mb-8 flex justify-center">
            <div className="rounded-2xl bg-blue-50 p-6">
              <svg className="h-20 w-20 text-blue-200" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" strokeWidth="2" />
                <line x1="12" y1="18" x2="12" y2="18" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-2xl font-bold text-gray-900">Vérifiez votre téléphone</h1>
            <p className="text-sm text-gray-600">Entrez le code de vérification que nous avons envoyé à</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">****** 7859</p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  className="h-14 w-14 border-gray-300 text-center text-lg font-semibold"
                />
              ))}
            </div>

            <div className="text-center text-sm text-gray-600">
              Vous n'avez pas reçu de code ? (
              {countdown}
              s)
              {' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0}
                className="font-semibold text-[#009ef7] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                Renvoyer
              </button>
            </div>

            <Button type="submit" className="h-12 w-full bg-[#009ef7] text-base font-medium hover:bg-[#0077b6]">
              Continuer
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
