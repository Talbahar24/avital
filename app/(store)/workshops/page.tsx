import { WorkshopForm } from "@/components/WorkshopForm";

export const metadata = { title: "סדנאות אבני חן" };

export default function WorkshopsPage() {
  return (
    <>
      <section className="hero section wrap">
        <div className="hero-grid">
          <div>
            <h1>
              יוצרים
              <br />
              תכשיטים
            </h1>
            <p className="script">עם כוונה ומשמעות</p>
            <p className="lead">
              חוויה מיוחדת ומקרבת
              <br />
              המשלבת אבני חן טבעיות,
              <br />
              בחירה אישית,
              <br />
              הקשבה וערך רגשי עמוק שפותח את הלב.
            </p>
          </div>
          <div className="hero-photos">
            <img className="arch" src="/images/c/hero.jpg" alt="הנחיה אישית בסדנה" />
            <img className="round" src="/images/c/hero-circle.png" alt="משתתפת בסדנה" />
          </div>
        </div>
      </section>

      <section className="section wrap" id="why">
        <div className="why-top">
          <figure className="polaroid rot-left">
            <img className="pin" src="/images/c/clip.png" alt="" />
            <img src="/images/c/avital-work.png" alt="אביטל מנחה סדנה" />
          </figure>
          <div className="why-copy">
            <h2>
              הרבה מעבר לסתם
              <br />
              תכשיט
            </h2>
            <p>
              ברוב סדנאות היצירה, המשתתפים מכינים פריט יפה ויוצאים איתו הביתה.
              <br />
              בסדנאות שלי, היצירה היא רק השער לחוויה רגשית עמוקה יותר.
            </p>
          </div>
          <figure className="polaroid rot-right">
            <img className="pin" src="/images/c/clip.png" alt="" />
            <img src="/images/c/avital-table.jpg" alt="סדנה סביב שולחן" />
          </figure>
        </div>
        <div className="why-grid">
          <figure className="polaroid rot-left">
            <img className="pin" src="/images/c/clip.png" alt="" />
            <img src="/images/c/necklace.jpg" alt="תכשיט שהושלם בסדנה" />
          </figure>
          <img className="watermark" src="/images/c/logo.png" alt="" />
          <ul className="benefits">
            <li>
              <strong>בחירה מודעת:</strong> כל משתתף בוחר אבן חן עם תכונה שהוא רוצה לחזק בחייו.
            </li>
            <li>
              <strong>שיח וחיבור אישי:</strong> מרחב מעצים ומקשיב, בו משתפים את הבחירות.
            </li>
            <li>
              <strong>מזכרת לחיים:</strong> התכשיט הוא קמע אישי שמזכיר את הכוונה שנבחרה.
            </li>
          </ul>
        </div>
      </section>

      <section className="section wrap" id="path">
        <div className="path-title">
          <h2>מסלול החוויה</h2>
          <p className="script">ארבעת שלבי הסדנה:</p>
        </div>
        <ol className="torn-cards">
          <li>
            <b>1</b>
            <h3>היכרות והסבר:</h3>
            <p>הקדמה על עולם אבני החן, התכונות והמשמעויות של כל אבן.</p>
          </li>
          <li>
            <b>2</b>
            <h3>בחירת אבן אישית:</h3>
            <p>כל משתתף בוחר את האבן שמדברת אליו ומכניס כוונה אישית לחייו.</p>
          </li>
          <li>
            <b>3</b>
            <h3>עיצוב ויצירה:</h3>
            <p>עבודה מעשית עם מגוון חומרים. גם ידע להמשיך ליצור אחר כך.</p>
          </li>
          <li>
            <b>4</b>
            <h3>אריזה ומזכרת:</h3>
            <p>אריזה ממותגת, מתנה שנשארת ומוסיפה משמעות.</p>
          </li>
        </ol>
      </section>

      <section className="section wrap" id="contact">
        <div className="contact-box">
          <div>
            <p className="script">יצירת קשר</p>
            <h2>לתאום סדנה והשארת פרטים</h2>
            <p>אשמח להגיע אליכם וליצור יחד חוויה מיוחדת.</p>
          </div>
          <WorkshopForm />
        </div>
      </section>
    </>
  );
}
