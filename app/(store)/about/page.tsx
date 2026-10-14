import { Polaroid } from "@/components/Polaroid";

export const metadata = { title: "הסטודיו" };

export default function AboutPage() {
  return (
    <section className="section wrap">
      <p className="script">היי, אני אבי</p>
      <h1>הסטודיו</h1>
      <div className="why-top" style={{ marginTop: 24 }}>
        <Polaroid src="/images/c/avital-work.png" alt="אביטל בעבודה" rotate="rot-left" />
        <div className="why-copy">
          <p className="lead">
            אני מאמינה שכל תכשיט אמור להיות יחיד ומיוחד. לכן אני יוצרת רק one piece — פריט אחד בעולם, שנמכר פעם אחת.
          </p>
          <p>
            האבן נבחרת עם כוונה: אומץ, שמחה, יצירתיות, חיבור, ביטחון, רוגע, אהבה. התכשיט הוא קמע, לא עוד אביזר במגירה.
          </p>
        </div>
        <Polaroid src="/images/c/avital-smile.png" alt="אביטל מחייכת" rotate="rot-right" />
      </div>
    </section>
  );
}
