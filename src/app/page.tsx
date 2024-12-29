import Navbar from '@/components/Navbar';
import HeroSection from '@/components/Hero-section';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <Footer />
    </main>
  );
}