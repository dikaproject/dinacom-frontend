import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Pregnaai from '@/components/section/pregnaai/Pregna';
import PageWrapper from '@/components/PageWrapper';


export default function pregna() {
  return (
    <PageWrapper>
    <main className="min-h-screen">
      <Navbar />
    <Pregnaai />
      <Footer />
    </main>
  </PageWrapper>
  );
}