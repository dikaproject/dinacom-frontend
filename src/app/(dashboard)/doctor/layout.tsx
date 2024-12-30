import ProtectedLayout from "@/components/layouts/protected";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout allowedRoles={["DOCTOR"]}>{children}</ProtectedLayout>;
}