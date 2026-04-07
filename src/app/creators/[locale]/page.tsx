import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreatorsDiscoveryPanel } from "@/components/creators/creators-discovery-panel";
import { MiniVisualMotif } from "@/components/visual/mini-visual-motif";
import { buttonVariants } from "@/components/ui/button-variants";
import { CREATOR_LOCALES, getCreatorMessages, isCreatorLocale, type CreatorLocale } from "@/lib/creators-i18n";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return CREATOR_LOCALES.map((locale) => ({ locale }));
}

export default async function CreatorsLandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isCreatorLocale(raw)) notFound();
  const locale: CreatorLocale = raw;
  const t = await getCreatorMessages(locale);

  const steps = [
    { title: t.steps["1t"], desc: t.steps["1d"] },
    { title: t.steps["2t"], desc: t.steps["2d"] },
    { title: t.steps["3t"], desc: t.steps["3d"] },
    { title: t.steps["4t"], desc: t.steps["4d"] },
  ];

  const benefits = [
    { title: t.benefits["1t"], desc: t.benefits["1d"] },
    { title: t.benefits["2t"], desc: t.benefits["2d"] },
    { title: t.benefits["3t"], desc: t.benefits["3d"] },
  ];

  return (
    <main className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-6 h-56 w-56 rounded-full bg-pink-200/35 blur-3xl" />
        <div className="absolute right-0 top-28 h-64 w-64 rounded-full bg-fuchsia-300/20 blur-3xl" />
      </div>

      <section className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">{t.hero.eyebrow}</p>
        <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl">
          {t.hero.title}
        </h1>
        <p className="mt-6 text-pretty text-base text-muted-foreground sm:text-lg">{t.hero.subtitle}</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
            {t.cta.primary}
          </Link>
        </div>
        <p className="mt-4 max-w-xl text-pretty text-sm text-muted-foreground">{t.cta.secondary}</p>
      </section>

      <section className="mx-auto mt-10 grid max-w-5xl gap-3 text-center sm:grid-cols-2 lg:grid-cols-4">
        {[
          { value: "120+", label: t.kpi.active },
          { value: "24h", label: t.kpi.response },
          { value: "18", label: t.kpi.global },
          { value: "$4.2K+", label: t.kpi.payout },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-border/70 bg-card/85 px-4 py-4 shadow-lg shadow-pink-100/40 backdrop-blur-md"
          >
            <p className="text-xl font-semibold tracking-tight text-primary">{item.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <MiniVisualMotif title={t.showcase.title} description={t.showcase.marketsDesc} />
      </section>

      <section className="mt-14 sm:mt-20">
        <h2 className="text-center font-heading text-2xl font-semibold tracking-tight">{t.benefits.title}</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {benefits.map((item, index) => (
            <Card
              key={item.title}
              className="rounded-2xl border-border/70 bg-card/85 text-left shadow-lg shadow-pink-100/40 backdrop-blur-md"
            >
              <CardHeader>
                <p className="text-xs font-semibold text-primary">POINT 0{index + 1}</p>
                <CardTitle className="font-heading text-lg">{item.title}</CardTitle>
                <CardDescription className="text-pretty leading-relaxed">{item.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-20 sm:mt-28">
        <h2 className="text-center font-heading text-2xl font-semibold tracking-tight">{t.steps.title}</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {steps.map((s, i) => (
            <Card key={s.title} className="border-border/60 bg-card/80 text-left shadow-sm">
              <CardHeader>
                <p className="text-xs font-semibold text-primary">0{i + 1}</p>
                <CardTitle className="font-heading text-lg">{s.title}</CardTitle>
                <CardDescription className="text-pretty">{s.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="brand-split-relaxed mt-16 grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="brand-pane rounded-3xl border-border/70 bg-card/85 p-6 shadow-xl shadow-pink-100/40 backdrop-blur-md">
          <h3 className="font-heading text-xl font-semibold">{t.showcase.earningsTitle}</h3>
          <p className="brand-copy-relaxed mt-2 text-sm text-muted-foreground">{t.showcase.earningsDesc}</p>
          <div className="mt-5 space-y-4">
            {[
              { label: "Nano Creator", value: 48, amount: "$620" },
              { label: "Mid Creator", value: 72, amount: "$1,450" },
              { label: "Top Creator", value: 89, amount: "$3,200" },
            ].map((tier) => (
              <div key={tier.label}>
                <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{tier.label}</span>
                  <span>{tier.amount}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${tier.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="brand-pane rounded-3xl border-border/70 bg-card/85 p-6 shadow-xl shadow-pink-100/40 backdrop-blur-md">
          <h3 className="font-heading text-xl font-semibold">{t.showcase.contentTitle}</h3>
          <p className="brand-copy-relaxed mt-2 text-sm text-muted-foreground">{t.showcase.contentDesc}</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {["Unboxing", "Store Visit", "Skincare Tips", "Before/After"].map((format, index) => (
              <div
                key={format}
                className="relative h-24 overflow-hidden rounded-xl border border-white/70 bg-linear-to-br from-white via-pink-100 to-fuchsia-100 p-3"
              >
                <div className="absolute -right-3 -top-3 h-10 w-10 rounded-full bg-fuchsia-300/45 blur-lg" />
                <p className="relative text-[11px] font-semibold text-primary">HOT 0{index + 1}</p>
                <p className="relative mt-1 text-sm font-medium">{format}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16 rounded-3xl border border-primary/25 bg-linear-to-r from-primary/10 via-pink-50 to-fuchsia-100/70 px-6 py-8">
        <h3 className="font-heading text-xl font-semibold">{t.showcase.marketsTitle}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{t.showcase.marketsDesc}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            { market: "Japan", share: 36 },
            { market: "United States", share: 28 },
            { market: "China", share: 22 },
            { market: "SEA", share: 14 },
          ].map((m) => (
            <div key={m.market} className="rounded-xl border border-white/80 bg-white/70 px-4 py-3">
              <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>{m.market}</span>
                <span>{m.share}%</span>
              </div>
              <div className="h-2 rounded-full bg-pink-100">
                <div className="h-2 rounded-full bg-fuchsia-400" style={{ width: `${m.share}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <CreatorsDiscoveryPanel
        filterTitle={t.discovery.filterTitle}
        allLabel={t.discovery.all}
        countryLabels={{
          JP: t.discovery.jp,
          US: t.discovery.us,
          CN: t.discovery.cn,
          SEA: t.discovery.sea,
          KR: t.discovery.kr,
        }}
        shortformTitle={t.discovery.shortformTitle}
        shortformSubtitle={t.discovery.shortformSubtitle}
        watchLabel={t.discovery.watch}
        campaignTitle={t.discovery.campaignTitle}
        campaignSubtitle={t.discovery.campaignSubtitle}
        applyLabel={t.discovery.apply}
        rewardLabel={t.discovery.reward}
        slotsLabel={t.discovery.slots}
        deadlineLabel={t.discovery.deadline}
        viewsLabel={t.discovery.views}
        engagementLabel={t.discovery.engagement}
      />

      <section className="mt-20 rounded-2xl border border-border/60 bg-muted/30 px-6 py-10 text-center sm:mt-24">
        <h2 className="font-heading text-xl font-semibold tracking-tight">{t.trust.title}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base">
          {t.trust.body}
        </p>
      </section>

      <footer className="mt-16 border-t border-border/40 pt-8 text-center text-xs text-muted-foreground">
        <p>{t.footer.rights}</p>
        <p className="mt-2">{t.footer.note}</p>
      </footer>
    </main>
  );
}
