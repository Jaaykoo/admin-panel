'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[v0] Error occurred:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-2xl text-center">
        {/* Illustration */}
        <div className="mb-8 flex justify-center">
          <div className="relative h-64 w-64">
            <svg viewBox="0 0 200 200" className="h-full w-full">
              {/* Person juggling */}
              <ellipse cx="100" cy="180" rx="25" ry="8" fill="#e5e7eb" opacity="0.5" />

              {/* 500 text */}
              <text x="60" y="80" fontSize="48" fontWeight="bold" fill="#7dd3fc" opacity="0.6">
                5
              </text>
              <text x="90" y="60" fontSize="48" fontWeight="bold" fill="#7dd3fc" opacity="0.8">
                0
              </text>
              <text x="120" y="50" fontSize="48" fontWeight="bold" fill="#7dd3fc" opacity="0.6">
                0
              </text>

              {/* Person */}
              <path
                d="M 85 130 Q 85 110 100 110 Q 115 110 115 130 L 115 170 Q 115 180 100 180 Q 85 180 85 170 Z"
                fill="none"
                stroke="#000"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="100" cy="100" r="15" fill="none" stroke="#000" strokeWidth="2.5" />
              <path d="M 93 98 Q 100 95 107 98" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />
              <circle cx="95" cy="97" r="2" fill="#000" />
              <circle cx="105" cy="97" r="2" fill="#000" />

              {/* Arms juggling */}
              <path d="M 85 120 Q 70 110 65 100" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 115 120 Q 130 115 140 105" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />

              {/* Juggling objects */}
              <circle cx="65" cy="95" r="6" fill="#ffc700" stroke="#000" strokeWidth="1.5" />
              <circle cx="140" cy="100" r="6" fill="#ffc700" stroke="#000" strokeWidth="1.5" />
              <circle cx="100" cy="75" r="6" fill="#ffc700" stroke="#000" strokeWidth="1.5" />

              {/* Decorative elements */}
              <circle cx="50" cy="120" r="2" fill="#e5e7eb" />
              <circle cx="150" cy="130" r="2" fill="#e5e7eb" />
              <path d="M 45 90 L 50 85" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <div className="mb-4 inline-block rounded-lg bg-blue-50 px-4 py-2">
            <span className="text-sm font-semibold text-[#009ef7]">500 Error</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Internal Server Error</h1>
          <p className="text-gray-600">
            Server error occurred. Please try again later or
            {' '}
            <Link href="/contact" className="font-medium text-[#009ef7] hover:underline">
              Contact Us
            </Link>
            {' '}
            for assistance.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={reset}
            variant="outline"
            className="h-12 border-gray-300 bg-transparent px-6 hover:bg-gray-50"
          >
            Try Again
          </Button>
          <Link href="/">
            <Button className="h-12 bg-[#009ef7] px-6 hover:bg-[#0077b6]">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
