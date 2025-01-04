import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Shop from '@/components/section/pregnashop/ProductDetail';


export default function pregnashop() {
  return (
    <main className="min-h-screen">
      <Navbar />
    <Shop />
      <Footer />
    </main>
  );
}