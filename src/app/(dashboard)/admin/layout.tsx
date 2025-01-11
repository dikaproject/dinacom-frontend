import Sidebar from "@/components/admin-dashboard/Sidebar";
import Footer from "@/components/admin-dashboard/Footer"
import ProtectedLayout from "@/components/layouts/protected";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout allowedRoles={["ADMIN"]}>
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