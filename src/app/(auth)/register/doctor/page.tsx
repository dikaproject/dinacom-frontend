import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DoctorRegisterForm from '@/components/forms/doctor-register-form';
import PageWrapper from '@/components/PageWrapper';

export default function DoctorRegister() {
  return (
    <PageWrapper>
      <main className="min-h-screen">
        <Navbar />
        <DoctorRegisterForm />
        <Footer />
      </main>
    </PageWrapper>
  );
}