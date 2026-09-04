import Navbar from '@/components/Navbar';
import AuthGuard from '@/components/auth/AuthGuard';

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <AuthGuard>
      <div className="min-h-screen">
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      </div>
    </AuthGuard>
  );
};

export default DashboardLayout;
