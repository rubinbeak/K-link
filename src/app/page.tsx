import type { Metadata } from "next";
import ForBrandsLanding from "./for-brands/for-brands-landing";

export const metadata: Metadata = {
  title: "브랜드 파트너 — K-LINK",
  description:
    "K-LINK는 한국 뷰티 브랜드와 글로벌 인플루언서를 연결하는 캠페인 운영 플랫폼입니다. 캠페인 등록부터 크리에이터 선정, 결과 확인까지 한 곳에서 관리하세요.",
};

export default function HomePage() {
  return (
    <div className="brand-site min-h-dvh overflow-x-hidden">
      <ForBrandsLanding />
    </div>
  );
}
