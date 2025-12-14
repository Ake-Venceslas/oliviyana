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
      <section className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-[2rem] py-2 bg-white shadow-md">
        <div className="flex gap-x-[4vw] items-center">
          <Image src="/logo 2.png" alt="Logo" width={80} height={27} />
          <div className="grid">
            <h4 className="text-[1.2rem] font-semibold">Bienvenue {userName}</h4>
            <span className="text-gray-500 text-[.9rem]">
              Merci de revenir vérifier
            </span>
          </div>
        </div>

        <div className="flex items-center gap-x-[2rem]">
          <Bell strokeWidth={1.3} />
          <div className="flex items-center gap-x-2">
            <div className="w-[2.5rem] h-[2.5rem] bg-amber-200 rounded-md"></div>
            <div className="grid">
              <h5 className="font-semibold">{userName}</h5>
              <span className="text-gray-500 text-[.9rem]">
                {userEmail}
              </span>
            </div>
            <button 
              onClick={() => signOut()}
              className="ml-4 p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="Déconnexion"
            >
              <LogOut size={20} strokeWidth={1.3} className="text-red-600" />
            </button>
          </div>
        </div>
      </section>
      <PSidebar expanded={expanded} setExpanded={setExpanded} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main className={` mt-[5rem] ${expanded ? "main-expanded" : "main-collapsed"}`}>{children}</main>
    </div>
  );
}
