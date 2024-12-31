import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Konsultasi from '@/components/section/konsultasi/Konsultasi';


export default function konsultasi() {
  return (
    <main className="min-h-screen">
      <Navbar />
    <Konsultasi />
      <Footer />
    </main>
  );
}