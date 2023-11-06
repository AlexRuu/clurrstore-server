"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLinks = () => {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Overview", active: pathname === "/" },
    { href: "/products", label: "Products", active: pathname === "/products" },
    {
      href: "/categories",
      label: "Categories",
      active: pathname === "/categories",
    },
  ];
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            link.active ? "text-black dark:text-white" : "text-muted-foreground"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

export default NavLinks;
