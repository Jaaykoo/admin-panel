'use client';

import type React from 'react';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const router = useRouter();
    resolver: zodResolver(forgotPasswordSchema),
  });
  const [email, setEmail] = useState('');

  const mutation = useMutation(
    [QUERIES.RESET_PASSWORD],
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Mot de passe oublié ?</h1>
            <p className="mt-2 text-sm text-gray-600">
              Entrez votre email pour réinitialiser votre mot de passe
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
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1.5 h-12 border-gray-300 bg-white"
              required
          </div>

          <Button
          <Button type="submit" className="h-12 w-full bg-[#009ef7] text-base font-medium hover:bg-[#0077b6]">
            Continuer
            <ArrowRight className="ml-2 h-5 w-5" />
          >
            {mutation.isLoading ? 'Envoi en cours...' : 'Continuer'}
            {!mutation.isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
          </Button>

          <div className="text-center">
            <Link href="/auth/login" className="text-sm font-medium text-[#009ef7] hover:underline">
              Retour à la connexion
            </Link>
          </div>
  );
      </div>
    </div>
              Entrez votre email pour réinitialiser votre mot de passe
}
