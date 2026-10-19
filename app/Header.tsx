"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="header">
      {" "}
      <Link href="/" className="header-logo">
        {" "}
        <Image
          src="/logo.svg"
          alt="TravelTrucks"
          width={136}
          height={16}
          priority
        />{" "}
      </Link>
      <nav className="header-menu">
        <Link
          href="/"
          className={`menu-link ${pathname === "/" ? "menu-link-active" : ""}`}
        >
          Home
        </Link>

        <Link
          href="/catalog"
          className={`menu-link ${pathname === "/catalog" ? "menu-link-active" : ""}`}
        >
          Catalog
        </Link>
      </nav>
    </header>
  );
}
