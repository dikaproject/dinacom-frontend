import Sidebar from "@/components/doctor-dashboard/Sidebar";
import Footer from "@/components/doctor-dashboard/Footer";
import ProtectedLayout from "@/components/layouts/protected";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout allowedRoles={["DOCTOR"]}>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-auto">
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </ProtectedLayout>
  );
}