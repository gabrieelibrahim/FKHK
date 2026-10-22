import { notFound } from "next/navigation";

// Catch-all dalam [locale] → jatuh ke not-found.tsx milik [locale]
// (dengan navbar/footer + styling). Mencegah root not-found polos.
export default function CatchAllPage() {
  notFound();
}
