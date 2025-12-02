// src/components/landing/HeroSection.tsx
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
          Gerencie suas tarefas com <span className="text-indigo-600">fluidez</span>
        </h1>
        <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
          TaskFlow é uma ferramenta simples, rápida e sempre sincronizada para você organizar seu dia com foco e clareza.
        </p>
        <div className="mt-10">
          <Link
            href="/login"
            className="inline-block px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Comece agora
          </Link>
        </div>
      </div>
    </section>
  );
}