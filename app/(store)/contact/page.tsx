import { SITE } from "@/lib/constants";
import { WorkshopForm } from "@/components/WorkshopForm";

export const metadata = { title: "יצירת קשר" };

export default function ContactPage() {
  return (
    <section className="section wrap">
      <p className="script">אשמח לשמוע</p>
      <h1>יצירת קשר</h1>
      <p>
        וואטסאפ: <a href={`https://wa.me/${SITE.whatsapp}`}>{SITE.whatsapp}</a>
        <br />
        אינסטגרם:{" "}
        <a href={SITE.instagram} target="_blank" rel="noreferrer">
          avital_jewellery
        </a>
      </p>
      <div className="contact-box" style={{ marginTop: 24 }}>
        <div>
          <h2>תיאום סדנה או שאלה על פריט</h2>
          <p>השאירו פרטים. נפתח גם וואטסאפ עם ההודעה.</p>
        </div>
        <WorkshopForm />
      </div>
    </section>
  );
}
