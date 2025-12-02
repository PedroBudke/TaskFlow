// src/components/layout/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:justify-between md:items-center">
          <div className="mb-6 md:mb-0">
            <div className="text-2xl font-bold text-indigo-400">TaskFlow</div>
            <p className="mt-2 text-gray-400 text-sm">
              Gerenciamento de tarefas feito para fluir com você.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/sobre" className="text-gray-300 hover:text-white">
              Sobre
            </Link>
            <Link href="/contato" className="text-gray-300 hover:text-white">
              Contato
            </Link>
            <Link href="/privacidade" className="text-gray-300 hover:text-white">
              Privacidade
            </Link>
            <Link href="/termos" className="text-gray-300 hover:text-white">
              Termos
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} TaskFlow. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}