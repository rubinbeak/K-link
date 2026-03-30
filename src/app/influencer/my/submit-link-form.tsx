"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContentLink } from "../actions";

export function SubmitLinkForm({ applicationId }: { applicationId: string }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    start(async () => {
      try {
        await submitContentLink(applicationId, url);
        setUrl("");
      } catch {
        setError("Could not submit. Check the link and try again.");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-lg border border-dashed border-border/80 bg-muted/20 p-4">
      <div className="space-y-2">
        <Label htmlFor={`link-${applicationId}`}>Submit content URL</Label>
        <Textarea
          id={`link-${applicationId}`}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          rows={2}
          placeholder="https://instagram.com/reel/…"
          required
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Submitting…" : "Mark as submitted"}
      </Button>
    </form>
  );
}
