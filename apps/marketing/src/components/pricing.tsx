import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";

/**
 * "Payment is currently by manual transfer; refunds follow the refund policy",
 * under every list of prices.
 */
export function PaymentNote({ copy, locale }: { copy: Dictionary["pricing"]; locale: Locale }) {
  return (
    <p className="mt-8 text-center text-sm text-ink-soft">
      {copy.paymentNote}{" "}
      <Link href={`/${locale}/refund-policy`} className="font-medium text-primary underline underline-offset-2">
        {copy.refundLink}
      </Link>
      .
    </p>
  );
}
