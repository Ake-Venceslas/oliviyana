'use client';

import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';

type NavLinkProps = {
  href: string;
  children: ReactNode;
  className: string;
};

export default function NavLink({ href, children }: NavLinkProps) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");

    const handleScroll = () => {
      let current = "";
      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY - 150; // offset
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute("id") || "";
        }
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Extract the "id" from href (#home → home)
  const sectionId = href.replace("#", "");
  const isActive = activeSection === sectionId;

  return (
    <Link
      href={href}
      className={`px-3 py-2 transition-all 
        ${isActive ? "nav-link-active" : "nav-link-default"}`}
    >
      {children}
    </Link>
  );
}
