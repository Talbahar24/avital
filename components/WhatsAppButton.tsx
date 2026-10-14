import { SITE } from "@/lib/constants";
import { WhatsAppIcon } from "./Icons";

export function WhatsAppButton() {
  return (
    <a
      className="whatsapp-float"
      href={`https://wa.me/${SITE.whatsapp}`}
      target="_blank"
      rel="noreferrer"
      aria-label="וואטסאפ לאביטל"
    >
      <WhatsAppIcon />
    </a>
  );
}
