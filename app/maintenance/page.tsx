export const metadata = {
  title: "האתר בשיפוצים",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <main
      id="main"
      className="sheet"
      style={{
        marginTop: 0,
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        padding: "48px 20px",
      }}
    >
      <div>
        <img
          src="/images/c/logo.png"
          alt=""
          style={{
            width: 120,
            height: 120,
            margin: "0 auto 20px",
            borderRadius: "50%",
            objectFit: "cover",
            objectPosition: "center 42%",
          }}
        />
        <p className="script">רגע</p>
        <h1>האתר בשיפוצים</h1>
        <p className="lead">הסטודיו מתכונן. נחזור בקרוב.</p>
      </div>
    </main>
  );
}
