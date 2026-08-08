import AdminHeader from "./components/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Admin Header */}
      <AdminHeader />

      {/* Admin Page Content */}
      {children}
    </>
  );
}