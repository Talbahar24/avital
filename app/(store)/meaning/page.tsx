import Link from "next/link";
import { MEANINGS } from "@/lib/meanings";

export const metadata = { title: "אבנים ומשמעות" };

export default function MeaningPage() {
  return (
    <section className="section wrap">
      <p className="script">לבחור כוונה</p>
      <h1>אבנים ומשמעות</h1>
      <p className="lead">כל אבן בחנות נושאת כוונה. בחרו משמעות — ותראו איזה פריטים מחכים לה עכשיו.</p>
      <div className="meaning-grid">
        {MEANINGS.map((item) => (
          <Link key={item.slug} className="meaning-card" href={`/meaning/${item.slug}`}>
            <img src={item.image} alt="" />
            <h2>{item.label}</h2>
            <p>{item.text}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
