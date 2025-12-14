"use client";

// import React, { useState } from 'react';
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  House,
  CalendarClock,
  Users,
  MessageCircleMore,
  ClipboardList,
  MessageSquareText,
  UserRoundCog,
  LogOut,
  CircleQuestionMark,
  ChevronLeftIcon,
} from "lucide-react";
import { RiMenuFold4Line, RiMenuFold3Line } from "react-icons/ri";

interface SidebarProps {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const navItems = [
  { label: "Accueil", icon: House, href: "/dashboard/doctors" },
  {
    label: "Rendez-vous",
    icon: CalendarClock,
    href: "/dashboard/doctors/appointments",
  },
  { label: "Patients", icon: Users, href: "/dashboard/doctors/patients" },
  {
    label: "Consultation",
    icon: MessageCircleMore,
    href: "/dashboard/doctors/consultation",
  },
  {
    label: "Ordonnances",
    icon: ClipboardList,
    href: "/dashboard/doctors/prescriptions",
  },
  {
    label: "Messages",
    icon: MessageSquareText,
    href: "/dashboard/doctors/messages",
  },
  { label: "Profil", icon: UserRoundCog, href: "/dashboard/doctors/profile" },
];

const bottomNav = [
  { label: "Aide", icon: CircleQuestionMark, href: "/help" },
  { label: "Déconnexion", icon: LogOut, href: "/logout" },
];

const sidebarVariants = {
  expanded: { width: 240 }, // e.g. 60px * 4
  collapsed: { width: 64 }, // 16px * 4
};

export default function Sidebar({
  expanded,
  setExpanded,
  menuOpen,
  setMenuOpen,
}: SidebarProps) {
  // const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard/doctors"
      ? pathname === "/dashboard/doctors"
      : pathname.startsWith(href);

  // Mobile Sidebar Configs

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, setMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuVariants: Variants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 250, damping: 20 },
    },
    exit: {
      x: "-100%",
      opacity: 0,
      transition: { ease: "easeInOut", duration: 0.3 },
    },
  };

  return (
    <div>
      <motion.nav
        className="hidden fixed top-0 left-0 h-screen bg-white shadow z-30 lg:flex flex-col justify-between hover:cursor-pointer"
        variants={sidebarVariants}
        animate={expanded ? "expanded" : "collapsed"}
        initial="collapsed"
        transition={{ type: "spring", stiffness: 800, damping: 40 }}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <div className="grid gap-y-[2rem]">
          <div className="flex items-center gap-2 h-16 px-4">
            {/* Your app logo/icon here */}
            <Image
              src="/logo 2.png"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span
              className={`font-bold transition-opacity duration-300 ${
                expanded ? "opacity-100" : "hidden"
              }`}
            >
              OLIVIYANA
            </span>
          </div>
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
        <div className="mb-4">
          <ul>
            {bottomNav.map(({ label, icon: Icon, href }) => (
              <li key={label} className="my-2 px-1">
                <Link
                  href={href}
                  className={`flex py-2 gap-4 items-center px-4 rounded-lg transition-colors hover:bg-violet-100 
                ${expanded ? "justify-start" : "justify-center flex-col"}`}
                >
                  <Icon className="w-6 h-6" />
                  <span
                    className={`transition-opacity duration-300 ${
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

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        {!menuOpen && (
          <div
            className={`fixed top-0 left-0 right-0 z-50 flex justify-between py-3 px-2 transition-all duration-300 ease-in-out
          ${scrolled ? "bg-white/90 shadow-md" : ""}`}
          >
            <button
              onClick={() => setMenuOpen(true)}
              className="px-3 py-2 "
              aria-label="Ouvrir le menu"
            >
              <RiMenuFold4Line />
            </button>

            <div className="w-[2rem] h-[2rem] bg-gray-500 rounded-full"></div>
          </div>
        )}

        <AnimatePresence>
          {menuOpen && (
            <>
              {/* Overlay covers entire screen under sidebar */}
              <motion.div
                key="overlay"
                className="fixed inset-0 bg-black/10 z-30"
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.div
                className="bg-white fixed top-0 left-0 h-full py-3 pl-[1.5rem] pr-[1rem] w-64 z-40 shadow-md"
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="border-b-2 py-1 pb-[1.5rem] relative flex items-center gap-2">
                  <Image
                    src="/logo 2.png"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="absolute right-[-17%] self-start px-3 py-2 bg-white rounded-full"
                    aria-label="Fermer le menu"
                  >
                    <RiMenuFold3Line />
                  </button>
                </div>

                <div className="grid h-[90%]">
                  <ul className="flex flex-col gap-2 mt-[1.5rem]">
                    {navItems.map(({ label, icon: Icon, href }) => (
                      <li key={label}>
                        <Link
                          href={href}
                          className={`flex items-center gap-2 py-2 px-2 text-[0.9rem] ${
                            isActive(href)
                              ? "bg-green-400 font-bold text-white rounded-md"
                              : "text-[#000]"
                          }`}
                        >
                          <Icon width={20} strokeWidth={1.5} />
                          <span>{label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <ul className="self-end border-t-2 py-2">
                    {bottomNav.map(({ label, icon: Icon, href }) => (
                      <li key={label}>
                        <Link
                          href={href}
                          className="flex items-center gap-2 py-2 text-[0.9rem]"
                        >
                          <Icon width={20} strokeWidth={1.5} />
                          <span>{label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
