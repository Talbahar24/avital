export function AnnouncementBar({ items }: { items: string[] }) {
  if (!items.length) return null;
  const loop = [...items, ...items, ...items];
  return (
    <div className="announce" role="region" aria-label="הודעות הסטודיו">
      <div className="announce-track">
        {loop.map((text, index) => (
          <span key={`${text}-${index}`}>{text}</span>
        ))}
      </div>
    </div>
  );
}
