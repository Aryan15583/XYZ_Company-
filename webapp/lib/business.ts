// Legal details of the business behind the Arvina Crystal brand. Shown in the
// policies, the site footer, order emails, the order confirmation screen and
// the invoice. Fill in GSTIN once and it appears everywhere.
export const BRAND_NAME = "Arvina Crystal";
export const LEGAL_NAME = "Exclusive Gallery";
/** 15-character GST number, e.g. "27ABCDE1234F1Z5". Leave empty to hide the number. */
export const GSTIN = "";

/** "Arvina Crystal is a brand of Exclusive Gallery, registered under GST (GSTIN …)." */
export function registrationLine(): string {
  return GSTIN
    ? `${BRAND_NAME} is a brand of ${LEGAL_NAME}, registered under the Goods and Services Tax (GSTIN: ${GSTIN}).`
    : `${BRAND_NAME} is a brand of ${LEGAL_NAME}, a business registered under the Goods and Services Tax (GST).`;
}

/** Product-image disclaimer used on policies and receipts. */
export const PRODUCT_IMAGE_NOTE =
  "Product images are for illustration only. Because every crystal is natural, the piece you receive may differ from the photos in colour, size, shape and markings. This is a mark of a genuine stone, not a defect.";
