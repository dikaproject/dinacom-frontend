import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RegisterForm from '@/components/forms/register-form';

export default function Login() {
  return (
    <main className="min-h-screen">
      <Navbar />
    <RegisterForm />
      <Footer />
    </main>
  );
}