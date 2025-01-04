import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Diagnosa from '@/components/section/diagnosa/Diagnosa';
import PageWrapper from '@/components/PageWrapper';


export default function diagnosa() {
  return (
    <PageWrapper>
    <main className="min-h-screen">
      <Navbar />
       <Diagnosa />
      <Footer />
    </main>
  </PageWrapper>
  );
}