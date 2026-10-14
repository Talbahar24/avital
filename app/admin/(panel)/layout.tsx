import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";

const links = [
  { href: "/admin", label: "סקירה" },
  { href: "/admin/products", label: "מוצרים" },
  { href: "/admin/products/new", label: "מוצר חדש" },
  { href: "/admin/orders", label: "הזמנות" },
  { href: "/admin/workshops", label: "סדנאות" },
  { href: "/admin/lookbook", label: "על הגוף" },
  { href: "/admin/settings", label: "הודעות והגדרות" },
];

export const metadata = {
  robots: { index: false, follow: false },
  title: "פאנל ניהול",
};

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <div className="admin-shell">
      <aside className="admin-nav">
        <p className="script" style={{ color: "#f6efe4", fontSize: "1.4rem" }}>
          Avital
        </p>
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
        <form action="/api/admin/logout" method="post">
          <button className="btn-secondary" type="submit" style={{ marginTop: 18, color: "#f6efe4", borderColor: "#f6efe4" }}>
            יציאה
          </button>
        </form>
        <p>
          <Link href="/">חזרה לאתר</Link>
        </p>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}
