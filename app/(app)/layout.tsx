"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { MobileMenu } from "@/components/layout/MobileMenu";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-black">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Menu */}
      <MobileMenu />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <AppHeader />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-950 via-black to-gray-950">
          <div className="py-6 px-6 md:px-6 pt-20 md:pt-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
