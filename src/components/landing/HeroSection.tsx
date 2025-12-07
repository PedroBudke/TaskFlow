// src/components/landing/HeroSection.tsx
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="py-16 md:py-24 hero-section-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold hero-text-primary tracking-tight">
          Gerencie suas tarefas com{' '}
          <span className="hero-text-highlight font-extrabold">fluidez</span>
        </h1>
        <p className="mt-6 text-xl hero-text-secondary max-w-3xl mx-auto">
          TaskFlow é uma ferramenta simples, rápida e sempre sincronizada para você organizar seu dia com foco e clareza.
        </p>
        <div className="mt-10">
          <Link
            href="/login"
            className="inline-block px-8 py-3 hero-button font-semibold rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
            aria-label="Comece a usar o TaskFlow agora"
          >
            Comece agora
          </Link>
        </div>
      </div>
    </section>
  );
}