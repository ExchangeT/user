import { Sidebar, MobileSidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--canvas)]">
      <Sidebar />
      <MobileSidebar />
      <div className="lg:ml-sidebar">
        <Header />
        <main className="p-4 lg:p-6 max-w-[1600px]">
          {children}
        </main>
      </div>
    </div>
  );
}
