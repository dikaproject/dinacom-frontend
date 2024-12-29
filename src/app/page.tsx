import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/section/Home-hero';
import Features from '@/components/section/Features';
import Workflow from '@/components/section/Workflow';
import Faq from '@/components/section/Faq';
import Testimonials from '@/components/section/Testimonials';


export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Workflow />
      <Faq />
      <Testimonials />
      <Footer />
    </main>
  );
}