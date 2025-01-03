import Sidebar from "@/components/user-dashboard/Sidebar";
import Footer from "@/components/user-dashboard/Footer";
import ProtectedLayout from "@/components/layouts/protected";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout allowedRoles={["USER"]}>
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