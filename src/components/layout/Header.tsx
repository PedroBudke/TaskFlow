// src/components/layout/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useA11y } from '@/contexts/A11yContext';

export default function Header() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { theme, toggleTheme } = useA11y();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.refresh();
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  if (loading) {
    return (
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-indigo-600">TaskFlow</div>
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-indigo-600"
            aria-label="TaskFlow - Página inicial"
          >
            TaskFlow
          </Link>

          {/* Navegação e controles de acessibilidade */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Desktop */}
                <div className="hidden md:flex items-center space-x-4">
                  <span className="text-gray-700 text-sm">
                    Olá, {user.displayName || user.email}
                  </span>

                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-indigo-600 font-medium"
                    aria-label="Ir para o Dashboard"
                  >
                    Dashboard
                  </Link>

                  {/* Controles de acessibilidade */}
                  <div className="flex items-center space-x-2 ml-4" aria-label="Opções de acessibilidade">
                    <button
                      onClick={() => toggleTheme('default')}
                      className={`text-xs px-2 py-1 rounded ${
                        theme === 'default'
                          ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                      aria-label="Tema padrão"
                    >
                      Padrão
                    </button>
                    <button
                      onClick={() => toggleTheme('high-contrast')}
                      className={`text-xs px-2 py-1 rounded ${
                        theme === 'high-contrast'
                          ? 'bg-yellow-400 text-black border border-yellow-600'
                          : 'bg-black text-yellow-300'
                      }`}
                      aria-label="Ativar modo de alto contraste"
                    >
                      Alto Contraste
                    </button>
                    <button
                      onClick={() => toggleTheme('large-text')}
                      className={`text-xs px-2 py-1 rounded ${
                        theme === 'large-text'
                          ? 'bg-blue-200 text-blue-900 border border-blue-400'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                      aria-label="Ativar fonte ampliada"
                    >
                      Fonte +
                    </button>
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="flex items-center text-gray-600 hover:text-red-600 font-medium transition-colors"
                    aria-label="Sair da conta"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sair
                  </button>
                </div>

                {/* Mobile: ícones + controles simplificados (opcional) */}
                <div className="md:hidden flex items-center space-x-3">
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 transition-colors"
                    aria-label="Dashboard"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-600 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                    aria-label="Sair da conta"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Desktop: Login e Cadastro */}
                <div className="hidden md:flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-indigo-600 font-medium"
                    aria-label="Entrar na conta"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/register"
                    className="px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition"
                    aria-label="Criar nova conta"
                  >
                    Cadastrar
                  </Link>
                </div>

                {/* Mobile: Ícone de usuário */}
                <div className="md:hidden">
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 transition-colors"
                    aria-label="Entrar ou cadastrar"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}