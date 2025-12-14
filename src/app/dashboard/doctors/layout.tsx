"use client";
import { SidebarProvider } from "@/components/SidebarProvider";
import { useSidebar } from "@/components/SidebarProvider";
import Sidebar from "@/components/Dashboard/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SidebarWrapper>{children}</SidebarWrapper>
    </SidebarProvider>
  );
}

function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const { expanded, setExpanded, menuOpen, setMenuOpen } = useSidebar();

  return (
    <div className="">
      <Sidebar expanded={expanded} setExpanded={setExpanded} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main className={`lg:mt-8 px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out overflow-x-hidden ${expanded ? "main-expanded" : "main-collapsed"}
        ${menuOpen ? "" : ""}`}>
        {children}
      </main>
    </div>
  );
}
