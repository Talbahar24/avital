"use client";

import { useState } from "react";

export function ProductGallery({ images, name }: { images: { path: string; alt: string }[]; name: string }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const current = images[index] ?? images[0];
  if (!current) return null;

  return (
    <div>
      <button className="gallery-main" type="button" onClick={() => setZoom(true)} aria-label="הגדלת התמונה">
        <img src={current.path} alt={current.alt || name} />
      </button>
      {images.length > 1 ? (
        <div className="thumbs">
          {images.map((image, i) => (
            <button key={image.path + i} type="button" className={i === index ? "active" : ""} onClick={() => setIndex(i)}>
              <img src={image.path} alt={image.alt || `${name} ${i + 1}`} />
            </button>
          ))}
        </div>
      ) : null}
      {zoom ? (
        <div className="lightbox" role="dialog" aria-label="תמונה מוגדלת" onClick={() => setZoom(false)}>
          <img src={current.path} alt={current.alt || name} />
        </div>
      ) : null}
    </div>
  );
}
