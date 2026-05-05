"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import AppShell from "@/components/AppShell";
import { Loader2 } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-app)" }}>
        <Loader2 className="pulse" size={48} style={{ color: "var(--accent)" }} />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return <AppShell>{children}</AppShell>;
}
