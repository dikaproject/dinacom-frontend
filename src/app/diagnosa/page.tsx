import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Diagnosa from '@/components/section/home/diagnosa/Diagnosa';

export default function diagnosa() {
  return (
    <main className="min-h-screen">
      <Navbar />
       <Diagnosa />
      <Footer />
    </main>
  );
}