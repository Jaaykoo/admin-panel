import type { Metadata } from 'next';
import type React from 'react';
import { Inter } from 'next/font/google';
import '@/styles/global.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Jaykoo Admin',
  // description: 'Professional e-commerce dashboard inspired by Metronic 8',
  // generator: 'v0.app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
