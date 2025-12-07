// src/app/page.tsx
import Header from '@/components/layout/Header';
import HeroSection from '@/components/landing/HeroSection';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <>
      <main>
        <HeroSection />
      </main>
      <Footer />
    </>
  );
}