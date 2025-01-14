import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/section/home/Home-hero';
import Features from '@/components/section/home/Features';
import Workflow from '@/components/section/Workflow';
import Faq from '@/components/section/home/Faq';
import Testimonials from '@/components/section/home/Testimonials';
import PageWrapper from '@/components/PageWrapper';


export default function Home() {
  return (
    <PageWrapper>
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Workflow />
      <Faq />
      <Testimonials />
      <Footer />
    </main>
    </PageWrapper>
  );
}