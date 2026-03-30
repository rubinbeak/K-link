import type { ApplicationStatus, CampaignStatus, PaymentStatus } from "@/generated/prisma";

const appMap: Record<ApplicationStatus, string> = {
  PENDING: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100",
  SELECTED: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100",
  REJECTED: "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-100",
  SUBMITTED: "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-100",
};

const campaignMap: Record<CampaignStatus, string> = {
  OPEN: "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-100",
  CLOSED: "bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100",
};

const paymentMap: Record<PaymentStatus, string> = {
  PENDING: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100",
  COMPLETED: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100",
  FAILED: "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-100",
};

export function applicationStatusClass(s: ApplicationStatus) {
  return appMap[s];
}

export function campaignStatusClass(s: CampaignStatus) {
  return campaignMap[s];
}

export function paymentStatusClass(s: PaymentStatus) {
  return paymentMap[s];
}
