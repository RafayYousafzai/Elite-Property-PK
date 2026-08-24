import { ReactNode } from "react";
import SessionProviderComp from "@/components/nextauth/SessionProvider";

// Sign in/up are the only public-site pages that read useSession(), so the
// next-auth client bundle (~57KB gzip, 80%+ unused everywhere else) is scoped
// here instead of the root layout.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <SessionProviderComp session={undefined}>{children}</SessionProviderComp>;
}
