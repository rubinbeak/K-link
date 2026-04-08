import Link from "next/link";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRight,
  CalendarClock,
  CalendarDays,
  ClipboardList,
  CreditCard,
  FileBarChart,
  FileText,
  Frame,
  GitBranch,
  Hospital,
  MapPinned,
  Package,
  Radar,
  Share2,
  Store,
  Tent,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Video,
} from "lucide-react";
import { BrandPricingGuide } from "@/components/brand/brand-pricing-guide";
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
const visitContentPackageItems: readonly { text: string; line2?: string; Icon: LucideIcon }[] = [
  { text: "방문 1회 · 콘텐츠 업로드 1건", Icon: Video },
  { text: "가이드라인 제작·전달 + 업로드 관리", Icon: FileText },
  { text: "Instagram · TikTok · 小红书", line2: "등등 채널 선택", Icon: Share2 },
  { text: "방문 후 7일 이내 업로드 운영", Icon: CalendarClock },
  { text: "결과 보고 · 2차 활용 가능", Icon: FileBarChart },
];
/** 방문 채널 — 포함 범위·운영 카드와 동일한 라인 아이콘 톤 */
const visitSpecialtyChips: readonly { label: string; Icon: LucideIcon }[] = [
  { label: "매장/팝업스토어", Icon: Store },
  { label: "행사 / 부스", Icon: Tent },
  { label: "병원 / 클리닉", Icon: Hospital },
  { label: "쇼룸 / 전시", Icon: Frame },
  { label: "레스토랑 / F&B", Icon: UtensilsCrossed },
];
const visitOperationsItems: readonly { text: string; Icon: LucideIcon }[] = [
  { text: "인플루언서 섭외 · 방문 일정 조율", Icon: Users },
  { text: "촬영 가이드라인 준수 코드네이션", Icon: Video },
  { text: "성과·링크 정리 후 보고서 전달", Icon: ClipboardList },
];
const urgencyPoints = ["캠페인 세팅 즉시 시작", "무통장입금 확인 후 빠른 착수", "프로세스 6단계 가시화로 손쉬운 보고"];
/** 메인 랜딩 — 4단계 플로우(스캔용 초단문 + 아이콘) */
const campaignProcessMacroSteps: readonly { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "캠페인 세팅",
    body: "장소·일정·타겟·인원을 입력합니다. 초안은 자동 저장됩니다.",
    Icon: ClipboardList,
  },
  {
    title: "결제·확정",
    body: "세팅 내용을 확정한 뒤 입금하면\n캠페인이 확정됩니다",
    Icon: CreditCard,
  },
  {
    title: "캠페인 진행",
    body: "가이드 섭외 방문 업로드까지\n운영팀이 케어합니다",
    Icon: GitBranch,
  },
  {
    title: "결과 보고",
    body: "업로드된 영상 링크와 핵심 지표를\n리포트로 전달합니다",
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
    <div className="relative min-h-dvh w-full min-w-0 bg-linear-to-b from-fuchsia-50/45 via-rose-50/20 to-sky-50/25 text-zinc-900">
      <BrandImpactHero fullScreen />
      <main className="brand-container relative min-w-0 overflow-x-clip pb-(--brand-space-12)">
        <section className="mt-0 w-full pt-16 text-center sm:pt-24 md:pt-28 lg:pt-32">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8">
            <p className="text-base font-bold tracking-[0.2em] text-primary sm:text-lg md:text-xl lg:text-2xl">
              PARTNER BRANDS
            </p>
            <div
              className="mx-auto mt-5 h-1 max-w-18 rounded-full bg-linear-to-r from-transparent via-primary/75 to-transparent sm:mt-6 sm:max-w-22 md:mt-7"
              aria-hidden
            />
            <h2 className="mx-auto mt-6 max-w-5xl text-balance font-heading text-3xl font-bold leading-[1.15] tracking-tight text-zinc-900 sm:mt-7 sm:text-4xl sm:leading-[1.12] md:mt-8 md:text-5xl md:leading-[1.1] lg:text-[3.15rem] lg:leading-[1.08] xl:text-[3.45rem]">
              K-LINK와 함께한{" "}
              <span className="bg-linear-to-r from-primary via-fuchsia-600 to-primary bg-clip-text text-transparent">
                협력·레퍼런스
              </span>{" "}
              브랜드
            </h2>
          </div>
          <div className="relative mt-12 w-screen max-w-[100vw] shrink-0 overflow-hidden bg-fuchsia-50/55 pt-6 pb-14 mx-[calc(50%-50vw)] sm:mt-14 sm:pt-7 sm:pb-16 md:mt-16 md:pb-20 md:pt-8">
            <div className="px-2 sm:px-4 md:px-6">
              <PartnerBrandMarquee partners={partnerBrandsRowForward} className="mt-0" speed="slow" />
              <PartnerBrandMarquee partners={partnerBrandsRowReverse} reverse className="mt-3 sm:mt-4" />
            </div>
          </div>
        </section>

        <section className="relative w-screen max-w-[100vw] shrink-0 mx-[calc(50%-50vw)]">
          <div className="relative -mt-px flex min-h-[min(58vh,640px)] flex-col justify-center overflow-hidden bg-zinc-950 px-5 py-16 text-center text-white sm:min-h-[min(56vh,680px)] sm:px-8 sm:py-20 md:min-h-[min(54vh,720px)] md:py-24 lg:py-28">
            <Image
              src="https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt=""
              fill
              className="object-cover opacity-[0.32]"
              sizes="100vw"
              priority={false}
            />
            <div
              className="pointer-events-none absolute inset-0 bg-linear-to-b from-zinc-950/88 via-zinc-950/78 to-zinc-950/92"
              aria-hidden
            />
            <div className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl" aria-hidden />
            <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col justify-center px-3 sm:px-6">
              <h2 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                <span className="block leading-[1.15] sm:leading-[1.18]">고객은 광고보다</span>
                <span className="mt-4 block leading-[1.15] sm:mt-5 sm:leading-[1.18] md:mt-6">
                  경험에 반응합니다
                </span>
              </h2>
              <p className="mx-auto mt-9 max-w-3xl text-pretty text-lg font-medium leading-relaxed text-zinc-100/95 sm:mt-11 sm:text-2xl sm:leading-snug md:mt-12 md:text-3xl md:leading-snug">
                현지 인플루언서의 방문이 브랜드 경험을 만듭니다
              </p>
            </div>
          </div>
          <div className="relative z-10 -mt-px overflow-hidden leading-none text-fuchsia-50">
            <svg
              className="block h-10 w-full sm:h-14 md:h-16"
              viewBox="0 0 1440 56"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path
                fill="currentColor"
                d="M0,32 C240,8 480,52 720,28 C960,4 1200,48 1440,24 L1440,56 L0,56 Z"
              />
            </svg>
          </div>
          <div className="relative z-10 bg-fuchsia-50/55 px-4 pt-10 pb-6 text-center sm:pt-12 sm:pb-8 md:pt-16 md:pb-10 lg:pt-20 lg:pb-12">
            <h2 className="mx-auto max-w-5xl text-balance font-heading text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              <span className="block bg-linear-to-r from-primary via-fuchsia-600 to-primary bg-clip-text text-transparent leading-[1.2] sm:leading-[1.22]">
                성공적인 오프라인 브랜딩
              </span>
              <span className="mt-5 block bg-linear-to-r from-primary via-fuchsia-600 to-primary bg-clip-text text-transparent leading-[1.2] sm:mt-6 sm:leading-[1.22] md:mt-7">
                K-link의 디테일은 다릅니다
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-zinc-600 sm:mt-8 sm:text-lg md:text-xl">
              방문 캠페인의 모든 과정을 K-link가 올인원으로 해결해 드립니다.
            </p>
          </div>
        </section>

        <section className="brand-section-tight mt-2 w-full sm:mt-3 md:mt-4">
          <div className="mx-auto grid w-full max-w-6xl gap-6 px-1 sm:px-0 lg:grid-cols-3 lg:items-stretch lg:gap-7">
            <div className="flex h-full min-h-0 flex-col rounded-2xl border border-zinc-200/85 bg-white p-6 shadow-[0_22px_50px_-36px_rgba(15,23,42,0.28)] ring-1 ring-black/4 sm:p-8">
              <div className="flex items-start gap-3 text-left">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary shadow-inner shadow-primary/10 sm:size-12">
                  <Package className="size-5 sm:size-[1.35rem]" strokeWidth={2} aria-hidden />
                </span>
                <div className="min-w-0">
                  <h3 className="font-heading text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">포함 범위</h3>
                  <p className="mt-1.5 text-sm leading-snug text-zinc-500 sm:text-base sm:leading-relaxed">
                    1인 · 1회 방문 · 1업로드 기준 요약
                  </p>
                </div>
              </div>
              <ul className="mt-7 space-y-4 text-left sm:mt-8 sm:space-y-[1.15rem]">
                {visitContentPackageItems.map(({ text, line2, Icon }) => (
                  <li
                    key={text}
                    className="flex gap-3.5 text-[0.9375rem] leading-relaxed text-zinc-800 sm:text-base sm:leading-[1.65]"
                  >
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-fuchsia-50 text-primary sm:size-10">
                      <Icon className="size-4 sm:size-4.5" strokeWidth={2} aria-hidden />
                    </span>
                    <span className="min-w-0 pt-0.5">
                      <span className="block">{text}</span>
                      {line2 ? <span className="mt-0.5 block">{line2}</span> : null}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex h-full min-h-0 flex-col rounded-2xl border border-zinc-200/85 bg-white p-6 shadow-[0_22px_50px_-36px_rgba(15,23,42,0.28)] ring-1 ring-black/4 sm:p-8">
              <div className="flex items-start gap-3 text-left">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary shadow-inner shadow-primary/10 sm:size-12">
                  <MapPinned className="size-5 sm:size-[1.35rem]" strokeWidth={2} aria-hidden />
                </span>
                <div className="min-w-0">
                  <h3 className="font-heading text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">방문 채널</h3>
                  <p className="mt-2 text-base leading-relaxed text-zinc-500 sm:text-lg">대표 장소 유형</p>
                </div>
              </div>
              <ul className="mt-7 flex flex-1 flex-col justify-center space-y-4 text-left sm:mt-8 sm:space-y-[1.15rem]">
                {visitSpecialtyChips.map(({ label, Icon }) => (
                  <li
                    key={label}
                    className="flex gap-3.5 text-[0.9375rem] leading-relaxed text-zinc-800 sm:text-base sm:leading-[1.65]"
                  >
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-fuchsia-50 text-primary sm:size-10">
                      <Icon className="size-4 sm:size-4.5" strokeWidth={2} aria-hidden />
                    </span>
                    <span className="min-w-0 pt-0.5 font-medium">{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex h-full min-h-0 flex-col rounded-2xl border border-zinc-200/85 bg-white p-6 shadow-[0_22px_50px_-36px_rgba(15,23,42,0.28)] ring-1 ring-black/4 sm:p-8">
              <div className="flex items-start gap-3 text-left">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary shadow-inner shadow-primary/10 sm:size-12">
                  <GitBranch className="size-5 sm:size-[1.35rem]" strokeWidth={2} aria-hidden />
                </span>
                <div className="min-w-0">
                  <h3 className="font-heading text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">운영에서 맡는 일</h3>
                  <p className="mt-2 text-base leading-relaxed text-zinc-500 sm:text-lg">
                    섭외부터 보고까지 올인원
                  </p>
                </div>
              </div>
              <ul className="mt-8 flex flex-1 flex-col justify-center space-y-5 text-left sm:mt-10 sm:space-y-6">
                {visitOperationsItems.map(({ text, Icon }) => (
                  <li key={text} className="flex gap-3 sm:gap-3.5">
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-fuchsia-50 text-primary sm:size-10">
                      <Icon className="size-4 sm:size-4.5" strokeWidth={2} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1 pt-0.5 text-[0.9375rem] font-medium leading-snug break-keep text-zinc-800 sm:text-base lg:text-[1.0625rem] lg:leading-normal xl:whitespace-nowrap">
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-3xl px-4 py-10 text-center sm:mt-20 sm:py-14 md:max-w-4xl">
            <Link
              href="/campaign/setup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "inline-flex min-h-14 w-full max-w-2xl items-center justify-center gap-2 bg-[#ff2f9b] px-10 py-6 text-base font-semibold text-white shadow-[0_20px_44px_-24px_rgba(255,47,155,0.75)] transition-[transform,box-shadow] hover:bg-[#e61c8d] hover:shadow-[0_24px_50px_-22px_rgba(255,47,155,0.85)] sm:min-h-16 sm:text-lg md:max-w-3xl md:px-14",
              )}
            >
              <span>{brandPrimaryCtaLabel}</span>
              <ArrowRight className="size-5 shrink-0 sm:size-6" aria-hidden />
            </Link>
          </div>

          <div className="mt-12 w-full border-t border-zinc-200/80 pt-12">
            <div className="mx-auto max-w-5xl text-center lg:max-w-6xl">
              <p className="text-xs font-semibold tracking-[0.14em] text-primary">REFERENCE VIDEO</p>
              <h3 className="mt-2 font-heading text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
                현장 레퍼런스 영상
              </h3>
              <p className="mx-auto mt-3 max-w-2xl text-balance text-sm leading-relaxed text-zinc-600">
                실제 방문형 콘텐츠 동선과 현장 반응을 기준으로 <br/>   
                메시지가 경험으로 전환되는 사례를 선별했습니다.
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
                  <span className="block">10만+ 데이터로 후보군을 좁히고</span>
                  <span className="block">실행까지 한 흐름으로</span>
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-600 lg:mx-0">
                  <span className="block">방문 캠페인에 맞는 크리에이터 풀을 빠르게 고르고</span>
                  <span className="block">일정·보고까지 같은 언어로 이어집니다</span>
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
          </div>
        </section>

        <section className="mt-24 w-full">
          <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-zinc-200/90 bg-stone-50/40">
            <div className="border-b border-zinc-200/80 px-5 py-3 text-center sm:text-left">
              <p className="text-xs text-zinc-500">K-LINK · 캠페인 운영 미리보기 예시</p>
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
              </div>
              <div className="grid flex-1 gap-5 bg-white/40 p-5 lg:grid-cols-[1fr_1fr_0.85fr]">
              <div className="rounded-xl border border-zinc-200/90 bg-white p-5">
                <p className="text-[11px] font-semibold tracking-[0.12em] text-zinc-600">캠페인 운영 개요</p>
                <h3 className="mt-2 max-w-3xl text-balance break-keep font-heading text-xl font-bold leading-[1.2] tracking-tight text-zinc-900">
                  예상 성과와 착수 일정을 실행 전에 확인
                </h3>
                <div className="mt-5 divide-y divide-zinc-200/80 rounded-lg border border-zinc-100 bg-zinc-50/80">
                  <div className="flex items-center justify-between gap-3 px-3 py-2.5">
                    <span className="shrink-0 text-[11px] text-zinc-500">예상 도달</span>
                    <span className="text-right text-sm font-semibold tabular-nums text-zinc-900">1.2M+</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 px-3 py-2.5">
                    <span className="min-w-0 text-[11px] leading-snug text-zinc-500">
                      운영 시작 <span className="text-zinc-400">·</span> 착수 ETA
                    </span>
                    <span className="shrink-0 text-sm font-semibold tabular-nums text-zinc-900 whitespace-nowrap">
                      24h ~ 72h
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 px-3 py-2.5">
                    <span className="min-w-0 text-[11px] leading-snug text-zinc-500">
                      리포트 <span className="text-zinc-400">·</span> 성과 요약
                    </span>
                    <span className="text-right text-sm font-semibold tabular-nums text-zinc-900">D+7</span>
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
            <div className="border-t border-zinc-200/80 bg-linear-to-b from-zinc-50/90 to-white px-5 py-6">
              <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-12 sm:gap-y-4">
                {urgencyPoints.map((item) => (
                  <div key={item} className="flex max-w-[280px] flex-col items-center gap-2.5 text-center sm:max-w-[220px]">
                    <span
                      className="size-2 rounded-full bg-primary shadow-[0_0_14px_rgba(255,47,155,0.4)]"
                      aria-hidden
                    />
                    <p className="text-pretty text-sm font-semibold leading-snug tracking-tight text-zinc-900">{item}</p>
                  </div>
                ))}
              </div>
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

        <section className="brand-section-tight mt-32 sm:mt-40">
          <div className="mx-auto max-w-4xl px-2 text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-primary/90">CAMPAIGN FLOW</p>
            <h2 className="mt-4 text-balance font-heading text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              캠페인 프로세스
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-zinc-500">
              4단계로 이어지는 명확한 워크플로우. 자세한 내용은 서비스 설명을 참조해주세요.
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
                  <p className="mt-2 max-w-46 whitespace-pre-line text-pretty text-xs leading-snug text-zinc-500 sm:max-w-52 sm:text-[0.8125rem]">
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
                    <p className="mt-1.5 whitespace-pre-line text-sm leading-snug text-zinc-500">{item.body}</p>
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
          </div>
        </section>

        <BrandPricingGuide />

        <BrandWhyKlinkCta />
      </main>

      <BrandFloatingSetupCta label={brandPrimaryCtaLabel} />
    </div>
  );
}
