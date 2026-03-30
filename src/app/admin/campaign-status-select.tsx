"use client";

import { setCampaignStatus } from "./actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const options = ["OPEN", "CLOSED"] as const;

export function CampaignStatusSelect({
  campaignId,
  value,
}: {
  campaignId: string;
  value: (typeof options)[number];
}) {
  return (
    <Select
      defaultValue={value}
      onValueChange={(v) => setCampaignStatus(campaignId, v as (typeof options)[number])}
    >
      <SelectTrigger className="h-8 w-[120px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
