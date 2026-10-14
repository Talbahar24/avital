import { SITE } from "@/lib/constants";

export const metadata = { title: "מדיניות פרטיות" };

export default function PrivacyPage() {
  return (
    <section className="section wrap prose">
      <h1>מדיניות פרטיות</h1>
      <p>
        האתר שומר שם, טלפון, כתובת ואימייל לצורך הזמנה, משלוח ושירות. פרטי אשראי לא נשמרים בשרת של {SITE.name} — התשלום מתבצע אצל ספק הסליקה.
      </p>
      <p>לידים של סדנאות נשמרים כדי לחזור אליכם לתיאום. אין הרשמה לניוזלטר בלי סימון מפורש מצדכם.</p>
    </section>
  );
}
