"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
return ( <header className="header"> <Link href="/" className="header-logo"> <Image
       src="/logo.svg"
       alt="TravelTrucks"
       width={136}
       height={16}
       priority
     /> </Link>

```
  <nav className="header-menu">
    <Link href="/" className="menu-link menu-link-active">
      Home
    </Link>

    <Link href="/catalog" className="menu-link">
      Catalog
    </Link>
  </nav>
</header>

);
}
