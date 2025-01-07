import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Konsultasi from '@/components/section/konsultasi/Konsultasi';
import PageWrapper from '@/components/PageWrapper';


export default function konsultasi() {
  return (
    <PageWrapper>
    <main className="min-h-screen">
      <Navbar />
    <Konsultasi />
      <Footer />
    </main>
  </PageWrapper>
  );
}