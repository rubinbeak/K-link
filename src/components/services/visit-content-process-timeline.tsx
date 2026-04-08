"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { campaignProcessDetailedSteps } from "@/lib/campaign-process-detailed-steps";
import { cn } from "@/lib/utils";

const stepCardLabels = ["세팅/결제", "가이드라인", "리스트 전달", "방문/촬영", "업로드", "결과보고"] as const;

const timelineBodyClass =
  "mt-3 w-full rounded-xl border border-primary/15 bg-white/60 px-4 py-4 shadow-sm backdrop-blur-sm sm:px-6 sm:py-5";

/** 자세한 설명: 문장 간·줄 높이 모두 동일하게 */
const bodyTextClass =
  "m-0 text-sm leading-relaxed text-muted-foreground text-pretty sm:text-[15px]";

export type VisitContentSimpleStep = {
  title: string;
  body: string;
};

export function VisitContentProcessTimeline({ simpleSteps }: { simpleSteps: readonly VisitContentSimpleStep[] }) {
  return (
    <section className="mt-16 rounded-3xl border border-primary/25 bg-linear-to-r from-primary/10 via-pink-50 to-fuchsia-100/60 p-6 sm:p-8">
      <Tabs defaultValue="simple" className="w-full">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-primary">PROCESS TIMELINE</p>
          <TabsList
            variant="default"
            className="h-auto w-full flex-wrap justify-stretch gap-1 rounded-xl border border-primary/15 bg-white/60 p-1 shadow-sm backdrop-blur-sm sm:w-auto sm:min-w-[280px]"
          >
            <TabsTrigger
              value="simple"
              className={cn(
                "flex-1 rounded-lg px-3 py-2 text-xs font-semibold sm:text-sm",
                "data-active:bg-primary/15 data-active:text-primary",
              )}
            >
              간단한 설명
            </TabsTrigger>
            <TabsTrigger
              value="detailed"
              className={cn(
                "flex-1 rounded-lg px-3 py-2 text-xs font-semibold sm:text-sm",
                "data-active:bg-primary/15 data-active:text-primary",
              )}
            >
              자세한 설명
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          {stepCardLabels.map((item, index) => (
            <div key={item} className="rounded-lg bg-white/70 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground">STEP {index + 1}</p>
              <p className="mt-1 text-sm font-semibold">{item}</p>
            </div>
          ))}
        </div>

        <TabsContent value="simple" className="mt-10">
          <div className="brand-timeline relative ml-1 max-w-none pl-6 sm:pl-8">
            {simpleSteps.map((step, index) => (
              <div key={step.title} className="relative pb-12 last:pb-0">
                <span className="brand-timeline-dot absolute -left-[28px] top-2 inline-flex sm:-left-[37px]" />
                <p className="text-xs font-semibold tracking-wide text-primary">STEP {index + 1}</p>
                <h3 className="mt-1.5 font-heading text-xl font-semibold tracking-tight sm:text-2xl">{step.title}</h3>
                <div className={timelineBodyClass}>
                  <p className={bodyTextClass}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="mt-10">
          <div className="brand-timeline relative ml-1 max-w-none pl-6 sm:pl-8">
            {campaignProcessDetailedSteps.map((step, index) => {
              const title = simpleSteps[index]?.title ?? step.title;
              return (
                <div key={title} className="relative pb-12 last:pb-0">
                  <span className="brand-timeline-dot absolute -left-[28px] top-2 inline-flex sm:-left-[37px]" />
                  <p className="text-xs font-semibold tracking-wide text-primary">STEP {index + 1}</p>
                  <h3 className="mt-1.5 font-heading text-xl font-semibold tracking-tight sm:text-2xl">{title}</h3>
                  <div className={timelineBodyClass}>
                    <div className="flex flex-col gap-3">
                      {step.paragraphs.flatMap((para) => splitIntoSentences(para)).map((sentence, si) => (
                        <p key={si} className={bodyTextClass}>
                          {sentence}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}

/** 마침표·물음표·느낌표(반각·전각) 뒤 공백에서 문장 단위로 분리 */
function splitIntoSentences(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  return trimmed.split(/(?<=[.!?。？！])\s+/).filter(Boolean);
}
