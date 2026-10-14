import { SITE } from "@/lib/constants";

export const metadata = { title: "תקנון" };

export default function TermsPage() {
  return (
    <section className="section wrap prose">
      <h1>תקנון האתר</h1>
      <p>
        החנות מופעלת על ידי {SITE.legalName}. המחירים כוללים מע״מ. כל תכשיט one piece נמכר פעם אחת. עם אישור התשלום המלאי מתאפס והפריט נעול.
      </p>
      <p>השימוש באתר כפוף למדיניות הפרטיות, למדיניות הביטול ולדין הישראלי.</p>
    </section>
  );
}
