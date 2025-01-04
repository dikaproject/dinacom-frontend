import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RegisterForm from '@/components/forms/register-form';
import PageWrapper from '@/components/PageWrapper';


export default function Login() {
  return (
    <PageWrapper>
    <main className="min-h-screen">
      <Navbar />
    <RegisterForm />
      <Footer />
    </main>
  </PageWrapper>
  );
}