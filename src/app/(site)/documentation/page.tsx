import { Documentation } from "@/components/Documentation/Documentation";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Documentation",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Documentation />
    </>
  );
}
