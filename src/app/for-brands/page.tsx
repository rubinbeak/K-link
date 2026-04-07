import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  CalendarDays,
  ClipboardList,
  CreditCard,
  FileBarChart,
  GitBranch,
  Radar,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { BrandBudgetCalculator } from "@/components/brand/brand-budget-calculator";
import { BrandFloatingSetupCta } from "@/components/brand/brand-floating-setup-cta";
import { BrandImpactHero } from "@/components/brand/brand-impact-hero";
import { BrandReferenceVideoGallery } from "@/components/brand/brand-reference-video-gallery";
import { BrandWhyKlinkCta } from "@/components/brand/brand-why-klink-cta";
import { PartnerBrandMarquee, type PartnerBrandDef } from "@/components/brand/partner-brand-grid";
import { buttonVariants } from "@/components/ui/button-variants";
import { brandPrimaryCtaLabel, brandServiceOutlineLabel } from "@/lib/brand-marketing-copy";
import { cn } from "@/lib/utils";

/** K-LINK 실제 운영 레퍼런스 — 플랫폼별 임베드/원본 링크 */
const brandReferenceTikTokVideos = [
  {
    id: "7584073590383906055",
    platform: "tiktok",
    sourceUrl: "https://www.tiktok.com/@anhlorenhehehe/video/7584073590383906055",
    title: "럭셔리 브랜드 팝업 방문",
    targetCountry: "베트남",
    flagCodes: ["vn"],
    summary: "럭셔리 팝업 동선과 현장 분위기를 짧은 컷으로 전달한 방문형 레퍼런스",
  },
  {
    id: "7619787309356977429",
    platform: "tiktok",
    sourceUrl: "https://www.tiktok.com/@bygiannalee/video/7619787309356977429",
    title: "뷰티 브랜드 팝업 현장 방문 및 체험",
    targetCountry: "미국",
    flagCodes: ["us"],
    summary: "체험 포인트와 현장 반응을 중심으로 구성한 팝업 방문형 콘텐츠",
  },
  {
    id: "7615869237189414164",
    platform: "tiktok",
    sourceUrl: "https://www.tiktok.com/@aliasunc/video/7615869237189414164",
    title: "뷰티 페스티벌 현장 방문",
    targetCountry: "필리핀",
    flagCodes: ["ph"],
    summary: "페스티벌 현장의 체험 장면과 이벤트 참여 흐름을 빠르게 담은 콘텐츠",
  },
  {
    id: "7179731554673937706",
    platform: "tiktok",
    sourceUrl: "https://www.tiktok.com/@rogerwh0/video/7179731554673937706",
    title: "피부과 시술 경험 기반 병원 홍보",
    targetCountry: "미국",
    flagCodes: ["us"],
    summary: "시술 전후 맥락을 경험 중심으로 전달해 병원 신뢰를 높인 사례",
  },
  {
    id: "7581720956498955575",
    platform: "tiktok",
    sourceUrl: "https://www.tiktok.com/@_lilyis/video/7581720956498955575",
    title: "치과 시술 경험 기반 병원 홍보",
    targetCountry: "한국",
    flagCodes: ["kr"],
    summary: "진료 경험과 결과 포인트를 짧게 연결해 방문 동기를 만든 콘텐츠",
  },
  {
    id: "7578931109434608904",
    platform: "tiktok",
    sourceUrl: "https://www.tiktok.com/@leeskincare7/video/7578931109434608904",
    title: "한의원 시술 경험 기반 병원 홍보",
    targetCountry: "미국",
    flagCodes: ["us"],
    summary: "시술 경험을 일상 톤으로 풀어내며 자연스럽게 기관 인지도를 높인 사례",
  },
  {
    id: "xiaohongshu-oy-local",
    platform: "mp4",
    sourceUrl: "/reference-videos/xiaohongshu-oy.mp4",
    title: "중국 리테일 매장 방문 및 제품 소개",
    targetCountry: "중국",
    flagCodes: ["cn"],
    summary: "현장 방문 컷과 제품 디테일을 함께 배치해 구매 관심을 높인 리테일 사례",
  },
  {
    id: "7590722294637432072",
    platform: "tiktok",
    sourceUrl: "https://www.tiktok.com/@shushu_223_/video/7590722294637432072",
    title: "일본 리테일 매장 방문 및 제품 소개",
    targetCountry: "일본",
    flagCodes: ["jp"],
    summary: "매장 방문부터 제품 포인트까지 짧은 리듬으로 전달한 리테일 소개형 영상",
  },
  {
    id: "7599968252755840264",
    platform: "tiktok",
    sourceUrl: "https://www.tiktok.com/@kimberllyvuong/video/7599968252755840264",
    title: "리테일 매장 방문 및 제품 소개",
    targetCountry: "미국",
    flagCodes: ["us"],
    summary: "현장 사용 장면과 제품 효익을 동시에 보여준 리테일 방문형 콘텐츠",
  },
  {
    id: "7528463134911237383",
    platform: "tiktok",
    sourceUrl: "https://www.tiktok.com/@alia.abk/video/7528463134911237383",
    title: "중동 뷰티·헤어샵 방문 홍보",
    targetCountry: "중동",
    flagCodes: ["ae"],
    summary: "살롱 방문 체험과 스타일 변화를 중심으로 구성한 로컬 홍보형 콘텐츠",
  },
  {
    id: "7617994958666206477",
    platform: "tiktok",
    sourceUrl: "https://www.tiktok.com/@joinyogurtclub/video/7617994958666206477",
    title: "해외 F&B 매장 방문 및 브랜드 홍보",
    targetCountry: "미국",
    flagCodes: ["us"],
    summary: "매장 경험과 메뉴 포인트를 함께 보여주며 방문 유인을 만든 F&B 사례",
  },
  {
    id: "7305757699386461441",
    platform: "tiktok",
    sourceUrl: "https://www.tiktok.com/@biteswithlily/video/7305757699386461441",
    title: "한국 음식점 홍보",
    targetCountry: "호주, 미국",
    flagCodes: ["au", "us"],
    summary: "해외 소비자 시선에서 한국 음식점 경험을 전달한 방문형 홍보 콘텐츠",
  },
] as const;

