import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductDetail from '@/components/section/pregnashop/ProductDetail';
import PageWrapper from '@/components/PageWrapper';

export default function ProductDetailPage() {
  return (
    <PageWrapper>
      <main className="min-h-screen">
        <Navbar />
        <ProductDetail />
        <Footer />
      </main>
    </PageWrapper>
  );
}