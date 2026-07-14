import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import CallbackPopup from "@/components/shared/CallbackPopup";
import { ReactNode } from "react";

interface SiteLayoutProps {
  children: ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <>
      <Header />
      {children}
      <CallbackPopup />
      <Footer />
    </>
  );
}
