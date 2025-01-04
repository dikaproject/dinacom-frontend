import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Shop from '@/components/section/pregnashop/Shop';
import PageWrapper from '@/components/PageWrapper';

export default function pregnashop() {
  return (
    <PageWrapper>
    <main className="min-h-screen">
      <Navbar />
      <Shop />
      <Footer />
    </main>
  </PageWrapper>
  );
}