/** 협력 브랜드 — 수집한 정적 로고 우선 사용, 누락 시 Clearbit/텍스트 fallback */
const partnerBrands: PartnerBrandDef[] = [
  { name: "지오아이앤티", clearbitDomain: "goit.co.kr", logoSrc: "/partner-logos/gioint.png" },
  { name: "매일디지털치과", clearbitDomain: "maeildigital.com", logoSrc: "/partner-logos/maeildigitaldental.png" },
  { name: "연세아산산부인과", clearbitDomain: "yonseiasan.com", logoSrc: "/partner-logos/yonseiasan.png" },
  { name: "안양센트럴치과", logoSrc: "/partner-logos/anyangcentraldental.png" },
  { name: "전주365치과의원", clearbitDomain: "jeonju365dental.kr", logoSrc: "/partner-logos/jeonju365dental.png" },
  { name: "나의인생치과", clearbitDomain: "mylifedc.co.kr", logoSrc: "/partner-logos/myfirstdental.png" },
  { name: "동탄하나로치과", clearbitDomain: "dthanarodent.com", logoSrc: "/partner-logos/dongtanhanaro.png" },
  { name: "일본 PRYOU", clearbitDomain: "pryou.net", logoSrc: "/partner-logos/pryou.png" },
  { name: "일본 로지팩토리", logoSrc: "/partner-logos/tokyologifactory.png" },
  { name: "일본 세이와", logoSrc: "/partner-logos/seiwa.png" },
  { name: "이룸테이프", clearbitDomain: "2ruumtape.com", logoSrc: "/partner-logos/yiruumtape.png" },
  { name: "스티키랩", clearbitDomain: "stickylab.co.kr", logoSrc: "/partner-logos/stickylab.png" },
  { name: "맞춤박스", logoSrc: "/partner-logos/matchumbox.png" },
  { name: "SONO", clearbitDomain: "sonoonkorea.com", logoSrc: "/partner-logos/sono.png" },
];

const partnerBrandByName = new Map(partnerBrands.map((brand) => [brand.name, brand] as const));

function pickPartner(name: string): PartnerBrandDef {
  const brand = partnerBrandByName.get(name);
  if (!brand) {
    throw new Error(`Unknown partner brand: ${name}`);
  }
  return brand;
}

/**
 * 2줄 x 7개 고정 배열:
 * - 줄 간 중복 없음
 * - 치과 계열이 연달아 붙지 않도록 분산 배치
 */
const partnerBrandsRowForward: PartnerBrandDef[] = [
  pickPartner("맞춤박스"),
  pickPartner("매일디지털치과"),
  pickPartner("일본 세이와"),
  pickPartner("동탄하나로치과"),
  pickPartner("SONO"),
  pickPartner("일본 PRYOU"),
  pickPartner("안양센트럴치과"),
];

const partnerBrandsRowReverse: PartnerBrandDef[] = [
  pickPartner("지오아이앤티"),
  pickPartner("전주365치과의원"),
  pickPartner("스티키랩"),
  pickPartner("나의인생치과"),
  pickPartner("일본 로지팩토리"),
  pickPartner("연세아산산부인과"),
  pickPartner("이룸테이프"),
];

