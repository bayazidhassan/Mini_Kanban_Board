import Navbar from '@/components/Navbar';

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
