import { Sparkles, TrendingUp } from "lucide-react";

type MiniVisualMotifProps = {
  title?: string;
  description?: string;
};

export function MiniVisualMotif({
  title = "운영 인사이트",
  description = "핵심 흐름을 직관적으로 보여주는 미니 차트 모티프",
}: MiniVisualMotifProps) {
  const metrics = [
    { label: "매칭", value: 78, bar: "bg-primary" },
    { label: "방문", value: 63, bar: "bg-fuchsia-400" },
    { label: "업로드", value: 52, bar: "bg-pink-400" },
  ];

  return (
    <section className="rounded-2xl border border-border/70 bg-card/85 p-4 shadow-lg shadow-pink-100/40 backdrop-blur-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold tracking-tight">{title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary">
          <Sparkles className="size-3" />
          Live
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-2.5">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{metric.label}</span>
                <span>{metric.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className={`h-2 rounded-full ${metric.bar}`} style={{ width: `${metric.value}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/60 p-3">
          <div
            className="size-14 rounded-full border border-white/70"
            style={{
              background:
                "conic-gradient(from 200deg, #ff4fa6 0 34%, #ff82bf 34% 57%, #ffaccf 57% 79%, #ffd6e8 79% 100%)",
            }}
          />
          <div className="space-y-1 text-[11px] text-muted-foreground">
            <p className="font-medium text-foreground">국가 비중</p>
            <p>JP 34% · US 23%</p>
            <p>CN 22% · ETC 21%</p>
            <p className="inline-flex items-center gap-1 text-primary">
              <TrendingUp className="size-3" />
              전월 대비 +18%
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
