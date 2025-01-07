import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoginForm from '@/components/forms/login-form';
import PageWrapper from '@/components/PageWrapper';


export default function Login() {
  return (
    <PageWrapper>
    <main className="min-h-screen">
      <Navbar />
      <LoginForm />
      <Footer />
    </main>
  </PageWrapper>
  );
}