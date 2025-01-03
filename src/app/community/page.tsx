import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Community from '@/components/section/community/Community';


export default function community() {
  return (
    <main className="min-h-screen">
      <Navbar />
        <Community />
      <Footer />
    </main>
  );
}