export const APPLICATION_STATUSES = [
  "screened",
  "for_interview",
  "for_endorsement",
  "approved",
  "rejected",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  screened: "Screened",
  for_interview: "For Interview",
  for_endorsement: "For Endorsement",
  approved: "Approved",
  rejected: "Rejected",
};

export const APPLICATION_STATUS_STYLES: Record<ApplicationStatus, string> = {
  screened: "bg-slate-100 text-slate-600",
  for_interview: "bg-amber-100 text-amber-700",
  for_endorsement: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};
