import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageWrapper from '@/components/PageWrapper';
import Cart from '@/components/section/cart/Cart';

export default function cart() {
  return (
    <PageWrapper>
      <main className="min-h-screen">
        <Navbar />
        <Cart />
        <Footer />
      </main>
    </PageWrapper>
  );
}