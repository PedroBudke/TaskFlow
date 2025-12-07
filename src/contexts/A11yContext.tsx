// src/contexts/A11yContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type A11yTheme = 'default' | 'high-contrast' | 'large-text';

interface A11yContextType {
  theme: A11yTheme;
  toggleTheme: (theme: A11yTheme) => void;
}

const A11yContext = createContext<A11yContextType>({
  theme: 'default',
  toggleTheme: () => {},
});

export function A11yProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<A11yTheme>('default');

  useEffect(() => {
    // Carrega preferência do localStorage
    const saved = localStorage.getItem('a11y-theme') as A11yTheme;
    if (saved) {
      setTheme(saved);
    }
  }, []);

  useEffect(() => {
    // Remove TODAS as classes do body e aplica apenas a do tema atual
    document.body.className = ''; // remove tudo
    document.body.classList.add(`a11y-theme-${theme}`);

    // Garante que o estilo padrão seja restaurado se for "default"
    if (theme === 'default') {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    }

    localStorage.setItem('a11y-theme', theme);
  }, [theme]);

  return (
    <A11yContext.Provider value={{ theme, toggleTheme: setTheme }}>
      {children}
    </A11yContext.Provider>
  );
}

export const useA11y = () => useContext(A11yContext);