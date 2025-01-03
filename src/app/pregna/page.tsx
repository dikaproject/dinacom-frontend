import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Pregnaai from '@/components/section/pregnaai/Pregna';


export default function pregna() {
  return (
    <main className="min-h-screen">
      <Navbar />
    <Pregnaai />
      <Footer />
    </main>
  );
}