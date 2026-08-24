export const DOCUMENT_TYPES = [
  "passport",
  "nbi_clearance",
  "medical_exam",
  "trade_cert",
  "visa",
  "other",
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  passport: "Passport",
  nbi_clearance: "NBI Clearance",
  medical_exam: "Medical Exam",
  trade_cert: "Trade Certificate",
  visa: "Visa",
  other: "Other",
};
