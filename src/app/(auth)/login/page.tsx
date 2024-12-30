import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoginForm from '@/components/forms/login-form';

export default function Login() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <LoginForm />
      <Footer />
    </main>
  );
}