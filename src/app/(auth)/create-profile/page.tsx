import CreateProfileForm from "@/components/forms/create-profile-form";
import ProtectedLayout from "@/components/layouts/protected";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CreateProfilePage() {
  return (
    <ProtectedLayout allowedRoles={["USER"]}>
        <Navbar />
      <CreateProfileForm />
        <Footer /> 
    </ProtectedLayout>
  );
}