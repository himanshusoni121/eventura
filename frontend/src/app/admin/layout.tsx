/**
 * Admin layout — wraps all /admin/* pages.
 * Does NOT include the public Navbar, Footer, or Preloader.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eventura Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
