export function Polaroid({
  src,
  alt,
  rotate = "rot-1",
  href,
}: {
  src: string;
  alt: string;
  rotate?: string;
  href?: string;
}) {
  const inner = (
    <figure className={`polaroid ${rotate}`}>
      <img className="pin" src="/images/c/clip.png" alt="" />
      <img src={src} alt={alt} />
    </figure>
  );
  return href ? <a href={href}>{inner}</a> : inner;
}
