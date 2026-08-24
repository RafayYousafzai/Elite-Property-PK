import { ReactNode } from "react";
import SessionProviderComp from "@/components/nextauth/SessionProvider";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SessionProviderComp session={undefined}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {children}
      </div>
    </SessionProviderComp>
  );
}
