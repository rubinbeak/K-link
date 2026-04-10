import type { ApplicationStatus, CampaignLifecycleStatus, CampaignStatus, PaymentStatus } from "@/generated/prisma";

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

const lifecycleMap: Record<CampaignLifecycleStatus, string> = {
  DRAFT: "bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100",
  READY_FOR_PAYMENT: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100",
  PAID: "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-100",
  GUIDELINE_IN_PROGRESS: "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-100",
  GUIDELINE_CONFIRMED: "bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-100",
  INFLUENCER_LIST_DELIVERED: "bg-cyan-100 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-100",
  VISIT_SCHEDULED: "bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-100",
  VISIT_DONE: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100",
  CONTENT_UPLOADED: "bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-100",
  REPORT_DELIVERED: "bg-lime-100 text-lime-900 dark:bg-lime-950 dark:text-lime-100",
  COMPLETED: "bg-emerald-200 text-emerald-950 dark:bg-emerald-900 dark:text-emerald-50",
  CANCELLED: "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-100",
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

export function campaignLifecycleClass(s: CampaignLifecycleStatus) {
  return lifecycleMap[s];
}
