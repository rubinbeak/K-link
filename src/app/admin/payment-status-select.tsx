"use client";

import { setPaymentStatus } from "./actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const options = ["PENDING", "COMPLETED", "FAILED"] as const;

export function PaymentStatusSelect({
  paymentId,
  value,
}: {
  paymentId: string;
  value: (typeof options)[number];
}) {
  return (
    <Select
      defaultValue={value}
      onValueChange={(v) => setPaymentStatus(paymentId, v as (typeof options)[number])}
    >
      <SelectTrigger className="h-8 w-[140px]">
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
