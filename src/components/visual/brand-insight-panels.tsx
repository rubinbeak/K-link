import { BarChart3, CalendarClock, Globe2 } from "lucide-react";

export function BrandInsightPanels() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="rounded-2xl border border-border/70 bg-card/85 p-5 shadow-lg shadow-pink-100/40 backdrop-blur-md">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
          <BarChart3 className="size-4 text-primary" />
          캠페인 진행 현황
        </div>
        <div className="space-y-3">
          {[
            { label: "섭외 완료", value: 82, color: "bg-primary" },
            { label: "방문 완료", value: 61, color: "bg-fuchsia-400" },
            { label: "업로드 완료", value: 54, color: "bg-pink-400" },
          ].map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>{item.label}</span>
                <span>{item.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/85 p-5 shadow-lg shadow-pink-100/40 backdrop-blur-md">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Globe2 className="size-4 text-primary" />
          국가별 비중 예시
        </div>
        <div className="flex items-center gap-4">
          <div
            className="size-28 rounded-full border border-white/60"
            style={{
              background:
                "conic-gradient(from 180deg, #ff4fa6 0 36%, #ff82bf 36% 58%, #ffaccf 58% 77%, #ffd6e8 77% 100%)",
            }}
          />
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>
              <span className="mr-2 inline-block size-2 rounded-full bg-[#ff4fa6]" />
              일본 36%
            </p>
            <p>
              <span className="mr-2 inline-block size-2 rounded-full bg-[#ff82bf]" />
              미국 22%
            </p>
            <p>
              <span className="mr-2 inline-block size-2 rounded-full bg-[#ffaccf]" />
              중국 19%
            </p>
            <p>
              <span className="mr-2 inline-block size-2 rounded-full bg-[#ffd6e8]" />
              기타 23%
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/85 p-5 shadow-lg shadow-pink-100/40 backdrop-blur-md">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
          <CalendarClock className="size-4 text-primary" />
          일정 타임라인 예시
        </div>
        <ol className="space-y-2 text-xs text-muted-foreground">
          <li className="rounded-lg border border-border/70 bg-background/70 px-3 py-2">D-21 캠페인 세팅 및 결제</li>
          <li className="rounded-lg border border-border/70 bg-background/70 px-3 py-2">D-14 가이드라인 확정</li>
          <li className="rounded-lg border border-border/70 bg-background/70 px-3 py-2">D-7 인플루언서 리스트 전달</li>
          <li className="rounded-lg border border-border/70 bg-background/70 px-3 py-2">D-day 방문 진행</li>
          <li className="rounded-lg border border-border/70 bg-background/70 px-3 py-2">D+7 업로드 완료 및 결과 정리</li>
        </ol>
      </div>
    </div>
  );
}
