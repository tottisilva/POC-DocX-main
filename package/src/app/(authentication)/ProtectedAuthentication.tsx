'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedAuthentication = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Redirect to login if not authenticated
    } else if (session && session.user.role !== "Manager") {
      router.push("/unauthorized"); // Redirect to unauthorized page if not an admin
    }
  }, [status, session, router]);

  return <>{children}</>;
};

export default ProtectedAuthentication;
