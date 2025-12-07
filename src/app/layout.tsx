// src/app/layout.tsx
'use client';

import './globals.css';
import Header from '@/components/layout/Header';
import { Inter } from 'next/font/google';
import { A11yProvider } from '@/contexts/A11yContext';
import VLibras from 'vlibras-nextjs';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <A11yProvider>
          <Header />
          <main>{children}</main>
        </A11yProvider>

        <VLibras forceOnload />
      </body>
    </html>
  );
}