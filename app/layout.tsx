import type { Metadata } from "next";
import { CartProvider } from "@/components/CartProvider";
import { SITE } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} | תכשיטים one piece`,
    template: `%s | ${SITE.name}`,
  },
  description: "תכשיטי אבני חן בעבודת יד. כל פריט יחיד בעולם, עם כוונה ומשמעות.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <a className="skip" href="#main">
          דילוג לתוכן
        </a>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
