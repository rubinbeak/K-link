import type {
  ApplicationStatus,
  CampaignLifecycleStatus,
  CampaignStatus,
  CampaignType,
  PaymentStatus,
} from "@/generated/prisma";

export type BrandMyCampaignItem = {
  id: string;
  title: string;
  description: string;
  lifecycle: CampaignLifecycleStatus;
  status: CampaignStatus;
  campaignType: CampaignType | null;
  createdAtLabel: string;
  budget: number;
  visitLine: string | null;
  visitAddress: string | null;
  payment: { id: string; status: PaymentStatus; amount: number } | null;
  applications: Array<{
    id: string;
    status: ApplicationStatus;
    contentUrl: string | null;
    influencer: { name: string | null; email: string; bio: string | null };
  }>;
};
