import { Search } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-2xl text-center">
        {/* Illustration */}
        <div className="mb-8 flex justify-center">
          <div className="relative h-64 w-64">
            <svg viewBox="0 0 200 200" className="h-full w-full">
              {/* Person looking through door */}
              <ellipse cx="100" cy="180" rx="25" ry="8" fill="#e5e7eb" opacity="0.5" />

              {/* Door frame */}
              <rect x="60" y="80" width="4" height="100" fill="#6b7280" />
              <rect x="60" y="80" width="80" height="4" fill="#6b7280" />

              {/* Person */}
              <path
                d="M 80 140 Q 80 120 95 120 Q 110 120 110 140 L 110 170 Q 110 180 95 180 Q 80 180 80 170 Z"
                fill="none"
                stroke="#000"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="95" cy="110" r="15" fill="none" stroke="#000" strokeWidth="2.5" />
              <path d="M 88 108 Q 95 105 102 108" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />
              <circle cx="90" cy="107" r="2" fill="#000" />
              <circle cx="100" cy="107" r="2" fill="#000" />

              {/* 404 lightbulb */}
              <circle cx="150" cy="60" r="25" fill="#ffc700" opacity="0.3" />
              <circle cx="150" cy="60" r="18" fill="#ffc700" />
              <text x="150" y="70" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#fff">
                404
              </text>
              <rect x="145" y="78" width="10" height="8" fill="#ffc700" />
              <path d="M 140 86 L 145 78 L 155 78 L 160 86 Z" fill="#ffc700" />

              {/* Light rays */}
              <path d="M 150 35 L 150 25" stroke="#ffc700" strokeWidth="3" strokeLinecap="round" />
              <path d="M 175 60 L 185 60" stroke="#ffc700" strokeWidth="3" strokeLinecap="round" />
              <path d="M 168 42 L 175 35" stroke="#ffc700" strokeWidth="3" strokeLinecap="round" />
              <path d="M 168 78 L 175 85" stroke="#ffc700" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <div className="mb-4 inline-block rounded-lg bg-blue-50 px-4 py-2">
            <span className="text-sm font-semibold text-[#009ef7]">404 Error</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900">We have lost this page</h1>
          <p className="text-gray-600">
            The requested page is missing. Check the URL or
            {' '}
            <Link href="/" className="font-medium text-[#009ef7] hover:underline">
              Return Home
            </Link>
            .
          </p>
        </div>

        {/* Search */}
        <div className="mx-auto max-w-md">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input type="search" placeholder="Search Metronic" className="h-12 border-gray-300 pl-10" />
          </div>
        </div>
      </div>
    </div>
  );
}
