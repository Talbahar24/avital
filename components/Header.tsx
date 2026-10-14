"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV } from "@/lib/constants";
import { useCart } from "./CartProvider";
import { CartIcon, SearchIcon } from "./Icons";
import { SearchPanel } from "./SearchPanel";

export function Header() {
  const pathname = usePathname();
  const { count, setOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-bar">
        <div className="header-inner">
          <Link href="/" className="logo" aria-label="אביטל וטניק — דף הבית">
            <img src="/images/c/logo.png" alt="" />
          </Link>
          <nav id="nav" className={menuOpen ? "site-nav open" : "site-nav"} aria-label="ראשי">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={pathname === item.href || (item.href !== "/shop" && pathname.startsWith(item.href)) ? "active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <button className="icon-btn" type="button" aria-label="חיפוש" onClick={() => setSearchOpen(true)}>
              <SearchIcon />
            </button>
            <button className="icon-btn" type="button" aria-label="סל קניות" onClick={() => setOpen(true)}>
              <CartIcon />
              {count > 0 ? <span className="cart-count">{count}</span> : null}
            </button>
            <button
              className="burger"
              type="button"
              aria-label="תפריט"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            />
          </div>
        </div>
      </div>
      <div className="tear" aria-hidden="true" />
      {searchOpen ? <SearchPanel onClose={() => setSearchOpen(false)} /> : null}
    </header>
  );
}
