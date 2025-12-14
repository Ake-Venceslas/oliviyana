"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  CalendarDays,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  MessageCircleMore,
  Wallet,
} from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const sidebarVariants = {
  expanded: { width: 240 }, // e.g. 60px * 4
  collapsed: { width: 64 }, // 16px * 4
};

const navItems = [
  { label: "Accueil", icon: LayoutDashboard, href: "/dashboard/patients" },
  {
    label: "Mes Rendez-vous",
    icon: CalendarDays,
    href: "/dashboard/patients/Appointments",
  },
  {
    label: "Messages",
    icon: MessageCircleMore,
    href: "/dashboard/patients/Messages",
  },
  {
    label: "Mes Dossiers",
    icon: ClipboardList,
    href: "/dashboard/patients/Records",
  },
  { label: "Facturation", icon: Wallet, href: "/dashboard/patients/Billing" },
  {
    label: "Carte de Crédit",
    icon: CreditCard,
    href: "/dashboard/patients/CreditCard",
  },
];

export default function PSidebar({ expanded, setExpanded }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard/patients"
      ? pathname === "/dashboard/patients"
      : pathname.startsWith(href);

  return (
    <div>
      {/* Desktop View */}
      <div className="bg-white">
        <motion.nav
          className="hidden fixed top-[4.5rem] left-0 h-screen bg-white shadow z-30 lg:flex flex-col justify-between hover:cursor-pointer pt-3"
          variants={sidebarVariants}
          animate={expanded ? "expanded" : "collapsed"}
          initial="collapsed"
          transition={{ type: "spring", stiffness: 800, damping: 40 }}
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
        >
          <div className="grid gap-y-[2rem]">
            <ul>
              {navItems.map(({ label, icon: Icon, href }) => (
                <li key={label} className="my-2 pl-1 pr-2">
                  <Link
                    href={href}
                    className={`flex gap-4 py-2 items-center px-4  rounded-lg transition-colors hover:bg-green-300 
                ${expanded ? "justify-start " : "justify-center flex-col"}
                ${
                  isActive(href)
                    ? "bg-green-400 font-bold text-white"
                    : "text-[#000]"
                }`}
                  >
                    <Icon className="w-6 h-6" strokeWidth={1.4} />
                    <span
                      className={`text-base font-medium transition-opacity duration-300 ${
                        expanded ? "opacity-100" : "hidden"
                      }`}
                    >
                      {label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </motion.nav>
      </div>

      {/* Mobile View */}
      <div></div>
    </div>
  );
}
