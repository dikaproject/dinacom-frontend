import ProtectedLayout from '@/components/layouts/protected';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout allowedRoles={['ADMIN']}>
      {children}
    </ProtectedLayout>
  );
}