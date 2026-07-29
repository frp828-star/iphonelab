"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminHeader from "./components/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn");

    if (loggedIn !== "true") {
      router.replace("/admin-login");
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl font-semibold">
          Checking Admin Access...
        </p>
      </main>
    );
  }

  return (
    <>
      {/* Admin Header */}
      <AdminHeader />

      {/* Admin Page Content */}
      {children}
    </>
  );
}