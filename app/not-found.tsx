import Link from "next/link";

export default function NotFound() {
  return (
    <div className="sheet" style={{ minHeight: "70vh", padding: "80px 24px" }}>
      <div className="wrap">
        <h1>העמוד לא נמצא</h1>
        <p>אולי הפריט כבר מצא בית, או שהכתובת השתנתה.</p>
        <Link className="btn" href="/shop">
          לחנות
        </Link>
      </div>
    </div>
  );
}
