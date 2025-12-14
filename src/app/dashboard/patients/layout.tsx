"use client";

import { SidebarProvider } from "@/components/SidebarProvider";
import PSidebar from "@/components/Dashboard/PSidebar";
import { useSidebar } from "@/components/SidebarProvider";
import { useUser, useClerk } from "@clerk/nextjs";
import "../../globals.css";
import { Bell, LogOut } from "lucide-react";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SidebarWrapper>{children}</SidebarWrapper>
    </SidebarProvider>
  );
}

function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const { expanded, setExpanded, menuOpen, setMenuOpen  } = useSidebar();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const userName = isLoaded && user ? user.firstName || user.emailAddresses[0].emailAddress : "Patient";
  const userEmail = isLoaded && user ? user.emailAddresses[0].emailAddress : "email@example.com";

  return (
    <div>
      <section className="fixed top-0 left-0 right-0 z-50 flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 lg:px-8 py-3 gap-4 sm:gap-0 bg-white shadow-md">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center w-full sm:w-auto">
          <Image src="/logo 2.png" alt="Logo" width={70} height={24} className="w-auto h-auto" />
          <div className="grid gap-1">
            <h4 className="text-sm sm:text-lg font-semibold">Bienvenue {userName}</h4>
            <span className="text-gray-500 text-xs sm:text-sm">
              Merci de revenir vérifier
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <Bell strokeWidth={1.3} size={20} className="sm:size-auto" />
          <div className="flex items-center gap-2">
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-amber-200 rounded-md flex-shrink-0"></div>
            <div className="hidden sm:grid">
              <h5 className="font-semibold text-sm">{userName}</h5>
              <span className="text-gray-500 text-xs">
                {userEmail}
              </span>
            </div>
            <button 
              onClick={() => signOut()}
              className="ml-2 p-1 sm:p-2 hover:bg-gray-100 rounded-md transition-colors flex-shrink-0"
              title="Déconnexion"
            >
              <LogOut size={18} strokeWidth={1.3} className="text-red-600 sm:size-5" />
            </button>
          </div>
        </div>
      </section>
      <PSidebar expanded={expanded} setExpanded={setExpanded} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main className={`mt-24 sm:mt-20 ${expanded ? "main-expanded" : "main-collapsed"} px-4 sm:px-6 lg:px-8`}>{children}</main>
    </div>
  );
}
