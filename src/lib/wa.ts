/**
 * WhatsApp link helper.
 *
 * The number is held in a module variable rather than baked into every call
 * site, so changing it in the admin Settings tab changes every "WhatsApp us"
 * link on the site. The store calls setWaNumber() whenever settings load or
 * change.
 */

const DEFAULT_NUMBER = "971555755427";

let currentNumber = DEFAULT_NUMBER;

/** Accepts "+971 55 575 7427", "00971...", etc. and keeps only the digits. */
export function setWaNumber(raw: string | null | undefined) {
  const digits = (raw ?? "").replace(/\D/g, "").replace(/^00/, "");
  if (digits.length >= 8) currentNumber = digits;
}

export function waNumber(): string {
  return currentNumber;
}

export function waLink(text: string): string {
  return `https://wa.me/${currentNumber}?text=${encodeURIComponent(text)}`;
}