/** 서비스 정의 섹션용 — 항목 수·글자 수 최소화로 스캔용 */
const visitContentPackageItems = [
  "방문 1회 · 콘텐츠 업로드 1건",
  "가이드라인 제작·전달 + 업로드 관리",
  "Instagram · TikTok · 小红书 등 채널 선택",
  "방문 후 7일 이내 업로드 운영",
  "결과 보고 · 2차 활용 가능",
];
const visitSpecialties = ["매장", "팝업스토어", "행사 / 부스", "병원 / 클리닉", "쇼룸 / 전시", "레스토랑 / F&B"];
const visitOperationsItems = [
  "인플루언서 섭외 · 방문 일정 조율",
  "현장 촬영·가이드 준수 코디네이션",
  "성과·링크 정리 후 보고서 전달",
];
const urgencyPoints = ["캠페인 세팅 즉시 시작", "무통장입금 확인 후 빠른 착수", "프로세스 6단계 가시화로 내부 보고 용이"];
/** 메인 랜딩 — 4단계 플로우(스캔용 초단문 + 아이콘). 상세는 /for-brands/process */
const campaignProcessMacroSteps: readonly { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "캠페인 세팅",
    body: "장소·일정·타겟·인원을 입력합니다. 초안은 자동 저장됩니다.",
    Icon: ClipboardList,
  },
  {
    title: "결제·확정",
    body: "세팅 내용을 확정한 뒤 입금하면 캠페인이 확정됩니다.",
    Icon: CreditCard,
  },
  {
    title: "캠페인 진행",
    body: "가이드·섭외·방문·업로드까지 운영팀이 맞춥니다.",
    Icon: GitBranch,
  },
  {
    title: "결과 보고",
    body: "게시 링크와 핵심 지표를 리포트로 전달합니다.",
    Icon: FileBarChart,
  },
];
const previewSidebarItems = [
  { label: "캠페인 세팅", status: "완료" },
  { label: "가이드라인 확정", status: "진행 중" },
  { label: "인플루언서 전달", status: "대기" },
  { label: "방문/촬영 운영", status: "대기" },
  { label: "결과 보고", status: "예정" },
];
export default function ForBrandsPage() {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-white text-zinc-900">
      <main className="brand-container relative pb-(--brand-space-12)">
        <BrandImpactHero
          setupCtaLabel={brandPrimaryCtaLabel}
          fullScreen
        />

        <section className="mt-12 w-full text-center">
          <div className="mx-auto w-full max-w-6xl">
            <p className="text-xs font-semibold tracking-[0.12em] text-zinc-500">PARTNER BRANDS</p>
            <p className="mt-1 text-sm text-zinc-600">K-LINK와 함께한 협력·레퍼런스 브랜드</p>
          </div>
          <div className="relative left-1/2 mt-6 w-screen -translate-x-1/2 overflow-hidden border-y border-zinc-200/80 bg-linear-to-r from-zinc-50 via-white to-zinc-50 py-4 shadow-[0_14px_38px_-24px_rgba(0,0,0,0.22)]">
            <div className="px-2 sm:px-4">
              <PartnerBrandMarquee partners={partnerBrandsRowForward} className="mt-0" speed="slow" />
              <PartnerBrandMarquee partners={partnerBrandsRowReverse} reverse className="mt-3" />
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-3xl border border-zinc-200/80 bg-linear-to-r from-zinc-950 via-zinc-900 to-zinc-950 px-6 py-10 text-center text-white sm:px-10 sm:py-12">
            <div className="pointer-events-none absolute -left-8 top-0 h-36 w-36 rounded-full bg-fuchsia-400/20 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute -right-8 bottom-0 h-36 w-36 rounded-full bg-sky-300/18 blur-3xl" aria-hidden />
            <p className="text-xs font-semibold tracking-[0.16em] text-fuchsia-100/85">CORE MESSAGE</p>
            <h2 className="mt-3 text-balance font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              고객은 광고보다 경험에 반응합니다.
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-balance text-base leading-relaxed text-zinc-200 sm:text-xl">
              현지 인플루언서의 방문이, 브랜드 경험을 만듭니다.
            </p>
          </div>
        </section>

        <section className="brand-section-tight mt-16 w-full">
          <div className="mx-auto w-full max-w-5xl text-center lg:max-w-6xl">
            <p className="text-xs font-semibold tracking-[0.14em] text-primary">VISIT CONTENT</p>
            <h2 className="mt-2 text-balance font-heading text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl lg:text-4xl">
              서비스 정의 · 방문 전문 분야
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-balance text-base leading-[1.75] text-zinc-600 sm:text-lg">
              <strong className="font-semibold text-zinc-900">방문형 콘텐츠만</strong> 다룹니다. 현장 촬영 기준으로 섭외부터 보고까지 한 흐름입니다.
            </p>
          </div>

          <div className="relative mx-auto mt-12 w-full max-w-6xl overflow-hidden rounded-3xl border border-zinc-200/70 bg-linear-to-br from-white via-fuchsia-50/35 to-sky-50/45 px-6 py-10 shadow-[0_24px_60px_-38px_rgba(236,72,153,0.38)] sm:px-10 sm:py-12">
            <div className="pointer-events-none absolute -right-12 top-0 h-44 w-44 rounded-full bg-fuchsia-300/25 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-sky-300/20 blur-3xl" aria-hidden />
            <div className="relative grid w-full gap-14 lg:grid-cols-2 lg:gap-16">
              <div className="min-w-0 text-center lg:pr-6 lg:text-left">
              <h3 className="font-heading text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">포함 범위</h3>
              <p className="mt-2 text-sm text-zinc-500">1인 · 1회 방문 · 1업로드 기준 요약</p>
              <ul className="mx-auto mt-8 max-w-xl space-y-3 border-l border-zinc-200 pl-4 text-left lg:mx-0">
                {visitContentPackageItems.map((item) => (
                  <li key={item} className="flex gap-3 text-base leading-snug text-zinc-800">
                    <span className="mt-2 inline-flex size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              </div>
              <div className="min-w-0 border-t border-zinc-200/80 pt-12 text-center lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0 lg:text-left">
              <h3 className="font-heading text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">방문 채널</h3>
              <p className="mt-2 text-sm text-zinc-500">대표 장소 유형</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2.5 lg:justify-start">
                {visitSpecialties.map((item) => (
                  <span key={item} className="rounded-md border border-zinc-200/90 bg-zinc-50/80 px-3 py-1.5 text-sm font-medium text-zinc-800">
                    {item}
                  </span>
                ))}
              </div>
              <h4 className="mt-10 font-heading text-base font-semibold text-zinc-900">운영에서 맡는 일</h4>
              <p className="mt-1.5 text-sm text-zinc-500">섭외·현장·전달까지 실행 코디네이션</p>
              <ul className="mx-auto mt-6 max-w-xl space-y-3 border-l border-zinc-200 pl-4 text-left lg:mx-0">
                {visitOperationsItems.map((item) => (
                  <li key={item} className="flex gap-3 text-base leading-snug text-zinc-800">
                    <span className="mt-2 inline-flex size-1.5 shrink-0 rounded-full bg-primary/70" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 w-full border-t border-zinc-200/80 pt-12">
            <div className="mx-auto max-w-5xl text-center lg:max-w-6xl">
              <p className="text-xs font-semibold tracking-[0.14em] text-primary">REFERENCE VIDEO</p>
              <h3 className="mt-2 font-heading text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
                실제 운영 레퍼런스 영상
              </h3>
              <p className="mx-auto mt-3 max-w-2xl text-balance text-sm leading-relaxed text-zinc-600">
                브랜드 메시지가 가장 자연스럽게 소비자 경험으로 이어지도록,
                실제 방문형 콘텐츠 동선과 현장 반응을 기준으로 선별한 레퍼런스입니다.
              </p>
            </div>
            <BrandReferenceVideoGallery videos={brandReferenceTikTokVideos} />
          </div>
        </section>

        <section className="mt-24 w-full">
          <div className="mx-auto w-full max-w-6xl rounded-2xl border border-zinc-200/80 bg-zinc-50/40 p-8 sm:p-10">
            <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="text-center lg:text-left">
                <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.12em] text-zinc-600">
                  <Radar className="size-3.5 text-zinc-500" />
                  데이터 기반 스마트 매칭
                </p>
                <h2 className="mx-auto mt-3 max-w-4xl text-balance break-keep font-heading text-2xl font-bold leading-[1.18] tracking-tight text-zinc-900 sm:text-3xl lg:mx-0 lg:max-w-none">
                  10만+ 데이터로 후보를 좁히고, 실행까지 한 흐름으로
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-600 lg:mx-0">
                  방문 캠페인에 맞는 크리에이터 풀을 빠르게 고르고, 일정·보고까지 같은 언어로 이어집니다.
                </p>
                <div className="mx-auto mt-8 grid max-w-lg gap-4 sm:max-w-none sm:grid-cols-3 lg:mx-0">
                  {[
                    { k: "데이터 처리 규모", v: "100,000+ 프로필" },
                    { k: "매칭 정확도", v: "상위 후보군 자동 랭킹" },
                    { k: "운영 신뢰성", v: "다중 검수 프로세스" },
                  ].map((item) => (
                    <div key={item.k} className="border-b border-zinc-200/90 py-3 sm:border-0 sm:py-0">
                      <p className="text-[11px] text-zinc-500">{item.k}</p>
                      <p className="mt-1 text-sm font-semibold text-zinc-900">{item.v}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative min-h-[280px] overflow-hidden rounded-xl bg-radial-[circle_at_25%_20%] from-fuchsia-500/35 via-zinc-900 to-zinc-950 p-6 text-white">
                <div className="pointer-events-none absolute -right-6 top-6 h-20 w-20 rounded-full bg-white/8 blur-2xl" />
                <div className="pointer-events-none absolute -left-6 bottom-0 h-20 w-20 rounded-full bg-fuchsia-300/12 blur-2xl" />
                <p className="text-xs font-semibold tracking-[0.12em] text-zinc-200/90">MATCHING FLOW VISUAL</p>
                <svg viewBox="0 0 400 220" className="mt-4 h-[210px] w-full">
                  <defs>
                    <linearGradient id="flow-line-1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(244,114,182,0.20)" />
                      <stop offset="100%" stopColor="rgba(253,224,71,0.85)" />
                    </linearGradient>
                    <linearGradient id="flow-line-2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(192,132,252,0.55)" />
                      <stop offset="100%" stopColor="rgba(56,189,248,0.8)" />
                    </linearGradient>
                  </defs>
                  <path d="M35 60 C118 8, 192 138, 356 54" fill="none" stroke="url(#flow-line-1)" strokeWidth="3.2" strokeLinecap="round" />
                  <path d="M34 166 C126 114, 188 56, 362 162" fill="none" stroke="url(#flow-line-2)" strokeWidth="2.8" strokeLinecap="round" />
                  <circle cx="36" cy="60" r="9" fill="rgba(244,114,182,0.96)" />
                  <circle cx="36" cy="166" r="7.5" fill="rgba(125,211,252,0.9)" />
                  <circle cx="199" cy="108" r="18" fill="rgba(244,114,182,0.22)" />
                  <circle cx="199" cy="108" r="8" fill="rgba(251,207,232,0.95)" />
                  <circle cx="357" cy="55" r="10" fill="rgba(250,204,21,0.95)" />
                  <circle cx="357" cy="162" r="9" fill="rgba(96,165,250,0.92)" />
                  {[72, 106, 140, 174, 208, 242, 276, 310].map((x) => (
                    <circle key={x} cx={x} cy={112 + Math.sin(x / 28) * 28} r="2.8" fill="rgba(244,114,182,0.62)" />
                  ))}
                </svg>
                <p className="mt-1 text-[11px] text-zinc-200/85">후보 스코어링과 실행 단계를 같은 화면 언어로 맞춥니다.</p>
              </div>
            </div>
            <div className="mx-auto mt-10 flex w-full max-w-2xl flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4">
              <Link
                href="/campaign/setup"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-[#ff2f9b] px-5 text-white shadow-sm hover:bg-[#e61c8d] sm:min-h-11",
                )}
              >
                <span className="text-center text-sm font-semibold leading-snug">{brandPrimaryCtaLabel}</span>
              </Link>
              <Link
                href="/services/visit-content"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50",
                )}
              >
                {brandServiceOutlineLabel}
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-24 w-full">
          <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-zinc-200/90 bg-stone-50/40">
            <div className="border-b border-zinc-200/80 px-5 py-3 text-center sm:text-left">
              <p className="text-xs text-zinc-500">K-LINK · 캠페인 운영 미리보기</p>
            </div>
            <div className="flex flex-col lg:flex-row">
              <div className="hidden w-52 shrink-0 border-r border-zinc-200/80 p-5 lg:block">
                <p className="text-[11px] font-semibold tracking-[0.12em] text-zinc-500">진행 단계</p>
                <p className="mt-3 text-sm font-semibold text-zinc-900">가이드라인 확정</p>
                <ul className="mt-4 space-y-2 border-t border-zinc-200/80 pt-4">
                  {previewSidebarItems.map((item, index) => (
                    <li key={item.label} className="flex items-center justify-between gap-2 text-xs text-zinc-700">
                      <span>{item.label}</span>
                      <span
                        className={cn(
                          "shrink-0 text-[10px] font-semibold",
                          index < 1 ? "text-emerald-700" : index === 1 ? "text-primary" : "text-zinc-400",
                        )}
                      >
                        {item.status}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[11px] leading-relaxed text-zinc-500">운영팀·브랜드가 같은 진행률을 봅니다.</p>
              </div>
              <div className="grid flex-1 gap-5 bg-white/40 p-5 lg:grid-cols-[1fr_1fr_0.85fr]">
              <div className="rounded-xl border border-zinc-200/90 bg-white p-5">
                <p className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-[0.12em] text-zinc-600">
                  <Sparkles className="size-3.5" />
                  한눈에 보는 캠페인 대시보드
                </p>
                <h3 className="mt-2 max-w-3xl text-balance break-keep font-heading text-xl font-bold leading-[1.2] tracking-tight text-zinc-900">
                  실행 전 성과 가능성을 확인하고 시작
                </h3>
                <p className="mt-2 max-w-[40ch] text-sm text-zinc-600">
                  세팅 입력과 동시에 예상 비용, 착수 속도, 진행 흐름을 한눈에 확인합니다.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-zinc-100 bg-zinc-50/80 p-3">
                    <p className="text-[11px] text-zinc-500">예상 도달</p>
                    <p className="mt-1 text-lg font-semibold text-zinc-900">1.2M+</p>
                    <svg viewBox="0 0 92 22" className="mt-2 h-5 w-full">
                      <path d="M1 17 L16 15 L31 11 L46 12 L61 8 L76 5 L91 3" fill="none" stroke="#e11d8d" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="rounded-lg border border-zinc-100 bg-zinc-50/80 p-3">
                    <p className="text-[11px] text-zinc-500">운영 시작</p>
                    <p className="mt-1 text-lg font-semibold text-zinc-900">24h~72h</p>
                    <p className="mt-2 text-xs text-zinc-500">착수 ETA</p>
                  </div>
                  <div className="rounded-lg border border-zinc-100 bg-zinc-50/80 p-3">
                    <p className="text-[11px] text-zinc-500">리포트</p>
                    <p className="mt-1 text-lg font-semibold text-zinc-900">D+7</p>
                    <p className="mt-2 text-xs text-zinc-500">성과 요약</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="rounded-xl border border-zinc-200/90 bg-white p-5">
                  <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-600">
                    <TrendingUp className="size-3.5" />
                    인플루언서 매칭률
                  </p>
                  <p className="mt-1 text-2xl font-bold text-zinc-900">98%</p>
                  <div className="mt-3 h-2 rounded-full bg-zinc-100">
                    <div className="h-2 w-[98%] rounded-full bg-fuchsia-500" />
                  </div>
                </div>
                <div className="rounded-xl border border-zinc-200/90 bg-white p-5">
                  <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-600">
                    <Activity className="size-3.5" />
                    예상 도달률 추이
                  </p>
                  <svg viewBox="0 0 180 44" className="mt-3 h-11 w-full">
                    <path d="M2 36 L24 31 L46 33 L68 24 L90 20 L112 16 L134 18 L156 10 L178 8" fill="none" stroke="#ff2f9b" strokeWidth="3" />
                  </svg>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="rounded-xl border border-zinc-200/90 bg-white p-5">
                  <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-600">
                    <CalendarDays className="size-3.5" />
                    방문 예약 캘린더
                  </p>
                  <div className="mt-3 grid grid-cols-7 gap-1.5">
                    {[1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0].map((v, idx) => (
                      <span key={idx} className={`h-2 rounded-full ${v ? "bg-fuchsia-500" : "bg-zinc-200"}`} />
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-zinc-200/90 bg-white p-5">
                  <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-600">
                    <GitBranch className="size-3.5" />
                    실시간 진행 현황 트래킹
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    {[1, 1, 1, 0].map((active, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className={`inline-flex size-2.5 rounded-full ${active ? "bg-fuchsia-500" : "bg-zinc-300"} ${idx === 2 ? "animate-pulse" : ""}`} />
                        {idx < 3 ? <span className="h-px w-5 bg-zinc-300" /> : null}
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">세팅/결제 → 가이드라인 → 진행 → 결과 보고</p>
                </div>
              </div>
            </div>
            </div>
            <div className="flex flex-col gap-3 border-t border-zinc-200/80 bg-zinc-50/60 px-5 py-4 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              {urgencyPoints.map((item) => (
                <p key={item} className="text-pretty sm:flex-1">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="brand-section-tight brand-rule mt-24 grid gap-4 border-b pb-10 sm:grid-cols-3">
          {[
            { n: "100,000+", t: "검증된 글로벌 인플루언서 데이터" },
            { n: "24h~72h", t: "초기 섭외 시작 속도" },
            { n: "7일", t: "방문 후 업로드 관리 기준" },
          ].map((item) => (
            <div key={item.t} className="px-1 py-2 text-center sm:border-l sm:border-[#eedbe6] sm:first:border-l-0">
              <p className="text-2xl font-semibold tracking-tight text-primary">{item.n}</p>
              <p className="mt-1 text-sm text-[#645c6b]">{item.t}</p>
            </div>
          ))}
        </section>

        <section className="brand-section-tight mt-28 space-y-16 sm:space-y-24">
          <article className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-2 lg:gap-10">
            <div className="relative min-h-[260px] overflow-hidden rounded-xl border border-zinc-800 bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-950 px-7 py-8 text-left text-white">
              <div className="pointer-events-none absolute -top-8 right-8 h-20 w-20 rounded-full bg-fuchsia-400/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-8 -left-6 h-24 w-24 rounded-full bg-sky-400/10 blur-2xl" />
              <p className="text-xs font-semibold tracking-[0.14em] text-primary">SOLUTIONS</p>
              <h2 className="mt-3 text-balance font-heading text-3xl font-semibold leading-[1.15] tracking-tight text-white sm:text-[2rem]">
                운영팀이 쓰기 좋은 한 흐름
              </h2>
              <p className="max-w-[38ch] text-sm leading-relaxed text-zinc-300 sm:text-base">
                인사이트·실행·리포트를 같은 화면 언어로 묶어, 내부 공유와 다음 액션을 빠르게 잡습니다.
              </p>
              <ul className="mt-6 space-y-4 pt-1 text-left text-sm leading-snug text-zinc-200">
                <li className="flex gap-3">
                  <span className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-fuchsia-300" />
                  인사이트로 메시지·채널 방향을 잡습니다.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-fuchsia-300" />
                  세팅 조건에 맞춰 섭외·일정을 한곳에서 봅니다.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-fuchsia-300" />
                  업로드·지표를 묶어 다음 캠페인 결정을 돕습니다.
                </li>
              </ul>
              <Link
                href="/services/visit-content"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "mt-5 w-fit border-white/40 bg-white/10 text-white hover:bg-white/15",
                )}
              >
                {brandServiceOutlineLabel}
              </Link>
            </div>
            <div className="relative min-h-[260px] w-full flex-1 overflow-hidden rounded-xl border border-zinc-800 bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-950 px-7 py-8 text-left text-white">
              <div className="pointer-events-none absolute -top-8 right-8 h-20 w-20 rounded-full bg-fuchsia-400/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-8 -left-6 h-24 w-24 rounded-full bg-sky-400/10 blur-2xl" />
              <p className="text-xs font-semibold tracking-wide text-zinc-300">캠페인 개요 예시</p>
              <h3 className="mt-4 text-xl font-semibold tracking-tight sm:text-2xl">한 화면에서 전략부터 실행까지</h3>
              <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-zinc-300">
                도달·일정·진행을 한눈에 보고, 보고용 근거를 빠르게 만듭니다.
              </p>
              <div className="mt-8 space-y-6 border-t border-white/10 pt-8">
                <div>
                  <p className="text-xs font-medium text-zinc-400">타겟 예시</p>
                  <p className="mt-2 text-sm font-medium leading-snug text-white">
                    K-Beauty 관심 20–34세 · 도심권 방문형 콘텐츠 반응이 높은 세그먼트
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-400">운영에서 보는 지표</p>
                  <p className="mt-2 text-sm font-medium leading-snug text-white">
                    예상 도달 대비 효율, 업로드 완료율, 캠페인 단계별 상태
                  </p>
                </div>
              </div>
            </div>
          </article>
        </section>

        <section className="brand-section-tight mt-32 sm:mt-40">
          <div className="mx-auto max-w-4xl px-2 text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-primary/90">CAMPAIGN FLOW</p>
            <h2 className="mt-4 text-balance font-heading text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              캠페인 프로세스
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-zinc-500">
              네 단계로 끝까지 이어집니다. 일정·운영 세부는 전용 페이지에서 확인하세요.
            </p>
          </div>

          <div className="mx-auto mt-16 w-full max-w-6xl">
            <ol className="hidden md:grid md:grid-cols-4 md:gap-4 lg:gap-6" aria-label="캠페인 4단계">
              {campaignProcessMacroSteps.map((item, index) => (
                <li key={item.title} className="relative flex flex-col items-center text-center">
                  {index < campaignProcessMacroSteps.length - 1 ? (
                    <div
                      className="pointer-events-none absolute left-[calc(50%+2.75rem)] top-9 hidden h-px w-[calc(100%-5.5rem)] bg-linear-to-r from-primary/35 via-primary/15 to-transparent md:block"
                      aria-hidden
                    />
                  ) : null}
                  <div className="relative z-10 flex size-17 items-center justify-center rounded-2xl bg-white shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] ring-1 ring-zinc-200/90 sm:size-18">
                    <item.Icon className="size-8 text-primary sm:size-9" strokeWidth={1.5} aria-hidden />
                  </div>
                  <p className="mt-5 text-[10px] font-bold tracking-[0.2em] text-primary/85">STEP {index + 1}</p>
                  <p className="mt-1.5 font-heading text-base font-semibold tracking-tight text-zinc-900">{item.title}</p>
                  <p className="mt-2 max-w-46 text-pretty text-xs leading-snug text-zinc-500 sm:max-w-52 sm:text-[0.8125rem]">
                    {item.body}
                  </p>
                </li>
              ))}
            </ol>

            <ol className="mx-auto max-w-md space-y-0 md:hidden" aria-label="캠페인 4단계">
              {campaignProcessMacroSteps.map((item, index) => (
                <li key={item.title} className="relative flex gap-4 pb-10 last:pb-0">
                  {index < campaignProcessMacroSteps.length - 1 ? (
                    <span
                      className="absolute left-[1.85rem] top-13 h-[calc(100%-2.5rem)] w-px bg-linear-to-b from-primary/30 to-zinc-200"
                      aria-hidden
                    />
                  ) : null}
                  <div className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-zinc-200/90">
                    <item.Icon className="size-7 text-primary" strokeWidth={1.5} aria-hidden />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-[10px] font-bold tracking-[0.18em] text-primary/85">STEP {index + 1}</p>
                    <p className="mt-1 font-heading text-lg font-semibold tracking-tight text-zinc-900">{item.title}</p>
                    <p className="mt-1.5 text-sm leading-snug text-zinc-500">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mx-auto mt-16 flex w-full max-w-3xl flex-col items-stretch gap-4 px-2 sm:mt-20 sm:items-center">
            <Link
              href="/campaign/setup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full justify-center bg-[#ff2f9b] text-white shadow-sm hover:bg-[#e61c8d] sm:w-full sm:max-w-xl",
              )}
            >
              <span className="text-center text-sm font-semibold leading-snug sm:text-base">{brandPrimaryCtaLabel}</span>
            </Link>
            <Link
              href="/services/visit-content"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full justify-center border-zinc-300 bg-white text-zinc-700 sm:w-full sm:max-w-xl",
              )}
            >
              {brandServiceOutlineLabel}
            </Link>
            <Link
              href="/for-brands/process"
              className="text-center text-sm font-medium text-zinc-500 underline-offset-4 hover:text-zinc-800 hover:underline"
            >
              6단계·운영 상세 보기
            </Link>
          </div>
        </section>

        <section className="mx-auto mt-28 w-full max-w-6xl px-1 sm:px-0">
          <div className="w-full text-center">
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">요금 안내</h2>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-zinc-600">
              팔로워 5천 이하·이상 인원을 섞어 합산할 수 있습니다. 세부 견적은 캠페인 세팅에서 동일 기준으로 확인할 수 있어요.
            </p>
          </div>

          <div className="relative mt-10 w-full overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-50/30 px-6 py-12 sm:px-10 sm:py-14">
            <div
              className="pointer-events-none absolute -left-10 top-0 h-32 w-32 rounded-full bg-fuchsia-400/8 blur-2xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-8 bottom-0 h-28 w-28 rounded-full bg-rose-300/10 blur-2xl"
              aria-hidden
            />

            <div className="relative grid gap-8 md:grid-cols-2 md:items-stretch lg:gap-10">
              <div className="relative flex flex-col overflow-hidden rounded-xl border-2 border-primary/35 bg-white p-7 shadow-[0_22px_50px_-34px_rgba(236,72,153,0.72)] sm:p-8">
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-fuchsia-300/25 blur-2xl" aria-hidden />
                <p className="text-xs font-semibold uppercase tracking-[0.14em] leading-normal text-fuchsia-600/90">Standard</p>
                <h3 className="mt-3 font-heading text-lg font-semibold leading-snug text-zinc-900">팔로워 5천 이하</h3>
                <p className="mt-6 font-heading text-3xl font-black tabular-nums tracking-tight text-fuchsia-700 sm:text-4xl">
                  250,000
                  <span className="ml-1.5 text-base font-semibold text-fuchsia-600/85">원</span>
                </p>
                <p className="mt-4 text-sm font-semibold leading-relaxed text-fuchsia-700">1인 기준 · 25만원</p>
                <ul className="mt-8 space-y-3.5 text-sm leading-relaxed text-zinc-700">
                  <li className="flex gap-2.5">
                    <span className="shrink-0 font-bold text-fuchsia-600">✓</span>
                    거주 국가 추가금 없음
                  </li>
                  <li className="flex gap-2.5">
                    <span className="shrink-0 font-bold text-fuchsia-600">✓</span>
                    방문 1회 · 콘텐츠 1업로드 체계
                  </li>
                </ul>
              </div>

              <div className="relative flex flex-col rounded-xl border border-zinc-200/90 bg-white p-7 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] leading-normal text-fuchsia-700">Plus</p>
                <h3 className="mt-3 font-heading text-lg font-semibold leading-snug text-zinc-900">팔로워 5천 이상</h3>
                <p className="mt-6 font-heading text-2xl font-bold tabular-nums tracking-tight text-zinc-900 sm:text-3xl">
                  500,000
                  <span className="ml-1.5 text-base font-semibold text-zinc-500">원</span>
                </p>
                <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                  1인 기준 (50만원)
                </p>
                <ul className="mt-8 space-y-3.5 text-sm leading-relaxed text-zinc-700">
                  <li className="flex gap-2.5">
                    <span className="shrink-0 text-zinc-500">·</span>
                    5천 이상 구간은 고정 단가로 동일 적용
                  </li>
                  <li className="flex gap-2.5">
                    <span className="shrink-0 text-zinc-500">·</span>
                    세부 조건은 상담 시 별도 합의 가능
                  </li>
                </ul>
              </div>
            </div>
            <p className="relative mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-zinc-500">
              위 단가 외 조정이 필요한 경우 별도 합의 후 반영됩니다.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-20 w-full max-w-6xl space-y-5">
          <BrandBudgetCalculator />
          <p className="mx-auto max-w-2xl text-center text-[11px] leading-relaxed text-zinc-500 sm:text-xs">
            결제는 <span className="text-zinc-600">무통장입금</span>만 가능하며 PG 연동 없이 입금 확인 후 진행됩니다. 브랜드 전용 기능은 회원가입 후 이용할 수 있고, 로그인 아이디는
            컨택 이메일을 사용합니다.{" "}
            <Link href="/signup" className="font-medium text-primary underline-offset-2 hover:underline">
              회원가입
            </Link>
          </p>
        </section>

        <BrandWhyKlinkCta />

        <footer className="mt-16 border-t border-border/50 pt-8 text-center text-xs text-muted-foreground">
          <p>© K-LINK. 문의 및 제휴는 로그인 후 내부 채널 또는 별도 안내에 따릅니다.</p>
          <p className="mt-2">크리에이터 대상 글로벌 안내는 다국어 페이지에서 확인할 수 있습니다.</p>
        </footer>
      </main>

      <BrandFloatingSetupCta label={brandPrimaryCtaLabel} />
    </div>
  );
}
