"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingComponent from "../(DashboardLayout)/layout/loading/Loading";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
  if (status === "unauthenticated") {
    router.push("/login"); // Redirect to login if not authenticated
  }
  }, [status, router]);

  if (status === "loading") {
    return <LoadingComponent />
  }

  return <>{children}</>;
};

export default ProtectedRoute;
