import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Community from '@/components/section/community/Community';
import PageWrapper from '@/components/PageWrapper';



export default function community() {
  return (
    <PageWrapper>
    <main className="min-h-screen">
      <Navbar />
        <Community />
      <Footer />
    </main>
  </PageWrapper>
  );
}